import { useState, useRef } from "react";

function ProductGallery({ product }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magPos, setMagPos] = useState({ x: 0, y: 0, xPct: 50, yPct: 50 });
  const containerRef = useRef(null);

  // Simulated viewpoints by cropping and transforming the primary image
  const views = [
    { label: "Overview", class: "view-standard" },
    { label: "Detail", class: "view-detail" },
    { label: "Focus", class: "view-focus" },
    { label: "Silhouette", class: "view-silhouette" }
  ];

  return (
    <div className="product-gallery-container">
      {/* Main Image Frame */}
      <div className="product-gallery-main">
        {/* Floating Corner Badge */}
        <div className="gallery-badge">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>100% Authentic</span>
        </div>

        {/* Wishlist Button */}
        <button className="gallery-wishlist-btn" aria-label="Add to Wishlist">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <div
          ref={containerRef}
          className={`gallery-image-viewport ${views[activeIdx].class}`}
          onMouseEnter={() => setShowMagnifier(true)}
          onMouseLeave={() => setShowMagnifier(false)}
          onMouseMove={(e) => {
            const el = containerRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPct = (x / rect.width) * 100;
            const yPct = (y / rect.height) * 100;
            setMagPos({ x, y, xPct, yPct });
          }}
        >
          <img
            src={product.image}
            alt={`${product.name} - ${views[activeIdx].label}`}
            className="gallery-main-img"
          />

          {showMagnifier && (
            <div
              className="image-magnifier"
              style={{
                position: "absolute",
                pointerEvents: "none",
                width: 180,
                height: 180,
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 6px 18px rgba(2,6,23,0.08)",
                left: Math.max(8, magPos.x - 90),
                top: Math.max(8, magPos.y - 90),
                backgroundImage: `url(${product.image})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `${magPos.xPct}% ${magPos.yPct}%`,
                backgroundSize: "200%",
                zIndex: 60,
              }}
            />
          )}
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="gallery-thumbnails">
        {views.map((view, idx) => (
          <button
            key={idx}
            className={`gallery-thumb-btn ${activeIdx === idx ? "active" : ""}`}
            onClick={() => setActiveIdx(idx)}
            type="button"
            aria-label={`View ${view.label}`}
          >
            <div className={`thumb-viewport-preview ${view.class}`}>
              <img src={product.image} alt="" className="gallery-thumb-img" />
            </div>
            <span className="thumb-label">{view.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
