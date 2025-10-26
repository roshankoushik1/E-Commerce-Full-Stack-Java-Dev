import React, { useEffect, useState } from 'react'
import './Categories.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { GATEWAY_BASE } from '../../api/apiClient'

const Categories = () => {
  const navigate = useNavigate()

  const defaultCategories = [
    // { name: 'Women', image: assets.women, id: 'women' },
    // { name: 'Men', image: assets.men, id: 'men' },
    // { name: 'Kids', image: assets.kids, id: 'kids' }
  ]

  const [categories, setCategories] = useState(defaultCategories)

  const resolveImage = (value) => {
    if (!value) return undefined
    if (typeof value === 'string') {
      if (value.startsWith('assets.')) {
        const key = value.split('.')[1]
        return assets[key] || assets[value]
      }
      return assets[value] || value
    }
    return value
  }

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [res1, res2] = await Promise.allSettled([
          fetch(`${GATEWAY_BASE}/categories`),
          fetch(`${GATEWAY_BASE}/api/category`)
        ])
        
        const allCategories = []
        
        if (res1.status === 'fulfilled' && res1.value.ok) {
          const data = await res1.value.json()
          const arr = Array.isArray(data) ? data : [data]
          allCategories.push(...arr)
        }
        
        if (res2.status === 'fulfilled' && res2.value.ok) {
          const data = await res2.value.json()
          const arr = Array.isArray(data) ? data : [data]
          allCategories.push(...arr)
        }
        
        const normalized = allCategories.map((item) => ({
          id: item.id || (item.name ? String(item.name).toLowerCase() : undefined),
          name: item.name || '',
          image: resolveImage(item.image)
        })).filter(c => c.id && c.name && c.image)
        
        setCategories(normalized.length ? normalized : defaultCategories)
      } catch (e) {
        console.error('Error fetching categories:', e)
        setCategories(defaultCategories)
      }
    }
    loadCategories()
  }, [])

  const handleCategoryClick = (categoryName) => {
    navigate(`/explore-all?category=${encodeURIComponent(categoryName)}`)
  }

  return (
    <div className="categories-container">
      <div className="categories-grid">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="category-card"
            style={{backgroundImage: `url(${category.image})`}}
            onClick={() => handleCategoryClick(category.name)}
          >
            <div className="category-overlay">
              <h2 className="category-name">{category.name}</h2>
              <button className="shop-now-btn">Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories