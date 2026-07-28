import React, { useEffect, useState } from "react";

function ImageLightbox({
  images = [],
  activeIndex = 0,
  onClose,
  onPrev,
  onNext,
}) {
  const [zoomScale, setZoomScale] = useState(1);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Disable scroll on body when lightbox is active
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, onPrev, onNext]);

  const handleZoomIn = () => setZoomScale((s) => Math.min(s + 0.4, 2.2));
  const handleZoomOut = () => setZoomScale((s) => Math.max(s - 0.4, 1));

  const currentImage = images[activeIndex]?.image || images[activeIndex]?.url;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-toolbar">
          <button
            className="lightbox-btn small"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            −
          </button>
          <button
            className="lightbox-btn small"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            +
          </button>
          <button
            className="lightbox-btn close-btn"
            onClick={onClose}
            title="Close"
          >
            ×
          </button>
        </div>

        <div className="lightbox-media">
          <div className="lightbox-image-frame">
            <img
              src={currentImage || "/placeholder-product.png"}
              alt={`gallery-preview-${activeIndex + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                transform: `scale(${zoomScale})`,
                transition: "transform 0.24s ease-in-out",
                borderRadius: "24px",
                boxShadow: "0 28px 80px rgba(0, 0, 0, 0.25)",
                background:
                  "radial-gradient(circle at top left, rgba(255,255,255,0.12), transparent 40%)",
              }}
            />
          </div>
        </div>

        <div className="lightbox-footer">
          <div className="lightbox-caption">Premium preview</div>
          <div className="lightbox-footer-center">
            <span
              className="lightbox-arrow-text"
              onClick={onPrev}
              title="Previous"
            >
              ‹
            </span>
            <span className="lightbox-image-index-text">
              {activeIndex + 1} / {images.length}
            </span>
            <span
              className="lightbox-arrow-text"
              onClick={onNext}
              title="Next"
            >
              ›
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 14, 30, 0.78);
          backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .lightbox-card {
          width: min(920px, 100%);
          height: 80vh;
          max-height: 88vh;
          background: rgba(12, 18, 35, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.4);
          border-radius: 30px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .lightbox-toolbar {
          position: absolute;
          top: 18px;
          right: 18px;
          display: flex;
          gap: 10px;
          z-index: 10;
        }

        .lightbox-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.08);
          color: #f8fafc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .lightbox-btn.small {
          width: 38px;
          height: 38px;
          font-size: 1rem;
        }

        .lightbox-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
        }

        .close-btn {
          width: 44px;
          height: 44px;
          font-size: 1.15rem;
          background: rgba(255, 255, 255, 0.1);
        }

        .lightbox-media {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 30px 26px 18px;
          min-height: 0;
          overflow: hidden;
        }

        .lightbox-image-frame {
          width: 100%;
          height: 100%;
          min-height: 0;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(12px);
        }

        .lightbox-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          padding: 20px 26px 24px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .lightbox-caption {
          color: rgba(241, 245, 249, 0.78);
          font-size: 0.92rem;
          letter-spacing: 0.01em;
        }

        .lightbox-footer-center {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          width: 100%;
        }

        .lightbox-arrow-text {
          color: #f8fafc;
          font-size: 2.2rem;
          cursor: pointer;
          user-select: none;
          opacity: 0.6;
          transition: opacity 0.2s ease, transform 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          line-height: 1;
        }

        .lightbox-arrow-text:hover {
          opacity: 1;
          transform: scale(1.25);
        }

        .lightbox-image-index-text {
          color: rgba(248, 250, 252, 0.85);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          user-select: none;
        }

        @media (max-width: 720px) {
          .lightbox-card {
            width: 100%;
            max-height: 92vh;
          }

          .lightbox-toolbar {
            top: 12px;
            right: 12px;
          }

          .lightbox-media {
            padding: 22px 18px 16px;
          }

          .lightbox-footer {
            padding: 18px 18px 20px;
          }

          .lightbox-footer-center {
            gap: 16px;
          }

          .lightbox-arrow-text {
            font-size: 1.8rem;
          }

          .lightbox-image-index-text {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ImageLightbox;
