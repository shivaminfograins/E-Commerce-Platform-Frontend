import React, { useState, useEffect, useRef, useMemo } from "react";
import MainImage from "./ProductGallery/MainImage";
import ThumbnailList from "./ProductGallery/ThumbnailList";
import ImageLightbox from "./ProductGallery/ImageLightbox";

function ProductGallery({ product = {}, variants = [], selectedVariant = null }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Swipe gesture hooks
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Derive the active images array
  const galleryImages = useMemo(() => {
    // 1. If a specific variant is selected, prioritize its images
    if (selectedVariant && Array.isArray(selectedVariant.images) && selectedVariant.images.length > 0) {
      return selectedVariant.images;
    }

    // 2. Fallback to the first variant with images
    if (Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        if (Array.isArray(variant.images) && variant.images.length > 0) {
          return variant.images;
        }
      }
    }

    // 3. Fallback to the product's primary image
    if (product?.image) {
      return [{ id: "fallback-primary", image: product.image, is_primary: true }];
    }

    // 4. Default placeholder
    return [];
  }, [product, variants, selectedVariant]);

  // Reset active index when images list changes (e.g. variant switches)
  useEffect(() => {
    setActiveIdx(0);
  }, [galleryImages]);

  const handleNext = () => {
    if (galleryImages.length <= 1) return;
    setActiveIdx((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    if (galleryImages.length <= 1) return;
    setActiveIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Mouse wheel image navigation
  const handleWheel = (e) => {
    if (galleryImages.length <= 1) return;
    e.preventDefault();
    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  // Mobile Swipe event handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // initialize end
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext(); // Swiped left
    } else if (diff < -50) {
      handlePrev(); // Swiped right
    }
  };

  const activeImageSrc = galleryImages[activeIdx]?.image || galleryImages[activeIdx]?.url || "";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "86px 1fr",
        gap: "20px",
        width: "100%",
        maxWidth: "600px",
        userSelect: "none"
      }}
      className="product-gallery-layout-wrapper"
    >
      {/* Thumbnail List (Desktop Column / Mobile Row) */}
      <div className="gallery-sidebar-thumb">
        <ThumbnailList
          images={galleryImages}
          activeIndex={activeIdx}
          onSelect={(idx) => setActiveIdx(idx)}
        />
      </div>

      {/* Main Preview Component */}
      <div
        className="gallery-main-preview-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ position: "relative" }}>
          {/* Gallery Badge */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "50px",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #e2e8f0",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "#0f172a",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}
          >
            <span>✓</span>
            <span>100% Authentic</span>
          </div>

          {/* Media Renderer (extensible for video, 360 views) */}
          {activeImageSrc.endsWith(".mp4") ? (
            <video
              src={activeImageSrc}
              controls
              autoPlay
              muted
              style={{ width: "100%", height: "450px", objectFit: "contain", borderRadius: "16px" }}
            />
          ) : (
            <MainImage
              src={activeImageSrc}
              alt={product.name || "Product Image"}
              onClick={() => setLightboxOpen(true)}
              onDoubleClick={() => setLightboxOpen(true)}
              onWheel={handleWheel}
            />
          )}
        </div>

        {/* Bottom Control Row */}
        {galleryImages.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
              padding: "0 4px"
            }}
          >
            {/* Image Counter */}
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569" }}>
              {activeIdx + 1} / {galleryImages.length}
            </span>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => alert("Hover over the image to activate the Zoom Lens Magnifier!")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                🔍 Zoom
              </button>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#ffffff",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                ⛶ Fullscreen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {lightboxOpen && galleryImages.length > 0 && (
        <ImageLightbox
          images={galleryImages}
          activeIndex={activeIdx}
          onClose={() => setLightboxOpen(false)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .product-gallery-layout-wrapper {
            grid-template-columns: 1fr !important;
            display: flex !important;
            flex-direction: column-reverse !important;
          }
          .gallery-sidebar-thumb {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductGallery;
