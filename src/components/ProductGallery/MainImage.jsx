import React, { useState, useRef, useEffect } from "react";
import ImageSkeleton from "./ImageSkeleton";

function MainImage({ src, alt, onClick, onDoubleClick, onWheel }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magPos, setMagPos] = useState({ xPct: 50, yPct: 50, left: 0, top: 0 });
  const containerRef = useRef(null);

  const imgRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    // Check if the image is already cached/complete
    if (imgRef.current && imgRef.current.complete) {
      setLoading(false);
    }
  }, [src]);

  const handleMouseMove = (e) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    
    // Calculate cursor position relative to the image container
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    // Convert to percentages
    const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setMagPos({
      xPct,
      yPct,
      left: x,
      top: y
    });
  };

  const handleWheel = (e) => {
    if (onWheel) {
      onWheel(e);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => !loading && !error && setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
      onDoubleClick={onDoubleClick}
      onWheel={handleWheel}
      onClick={onClick}
      style={{
        position: "relative",
        width: "100%",
        height: "450px",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        cursor: "zoom-in",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease"
      }}
    >
      {loading && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }}>
          <ImageSkeleton height="100%" />
        </div>
      )}

      {error ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "#64748b" }}>
          <span style={{ fontSize: "2rem" }}>📷</span>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Image failed to load</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src || "/placeholder-product.png"}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            transition: "opacity 0.4s ease-in-out",
            opacity: loading ? 0 : 1
          }}
        />
      )}

      {/* Progress Circle while loading */}
      {loading && (
        <div
          style={{
            position: "absolute",
            width: "40px",
            height: "40px",
            border: "3px solid #e2e8f0",
            borderTop: "3px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s infinite linear",
            zIndex: 3
          }}
        />
      )}

      {/* Magnifier glass lens overlay */}
      {showMagnifier && src && !loading && !error && (
        <>
          {/* Aim/Lens cursor indicator */}
          <div
            style={{
              position: "absolute",
              left: `${magPos.left - 60}px`,
              top: `${magPos.top - 60}px`,
              width: "120px",
              height: "120px",
              border: "1.5px solid rgba(255, 255, 255, 0.8)",
              borderRadius: "50%",
              boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.4)",
              pointerEvents: "none",
              zIndex: 4
            }}
          />

          {/* Floating Magnified View Portal */}
          <div
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              width: "220px",
              height: "220px",
              borderRadius: "12px",
              border: "2px solid #ffffff",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${magPos.xPct}% ${magPos.yPct}%`,
              backgroundSize: "300%",
              pointerEvents: "none",
              zIndex: 5
            }}
          />
        </>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default MainImage;
