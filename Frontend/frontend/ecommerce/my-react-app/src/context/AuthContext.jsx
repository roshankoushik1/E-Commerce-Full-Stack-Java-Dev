import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { apiFetch, AUTH_BASE, decodeJwtEmail } from '../api/apiClient'
 
const AuthContext = createContext(null)
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
 
  const buildUser = useCallback(async (token) => {
    const email = decodeJwtEmail(token)
    if (!email) return null
    
    // Handle admin user
    if (email === 'admin@gmail.com') {
      return {
        id: -1,
        email: 'admin@gmail.com',
        name: 'Admin',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      }
    }
    
    // For regular users, just use email info without API call
    return { 
      email, 
      name: email.split('@')[0], 
      role: 'USER',
      id: email.split('@')[0] // Use email prefix as ID
    }
  }, [])
 
  // Define auth actions BEFORE effects that reference them
  const logout = useCallback(() => { localStorage.removeItem('auth_token'); setUser(null) }, [])
 
  const login = useCallback(async ({ email, password }) => {
    // All authentication now goes through the backend
    const response = await apiFetch('/login', { method: 'POST', body: { email, password }, base: AUTH_BASE, auth: false })
    
    // Handle both old format (just token string) and new format (object with token and user)
    if (typeof response === 'string') {
      // Old format - just token
      localStorage.setItem('auth_token', response)
      const user = await buildUser(response)
      setUser(user)
      return user
    } else if (response && response.token && response.user) {
      // New format - object with token and user info
      localStorage.setItem('auth_token', response.token)
      const user = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.firstName,
        role: response.user.role,
        firstName: response.user.firstName,
        lastName: response.user.lastName
      }
      setUser(user)
      return user
    }
    throw new Error('Unexpected login response')
  }, [buildUser])
 
  const signup = useCallback(async ({ firstName, lastName, email, password }) => {
    await apiFetch('/signup', { method: 'POST', body: { firstName, lastName, email, password }, base: AUTH_BASE, auth: false })
  }, [])
 
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) { setLoading(false); return }
    
    // Build user from token for all users (including admin)
    ;(async () => {
      try {
        const u = await buildUser(token)
        setUser(u)
      } catch (e) {
        if (!e.message?.includes('Network Error')) {
          console.error('Build user failed:', e)
        }
        localStorage.removeItem('auth_token')
        setUser(null)
      } finally {
        setLoading(false)
      }
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