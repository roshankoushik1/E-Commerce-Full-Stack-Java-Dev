import React, { useState, useEffect } from "react";
import "./Trackorder.css";
import { useLocation } from 'react-router-dom';
import { apiFetch } from '../../api/apiClient';
 
const Trackorder = ({ orderNumber }) => {
  const [copied, setCopied] = useState(false);

  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const effectiveOrderNumber = orderNumber ?? location.state?.orderId ?? 'RKR123456789';
  const orderData = location.state;
  
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(effectiveOrderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  // Set order details from passed data or localStorage
  useEffect(() => {
    let data = orderData;
    
    // If no data passed, try to get from localStorage
    if (!data?.items) {
      try {
        const stored = localStorage.getItem(`order_${effectiveOrderNumber}`);
        if (stored) {
          data = JSON.parse(stored);
        }
      } catch (e) {
        console.log('No stored order data found');
      }
    }
    
    if (data?.items) {
      const details = data.items.map(item => ({
        productName: item.name,
        qty: item.quantity,
        price: item.price,
        status: 'SHIPPED'
      }));
      setOrderDetails(details);
    }
    setLoading(false);
  }, [orderData, effectiveOrderNumber]);
 
  const trackingSteps = [
    {
      date: "8 Oct 2025, 10:04 am",
      title: "Order Placed",
      description: "We have received your order",
      status: "completed"
    },
    {
      date: "9 Oct 2025, 10:18 am",
      title: "Payment Confirmed",
      description: "Awaiting confirmation...",
      status: "completed"
    },
    {
      date: "10 Oct 2025, 11:06 am",
      title: "Order Processed",
      description: "We are preparing your order",
      status: "completed"
    },
    {
      date: "10 Oct 2025, 1:15 pm",
      title: "Ready to Pickup",
      description: `Order #${effectiveOrderNumber} from Emmable`,
      status: "completed"
    },
    {
      date: "10 Oct 2025, 1:20 pm",
      title: "Delivered",
      description: "Successfully Delivered",
      status: "completed"
    }
  ];
 
  return (
    <div className="tracking-container order-tracking-page">
     
      <div className="tracking-content">
        <div className="tracking-header">
          <h1>Tracking order</h1>
          <div className="delivery-status">
            <span className="delivered-text">Delivered</span>
            <span className="checkmark">✓</span>
          </div>
        </div>
 
        <div className="info-box">
          <div className="order-number-section">
            <span className="order-number">{effectiveOrderNumber}</span>
            <button className="copy-btn" onClick={copyOrderNumber}>
              {copied ? "✓" : "📋"}
            </button>
          </div>
         
          <div className="separator-line"></div>
         
          <div className="shipping-info">
            <div className="shipping-method">
              <span className="method-name">Standard Shipping</span>
              <span className="delivery-time">Delivery in 5 - 7 working days</span>
            </div>
            <div className="fedex-logo">
              <span className="fedex-text">FedEx</span>
            </div>
          </div>
        </div>
 
        <div className="tracking-box">
          {loading ? (
            <div className="loading-message">Loading order details...</div>
          ) : (
            <>
              {orderDetails.length > 0 && (
                <div className="order-details">
                  <h3>Order Items:</h3>
                  {orderDetails.map((order, index) => (
                    <div key={index} className="order-item">
                      <p><strong>Product:</strong> {order.productName}</p>
                      <p><strong>Quantity:</strong> {order.qty}</p>
                      <p><strong>Price:</strong> ${order.price}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="tracking-timeline">
              {trackingSteps.map((step, index) => (
                <div key={index} className={`timeline-item ${step.status}`}>
                  <div className="timeline-date">
                    {step.date}
                  </div>
                  <div className="timeline-connector">
                    <div className="timeline-dot"></div>
                    {index < trackingSteps.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-content">
                    <h3 className="timeline-title">{step.title}</h3>
                    {step.description && (
                      <p className="timeline-description">{step.description}</p>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Trackorder;
