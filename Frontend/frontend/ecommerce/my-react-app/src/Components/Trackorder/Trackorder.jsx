import React, { useState } from "react";
import "./Trackorder.css";
import { useLocation } from 'react-router-dom';
 
const Trackorder = ({ orderNumber }) => {
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const effectiveOrderNumber = orderNumber ?? location.state?.orderId ?? 'RKR123456789';
  
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(effectiveOrderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
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
        </div>
      </div>
    </div>
  );
};
 
export default Trackorder;
