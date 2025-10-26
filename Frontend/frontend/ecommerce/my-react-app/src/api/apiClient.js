// Centralized API client using native fetch
// All requests go through the Gateway
export const GATEWAY_BASE = import.meta.env.VITE_GATEWAY_BASE_URL || 'http://localhost:8305';
export const API_BASE = GATEWAY_BASE;
export const AUTH_BASE = `${GATEWAY_BASE}/api/auth`;
export const OFFERS_BASE = `${GATEWAY_BASE}/api/offers`;
export const BILLS_BASE = `${GATEWAY_BASE}/api/bills`;

const getToken = () => localStorage.getItem('auth_token');

export const UNAUTHORIZED_EVENT = 'api:unauthorized';

export async function apiFetch(path, { method = 'GET', headers = {}, body, auth = true, base } = {}) {
  const root = base || API_BASE;
  const url = path.startsWith('http') ? path : `${root}${path}`;
  
  const config = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  // Add auth token if needed
  const token = getToken();
  if (auth && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add body for non-GET requests
  if (body !== undefined && method !== 'GET') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle 401 unauthorized
    if (response.status === 401) {
      try { localStorage.removeItem('auth_token'); } catch { /* ignore */ }
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    
    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Handle non-ok responses
    if (!response.ok) {
      const err = new Error(data?.message || `Request failed (${response.status})`);
      err.status = response.status;
      err.payload = data;
      throw err;
    }
    
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const err = new Error('Network Error');
      err.status = 0;
      throw err;
    }
    throw error;
  }
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