import React, { useEffect, useState } from "react";

function ImageLightbox({ images = [], activeIndex = 0, onClose, onPrev, onNext }) {
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

  const handleZoomIn = () => setZoomScale((s) => Math.min(s + 0.5, 3));
  const handleZoomOut = () => setZoomScale((s) => Math.max(s - 0.5, 1));

  const currentImage = images[activeIndex]?.image || images[activeIndex]?.url;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      {/* Lightbox Toolbar */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          display: "flex",
          gap: "16px",
          zIndex: 10000
        }}
      >
        <button className="lightbox-btn" onClick={handleZoomIn} title="Zoom In">🔍﹢</button>
        <button className="lightbox-btn" onClick={handleZoomOut} title="Zoom Out">🔍﹣</button>
        <button className="lightbox-btn" onClick={onClose} title="Close (Esc)" style={{ fontWeight: 800 }}>✕</button>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button className="lightbox-nav-arrow" style={{ left: "24px" }} onClick={onPrev} title="Previous (←)">
            ‹
          </button>
          <button className="lightbox-nav-arrow" style={{ right: "24px" }} onClick={onNext} title="Next (→)">
            ›
          </button>
        </>
      )}

      {/* Main Preview Container */}
      <div
        style={{
          width: "90%",
          height: "80%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        <img
          src={currentImage || "/placeholder-product.png"}
          alt={`gallery-preview-${activeIndex + 1}`}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transform: `scale(${zoomScale})`,
            transition: "transform 0.2s ease-in-out"
          }}
        />
      </div>

      {/* Footer Image Counter */}
      <div style={{ position: "absolute", bottom: "32px", color: "#f8fafc", fontSize: "0.95rem", fontWeight: 600 }}>
        {activeIndex + 1} / {images.length}
      </div>

      <style>{`
        .lightbox-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.15rem;
          display: flex;
          alignItems: center;
          justifyContent: center;
          transition: background 0.2s;
        }
        .lightbox-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .lightbox-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.08);
          border: none;
          color: white;
          font-size: 3rem;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          alignItems: center;
          justifyContent: center;
          z-index: 10000;
          transition: background 0.2s;
        }
        .lightbox-nav-arrow:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

export default ImageLightbox;
