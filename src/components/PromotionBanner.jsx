import { Link } from "react-router-dom";

function PromotionBanner() {
  return (
    <div className="promo-banner">
      <div className="promo-content">
        <span className="promo-badge">⭐ Special Promotion</span>
        <h2>Ultimate Tech Upgrade Sale</h2>
        <p>
          Get up to <strong>40% OFF</strong> on premium accessories, mechanical
          keyboards, and smart devices. Use code <strong>TECH40</strong> at checkout.
        </p>
        <Link to="/products" className="promo-btn">
          Shop the Sale Now
        </Link>
      </div>
      <div className="promo-visual">
        <div className="star-decoration float-1">⭐</div>
        <div className="star-decoration float-2">✨</div>
        <div className="star-decoration float-3">⭐</div>
      </div>
    </div>
  );
}

export default PromotionBanner;
