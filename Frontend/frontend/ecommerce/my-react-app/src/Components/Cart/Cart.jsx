import React, { useState } from 'react'
import './Cart.css'
import { assets } from '../../assets/assets'
import Order from '../Order/Order'
import Wishlist from '../Wishlist/Wishlist'
import { useCart } from '../../context/CartContext'
 
const Cart = () => {
  // Use cart context for dynamic data
  const {
     cartItems,
    wishlistItems,
    updateQuantity,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    isSyncing,
    isLineLocked
  } = useCart()
 
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [appliedOffer, setAppliedOffer] = useState(null)
  // Removed selection state & logic (reverting to previous working condition)
 
  // Subtotal of all cart items (no per-item selection)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
 
  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Left Side - Cart Items */}
        <div className="cart-section">
          <div className="cart-header">
            <div className="cart-title">
              <div className="cart-icons">
                <img src={assets.carticon} alt="Cart" />
              </div>
              <h2>My Cart ({cartItems.length})</h2>
            </div>
            <div className="cart-total-header">
              <span>Cart Total : ${(subtotal).toFixed(2)}</span>
            </div>
          </div>
 
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                {/* Removed checkbox UI */}
                <div>
                </div>
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
 
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <div className="item-specs">
                    <span>Size: {item.size}, Color: {item.color}</span>
                  </div>
                 
                  <div className="item-pricess">
                    {item.discount && (
                      <span className="discount-badge">{item.discount}%</span>
                    )}
                    <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                    <span className="current-price">${item.price.toFixed(2)}</span>
                  </div>
 
                  <div className="item-actions">
                    <button
                      className="wishlist-btn"
                      onClick={() => addToWishlist(item)}
                    >
                                            <div className="wishlist-icon">
                        {wishlistItems.some(wishlistItem => wishlistItem.id === (item.productId || item.id)) ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill="#ef4444"
                                    stroke="#ef4444"
                                    strokeWidth="1"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"/>
                          </svg>
                        )}
                      </div>
   
                      <span className="wishlist-text">Add to wishlist</span>
                    </button>
                  </div>
                </div>
 
                <div className="quantity-controls">
                  <button
                    onClick={() => {
                      const latest = cartItems.find(ci => ci.id === item.id) || item
                      updateQuantity(latest, (latest.quantity || 1) - 1)
                    }}
                    className="qty-btns minus"
                    disabled={isSyncing || isLineLocked(item.id)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => {
                      const latest = cartItems.find(ci => ci.id === item.id) || item
                      updateQuantity(latest, (latest.quantity || 1) + 1)
                    }}
                    className="qty-btns plus"
                    disabled={isSyncing || isLineLocked(item.id)}
                  >
                    +
                  </button>
                </div>
 
                <div className="item-delete">
                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <img src={assets.deleteicon} alt="Delete" />
                  </button>
                </div>
              </div>
            ))}
          </div>
 
          {cartItems.length === 0 && (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          )}
 
          <div className="cart-footer">
            <button
              className="view-wishlist-btn"
              onClick={() => setIsWishlistOpen(true)}
            >
              View WishList
            </button>
          </div>
        </div>
 
        {/* Right Side - Order Summary */}
        <div className="order-section">
          <Order
            appliedOffer={appliedOffer}
            setAppliedOffer={setAppliedOffer}
            customSubtotal={subtotal}
          />
        </div>
      </div>
 
      {/* Wishlist Modal */}
      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={removeFromWishlist}
        onMoveToCart={moveToCart}
      />
    </div>
  )
}
 
export default Cart
 