import React, { useEffect, useState } from 'react'
import './Categories.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

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
        const res = await fetch('http://localhost:8305/categories')
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data = await res.json()
        const arr = Array.isArray(data) ? data : [data]
        const normalized = arr.map((item) => ({
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