import React, { useState, useEffect } from 'react'
import './Checkout.css'
import { useNavigate } from 'react-router-dom'
import Order from '../Order/Order'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../api/apiClient'

const Checkout = () => {
  const navigate = useNavigate()
  const { user } = useAuth() || {}

  const [contact, setContact] = useState({
    email: '',
    subscribe: true
  })

  const [shipping, setShipping] = useState({
    country: 'Indonesia',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: ''
  })
  const [errors, setErrors] = useState({ email: '', postalCode: '', phone: '' })
  const [isEmailRegistered, setIsEmailRegistered] = useState(false)

  const provinceOptions = {
    Indonesia: ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur'],
    India: ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana'],
    'United States': ['California', 'New York', 'Texas', 'Florida', 'Washington'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    Australia: ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia']
  }

  useEffect(() => {
    if (user && user.email) {
      setContact(prev => ({ ...prev, email: user.email }))
      setIsEmailRegistered(true) // If user is logged in, email is valid
    }
  }, [user])

  useEffect(() => {
    const email = (contact.email || '').trim()
    if (!email) {
      setErrors(prev => ({ ...prev, email: '' }))
      setIsEmailRegistered(false)
      return
    }

    // If user is logged in, skip email validation
    if (user && user.email === email) {
      setIsEmailRegistered(true)
      setErrors(prev => ({ ...prev, email: '' }))
      return
    }

    let cancelled = false

    const validateEmail = async () => {
      try {
        const data = await apiFetch('/api/auth/emails', { auth: false })

        let emails = []
        if (Array.isArray(data)) {
          if (data.length && typeof data[0] === 'string') {
            emails = data
          } else {
            emails = data.map(entry => (entry && entry.email) ? entry.email : '').filter(Boolean)
          }
        } else if (data && Array.isArray(data.emails)) {
          emails = data.emails
        }

        const found = emails.some(e => (e || '').toLowerCase() === email.toLowerCase())
        if (!cancelled) {
          setIsEmailRegistered(found)
          setErrors(prev => ({ ...prev, email: found ? '' : 'Please use a registered email or log in.' }))
        }
      } catch {
        // If email validation fails, allow any email for now
        if (!cancelled) {
          setIsEmailRegistered(true)
          setErrors(prev => ({ ...prev, email: '' }))
        }
      }
    }

    validateEmail()

    return () => {
      cancelled = true
    }
  }, [contact.email, user])

  const handleInputChange = (section, field, value) => {
    if (section === 'contact') {
      setContact(prev => ({ ...prev, [field]: value }))
      return
    }

    if (section === 'shipping') {
      if (field === 'country') {
        setShipping(prev => ({ ...prev, country: value, province: '' }))
        return
      }

      if (field === 'postalCode') {
        const isValidFormat = /^\d{0,6}$/.test(value)
        setErrors(prev => ({ ...prev, postalCode: isValidFormat ? '' : 'Invalid postal code. Use up to 6 digits.' }))
        setShipping(prev => ({ ...prev, postalCode: value }))
        return
      }

      if (field === 'phone') {
        const isDigitsOnly = /^\d*$/.test(value)
        const tooLong = value.length > 10
        const msg = !isDigitsOnly || tooLong ? 'Phone must contain digits only and be 10 digits.' : ''
        setErrors(prev => ({ ...prev, phone: msg }))
        setShipping(prev => ({ ...prev, phone: value }))
        return
      }

      setShipping(prev => ({ ...prev, [field]: value }))
    }
  }

  const isPostalValid = /^\d{1,6}$/.test(shipping.postalCode) && !errors.postalCode
  const isPhoneValid = /^\d{10}$/.test(shipping.phone) && !errors.phone

  const handleContinue = async (e) => {
    e.preventDefault()
    if (!isPostalValid || !isPhoneValid || !isEmailRegistered) return

    const payload = {
      email: contact.email,
      subscribe: contact.subscribe,
      country: shipping.country,
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      address: shipping.address,
      city: shipping.city,
      province: shipping.province,
      postalCode: shipping.postalCode,
      phone: shipping.phone
    }

    try {
      await apiFetch('/api/checkout', { method: 'POST', body: payload })
      navigate('/shipping', { state: { contact, shipping } })
    } catch (e) {
      alert(e.message || 'Failed to save checkout details')
    }
  }

  const openLoginPopup = () => {
    window.dispatchEvent(new Event('open-login'))
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <div className="checkout-crumbs">
            <span className="crumb" onClick={() => navigate('/cart')}>Cart</span>
            <span className="sep">›</span>
            <span className="crumb active">Information</span>
            <span className="sep">›</span>
            <span className="crumb">Shipping</span>
            <span className="sep">›</span>
            <span className="crumb">Payment</span>
          </div>

          <form className="checkout-form" onSubmit={handleContinue}>
            <div className="section">
              <div className="section-header">
                <h3>Contact information</h3>
                <div className="login-note">Already have an account? <button type="button" className="linklike" onClick={openLoginPopup}>Log in</button></div>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your email"
                  value={contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className={errors.email ? 'input-error' : ''}
                  required
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>

              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={contact.subscribe}
                  onChange={(e) => handleInputChange('contact', 'subscribe', e.target.checked)}
                />
                <span>Email me with news and offers</span>
              </label>
            </div>

            <div className="section">
              <h3>Shipping address</h3>

              <div className="form-group">
                <select
                  value={shipping.country}
                  onChange={(e) => handleInputChange('shipping', 'country', e.target.value)}
                  required
                >
                  <option>Indonesia</option>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                </select>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="First name"
                    value={shipping.firstName}
                    onChange={(e) => handleInputChange('shipping', 'firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Last name"
                    value={shipping.lastName}
                    onChange={(e) => handleInputChange('shipping', 'lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Address"
                  value={shipping.address}
                  onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="City"
                  value={shipping.city}
                  onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                  required
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <select
                    value={shipping.province}
                    onChange={(e) => handleInputChange('shipping', 'province', e.target.value)}
                    required
                  >
                    <option value="">Province</option>
                    {(provinceOptions[shipping.country] || []).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Postal code"
                    value={shipping.postalCode}
                    onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                    className={errors.postalCode ? 'input-error' : ''}
                    required
                  />
                  {errors.postalCode && <div className="error-text">{errors.postalCode}</div>}
                </div>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Phone"
                  value={shipping.phone}
                  onChange={(e) => handleInputChange('shipping', 'phone', e.target.value)}
                  className={errors.phone ? 'input-error' : ''}
                  required
                />
                {errors.phone && <div className="error-text">{errors.phone}</div>}
              </div>

              <div className="form-actionss">
                <button type="button" className="linklike" onClick={() => navigate('/cart')}>Return to cart</button>
                <button type="submit" className="continue-btn" disabled={!isPostalValid || !isPhoneValid || !isEmailRegistered}>Continue</button>
              </div>
            </div>
          </form>
        </div>

        <div className="checkout-right">
          <Order />
        </div>
      </div>
    </div>
  )
}

export default Checkout