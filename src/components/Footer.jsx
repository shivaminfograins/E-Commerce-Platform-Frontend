import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="app-footer">
      {/* Premium Trust Bar Bar */}
      <div className="footer-trust-bar">
        <div className="trust-item">
          <div className="trust-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <div className="trust-content">
            <h4>Free Shipping</h4>
            <p>On all orders above $50</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="trust-content">
            <h4>Secure Checkout</h4>
            <p>100% protected payments</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
          </div>
          <div className="trust-content">
            <h4>Easy Returns</h4>
            <p>30-day money-back guarantee</p>
          </div>
        </div>
        <div className="trust-item">
          <div className="trust-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div className="trust-content">
            <h4>24/7 Support</h4>
            <p>Direct access to dedicated help</p>
          </div>
        </div>
      </div>

      <div className="footer-divider trust-divider"></div>

      <div className="footer-inner">
        {/* Column 1: Brand Info */}
        <div className="footer-brand">
          <div className="footer-logo-wrapper">
            <svg className="footer-logo-icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h3 className="footer-logo">ShopEase</h3>
          </div>
          <p className="footer-desc">
            Your premium destination for high-end tech, accessories, and modern gadgets. Designed with passion for digital excellence.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-icon" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Twitter/X">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
          </ul>
        </div>

        {/* Column 3: Customer Service */}
        <div className="footer-links">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Returns & Refunds</a></li>
            <li><a href="#">Shipping Info</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Payments */}
        <div className="footer-links">
          <h4>Get in Touch</h4>
          <div className="contact-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <p className="contact-info">123 Tech Avenue, Silicon Valley</p>
          </div>
          <div className="contact-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <p className="contact-info">support@shopease.com</p>
          </div>
          <div className="contact-item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <p className="contact-info">+1 (800) 123-4567</p>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>© 2026 ShopEase. All Rights Reserved.</p>
        
        {/* Modern Vector Payment Badges */}
        <div className="payment-badges">
          <div className="payment-badge-svg" title="Visa">
            <svg viewBox="0 0 36 24" width="36" height="24">
              <rect width="36" height="24" rx="4" fill="#1434CB"></rect>
              <path d="M12.2 16.5l1.6-4.9h2.3l-1.6 4.9H12.2zm7.1-4.9c-.4-.2-.9-.3-1.4-.3-1.5 0-2.5.8-2.5 1.9 0 .8.8 1.3 1.3 1.6.6.3.8.5.8.7 0 .4-.5.6-1 .6-.6 0-1.1-.1-1.6-.4l-.2-.1-.3 1.9c.5.2 1.5.4 2.4.4 2.2 0 3.7-1.1 3.7-2.8 0-.9-.6-1.6-1.8-2.1-.7-.4-1.2-.6-1.2-.9 0-.3.3-.6.9-.6.5 0 1 .1 1.4.3l.2.1.3-1.7zm5.5 1.7l1.1-3.1.6 2.8h-1.7zm2.4 3.2L29 11.6h-1.8c-.6 0-1 .3-1.2.9l-3.5 8.1h2.4l.5-1.3h2.9l.3 1.3H29.2zm-21.4.1l2.2-5.6-.2.9c-.3-1.1-1.2-2.3-2.3-2.9L5.3 16.5h2.5z" fill="#FFF"></path>
            </svg>
          </div>
          <div className="payment-badge-svg" title="Mastercard">
            <svg viewBox="0 0 36 24" width="36" height="24">
              <rect width="36" height="24" rx="4" fill="#0A0E1A"></rect>
              <circle cx="15.5" cy="12" r="6" fill="#EB001B"></circle>
              <circle cx="20.5" cy="12" r="6" fill="#F79E1B" opacity="0.85"></circle>
            </svg>
          </div>
          <div className="payment-badge-svg" title="PayPal">
            <svg viewBox="0 0 36 24" width="36" height="24">
              <rect width="36" height="24" rx="4" fill="#003087"></rect>
              <path d="M13.2 16.8l1-6.1h3.3c1.4 0 2.4.3 2.9 1 .5.6.6 1.4.3 2.4-.4 2.1-1.7 3.2-3.8 3.2h-2.2l-1.5-6h-.8l-.8 5.5H13.2zm2.1-7.8l.9-5.5h3.3c1.4 0 2.4.3 2.9 1 .5.6.6 1.4.3 2.4-.4 2.1-1.7 3.2-3.8 3.2h-2.2l-1.4-1.1" fill="#0079C1"></path>
            </svg>
          </div>
          <div className="payment-badge-svg" title="Apple Pay">
            <svg viewBox="0 0 36 24" width="36" height="24">
              <rect width="36" height="24" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1"></rect>
              <path d="M13 13.5c0-1.8 1.4-2.7 1.4-2.7-.8-1.2-2.1-1.4-2.6-1.4-1.1-.1-2.2.6-2.8.6-.6 0-1.5-.6-2.4-.6-1.2 0-2.3.7-2.9 1.8-1.2 2.1-.3 5.2.8 6.9.6.8 1.2 1.7 2.1 1.7s1.2-.6 2.3-.6c1.1 0 1.4.6 2.3.6.9 0 1.5-.8 2.1-1.7.7-1 1-2 1-2.1s-1.8-.7-1.8-2.6zm-1.8-5.3c.5-.6.8-1.5.7-2.3-.7 0-1.6.5-2.1 1.1-.4.5-.8 1.4-.7 2.2.8.1 1.6-.4 2.1-1zM20 16.5v-5h1c.6 0 1 .4 1 1v3h1v-3.7c0-1.2-1-2.3-2.3-2.3h-1.7v7h2zm6.2-3h1.3c.3 0 .5-.2.5-.5V12c0-.5-.5-1-1-1h-1.5v4.5h.7zm.8-3.5c1.2 0 2.2.9 2.2 2.1v4.4h-2v-1.1c-.4.8-1.3 1.3-2.2 1.3-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5h2v-.7c0-.6-.5-1-1-1h-1.5v-1h2.5z" fill="#000000"></path>
            </svg>
          </div>
        </div>

        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
