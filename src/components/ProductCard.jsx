import { Link } from "react-router-dom";
import { useState } from "react";

/**
 * ProductCard.jsx
 *
 * Changes from previous version:
 *  - "Add To Cart" on the card now navigates to the product detail page
 *    instead of attempting an inline add-to-cart.
 *
 *  WHY: The backend now requires a ProductVariant PK, not just a Product PK.
 *  A card doesn't know which variant the shopper wants — only the detail page
 *  can present the variant selector.  Clicking "Add To Cart" on the card
 *  takes the user to `/product/<id>` where they can pick a variant and add
 *  it properly.
 *
 *  The quantity control (qty > 0 state) is preserved for when the card is
 *  used in a context where a variant is already pre-selected (future use).
 *  In the current architecture, qty will always be 0 on listing pages.
 *
 *  All other visual elements (badge, wishlist, rating, pricing) are unchanged.
 */
function ProductCard({
  id,
  name,
  brand,
  image,
  price,
  originalPrice,
  discountPercent,
  rating,
  reviewsCount,
  badge,
  qty = 0,
  isWishlisted = false,
  onAdd,
  onRemove,
  onToggleWishlist,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge (e.g. Best Seller, Hot, Premium, New) */}
      {badge && (
        <span className={`badge badge--${badge.toLowerCase().replace(" ", "-")}`}>
          {badge}
        </span>
      )}

      {/* Wishlist Button */}
      <button
        className={`wishlist-btn ${isWishlisted ? "wishlist-btn--active" : ""}`}
        onClick={() => onToggleWishlist && onToggleWishlist(id)}
        aria-label="Add to Wishlist"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isWishlisted ? "#ef4444" : "none"}
          stroke={isWishlisted ? "#ef4444" : "#64748b"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="wishlist-icon"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      {/* Product Image & Media Container */}
      <div className="product-media">
        <img src={image} alt={name} className="product-image" />
        {isHovered && (
          <div className="media-overlay">
            <Link to={`/product/${id}`} className="product-link">
              <button className="quick-view-btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Quick View
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <span className="product-brand">{brand || "ShopEase"}</span>
        <Link to={`/product/${id}`} className="product-link">
          <h3 className="product-title">{name}</h3>
        </Link>

        {/* Rating and Reviews */}
        <div className="rating-container">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={i < Math.floor(rating) ? "#f59e0b" : "#e2e8f0"}
                className="star-icon"
                width="14"
                height="14"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
          <span className="rating-value">{rating}</span>
          <span className="reviews-count">
            ({reviewsCount || Math.floor(rating * 18 + id)})
          </span>
        </div>

        {/* Pricing */}
        <div className="price-container">
          <span className="price-current">₹{price.toLocaleString()}</span>
          {originalPrice && (
            <>
              <span className="price-original">
                ₹{originalPrice.toLocaleString()}
              </span>
              <span className="discount-badge">{discountPercent}% OFF</span>
            </>
          )}
        </div>

        {/* Action Button
            Always navigates to the product detail page so the user can
            choose a variant before the item is added to the cart.
            The qty control branch is kept for future use-cases but is
            effectively unreachable from listing pages in the current flow.
        */}
        <div className="card-actions">
          {qty > 0 ? (
            <div className="qty-control">
              <button
                className="qty-btn"
                onClick={() => onRemove && onRemove(id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="qty-display">{qty}</span>
              <button
                className="qty-btn qty-btn--add"
                onClick={() => onAdd && onAdd(id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          ) : (
            /* Navigate to detail page — variant selection is required */
            <Link to={`/product/${id}`} className="btn btn--primary btn--add-to-cart">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="cart-icon"
                width="16"
                height="16"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              Add To Cart
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
