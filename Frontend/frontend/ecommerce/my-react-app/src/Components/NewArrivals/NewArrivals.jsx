import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './NewArrivals.css'
import { assets } from '../../assets/assets'
import { GATEWAY_BASE } from '../../api/apiClient'

const NewArrivals = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const resolveImagePath = (imageField) => {
    if (!imageField) return null
    if (typeof imageField === 'string') {
      const match = imageField.match(/^assets\.(.+)$/)
      if (match && assets[match[1]]) return assets[match[1]]
      if (imageField.startsWith('http://') || imageField.startsWith('https://') || imageField.startsWith('/')) {
        return imageField
      }
    }
    return imageField
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${GATEWAY_BASE}/api/products`)
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()
        const normalized = Array.isArray(data) ? data.map((item) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          originalPrice: item.originalPrice != null ? Number(item.originalPrice) : null,
          image: resolveImagePath(item.image),
          category: item.category,
          brand: item.brand,
          sizes: item.sizes || [],
          colors: item.colors || [],
          isNew: item.new ?? item.isNew ?? false,
          inStock: Boolean(item.inStock),
          rating: item.rating ?? 0,
          reviews: item.reviews ?? 0,
          description: item.description || ''
        })) : []
        setProducts(normalized)
      } catch (err) {
        setError(err.message || 'Error fetching products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleProductClick = (product) => {
    // Navigate to product details page with the product data
    navigate('/product-details', { 
      state: { 
        selectedProduct: product,
        thumbnails: [assets.dummy1, assets.dummy2, assets.dummy3, assets.dummy4]
      } 
    })
  }

  const nextSlide = () => {
    if (products.length === 0) return
    setCurrentIndex((prevIndex) => 
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    if (products.length === 0) return
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    )
  }

  return (
    <div className="new-arrivals">
      <div className="new-arrivals-header">
        <h2>New Arrivals</h2>
      </div>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
      <div className="products-container">
        <button className="nav-arrow nav-arrow-left" onClick={prevSlide}>
          &#8249;
        </button>
        
        <div className="products-wrapper">
          <div 
            className="products-track" 
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {products.map((product) => (
              <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
                <div className="product-image-container">
                  {product.isNew && <span className="new-badge">NEW</span>}
                  <img src={product.image} alt={product.name} className="product-image" />
                  {/* <div className="product-actions">
                    <button className="action-btn wishlist-btn">♡</button>
                    <button className="action-btn cart-btn">🛒</button>
                  </div> */}
                </div>
                <div className="product-info">
                  <h4 className="product-names">{product.name}</h4>
                  <div className="product-pricings">
                    {product.originalPrice && (
                      <span className="original-prices">${product.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="current-prices">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button className="nav-arrow nav-arrow-right" onClick={nextSlide}>
          &#8250;
        </button>
      </div>
      )}
    </div>
  )
}

export default NewArrivals