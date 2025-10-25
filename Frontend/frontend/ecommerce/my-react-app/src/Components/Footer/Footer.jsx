import React, { useState, useRef } from 'react'
import "./Footer.css"
import { assets } from '../../assets/assets'
import { jsPDF } from 'jspdf'

const Footer = () => {
  const [isDocOpen, setIsDocOpen] = useState(false)
  const [currentTopic, setCurrentTopic] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')
  const docRef = useRef(null)

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

    // Simple dummy form fields
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

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Top Section */}
        <div className="footer-top">
          {/* Brand and App Downloads */}
          <div className="footer-brand">
            <div className='footer-brand-text'>
            <h3 className="brand-name">Emmable</h3>
            <p className="brand-tagline">Easy & reliable online buying and selling site</p>
            </div>
            <div className="app-downloads">
              <a href="https://www.appstore.com" target="_blank" rel="noopener noreferrer">
                <img src={assets.appstore} alt="Download on App Store" className="app-button" />
              </a>
              <a href="https://www.playstore.com" target="_blank" rel="noopener noreferrer">
                <img src={assets.playstore} alt="Get it on Google Play" className="app-button" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="footer-links">
            {/* Company Section */}
            <div className="footer-column">
              <h4 className="column-title">Company</h4>
              <ul className="footer-list">
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('About Us') }}>About Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Career') }}>Career</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Privacy Policy') }}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Blogs') }}>Blogs</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Flash Sale') }}>Flash Sale</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Affiliates') }}>Affiliates</a></li>
              </ul>
            </div>

            {/* Buyer Section */}
            <div className="footer-column">
              <h4 className="column-title">Buyer</h4>
              <ul className="footer-list">
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Help') }}>Help</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Payment method') }}>Payment method</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Track Buyer Orders') }}>Track Buyer Orders</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Free Shipping') }}>Free Shipping</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Returns & Funds') }}>Returns & Funds</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Guarantee') }}>Guarantee</a></li>
              </ul>
            </div>

            {/* Seller Section */}
            <div className="footer-column">
              <h4 className="column-title">Seller</h4>
              <ul className="footer-list">
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('How to Sell') }}>How to Sell</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Sales Profits') }}>Sales Profits</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Brand Index') }}>Brand Index</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openTopic('Track Seller Shipments') }}>Track Seller Shipments</a></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="footer-column">
              <h4 className="column-title">Contact us</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <img src={assets.callicon} alt="Call" />
                  </div>
                  <div className="contact-details">
                    <p className="contact-question">Got questions? Call us 24/7!</p>
                    <p className="contact-phone">(00) 11 234 5678</p>
                  </div>
                </div>
                <div className="social-media">
                  <p className="social-title">Find us on:</p>
                  <div className="social-links">
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter">
                      <img src={assets.twitter} alt="Twitter" />
                    </a>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook">
                      <img src={assets.facebook} alt="Facebook" />
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                      <img src={assets.linkedin} alt="LinkedIn" />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram">
                      <img src={assets.instagram} alt="Instagram" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© 2025 All rights reserved. Designed by Designspace.</p>
            <div className="payment-methods">
              <span className="payment-title">Payment method</span>
              <div className="payment-icons">
                <div className="payment-icon visa">VISA</div>
                <div className="payment-icon mastercard">MC</div>
                <div className="payment-icon visa-alt">GP</div>
                <div className="payment-icon amex">AMEX</div>
                <div className="payment-icon paypal">PP</div>
                <div className="payment-icon discover">DC</div>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </footer>
  )
}

export default Footer