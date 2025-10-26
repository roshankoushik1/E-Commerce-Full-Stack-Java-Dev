import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../../assets/assets';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { jsPDF } from 'jspdf';

const Header = () => {
  const navigate = useNavigate()
  const { getCartItemsCount } = useCart()
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { user, logout } = useAuth() || {};
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // PDF modal state
  const [isDocOpen, setIsDocOpen] = useState(false)
  const [currentTopic, setCurrentTopic] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const docRef = useRef(null)

  // Search state
  const [searchText, setSearchText] = useState('')
  const [mobileSearchText, setMobileSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState('All')

  useEffect(() => {
    const openLoginHandler = () => setIsLoginOpen(true);
    window.addEventListener('open-login', openLoginHandler);
    return () => {
      window.removeEventListener('open-login', openLoginHandler);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/')
  }

  const handleCartClick = () => {
    navigate('/cart')
  }

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  }

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  }

  const handleCloseSignup = () => {
    setIsSignupOpen(false);
  }

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  }

  const handleSwitchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  }

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  }

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    setIsProfileOpen(false);
  }

  // PDF helpers
  const createPdfForTopic = (topic) => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    doc.setFontSize(20)
    doc.text(`Emmable — ${topic}`, 40, 60)
    doc.setFontSize(12)
    const intro = `This is a dummy document for ${topic}. The content here is placeholder text.\n\nBelow is a simple form layout for demonstration:`
    doc.text(doc.splitTextToSize(intro, 520), 40, 100)
    const startY = 160
    const lineGap = 36
    doc.setDrawColor(0)
    doc.setLineWidth(0.8)
    doc.text('Full Name', 40, startY)
    doc.rect(140, startY - 14, 420, 22)
    doc.text('Email', 40, startY + lineGap)
    doc.rect(140, startY + lineGap - 14, 420, 22)
    doc.text('Phone', 40, startY + lineGap * 2)
    doc.rect(140, startY + lineGap * 2 - 14, 420, 22)
    doc.text('Comments', 40, startY + lineGap * 3)
    doc.rect(140, startY + lineGap * 3 - 14, 420, 80)
    doc.text('Signature', 40, startY + lineGap * 6)
    doc.line(140, startY + lineGap * 6 - 5, 420, startY + lineGap * 6 - 5)
    doc.setFontSize(10)
    doc.text('This is a generated PDF for demo purposes only.', 40, 760)
    docRef.current = doc
    const url = doc.output('bloburl')
    setPdfUrl(url)
    return doc
  }

  const openTopic = (topic) => {
    setCurrentTopic(topic)
    createPdfForTopic(topic)
    setIsDocOpen(true)
  }

  const handleDownload = () => {
    const safe = (currentTopic || 'document').replace(/\s+/g, '_').toLowerCase()
    if (docRef.current) {
      docRef.current.save(`${safe}.pdf`)
    } else {
      const d = createPdfForTopic(currentTopic || 'Document')
      d.save(`${safe}.pdf`)
    }
  }

  const closeModal = () => {
    setIsDocOpen(false)
    setPdfUrl('')
    docRef.current = null
  }

  // Search handlers
  const submitSearch = (value, categoryLabel) => {
    const trimmed = (value || '').trim()
    const category = (categoryLabel || 'All')
    const params = new URLSearchParams()
    if (category && category.toLowerCase() !== 'all') {
      params.set('category', category)
    }
    if (trimmed) {
      params.set('search', trimmed)
    }
    const qs = params.toString()
    navigate(`/explore-all${qs ? `?${qs}` : ''}`)
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitSearch(searchText, selectedCategory)
    }
  }

  const handleMobileSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitSearch(mobileSearchText, mobileSelectedCategory)
    }
  }

  const userInitial = (user?.name || user?.email || 'U').slice(0, 1).toUpperCase();
  const displayName = user?.name || user?.email || 'User';
  const truncatedName = displayName.length > 8 ? displayName.slice(0, 8) + '...' : displayName;

  return (
    <>
      <header className="header">
        {/* Top Banner */}
        <div className="top-banner">
          <div className="top-banner-container">
            <div className="top-banner-phone">
              Call us: (00) 33 169 7720
            </div>
            <div className="top-banner-center">
              <span className="top-banner-center-text">
                Take <span className="top-banner-discount">20% off</span> when you spend $100 or more with code "
                <span className="top-banner-code">SAVE20</span>"
              </span>
              <a href="#" className="top-banner-details" onClick={(e) => { e.preventDefault(); openTopic('Offer Details') }}>
                More details
              </a>
            </div>
            <div className="top-banner-links">
              <a href="#" className="top-banner-link" onClick={(e) => { e.preventDefault(); openTopic('About Emmable') }}>About Emmable</a>
              <a href="#" className="top-banner-link" onClick={(e) => { e.preventDefault(); openTopic('Helps') }}>Helps</a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="main-header">
          <div className="main-header-container">
            {/* Logo */}
            <div className="logo-container">
              <h1 className="logo" onClick={handleLogoClick}>Emmable</h1>
            </div>

            {/* Search Section - Hidden on mobile, shown on md+ */}
            <div className="search-section">
              {/* Category Dropdown */}
              <div className="category-dropdown">
                <select className="category-select" value={selectedCategory} onChange={(e) => { const v = e.target.value; setSelectedCategory(v); submitSearch(searchText, v); }}>
                  <option>All</option>
                  <option>Men</option>
                  <option>Women</option>
                  <option>Kids</option>
                  <option>Shoes</option>
                  <option>Electronics</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="search-bar-container">
                <input
                  type="text"
                  placeholder="Search in Emmable"
                  className="search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>

              {/* Search Button */}
              <button className="search-button" onClick={() => submitSearch(searchText, selectedCategory)}>
                <img src={assets.searchicon} alt="Search" className="search-icon" />
              </button>
            </div>

            {/* Right Section */}
            <div className="right-section">
              {/* Mobile Search Icon */}
              <button className="mobile-search-button">
                <img src={assets.searchicon} alt="Search" className="search-icon" />
              </button>

                          {/* Cart Icon */}
            <button className="cart-button" onClick={handleCartClick}>
              <img src={assets.carticon} alt="Cart" className="cart-icon" />
              {/* Cart Badge */}
              <span className="cart-badge">
                {getCartItemsCount()}
              </span>
            </button>

              {/* Auth Area */}
              {!user ? (
                <button className="login-button" onClick={handleLoginClick}>
                  Login
                </button>
              ) : (
                <div className="profile-container">
                  <button className="profile-button" onClick={toggleProfile} aria-haspopup="true" aria-expanded={isProfileOpen}>
                    <div className="profile-avatar" title={displayName}>{userInitial}</div>
                  </button>
                  {isProfileOpen && (
                    <div className="profile-dropdown" role="menu">
                      <div className="profile-name">Hello, {truncatedName}</div>
                      <button className="logout-button" onClick={handleLogout} role="menuitem">
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mobile-search">
            <div className="mobile-search-container">
              <select className="mobile-category-select" value={mobileSelectedCategory} onChange={(e) => { const v = e.target.value; setMobileSelectedCategory(v); submitSearch(mobileSearchText, v); }}>
                <option>All</option>
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
                <option>Shoes</option>
                <option>Electronics</option>
              </select>
              <input
                type="text"
                placeholder="Search in Emmable"
                className="mobile-search-input"
                value={mobileSearchText}
                onChange={(e) => setMobileSearchText(e.target.value)}
                onKeyDown={handleMobileSearchKeyDown}
              />
              <button className="mobile-search-button" onClick={() => submitSearch(mobileSearchText, mobileSelectedCategory)}>
                <img src={assets.searchicon} alt="Search" className="mobile-search-icon" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Login Popup */}
      <Login 
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        onSwitchToSignup={handleSwitchToSignup}
      />

      {/* Signup Popup */}
      <Signup 
        isOpen={isSignupOpen}
        onClose={handleCloseSignup}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {isDocOpen && (
        <div className="pdf-modal-overlay" onClick={closeModal}>
          <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-modal-header">
              <h4 className="pdf-modal-title">{currentTopic}</h4>
              <button className="pdf-modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="pdf-modal-body">
              {pdfUrl ? (
                <iframe title="Document Preview" src={pdfUrl} className="pdf-frame" />
              ) : (
                <p>Generating document...</p>
              )}
            </div>
            <div className="pdf-modal-actions">
              <button className="download-btn" onClick={handleDownload}>Download PDF</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header; 