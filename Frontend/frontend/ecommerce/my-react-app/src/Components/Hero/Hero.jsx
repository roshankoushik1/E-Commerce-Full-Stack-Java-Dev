import React, { useState, useEffect } from 'react'
import "./Hero.css"
import { assets } from '../../assets/assets'
import { GATEWAY_BASE } from '../../api/apiClient'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Array of hero images
  const [heroImages, setHeroImages] = useState([])

  const resolveImage = (entry) => {
    if (!entry) return undefined
    if (typeof entry === 'string') {
      if (entry.startsWith('assets.')) {
        const key = entry.split('.')[1]
        return assets[key] || assets[entry]
      }
      return entry
    }
    if (typeof entry === 'object' && entry.image) {
      return resolveImage(entry.image)
    }
    return undefined
  }

  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        const res = await fetch(`${GATEWAY_BASE}/api/hero`)
        if (!res.ok) throw new Error('Failed to fetch hero images')
        const data = await res.json()
        const arr = Array.isArray(data) ? data : [data]
        const resolved = arr.map(resolveImage).filter(Boolean)
        setHeroImages(resolved.length ? resolved : [assets.hero1, assets.hero2, assets.hero3, assets.hero4, assets.hero5])
      } catch (e) {
        console.error('Error fetching hero images:', e)
        // setHeroImages([assets.hero1, assets.hero2, assets.hero3, assets.hero4, assets.hero5])
      }
    }
    loadHeroImages()
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!heroImages.length) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  // Navigate to previous slide
  const prevSlide = () => {
    if (!heroImages.length) return
    setCurrentSlide(prev => 
      prev === 0 ? heroImages.length - 1 : prev - 1
    )
  }

  // Navigate to next slide
  const nextSlide = () => {
    if (!heroImages.length) return
    setCurrentSlide(prev => (prev + 1) % heroImages.length)
  }

  // Navigate to specific slide
  const goToSlide = (index) => {
    if (!heroImages.length) return
    setCurrentSlide(index)
  }

  return (
    <div className="hero-carousel">
      <div className="carousel-container">
        {/* Left Arrow */}
        <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
          <span>&#8249;</span>
        </button>

        {/* Carousel Images */}
        <div className="carousel-slides">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <img src={image} alt={`Hero ${index + 1}`} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
          <span>&#8250;</span>
        </button>

        {/* Navigation Dots */}
        <div className="carousel-dots">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Hero