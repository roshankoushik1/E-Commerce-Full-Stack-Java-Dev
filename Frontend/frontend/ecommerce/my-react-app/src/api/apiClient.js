// Centralized API client for authenticated + unauthenticated requests
// Adjust API_BASE to match your Spring Boot backend base path.
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092/api';
export const AUTH_BASE = import.meta.env.VITE_AUTH_BASE_URL || 'http://localhost:9101/api/auth';
export const OFFERS_BASE = import.meta.env.VITE_OFFERS_BASE_URL || 'http://localhost:9092/api/offers';
export const BILLS_BASE = import.meta.env.VITE_BILLS_BASE_URL || 'http://localhost:9092'; // BillController mapped at /bills (no /api prefix)
 
const getToken = () => localStorage.getItem('auth_token');
 
export const UNAUTHORIZED_EVENT = 'api:unauthorized';
 
export async function apiFetch(path, { method = 'GET', headers = {}, body, auth = true, base } = {}) {
  const h = { 'Content-Type': 'application/json', ...headers };
  const token = getToken();
  if (auth && token) {
    h.Authorization = `Bearer ${token}`;
  }
  const root = base || API_BASE; // custom base per microservice
  const url = path.startsWith('http') ? path : `${root}${path}`;
  const res = await fetch(url, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
 
  // Try to parse response body (even on errors)
  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
 
  if (!res.ok) {
    if (res.status === 401) {
      try { localStorage.removeItem('auth_token'); } catch { /* ignore */ }
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data; // may be null for 204
}
 
// Helper for building query strings if needed later
export function toQuery(params = {}) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => {
    if (v !== undefined && v !== null) usp.append(k, v);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : '';
}
 
export function decodeJwtEmail(token) {
  if (!token) return null;
  const parts = token.split('.'); if (parts.length < 2) return null;
  try { const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/'))); return payload.sub || payload.email || null; } catch { return null; }
}
 