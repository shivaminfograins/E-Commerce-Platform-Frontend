import React, { useState, useEffect } from "react";
import { Dialog, Box, IconButton, Typography, Badge } from "@mui/material";

function ImagePreviewModal({ open, images = [], initialImageIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  useEffect(() => {
    setCurrentIndex(initialImageIndex);
  }, [initialImageIndex, open]);

  if (!open || images.length === 0) return null;

  const currentImage = images[currentIndex] || {};

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      handlePrev(e);
    } else if (e.key === "ArrowRight") {
      handleNext(e);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      onKeyDown={handleKeyDown}
      PaperProps={{
        sx: {
          bgcolor: "rgba(15, 23, 42, 0.95)",
          color: "white",
          boxShadow: "none",
          overflow: "hidden",
          borderRadius: "16px",
          position: "relative",
          p: 0,
          border: "1px solid rgba(255,255,255,0.1)"
        }
      }}
    >
      {/* Lightbox Container */}
      <Box sx={{ position: "relative", display: "flex", flexDirection: "column", height: "80vh" }}>
        
        {/* Top Control Bar */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2.5, zIndex: 10, bgcolor: "rgba(0,0,0,0.4)" }}>
          <Typography sx={{ fontWeight: 600, fontFamily: "'Inter', sans-serif", fontSize: "0.9rem" }}>
            Image {currentIndex + 1} of {images.length}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </IconButton>
        </Box>

        {/* Main Photo Area */}
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", px: 8 }}>
          
          {/* Left Arrow Button */}
          {images.length > 1 && (
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                left: 20,
                color: "white",
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </IconButton>
          )}

          {/* Image Display */}
          <Box sx={{ maxWidth: "100%", maxHeight: "100%", position: "relative", p: 2 }}>
            <img
              src={currentImage.image}
              alt={currentImage.alt_text || "Variant Image"}
              style={{
                maxWidth: "100%",
                maxHeight: "55vh",
                objectFit: "contain",
                borderRadius: "8px",
                display: "block",
                margin: "auto"
              }}
            />

            {/* Primary Badge inside image */}
            {currentImage.is_primary && (
              <Box
                sx={{
                  position: "absolute",
                  top: 24,
                  left: 24,
                  bgcolor: "#4f46e5",
                  color: "#ffffff",
                  fontSize: "0.675rem",
                  fontWeight: 700,
                  px: 1.5,
                  py: 0.4,
                  borderRadius: "6px",
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: "0 4px 10px rgba(79, 70, 229, 0.4)"
                }}
              >
                PRIMARY IMAGE
              </Box>
            )}
          </Box>

          {/* Right Arrow Button */}
          {images.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 20,
                color: "white",
                bgcolor: "rgba(255,255,255,0.08)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </IconButton>
          )}
        </Box>

        {/* Bottom Details Bar */}
        <Box sx={{ p: 3, bgcolor: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontFamily: "'Inter', sans-serif", color: "#818cf8" }}>
              Order Index: #{currentImage.display_order ?? 0}
            </Typography>
            {currentImage.is_primary && (
              <Typography variant="caption" sx={{ color: "#34d399", fontWeight: 700, textTransform: "uppercase" }}>
                ● Primary Display Image
              </Typography>
            )}
          </Box>
          <Typography variant="body2" sx={{ color: "#d1d5db", fontFamily: "'Inter', sans-serif", fontSize: "0.85rem" }}>
            {currentImage.alt_text ? `Alt Text: "${currentImage.alt_text}"` : "No Alt text defined."}
          </Typography>
        </Box>

      </Box>
    </Dialog>
  );
}

export default ImagePreviewModal;
