function ProductInfo({ product, quantity, onIncrease, onDecrease, onAddToCart, onBuyNow }) {
  return (
    <div className="product-info-box">
      {/* Brand Badge Capsule */}
      <span className="brand-badge">{product.brand}</span>

      <h1 className="product-details-title">{product.name}</h1>

      {/* Rating Pill */}
      <div className="rating-pill-row">
        <div className="rating-pill">
          <svg className="star-icon-svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span className="rating-val">{product.rating}</span>
        </div>
        <span className="reviews-count-text">({product.reviewsCount} Customer Reviews)</span>
      </div>

      {/* Price Grid */}
      <div className="price-details-row">
        <span className="current-price-val">₹{product.price.toLocaleString()}</span>
        <div className="price-discount-meta">
          <span className="original-price-val">₹{product.originalPrice.toLocaleString()}</span>
          <span className="discount-badge-percent">{product.discountPercent}% OFF</span>
        </div>
      </div>

      <div className="details-divider"></div>

      {/* Adjuster & Actions Block */}
      <div className="purchase-controls-row">
        <div className="quantity-adjuster-card">
          <button className="qty-adjust-btn" onClick={onDecrease} type="button" aria-label="Decrease Quantity">-</button>
          <span className="qty-number-display">{quantity}</span>
          <button className="qty-adjust-btn" onClick={onIncrease} type="button" aria-label="Increase Quantity">+</button>
        </div>

        <div className="action-buttons-wrapper">
          <button className="add-to-cart-premium-btn" onClick={onAddToCart} type="button">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Add To Cart</span>
          </button>

          <button className="buy-now-premium-btn" onClick={onBuyNow} type="button">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Checkout Trust Line */}
      <div className="checkout-trust-info">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>Guaranteed safe checkout. 💳 Visa, Mastercard, PayPal secured.</span>
      </div>
    </div>
  );
}

export default ProductInfo;
