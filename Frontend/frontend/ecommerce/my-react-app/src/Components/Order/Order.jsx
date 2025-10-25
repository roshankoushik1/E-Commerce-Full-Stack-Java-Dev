import React, { useState } from 'react'
import './Order.css'
import { useCart } from '../../context/CartContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { useBill } from '../../context/BillContext'
import { useAuth } from '../../context/AuthContext'
 
const Order = ({ customSubtotal }) => {
  const { cartItems, getCartTotal } = useCart()
  const { bill, applyOffer: applyBackendOffer, removeOffer: removeBackendOffer, offers, fetchOffers, loading: billLoading, generateBill } = useBill() || {}
  const { user } = useAuth() || {}
  const [offerCode, setOfferCode] = useState('')
  const [showOffersPopup, setShowOffersPopup] = useState(false)
  const [offerError, setOfferError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const isCartPage = location.pathname === '/cart'
  const [localApplying, setLocalApplying] = useState(false) // front-end only guard to ensure single click UX
 
  React.useEffect(()=>{ if(fetchOffers) fetchOffers() },[fetchOffers])
 
  React.useEffect(()=>{
    if (user && cartItems.length>0 && !bill && generateBill) {
      generateBill(cartItems.map(ci=>ci.id))
    }
  },[user, cartItems, bill, generateBill])
 
  const subtotal = customSubtotal !== undefined ? customSubtotal : getCartTotal()
  const backendSub = bill?.subTotal ?? subtotal
  const backendDiscount = bill?.discountAmount ?? 0
  const backendFinal = bill?.totalAmount ?? (backendSub - backendDiscount)
 
  const itemsToShow = cartItems
 
  const availableOffers = offers && offers.length ? offers.map(o => ({
    id: o.id,
    code: o.code,
    title: o.code,
    description: '',
    discountPercent: o.offPercentage,
    minAmount: o.minOrderPrice || 0
  })) : []
 
  const doApply = async (code) => {
    if (!code) return
    if (billLoading || localApplying) return
    setLocalApplying(true)
    setOfferError('')
    try {
      await applyBackendOffer(code)
      setOfferCode('')
      setShowOffersPopup(false)
    } catch { /* handled in context */ }
    finally { setLocalApplying(false) }
  }
 
  const applyOfferCode = async () => {
    const code = offerCode.trim()
    const offerObj = availableOffers.find(o => o.code.toLowerCase() === code.toLowerCase())
    if (!offerObj) { setOfferError('Invalid offer code'); return }
    await doApply(offerObj.code)
  }
 
  const removeOffer = async () => {
    if (billLoading || localApplying) return
    setLocalApplying(true)
    try { await removeBackendOffer(); setOfferError('') } finally { setLocalApplying(false) }
  }
 
  const selectOffer = async (offer) => {
    await doApply(offer.code)
  }
 
  return (
    <>
      <div className="order-summary">
        <h2>Order Summary</h2>
        {isCartPage && (
          <div className="offer-section">
            <div className="offer-input-container">
              <input
                type="text"
                placeholder="Enter offer code"
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value)}
                className="offer-input"
                disabled={billLoading || localApplying}
              />
              <button
                onClick={applyOfferCode}
                className="apply-btn"
                disabled={!offerCode.trim() || billLoading || localApplying}
              >
                { (billLoading || localApplying) ? 'Applying...' : 'Apply' }
              </button>
            </div>
            {offerError && (<div className="offer-error">{offerError}</div>)}
            {bill?.appliedOffer && (
              <div className="applied-offer">
                <div className="offer-details">
                  <span className="offer-title">{bill.appliedOffer.code}</span>
                  <span className="offer-discount">- ${ (bill.discountAmount||0).toFixed(2) }</span>
                </div>
                <button
                  onClick={removeOffer}
                  className="remove-offer-btn"
                  disabled={billLoading || localApplying}
                >
                  { (billLoading || localApplying) ? 'Removing...' : 'Remove offer' }
                </button>
              </div>
            )}
            <button
              onClick={() => setShowOffersPopup(true)}
              className="see-offers-btn"
              disabled={billLoading || localApplying}
            >
              See all offers
            </button>
          </div>
        )}
 
        <div className="order-items">
          <div className="items-header">
            <span>Items</span>
            <span>Quantity</span>
            <span>Price</span>
          </div>
          {itemsToShow.map(item => (
            <div key={item.id} className="order-item">
              <span className="item-names">{item.name}</span>
              <span className="item-quantity">{item.quantity}</span>
              <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
 
        <div className="order-totals">
          <div className="total-line"><span>Sub-Total</span><span>${backendSub.toFixed(2)}</span></div>
          {!!backendDiscount && <div className="total-line discount-line"><span>Discount</span><span>- ${backendDiscount.toFixed(2)}</span></div>}
          <div className="total-line final-total"><span>Order total:</span><span>${backendFinal.toFixed(2)}</span></div>
          {(billLoading || localApplying) && <div className="total-line">Updating...</div>}
        </div>
 
        {isCartPage && (
          <button className="buy-now-btns" onClick={() => navigate('/checkout')} disabled={billLoading || localApplying}>
            Buy Now
          </button>
        )}
      </div>
 
      {isCartPage && showOffersPopup && (
        <div className="offers-popup-overlay" onClick={() => setShowOffersPopup(false)}>
          <div className="offers-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Available Offers</h3>
              <button
                onClick={() => setShowOffersPopup(false)}
                className="close-popup-btn"
                disabled={billLoading || localApplying}
              >
                ×
              </button>
            </div>
            <div className="offers-list">
              {availableOffers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-info">
                    <div className="offer-code">{offer.code}</div>
                    <div className="offer-title">{offer.title}</div>
                    <div className="offer-description">{offer.description}</div>
                    <div className="offer-min-amount">Min. order: ${offer.minAmount}</div>
                  </div>
                  <button
                    onClick={() => selectOffer(offer)}
                    className={`select-offer-btn ${(backendSub < offer.minAmount || billLoading || localApplying) ? 'disabled' : ''}`}
                    disabled={backendSub < offer.minAmount || billLoading || localApplying}
                  >
                    {(billLoading || localApplying) ? 'Applying...' : (backendSub < offer.minAmount ? 'Not Eligible' : 'Apply')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
 
export default Order
 
 