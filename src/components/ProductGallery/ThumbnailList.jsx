import React from "react";

function ThumbnailList({ images = [], activeIndex = 0, onSelect }) {
  if (images.length <= 1) return null;

  return (
    <div className="gallery-thumbnail-list-container">
      {images.map((img, idx) => {
        const isSelected = idx === activeIndex;
        const imageUrl = img.image || img.url;

        return (
          <button
            key={img.id || idx}
            onClick={() => onSelect(idx)}
            onMouseEnter={() => onSelect(idx)} // Thumbnail hover preview bonus feature
            style={{
              padding: 0,
              width: "74px",
              height: "74px",
              borderRadius: "10px",
              border: isSelected ? "2.5px solid #3b82f6" : "1.5px solid #e2e8f0",
              backgroundColor: "#ffffff",
              overflow: "hidden",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isSelected ? "scale(1.05)" : "scale(1)",
              boxShadow: isSelected ? "0 4px 10px rgba(59, 130, 246, 0.15)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img
              src={imageUrl || "/placeholder-product.png"}
              alt={`thumbnail-${idx + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          </button>
        );
      })}

      <style>{`
        .gallery-thumbnail-list-container {
          display: flex;
          gap: 12px;
          flex-direction: column;
          max-height: 450px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .gallery-thumbnail-list-container::-webkit-scrollbar {
          width: 4px;
        }
        .gallery-thumbnail-list-container::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .gallery-thumbnail-list-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        @media (max-width: 900px) {
          .gallery-thumbnail-list-container {
            flex-direction: row;
            overflow-x: auto;
            padding: 4px 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default ThumbnailList;
