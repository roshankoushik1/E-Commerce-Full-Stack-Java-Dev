/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { apiFetch, BILLS_BASE, OFFERS_BASE } from '../api/apiClient'
import { useCart } from './CartContext'
import { useAuth } from './AuthContext'
import { toast } from 'react-toastify'
 
const BillContext = createContext(null)
export const useBill = () => useContext(BillContext)
 
export const BillProvider = ({ children }) => {
  const { cartItems } = useCart() || {}
  const { user } = useAuth() || {}
 
  const [bill, setBill] = useState(null)
  const [offers, setOffers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false) 
  const lastCartSignature = useRef('')
  const applyingOfferRef = useRef(false)
 
  // Check if user can use server-side billing (not admin, has valid JWT token)
  const canUseServerBilling = useCallback(() => {
    if (!user) return false
    if (user.role === 'ADMIN' || user.role === 'admin') return false
    const token = localStorage.getItem('auth_token')
    if (!token) return false
    const parts = token.split('.')
    return parts.length === 3
  }, [user])
 
  /* ---------------- Helpers ---------------- */
  // Aggregate identical lines (productId+size+color) to prevent duplicate line inflation (used only for signature now)
  const aggregateCartLines = useCallback((items) => {
    const map = new Map()
    for (const ci of (items||[])) {
      if (!ci) continue
      const productId = ci.productId || ci.id
      const size = ci.size || 'NA'
      const color = ci.color || 'NA'
      const unitPrice = Math.round(ci.price ?? ci.discountedPrice ?? ci.originalPrice ?? 0)
      const originalUnit = Math.round(ci.originalPrice ?? unitPrice)
      const key = `${productId}|${size}|${color}|${unitPrice}`
      const existing = map.get(key)
      if (existing) {
        existing.quantity += (ci.quantity || 1)
        existing.originalPrice = Math.max(existing.originalPrice, originalUnit)
      } else {
        map.set(key, {
          productId,
          name: ci.name,
            originalPrice: originalUnit,
            discountedPrice: unitPrice,
            quantity: ci.quantity || 1,
            size,
            color,
            discount: ci.discount || 0,
            instock: ci.inStock !== false,
            image: ci.image || '',
            category: ci.category || 'General',
            brand: ci.brand || 'Brand'
        })
      }
    }
    return Array.from(map.values())
  }, [])
 
  const computeCartSignature = useCallback((items) => {
    if (!items || !items.length) return 'empty'
    const aggregated = aggregateCartLines(items)
    return aggregated
      .map(ci => [ci.productId, ci.size, ci.color, ci.quantity, ci.discountedPrice].join(':'))
      .sort()
      .join('|')
  }, [aggregateCartLines])
 
  const cacheKey = (uid) => `bill_cache_${uid}`
 
  /* ---------------- Offer Fetch ---------------- */
  const fetchOffers = useCallback(async () => {
    if (!canUseServerBilling()) { setOffers([]); return }
    try {
      let data = await apiFetch('', { base: OFFERS_BASE })
      if (!Array.isArray(data)) { try { data = await apiFetch('/all', { base: OFFERS_BASE }) } catch { /* ignore */ } }
      if (Array.isArray(data)) setOffers(data)
    } catch { /* silent */ }
  }, [canUseServerBilling])
 
  React.useEffect(() => { fetchOffers() }, [fetchOffers])
 
  /* ---------------- Load cached bill on login ---------------- */
  React.useEffect(() => {
    if (!canUseServerBilling()) { setBill(null); lastCartSignature.current=''; return }
    if (!cartItems || !cartItems.length) { setBill(null); lastCartSignature.current=''; return }
    try {
      const sig = computeCartSignature(cartItems)
      const raw = localStorage.getItem(cacheKey(user.id || user.email || 'guest'))
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && parsed.signature === sig && parsed.bill) {
          setBill(parsed.bill)
          lastCartSignature.current = sig
          return
        }
      }
    } catch { /* ignore */ }
  }, [user, cartItems, canUseServerBilling, computeCartSignature])
 
  /* ---------------- Generate Bill (server derives items) ---------------- */
  const generateBill = useCallback(async (_selectedIds, { offerCode, applyOffer } = {}) => {
    if (!canUseServerBilling()) return null
    if (!cartItems || !cartItems.length) { setBill(null); lastCartSignature.current='empty'; return null }
 
    const signature = computeCartSignature(cartItems)
    if (bill && lastCartSignature.current === signature && !applyOffer && !offerCode) return bill
 
    setLoading(true); setError(null)
    const qs = []
    if (offerCode) qs.push(`offerCode=${encodeURIComponent(offerCode)}`)
    if (applyOffer) qs.push('applyOffer=true')
    const path = `/generate${qs.length?('?'+qs.join('&')):''}`
 
    try {
      const newBill = await apiFetch(path, { method: 'POST', base: BILLS_BASE })
      if (newBill) {
        setBill(newBill)
        lastCartSignature.current = signature
        try { localStorage.setItem(cacheKey(user.id || user.email || 'guest'), JSON.stringify({ signature, bill: newBill })) } catch { /* ignore */ }
        toast.success('Bill generated successfully')
      }
      return newBill
    } catch (e) {
      if (e.status === 500) {
        console.error('Bill generation 500. Likely backend logic / NPE. Check BillService.attachCurrentItems and offer logic.', e.payload || e)
      }
      const msg = e.message || ''
      setError(msg)
      if (!/detached entity/i.test(msg)) console.error('Bill generation failed:', msg)
      return null
    } finally { setLoading(false) }
  }, [canUseServerBilling, cartItems, bill, computeCartSignature, user])
 
  /* ---------------- React to cart changes (auto generate / regenerate) ---------------- */
  React.useEffect(() => {
    if (!canUseServerBilling()) return
    if (!cartItems || !cartItems.length) { setBill(null); lastCartSignature.current=''; return }
    const signature = computeCartSignature(cartItems)
    if (!bill) {
      generateBill().catch(() => {})
      return
    }
    if (signature !== lastCartSignature.current) {
      generateBill().catch(() => {})
    }
  }, [cartItems, canUseServerBilling, bill, computeCartSignature, generateBill])
 
  /* ---------------- Offer Actions ---------------- */
  const applyOffer = useCallback(async (code) => {
    if (!canUseServerBilling()) return null
    if (!code) return null
    if (loading || applyingOfferRef.current) return null
    applyingOfferRef.current = true
    setLoading(true); setError(null)
    try {
      let current = bill
      if (!current) current = await generateBill()
      if (!current?.id) return null
      const updated = await apiFetch(`/apply/${current.id}?code=${encodeURIComponent(code)}`, { method: 'PUT', base: OFFERS_BASE })
      if (updated) {
        setBill(updated)
        try { const signature = computeCartSignature(cartItems); localStorage.setItem(cacheKey(user.id || user.email || 'guest'), JSON.stringify({ signature, bill: updated })) } catch { /* ignore */ }
        toast.success('Offer applied successfully')
      }
      return updated
    } catch (e) {
      const msg = e.message || 'Apply offer failed'
      setError(msg); toast.error(msg)
      return null
    } finally { applyingOfferRef.current = false; setLoading(false) }
  }, [canUseServerBilling, bill, cartItems, generateBill, computeCartSignature, loading, user])
 
  const removeOffer = useCallback( async () => {
    if (!canUseServerBilling()) return null
    if (!bill?.id) return null
    if (loading || applyingOfferRef.current) return null
    applyingOfferRef.current = true
    setLoading(true); setError(null)
    try {
      const updated = await apiFetch(`/remove/${bill.id}`, { method: 'PUT', base: OFFERS_BASE })
      if (updated) {
        setBill(updated)
        try { const signature = computeCartSignature(cartItems); localStorage.setItem(cacheKey(user.id || user.email || 'guest'), JSON.stringify({ signature, bill: updated })) } catch { /* ignore */ }
        toast.success('Offer removed successfully')
      }
      return updated
    } catch (e) {
      const msg = e.message || 'Remove offer failed'
      setError(msg); toast.error(msg)
      return null
    } finally { applyingOfferRef.current = false; setLoading(false) }
  }, [canUseServerBilling, bill, cartItems, computeCartSignature, loading, user])
 
  /* ---------------- Logout cleanup ---------------- */
  React.useEffect(()=>{ if(!user){ setBill(null); setOffers([]); setError(null); lastCartSignature.current=''} }, [user])
 
  const value = { bill, loading, error, offers, fetchOffers, generateBill, applyOffer, removeOffer, _lastSignature: lastCartSignature.current }
  return <BillContext.Provider value={value}>{children}</BillContext.Provider>
}
 
export default BillProvider