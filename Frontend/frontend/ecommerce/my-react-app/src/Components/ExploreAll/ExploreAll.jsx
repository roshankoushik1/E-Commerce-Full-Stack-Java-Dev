import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './ExploreAll.css'
import { assets } from '../../assets/assets'
import { useProducts } from '../../context/ProductsContext'
import { GATEWAY_BASE } from '../../api/apiClient'
 
const resolveAsset = (imageField) => {
  if (!imageField) return undefined
  if (typeof imageField === 'string') {
    const key = imageField.startsWith('assets.') ? imageField.split('.')[1] : imageField
    return assets[key] || assets[imageField]
  }
  return imageField
}
 
const ExploreAll = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { products: allProducts } = useProducts()
 
  // Dynamic data states (replacing static arrays)
  const [categories, setCategories] = useState(['All'])
  const [brands, setBrands] = useState([])
  const [allSizes, setAllSizes] = useState([])
 
 
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [sortBy, setSortBy] = useState('featured')
  const [searchText, setSearchText] = useState('')
  const [metaLoading, setMetaLoading] = useState(false)
  const [metaError, setMetaError] = useState(null)
 
  // Load categories, brands, sizes from backend
  useEffect(() => {
    let cancelled = false
    const loadMeta = async () => {
      setMetaLoading(true)
      setMetaError(null)
      try {
        const base = `${GATEWAY_BASE}`
        const [catRes, catRes2, brandRes, sizeRes] = await Promise.allSettled([
          fetch(`${base}/categories`),
          fetch(`${base}/api/category`),
          fetch(`${base}/api/brands`),
          fetch(`${base}/api/sizes`)
        ])
 
        // Categories from both services
        const allCategories = []
        
        if (catRes.status === 'fulfilled' && catRes.value.ok) {
          const data = await catRes.value.json()
          const arr = Array.isArray(data) ? data : []
          const normalized = arr.map(c => (typeof c === 'string' ? c : c?.name)).filter(Boolean)
          allCategories.push(...normalized)
        }
        
        if (catRes2.status === 'fulfilled' && catRes2.value.ok) {
          const data = await catRes2.value.json()
          const arr = Array.isArray(data) ? data : []
          const normalized = arr.map(c => (typeof c === 'string' ? c : c?.name)).filter(Boolean)
          allCategories.push(...normalized)
        }
        
        // De-dupe and clean
        const deduped = [...new Set(allCategories.map(c => c.trim()).filter(c => c.length > 0 && c.toLowerCase() !== 'all'))]
        
        if (!cancelled && deduped.length) {
          setCategories(['All', ...deduped])
        }
 
        // Brands
        if (brandRes.status === 'fulfilled' && brandRes.value.ok) {
          const data = await brandRes.value.json().catch(() => [])
          const arr = Array.isArray(data) ? data : []
          const normalized = arr.map(b => (typeof b === 'string' ? b : b?.name)).filter(Boolean)
          if (!cancelled && normalized.length) setBrands(Array.from(new Set(normalized)))
        }
 
        // Sizes
        if (sizeRes.status === 'fulfilled' && sizeRes.value.ok) {
          const data = await sizeRes.value.json().catch(() => [])
          const arr = Array.isArray(data) ? data : []
          const normalized = arr.map(s => (typeof s === 'string' ? s : s?.name || s?.size)).filter(Boolean)
          if (!cancelled && normalized.length) setAllSizes(Array.from(new Set(normalized)))
        }
      } catch {
        if (!cancelled) setMetaError('Failed to load filters')
      } finally {
        if (!cancelled) setMetaLoading(false)
      }
    }
    loadMeta()
    return () => { cancelled = true }
  }, [])
 
  // Initialize selected category and search from query parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
 
    if (categoryParam) {
      const normalized = categoryParam.toLowerCase()
      let mapped = 'All'
      if (normalized === 'men') mapped = 'Men'
      else if (normalized === 'women') mapped = 'Women'
      else if (normalized === 'kids') mapped = 'Kids'
      else {
        if (categories.includes(categoryParam)) {
          mapped = categoryParam
        }
      }
      setSelectedCategory(mapped)
    }
 
    if (searchParam) {
      setSearchText(searchParam)
    } else {
      setSearchText('')
    }
  }, [searchParams])
 
  // Apply filters
  useEffect(() => {
    let filtered = allProducts || []
 
    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }
 
    // Brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand)
    }
 
    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
 
    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes && product.sizes.some(size => selectedSizes.includes(size))
      )
    }
 
    // Search filter
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      filtered = filtered.filter(product => product.name.toLowerCase().includes(q))
    }
 
    // Sorting
    switch (sortBy) {
      case 'priceLowToHigh':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'priceHighToLow':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1))
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      default:
        // featured - keep original order
        break
    }
 
    setFilteredProducts(filtered)
  }, [allProducts, selectedCategory, selectedBrand, priceRange, selectedSizes, sortBy, searchText])
 
  const handleProductClick = (product) => {
    navigate('/product-details', {
      state: {
        selectedProduct: product,
        thumbnails: [assets.dummy1, assets.dummy2, assets.dummy3, assets.dummy4]
      }
    })
  }
 
  const handleSizeToggle = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    )
  }
 
  const clearAllFilters = () => {
    setSelectedCategory('All')
    setSelectedBrand('')
    setPriceRange([0, 1000])
    setSelectedSizes([])
    setSortBy('featured')
    setSearchText('')
  }
 
  return (
    <div className="explore-all-container">
      {/* Header */}
      <div className="page-header">
        <h1>All Products</h1>
        <div className="results-info">
          <span>{filteredProducts.length} results found</span>
          <div className="sort-dropdown">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Best Rating</option>
            </select>
          </div>
        </div>
      </div>
 
      <div className="main-content">
        {/* Sidebar Filters */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <h3>Filter</h3>
            <button className="clear-filters" onClick={clearAllFilters}>
              Clear All
            </button>
            {metaLoading && <span className="small-dim" style={{marginLeft:8}}>Loading filters…</span>}
            {metaError && <span className="small-error" style={{marginLeft:8}}>{metaError}</span>}
          </div>
 
          {/* Department/Category Filter */}
          <div className="filter-section">
            <h4>Department</h4>
            <div className="category-list">
              {categories.map(category => (
                <label key={category} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
 
          {/* Brand Filter */}
          <div className="filter-section">
            <h4>Category</h4>
            <div className="brand-list">
              {brands.map(brand => (
                <label key={brand} className="filter-option">
                  <input
                    type="checkbox"
                    checked={selectedBrand === brand}
                    onChange={(e) => setSelectedBrand(e.target.checked ? brand : '')}
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>
 
          {/* Price Range Filter */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-range-container">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="price-slider"
              />
            </div>
          </div>
 
          {/* Size Filter */}
          <div className="filter-section">
            <h4>Size</h4>
            <div className="size-grid">
              {allSizes.map(size => (
                <button
                  key={size}
                  className={`size-option ${selectedSizes.includes(size) ? 'selected' : ''}`}
                  onClick={() => handleSizeToggle(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
 
          {/* Color Filter */}
          {/* <div className="filter-section">
            <h4>Color</h4>
            <div className="color-optionss">
              {['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff'].map(color => (
                <div
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div> */}
        </div>
 
        {/* Products Grid */}
        <div className="products-section">
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="product-cards"
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image-container">
                  <img src={resolveAsset(product.image)} alt={product.name} />
                  {product.isNew && <span className="new-badge">NEW</span>}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="price-container">
                    <span className="current-price">${Number(product.price).toFixed(2)}</span>
                    {Number(product.originalPrice) > Number(product.price) && (
                      <span className="original-price">${Number(product.originalPrice).toFixed(2)}</span>
                    )}
                  </div>
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(product.rating || 0) ? 'star filled' : 'star'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-value">({product.rating || 0})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
 
          {filteredProducts.length === 0 && (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button onClick={clearAllFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
 
export default ExploreAll