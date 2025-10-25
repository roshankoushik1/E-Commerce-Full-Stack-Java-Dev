import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { apiFetch, AUTH_BASE, decodeJwtEmail } from '../api/apiClient'
 
const AuthContext = createContext(null)
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
 
  const buildUser = async (token) => {
    const email = decodeJwtEmail(token)
    if (!email) return null
    try {
      const id = await apiFetch(`/user-id?email=${encodeURIComponent(email)}`, { base: AUTH_BASE, auth: false })
      return { id, email }
    } catch {
      return { email }
    }
  }
 
  // Define auth actions BEFORE effects that reference them
  const logout = useCallback(() => { localStorage.removeItem('auth_token'); setUser(null) }, [])
 
  const login = useCallback(async ({ email, password, name, role }) => {
    // Handle admin login locally without API call
    if (email === 'admin@gmail.com' && password === 'admin') {
      const adminUser = { 
        email: 'admin@gmail.com', 
        name: 'admin', 
        role: 'admin',
        id: 'admin'
      }
      setUser(adminUser)
      localStorage.setItem('auth_token', 'admin_token')
      return adminUser
    }
    
    // Regular user login with API call
    const token = await apiFetch('/login', { method: 'POST', body: { email, password }, base: AUTH_BASE, auth: false })
    if (typeof token === 'string') {
      localStorage.setItem('auth_token', token)
      const u = await buildUser(token)
      setUser(u)
      return u
    }
    throw new Error('Unexpected login response')
  }, [])
 
  const signup = useCallback(async ({ firstName, lastName, email, password }) => {
    await apiFetch('/signup', { method: 'POST', body: { firstName, lastName, email, password }, base: AUTH_BASE, auth: false })
  }, [])
 
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { setLoading(false); return }
    
    // Handle admin token
    if (token === 'admin_token') {
      const adminUser = { 
        email: 'admin@gmail.com', 
        name: 'admin', 
        role: 'admin',
        id: 'admin'
      }
      setUser(adminUser)
      setLoading(false)
      return
    }
    
    // Regular user token handling
    ;(async () => {
      const u = await buildUser(token)
      setUser(u)
      setLoading(false)
    })()
  }, [])
 
  useEffect(() => {
    function handleUnauthorized(){ logout() }
    window.addEventListener('api:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('api:unauthorized', handleUnauthorized)
  }, [logout])
 
  const value = useMemo(() => ({ user, loading, login, logout, signup }), [user, loading, login, logout, signup])
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
 
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)