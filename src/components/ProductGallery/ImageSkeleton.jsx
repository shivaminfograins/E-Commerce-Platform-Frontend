import React from "react";

function ImageSkeleton({ height = "100%", width = "100%", style = {} }) {
  return (
    <div
      style={{
        display: "block",
        height: height,
        width: width,
        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite linear",
        borderRadius: "8px",
        ...style
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export default ImageSkeleton;
