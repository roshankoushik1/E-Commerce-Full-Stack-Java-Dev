 import React from 'react'
import './Wishlist.css'
 
const Wishlist = ({ isOpen, onClose, wishlistItems, onRemoveFromWishlist, onMoveToCart }) => {
  if (!isOpen) return null
 
  return (
    <div className="wishlist-overlay" onClick={onClose}>
      <div className="wishlist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wishlist-header">
          <h2>My WishList</h2>
          <button
            onClick={onClose}
            className="close-wishlist-btn"
          >
            X
          </button>
        </div>
 
        <div className="wishlist-content">
          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <p>Your wishlist is empty</p>
              <span>Start adding items you love!</span>
            </div>
          ) : (
            <div className="wishlist-items">
              {wishlistItems.map(item => (
                <div key={item.id} className="wishlist-item">
                  <div className="wishlist-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                 
                  <div className="wishlist-item-details">
                    <h3>{item.name}</h3>
                    <div className="wishlist-item-price">
                      <span>Price: ${item.price.toFixed(2)}</span>
                    </div>
                   
                    <div className="wishlist-item-actions">
                      <button
                        onClick={() => onMoveToCart(item)}
                        className="move-to-cart-btn"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(item.id)}
                        className="remove-from-wishlist-btn"
                      >
                        <span className="remove-icon">🗑</span>
                        Remove from wishlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
 
export default Wishlist
 