import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Explore.css'
import { assets } from '../../assets/assets'
import { GATEWAY_BASE } from '../../api/apiClient'

const Explore = () => {
  const navigate = useNavigate()

  const [collections, setCollections] = useState([])

  const resolveAsset = (imageField) => {
    if (!imageField) return undefined
    if (typeof imageField === 'string') {
      const key = imageField.startsWith('assets.') ? imageField.split('.')[1] : imageField
      return assets[key] || assets[imageField]
    }
    return imageField
  }

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(`${GATEWAY_BASE}/api/Explores`)
        if (!response.ok) throw new Error('Failed to fetch explores')
        const data = await response.json()
        const normalized = (Array.isArray(data) ? data : [data]).map((item) => ({
          ...item,
          image: resolveAsset(item.image),
          isNew: item.isNew ?? item.new ?? false,
        }))
        setCollections(normalized)
      } catch (error) {
        console.error('Error loading explores:', error)
        setCollections([])
      }
    }

    fetchCollections()
  }, [])

  const handleExploreMoreClick = () => {
    navigate('/explore-all')
  }

  const handleProductClick = (product) => {
    // Navigate to product details page with the product data
    navigate('/product-details', { 
      state: { 
        selectedProduct: product,
        thumbnails: [assets.dummy1, assets.dummy2, assets.dummy3, assets.dummy4]
      } 
    })
  }

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h2 className="explore-title">Explore Our Collections</h2>
      </div>
      
      <div className="collections-grid">
        {collections.map((item) => (
          <div key={item.id} className="collection-card" onClick={() => handleProductClick(item)}>
            <div className="card-image-container">
              <img src={item.image} alt={item.name} className="card-image" />
              {item.isNew && <span className="new-badge">NEW</span>}
            </div>
            <div className="card-content">
              <h3 className="item-name">{item.name}</h3>
              <div className="item-pricing">
                {item.originalPrice && (
                  <span className="original-prices">${item.originalPrice.toFixed(2)}</span>
                )}
                <span className="current-prices">${item.price?.toFixed ? item.price.toFixed(2) : item.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="explore-footer">
        <button className="explore-more-btn" onClick={handleExploreMoreClick}>
          Explore More 
          <img src={assets.rightarrow} alt="arrow" className="arrow-icon" />
        </button>
      </div>
    </div>
  )
}

export default Explore