import React, { useMemo, useState } from 'react'
import './PaymentModal.css'
 
// const luhnCheck = (num) => {
//   const sanitized = (num || '').replace(/\s+/g, '')
//   if (!/^[0-9]{13,19}$/.test(sanitized)) return false
//   let sum = 0
//   let shouldDouble = false
//   for (let i = sanitized.length - 1; i >= 0; i--) {
//     let digit = parseInt(sanitized.charAt(i), 10)
//     if (shouldDouble) {
//       digit *= 2
//       if (digit > 9) digit -= 9
//     }
//     sum += digit
//     shouldDouble = !shouldDouble
//   }
//   return sum % 10 === 0
// }   
 
const parseExpiry = (value) => {
  const match = /^\s*(\d{2})\s*\/\s*(\d{2})\s*$/.exec(value || '')
  if (!match) return null
  const mm = parseInt(match[1], 10)
  const yy = parseInt(match[2], 10)
  if (mm < 1 || mm > 12) return null
  const year = 2000 + yy
  return { month: mm, year }
}
 
const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [form, setForm] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiry: '', // MM/YY
    cvv: '',
    saveCard: false
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
 
  const maskedAmount = useMemo(() => {
    const num = Number(amount || 0)
    if (Number.isNaN(num)) return '$0.00'
    return `$${num.toFixed(2)}`
  }, [amount])
 
  if (!isOpen) return null
 
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target
    let nextValue = value
 
    if (name === 'cardNumber') {
      nextValue = value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim()
    }
    if (name === 'expiry') {
      const v = value.replace(/[^0-9]/g, '').slice(0, 4)
      nextValue = v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v
    }
    if (name === 'cvv') {
      nextValue = value.replace(/[^0-9]/g, '').slice(0, 4)
    }
 
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : nextValue }))
  }
 
  const validate = () => {
    const newErrors = {}
 
    if (!form.nameOnCard.trim()) newErrors.nameOnCard = 'Name is required'
 
    const rawCard = form.cardNumber.replace(/\s+/g, '')
    if (!rawCard) newErrors.cardNumber = 'Card number is required'
    else if (!/^[0-9]{13,19}$/.test(rawCard)) newErrors.cardNumber = 'Invalid card number length'
    // else if (!luhnCheck(rawCard)) newErrors.cardNumber = 'Card number failed validation'
 
    const expiry = parseExpiry(form.expiry)
    if (!expiry) newErrors.expiry = 'Use MM/YY format'
    else {
      const now = new Date()
      const lastDay = new Date(expiry.year, expiry.month, 0)
      if (lastDay < new Date(now.getFullYear(), now.getMonth(), 1)) {
        newErrors.expiry = 'Card is expired'
      }
    }
 
    if (!form.cvv) newErrors.cvv = 'CVV is required'
    else if (!/^[0-9]{3,4}$/.test(form.cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits'
 
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
 
  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return
 
    setIsProcessing(true)
 
    // Simulate payment call
    await new Promise(r => setTimeout(r, 1000))
 
    setIsProcessing(false)
    setIsSuccess(true)
 
    // Inform parent and close/redirect shortly after
    setTimeout(() => {
      onSuccess?.({
        paymentId: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: Number(amount || 0)
      })
      onClose?.()
    }, 1200)
  }
 
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="popup-title">Payment</h2>
 
        {!isSuccess ? (
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="pm-amount">Amount to pay: <strong>{maskedAmount}</strong></div>
 
            <div className="form-groups">
              <label className="form-label" htmlFor="nameOnCard">Name on card</label>
              <input
                id="nameOnCard"
                name="nameOnCard"
                type="text"
                className={`form-input ${errors.nameOnCard ? 'pm-error' : ''}`}
                value={form.nameOnCard}
                onChange={handleChange}
                placeholder="Full name"
                required
              />
              {errors.nameOnCard && <div className="pm-error-text">{errors.nameOnCard}</div>}
            </div>
 
            <div className="form-groups">
              <label className="form-label" htmlFor="cardNumber">Card number</label>
              <input
                id="cardNumber"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                className={`form-input ${errors.cardNumber ? 'pm-error' : ''}`}
                value={form.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                required
              />
              {errors.cardNumber && <div className="pm-error-text">{errors.cardNumber}</div>}
            </div>
 
            <div className="pm-row">
              <div className="form-groups pm-col">
                <label className="form-label" htmlFor="expiry">Expiry</label>
                <input
                  id="expiry"
                  name="expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  className={`form-input ${errors.expiry ? 'pm-error' : ''}`}
                  value={form.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required
                />
                {errors.expiry && <div className="pm-error-text">{errors.expiry}</div>}
              </div>
 
              <div className="form-groups pm-col">
                <label className="form-label" htmlFor="cvv">CVV</label>
                <input
                  id="cvv"
                  name="cvv"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  className={`form-input ${errors.cvv ? 'pm-error' : ''}`}
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  required
                />
                {errors.cvv && <div className="pm-error-text">{errors.cvv}</div>}
              </div>
            </div>
 
            <label className="form-groups pm-checkbox">
              <input
                type="checkbox"
                name="saveCard"
                checked={form.saveCard}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkbox-text">Save card for future use</span>
            </label>
 
            <button type="submit" className="submit-button" disabled={isProcessing}>
              {isProcessing ? 'Processing…' : 'Confirm Payment'}
            </button>
          </form>
        ) : (
          <div className="pm-success">
            <div className="pm-success-title">Payment Successful</div>
            <div className="pm-success-sub">Redirecting to confirmation…</div>
          </div>
        )}
      </div>
    </div>
  )
}
 
export default PaymentModal