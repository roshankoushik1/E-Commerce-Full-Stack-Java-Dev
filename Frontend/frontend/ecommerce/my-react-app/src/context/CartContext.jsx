/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { apiFetch } from '../api/apiClient'
import { useAuth } from './AuthContext'
import { useBill } from './BillContext'
import { toast } from 'react-toastify'
 
const CartContext = createContext()
 
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
 
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth() || {}
  const { } = useBill() || {}
  const addToCartLockRef = useRef(false)
  const addToWishlistLockRef = useRef(false)
  const syncingRef = useRef(false)
  const removeLockRef = useRef(false)
  const cartItemsRef = useRef(cartItems)
  const quantityLocksRef = useRef(new Map()) // per-line lock
  const [isSyncing, setIsSyncing] = useState(false)
  const [serverCartDisabled, setServerCartDisabled] = useState(false)
  useEffect(()=>{ cartItemsRef.current = cartItems }, [cartItems])

  // Trigger cart sync immediately when user logs in
  useEffect(() => {
    if (user && user.role === 'USER' && localStorage.getItem('auth_token') && canUseServerCart()) {
      syncCart()
    }
  }, [user?.id, user?.email])
 
  useEffect(() => {
    if (!user) {
      try {
        const raw = localStorage.getItem('guest_cart')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) setCartItems(parsed)
        }
      } catch { /* ignore */ }
      return
    }
  }, [user])
 
  useEffect(() => {
    if (!user) {
      try { localStorage.setItem('guest_cart', JSON.stringify(cartItems)) } catch { /* ignore */ }
    } else {
      try { localStorage.removeItem('guest_cart') } catch { /* ignore */ }
    }
  }, [cartItems, user])
 
  function normalizeCartItem(it){
    const discounted = it.discountedPrice ?? it.price ?? it.originalPrice ?? 0
    const original = it.originalPrice ?? discounted ?? 0
    const img = it.image || it.imageUrl || it.thumbnail || (Array.isArray(it.images)?it.images[0]:null)
    const imageBase = import.meta.env.VITE_IMAGE_BASE_URL || ''
    const finalImg = img && imageBase && !/^https?:/i.test(img) ? imageBase.replace(/\/$/,'') + '/' + img.replace(/^\//,'') : (img || '')
    return {
      id: it.id,
      productId: it.productId,
      name: it.name,
      price: discounted,
      originalPrice: original,
      discountedPrice: discounted,
      image: finalImg,
      size: it.size,
      color: it.color,
      inStock: it.instock,
      quantity: it.quantity,
      discount: it.discount ?? it.offPercentage ?? 0,
      category: it.category,
      brand: it.brand,
      billId: it.billId // keep if backend returns
    }
  }
  function normalizeWishlistItem(it){
    const discounted = it.discountedPrice ?? it.price ?? it.originalPrice ?? 0
    const original = it.originalPrice ?? discounted ?? 0
    return {
      id: it.id,
      productId: it.productId,
      name: it.name,
      price: discounted,
      originalPrice: original,
      discountedPrice: discounted,
      image: it.image,
      size: it.size,
      color: it.color,
      inStock: it.instock,
      quantity: it.quantity ?? 1,
      discount: it.discount ?? 0,
      category: it.category,
      brand: it.brand
    }
  }
 
  // Check if user can use server-side cart
  const canUseServerCart = useCallback(() => {
    if (!user) return false
    if (serverCartDisabled) return false
    if (user.role === 'ADMIN' || user.role === 'admin') return false
    const token = localStorage.getItem('auth_token')
    if (!token) return false
    const parts = token.split('.')
    return parts.length === 3
  }, [user, serverCartDisabled])
 
  const syncCart = useCallback(async () => {
    if (!user || !canUseServerCart()) return
    if (syncingRef.current) return
    syncingRef.current = true
    setIsSyncing(true)
    try {
      const items = await apiFetch('/api/cart', {})
      const normalizedItems = Array.isArray(items) ? items.map(normalizeCartItem) : []
      setCartItems(normalizedItems)
      return normalizedItems
    } catch (e) {
      console.error('Sync cart failed:', e)
      setCartItems([])
      setServerCartDisabled(true)
      return []
    } finally { 
      syncingRef.current = false
      setIsSyncing(false)
    }
  }, [user, canUseServerCart])
 
  useEffect(() => {
    setLoading(false)
    if (!user) { 
      setCartItems([])
      setWishlistItems([])
      setServerCartDisabled(false)
      return 
    }
    
    setServerCartDisabled(false)
    
    if (!canUseServerCart()) {
      setCartItems([])
      setWishlistItems([])
      return
    }
    
    // Make API calls for regular users with valid tokens
    if (user.role === 'USER' && localStorage.getItem('auth_token')) {
      ;(async () => {
        setLoading(true)
        try {
          await syncCart()
          if (!serverCartDisabled) {
            try {
              const wishlist = await apiFetch('/api/wishlist', {})
              setWishlistItems(Array.isArray(wishlist) ? wishlist.map(normalizeWishlistItem) : [])
            } catch {
              setWishlistItems([])
            }
          }
        } catch {
          setCartItems([])
          setWishlistItems([])
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [user, user?.email, canUseServerCart])
 
  const toIntPrice = (val) => {
    if (val == null) return 0
    if (typeof val === 'number') return Math.round(val)
    if (typeof val === 'string') {
      const num = parseFloat(val.replace(/[^0-9.]/g,'').trim())
      if (Number.isNaN(num)) return 0
      return Math.round(num)
    }
    return 0
  }
 
  const updateVariantQuantity = useCallback(async (productId, size, color, quantity) => {
    if (!canUseServerCart()) return
    try {
      await apiFetch(`/api/cart/variant?productId=${productId}&size=${encodeURIComponent(size||'NA')}&color=${encodeURIComponent(color||'NA')}&quantity=${quantity}`, { method: 'PUT' })
      await syncCart()
    } catch (e) {
      console.error('Variant quantity update failed', e)
      throw e
    }
  }, [canUseServerCart, syncCart])
 
  const addToCart = useCallback(async (product, selectedSize, selectedColor, quantity) => {
    if (addToCartLockRef.current) return null
    addToCartLockRef.current = true
    const release = () => { addToCartLockRef.current = false }
    try {
      const desiredQty = quantity || 1
      const numericProductId = parseInt(product.id || product.productId, 10)
      
      if (!canUseServerCart()) {
        // Guest cart mode - check for existing item with same product, size, color
        const existingItem = cartItems.find(item => 
          parseInt(item.productId) === numericProductId && 
          (item.size || 'NA') === (selectedSize || 'NA') && 
          (item.color || 'NA') === (selectedColor || 'NA')
        )
        
        if (existingItem) {
          // Update existing item quantity
          setCartItems(prev => prev.map(item => 
            item.id === existingItem.id 
              ? { ...item, quantity: item.quantity + desiredQty }
              : item
          ))
          toast.success('Updated quantity')
          return existingItem
        }
        
        // Add new item to guest cart
        const localId = 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2)
        const original = toIntPrice(product.originalPrice ?? product.price)
        const discounted = toIntPrice(product.price)
        const localItem = normalizeCartItem({
          id: localId,
          productId: numericProductId,
          name: product.name,
          originalPrice: original,
          discountedPrice: discounted,
          image: product.image,
          category: product.category || 'General',
          brand: product.brand || 'Brand',
          size: selectedSize || 'NA',
          color: selectedColor || 'NA',
          instock: product.inStock !== false,
          quantity: desiredQty,
          discount: product.discount || 0
        })
        setCartItems(prev => [...prev, localItem])
        if (!user) {
          if (!sessionStorage.getItem('guest_cart_notice')) {
            toast.info('Guest mode: item stored locally. Login to persist.')
            sessionStorage.setItem('guest_cart_notice','1')
          }
        }
        toast.success('Added to cart')
        return localItem
      }
      
      // Server cart mode - check for existing item with same product, size, color
      const existingItem = cartItems.find(item => 
        parseInt(item.productId) === numericProductId && 
        (item.size || 'NA') === (selectedSize || 'NA') && 
        (item.color || 'NA') === (selectedColor || 'NA')
      )
      
      if (existingItem) {
        // Update existing item quantity
        try {
          await apiFetch(`/api/cart/${existingItem.id}?quantity=${existingItem.quantity + desiredQty}`, { 
            method: 'PUT'
          })
          await syncCart()
          toast.success('Updated quantity')
          return existingItem
        } catch (e) {
          console.error('Update quantity failed:', e)
          return null
        }
      }
      
      // Add new item to cart
      try {
        if (!Number.isInteger(numericProductId)) return null
        const original = toIntPrice(product.originalPrice ?? product.price)
        const discounted = Math.max(0, toIntPrice(product.price))
        const bodyPayload = {
          productId: numericProductId,
          name: product.name || 'Item',
          originalPrice: original || discounted || 0,
          discountedPrice: (discounted || original || 0),
          quantity: desiredQty,
          size: (selectedSize||'NA'),
          color: (selectedColor||'NA'),
          discount: product.discount || product.offPercentage || 0,
          category: product.category || 'General',
          brand: product.brand || 'Brand',
          image: product.image || product.imageUrl || product.thumbnail || (Array.isArray(product.images)?product.images[0]:null) || ''
        }
        const newItem = await apiFetch('/api/cart', { method: 'POST', body: bodyPayload })
        await syncCart()
        toast.success('Added to cart')
        return newItem
      } catch (e) {
        console.error('Add to cart failed:', e)
        return null
      }
    } finally { release() }
  }, [canUseServerCart, syncCart, cartItems, user])
 
  const removeFromCart = useCallback(async (id) => {
    if (removeLockRef.current) return
    removeLockRef.current = true
    const release = () => { removeLockRef.current = false }
    try {
      if (!canUseServerCart()) { setCartItems(p=>p.filter(i=>i.id!==id)); return }
      await apiFetch(`/api/cart/${id}`, { method: 'DELETE' })
      await syncCart()
      toast.info('Removed item')
    } catch(e){ console.error('Delete cart failed', e) }
    finally { release() }
  }, [canUseServerCart, syncCart])
 
  const updateQuantity = useCallback(async (itemOrId, newQuantityRaw, _retry=false) => {
    const passedItem = (itemOrId && typeof itemOrId === 'object') ? itemOrId : null
    const id = passedItem ? passedItem.id : itemOrId
 
    if (quantityLocksRef.current.get(id)) return
 
    let newQuantity = parseInt(newQuantityRaw,10)
    if (Number.isNaN(newQuantity)) newQuantity = 1
    if (newQuantity < 1) return removeFromCart(id)
 
    if (!canUseServerCart()) { setCartItems(p=>p.map(i=>i.id===id?{...i,quantity:newQuantity}:i)); return }
 
    const lock = () => quantityLocksRef.current.set(id, true)
    const unlock = () => quantityLocksRef.current.delete(id)
 
    if (syncingRef.current && !_retry) { setTimeout(()=>updateQuantity(itemOrId, newQuantity, true), 100); return }
 
    lock()
    try {
      let target = passedItem || cartItemsRef.current.find(ci => ci.id === id)
      if (!target) {
        if (!_retry) { await syncCart(); unlock(); return updateQuantity(itemOrId, newQuantity, true) }
        unlock(); return
      }
      if (target.quantity === newQuantity) { unlock(); return }
 
      try {
        await apiFetch(`/api/cart/${target.id}?quantity=${newQuantity}`, { method: 'PUT' })
        await syncCart() // This updates cartItems state and triggers BillContext
      } catch(e){
        if (!_retry && e.status === 500) { await syncCart(); unlock(); return updateQuantity(itemOrId, newQuantity, true) }
        console.error('Update qty failed', e)
        await syncCart() // sync even on failure to revert optimistic update
      }
    } finally { unlock() }
  }, [canUseServerCart, removeFromCart, syncCart])
 
  const addToWishlist = useCallback(async (item) => {
    if (!canUseServerCart()) return
    if (addToWishlistLockRef.current) return
    addToWishlistLockRef.current = true
    const release = () => { addToWishlistLockRef.current = false }
    try {
      // Check if product already exists in wishlist (by productId only)
      const exists = wishlistItems.find(w => w.productId === (item.productId || item.id))
      if (exists) { 
        toast.info('Already in wishlist')
        return null 
      }
      
      const original = toIntPrice(item.originalPrice ?? item.price)
      const discounted = toIntPrice(item.price)
      const body = {
        productId: item.productId || item.id,
        name: item.name,
        originalPrice: original,
        discountedPrice: discounted,
        image: item.image,
        discount: item.discount || 0,
        category: item.category || 'General',
        brand: item.brand || 'Brand',
        size: item.size,
        color: item.color,
        instock: item.inStock !== false,
        quantity: item.quantity || 1
      }
      
      let created
      try { 
        created = await apiFetch('/api/wishlist', { method: 'POST', body }) 
      } catch(e) {
        const msg = e.payload?.message || e.message || ''
        if (/not return a unique result/i.test(msg) || /already exists/i.test(msg)) {
          toast.info('Already in wishlist')
          return null
        }
        throw e
      }
      
      if (created) {
        setWishlistItems(prev => [...prev, normalizeWishlistItem(created)])
        
        // Remove the specific cart item that was added to wishlist
        if (item.id) {
          setCartItems(prev => prev.filter(ci => ci.id !== item.id))
          try { 
            await apiFetch(`/api/cart/${item.id}`, { method: 'DELETE' }) 
          } catch { 
            // If delete fails, sync cart to get current state
            await syncCart()
          }
        }
        
        toast.success('Added to wishlist')
        return created
      } else {
        toast.info('Already in wishlist')
        return null
      }
    } catch(e){
      console.error('Add wishlist failed', e)
      toast.error(e.payload?.message || e.message || 'Add to wishlist failed')
      return null
    } finally { release() }
  }, [canUseServerCart, wishlistItems, toIntPrice, syncCart])
 
  const removeFromWishlist = useCallback(async (id) => {
    if (!canUseServerCart()) { setWishlistItems(p=>p.filter(i=>i.id!==id)); return }
    try { await apiFetch(`/api/wishlist/${id}`, { method: 'DELETE' }); setWishlistItems(p=>p.filter(i=>i.id!==id)); toast.info('Removed from wishlist') } catch(e){ console.error('Delete wishlist failed', e); toast.error('Remove from wishlist failed') }
  }, [canUseServerCart])
 
  const moveToCart = useCallback( async (item) => {
    if (!canUseServerCart()) return
    try {
      await apiFetch(`/api/wishlist/move-to-cart/${item.id}`, { method: 'POST' })
      const items = await apiFetch('/api/cart', {})
      setCartItems(Array.isArray(items)?items.map(normalizeCartItem):[])
      const wishlist = await apiFetch('/api/wishlist', {})
      setWishlistItems(Array.isArray(wishlist)?wishlist.map(normalizeWishlistItem):[])
      toast.success('Moved to cart')
    } catch(e){ console.error('Move to cart failed', e); toast.error('Move to cart failed') }
  }, [canUseServerCart])
 
  const getCartTotal = useCallback(() => cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0), [cartItems])
  const getFinalTotal = useCallback(() => { return getCartTotal() }, [getCartTotal])
  const getCartItemsCount = useCallback(() => cartItems.length, [cartItems])
  const getTotalQuantity = useCallback(() => cartItems.reduce((s,i)=>s+i.quantity,0), [cartItems])
  const isLineLocked = useCallback((id)=> quantityLocksRef.current.has(id), [])
 
  const value = useMemo(() => ({
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateVariantQuantity, // NOTE: still exported if other UI parts use it, but quantity update no longer auto-falls back to variant logic
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    getCartTotal,
    getFinalTotal,
    getCartItemsCount,
    getTotalQuantity,
    loading,
    isSyncing,
    isLineLocked
  }), [cartItems, wishlistItems, loading, addToCart, removeFromCart, updateQuantity, updateVariantQuantity, addToWishlist, removeFromWishlist, moveToCart, getCartTotal, getFinalTotal, getCartItemsCount, getTotalQuantity, isSyncing, isLineLocked])
 
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
 
export default CartContext