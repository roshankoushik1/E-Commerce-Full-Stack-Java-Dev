/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { GATEWAY_BASE } from '../api/apiClient'

const ProductsContext = createContext(null)

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${GATEWAY_BASE}/api/allproducts`)
        if (!response.ok) {
          console.error('Failed to fetch products')
          return
        }
        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Add a product by posting to the API
  const addProduct = async (product) => {
    console.log(product)
    try {
      const response = await fetch(`${GATEWAY_BASE}/api/allproducts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
      })
      if (!response.ok) {
        console.error('Failed to add product')
        return
      }
      const newProduct = await response.json()
      setProducts(prev => [newProduct, ...prev])
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  // Update product locally (extend to PUT/PATCH if needed)
  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  // Delete a product by calling the API
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${GATEWAY_BASE}/api/allproducts/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        console.error('Failed to delete product')
        return
      }
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const value = useMemo(() => ({
    products,
    addProduct,
    updateProduct,
    deleteProduct
  }), [products])

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
} 