import React, { useEffect, useState } from 'react'
import './Shipping.css'
import { useNavigate } from 'react-router-dom'
import Order from '../Order/Order'
import PaymentModal from '../PaymentModal/PaymentModal'
import { useCart } from '../../context/CartContext'
import { apiFetch } from '../../api/apiClient'

const Shipping = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, appliedOffer, getDiscountAmount } = useCart()

  const [contact, setContact] = useState(null)
  const [shipping, setShipping] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    let isCancelled = false
    const load = async () => {
      try {
        const data = await apiFetch('/api/checkout')
        console.log("shipping data", data)
        if (isCancelled) return
        setContact({ email: data[0].email || '', subscribe: !!data.subscribe })
        setShipping({
          country: data[0].country || '',
          firstName: data[0].firstName || '',
          lastName: data[0].lastName || '',
          address: data[0].address || '',
          city: data[0].city || '',
          province: data[0].province || '',
          postalCode: data[0].postalCode || '',
          phone: data[0].phone || ''
        })
        setLoading(false)
      } catch {
        navigate('/checkout', { replace: true })
      }
    }
    load()
    return () => { isCancelled = true }
  }, [navigate])

  if (loading) {
    return null
  }

  // Calculate total amount for payment
  const subtotal = getCartTotal()
  const discountAmount = appliedOffer ? getDiscountAmount(subtotal) : 0
  const totalAmount = Math.max(0, subtotal - discountAmount)

  const handleContinueToPayment = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentData) => {
    const orderId = `RKR${Math.floor(100000000 + Math.random() * 900000000)}`
    const items = (cartItems || []).map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
    
    // Navigate to order confirmation with payment data
    navigate('/order-confirmation', { 
      state: { 
        contact, 
        shipping, 
        orderId, 
        items, 
        payment: paymentData 
      } 
    })
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
  }

  const deleteCheckout = async () => {
      try {
        await apiFetch('/api/checkout', { method: 'DELETE' });
      } catch {
        // ignore errors for delete
      }
    };

  return (
    <div className="shipping-page">
      <div className="shipping-container">
        <div className="shipping-left">
          <div className="breadcrumbs">
            <span className="crumb" onClick={() => navigate('/cart')}>Cart</span>
            <span className="sep">›</span>
            <span className="crumb" onClick={() => navigate('/checkout')}>Information</span>
            <span className="sep">›</span>
            <span className="crumb active">Shipping</span>
            <span className="sep">›</span>
            <span className="crumb">Payment</span>
          </div>

          <div className="summary-card">
            <h3>Contact</h3>
            <div className="row">
              <span className="label">Email</span>
              <span className="value">{contact.email || '-'}</span>
            </div>
            <div className="row">
              <span className="label">Subscribed</span>
              <span className="value">{contact.subscribe ? 'Yes' : 'No'}</span>
            </div>
          </div>

          <div className="summary-card">
            <h3>Shipping address</h3>
            <div className="row"><span className="label">Country</span><span className="value">{shipping.country || '-'}</span></div>
            <div className="row"><span className="label">Name</span><span className="value">{`${shipping.firstName || ''} ${shipping.lastName || ''}`.trim() || '-'}</span></div>
            <div className="row"><span className="label">Address</span><span className="value">{shipping.address || '-'}</span></div>
            <div className="row"><span className="label">City</span><span className="value">{shipping.city || '-'}</span></div>
            <div className="row"><span className="label">Province</span><span className="value">{shipping.province || '-'}</span></div>
            <div className="row"><span className="label">Postal code</span><span className="value">{shipping.postalCode || '-'}</span></div>
            <div className="row"><span className="label">Phone</span><span className="value">{shipping.phone || '-'}</span></div>
          </div>

          <div className="form-actions">
            <button type="button" className="linklike" onClick={() => {deleteCheckout();navigate('/checkout');}}>Return to information</button>
            <button type="button" className="continue-btn" onClick={handleContinueToPayment}>Continue to Payment</button>
          </div>
        </div>

        <div className="shipping-right">
          <Order />
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        amount={totalAmount}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

export default Shipping