import React, { useEffect } from 'react'
import './OrderConfirmation.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const OrderConfirmation = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const orderId = state?.orderId || 'RKR123456789'
  const email = state?.contact?.email
  const items = state?.items || []
  const CHECKOUT_API_BASE_URL = 'http://localhost:9099';
  const ORDERS_API_BASE_URL = 'http://localhost:9105';
  console.log(state);


  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem('admin_orders') || '[]')
      const newOrder = {
        orderId,
        email: email || '-',
        items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        status: 'Shipped'
      }
      const withoutDup = existing.filter(o => o.orderId !== orderId)
      localStorage.setItem('admin_orders', JSON.stringify([newOrder, ...withoutDup]))
    } catch {
      // ignore storage errors
    }
  }, [orderId, email, items])

  useEffect(() => {
    const postOrders = async () => {
      if (!items || items.length === 0) return;
      try {
        await Promise.all(
          items.map(item =>
            fetch(`${ORDERS_API_BASE_URL}/orders`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                email: email || '-',
                productName: item.name,
                price: item.price,
                qty: item.quantity,
                status: 'SHIPPED'
              })
            })
          )
        );
      } catch {
        // ignore post errors
      }
    };
    postOrders();
  }, [orderId, email, items]);

  useEffect(() => {
    const deleteCheckout = async () => {
      try {
        await fetch(`${CHECKOUT_API_BASE_URL}/api/checkout`, { method: 'DELETE' });
      } catch {
        // ignore errors for delete
      }
    };
    deleteCheckout();
  }, []);

  return (
    <div className="oc-page">
      <div className="oc-card">
        <div className="oc-icon-wrap">
          <img src={assets.basket} alt="Order placed" className="oc-icon" />
        </div>

        <h1 className="oc-title">Thanks for your order!</h1>
        <p className="oc-sub">Thanks for placing order <span className="oc-order" onClick={() => navigate('/track', { state: { orderId } })}>{orderId}</span></p>
        <p className="oc-desc">We will send you a notification within 2 days when it ships{email ? ` to ${email}` : ''}.</p>

        <div className="oc-divider" />

        <p className="oc-help">Get in touch with us if you have any questions or concerns.</p>

        <div className="oc-actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>Go back shopping</button>
          <button className="btn-primary" onClick={() => navigate('/track', { state: { orderId } })}>Track order</button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
