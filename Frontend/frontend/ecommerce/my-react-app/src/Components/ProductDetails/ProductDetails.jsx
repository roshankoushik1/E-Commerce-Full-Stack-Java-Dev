import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import './ProductDetails.css'
import { assets } from '../../assets/assets'
import { useCart } from '../../context/CartContext'
 
const ProductDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedColor, setSelectedColor] = useState('Blue')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
 
  // Get product data from navigation state
  const productData = location.state?.selectedProduct
 
  // Resolve backend provided image strings like "assets.image2" / "image2" / filename
  const resolveBackendImage = (img) => {
    if (!img) return assets.dummy1
    if (typeof img !== 'string') return img
    const trimmed = img.trim()
    // If full URL return as-is
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    // If looks like relative path with extension keep (VITE_IMAGE_BASE_URL could prefix, omitted here)
    if (/\.(png|jpe?g|webp|avif)$/i.test(trimmed) && trimmed.includes('/')) return trimmed
    // Strip leading namespace like assets.
    let key = trimmed.replace(/^assets\./, '')
    // Remove extension when trying key lookup
    key = key.replace(/\.(png|jpe?g|webp|avif)$/i, '')
    // Common alias map (extend as needed)
    const aliasMap = {
      image1: assets.dummy1,
      image2: assets.dummy2,
      image3: assets.dummy3,
      image4: assets.dummy4,
      whiteshirt: assets.WhiteShirtMen,
      whiteshirtmen: assets.WhiteShirtMen
    }
    // Direct match in exported assets
    if (assets[key]) return assets[key]
    if (aliasMap[key.toLowerCase()]) return aliasMap[key.toLowerCase()]
    return assets.dummy1
  }
 
  // Enhanced thumbnails fallback (prefer provided thumbnails -> productData.images -> defaults)
  const thumbnails = location.state?.thumbnails || [assets.dummy1, assets.dummy2, assets.dummy3, assets.dummy4]
 
  // Default product data if no product is passed
  const defaultProduct = {
    name: "Premium Cotton T-Shirt",
    price: "$29.99",
    originalPrice: "$39.99",
    description: "Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this versatile piece features a classic fit that's perfect for everyday wear. The soft fabric ensures breathability while maintaining its shape wash after wash.",
    image: assets.dummy1,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Black', 'White', 'Gray', 'Navy'],
    inStock: true,
    rating: 4.5,
    reviews: 127
  }
 
  const product = productData || defaultProduct
 
  // Normalize numeric prices accommodating backend fields (discountedPrice/originalPrice)
  const normalizeNumber = (val) => {
    if (typeof val === 'number') return val
    if (typeof val === 'string') { const n = parseFloat(val.replace(/[^0-9.]/g, '')); return Number.isNaN(n) ? 0 : n }
    return 0
  }
  const currentPrice = normalizeNumber(product.discountedPrice || product.price || product.currentPrice || product.finalPrice || product.salePrice)
  const originalPrice = normalizeNumber(product.originalPrice || product.strikePrice || product.mrp || product.listPrice || product.price || currentPrice)
  const effectiveDiscountPercent = (product.discount !== undefined && product.discount !== null)
    ? normalizeNumber(product.discount)
    : (originalPrice > 0 && currentPrice < originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : null)
 
  // Main image robust fallback using resolver - always use the passed image
  const mainImage = resolveBackendImage(
    productData?.image 
  )
 
  // Add to cart handlers
  const handleAddToCart = async () => {
    if (adding) return
    setAdding(true)
    const added = await addToCart({
      ...product,
      price: currentPrice,
      originalPrice: originalPrice,
      discount: effectiveDiscountPercent,
      image: mainImage
    }, selectedSize, selectedColor, quantity)
    if (added) {
      toast.success(`${product.name} added to cart`) // single toast
    }
    setTimeout(() => setAdding(false), 400) // small debounce
  }
 
  const handleBuyNow = async () => {
    if (adding) return
    setAdding(true)
    const added = await addToCart({
      ...product,
      price: currentPrice,
      originalPrice: originalPrice,
      discount: effectiveDiscountPercent,
      image: mainImage
    }, selectedSize, selectedColor, quantity)
    if (added) {
      toast.success(`${product.name} added. Redirecting...`)
      setTimeout(() => { navigate('/checkout') }, 300)
    }
    setTimeout(() => setAdding(false), 400)
  }
 
  return (
    <div className="product-details-container">
      <div className="product-details">
        {/* Left side - Product Image */}
        <div className="product-image-section">
          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          <div className="image-thumbnails">
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`View ${index + 1}`}
                className="thumbnail"
              />
            ))}
          </div>
        </div>
 
        {/* Right side - Product Information */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating || 4.5) ? 'star filled' : 'star'}>★</span>
                ))}
              </div>
              <span className="rating-text">({product.reviews || 127} reviews)</span>
            </div>
          </div>
 
          <div className="price-section">
            <span className="current-price">${currentPrice.toFixed(2)}</span>
            {originalPrice > currentPrice && (
              <span className="original-price">${originalPrice.toFixed(2)}</span>
            )}
            {effectiveDiscountPercent !== null && effectiveDiscountPercent > 0 && (
              <span className="discount">{effectiveDiscountPercent}% OFF</span>
            )}
          </div>
 
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || defaultProduct.description}</p>
          </div>
 
          <div className="product-options">
            <div className="option-group">
              <h4>Size</h4>
              <div className="size-options">
                {(product.sizes || defaultProduct.sizes).map((size) => (
                  <button key={size} className={`size-btn ${selectedSize === size ? 'selected' : ''}`} onClick={() => setSelectedSize(size)}>{size}</button>
                ))}
              </div>
            </div>
            <div className="option-group">
              <h4>Color: <span className="selected-color">{selectedColor}</span></h4>
              <div className="color-options">
                {(product.colors || defaultProduct.colors).map((color) => (
                  <button
                    key={color}
                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  >
                    {selectedColor === color && <span className="checkmark">✓</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="option-group">
              <h4>Quantity</h4>
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="quantity">{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
          </div>
 
          <div className="action-buttons">
            <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={adding || !(product.inStock !== false || product.instock !== false)}>
              <img src={assets.carticon} alt="Cart" />
              Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow} disabled={adding || !(product.inStock !== false || product.instock !== false)}>
              Buy Now
            </button>
          </div>
 
          <div className="additional-info">
            <div className="info-item"><strong>Free Shipping</strong> on orders over $50</div>
            <div className="info-item"><strong>Easy Returns</strong> within 30 days</div>
            <div className="info-item"><strong>Secure Payment</strong> guaranteed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
 
export default ProductDetails
 