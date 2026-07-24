import React, { useState } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ImagePreviewModal from "./ImagePreviewModal";

function VariantGallery({ images = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic", fontFamily: "'Inter', sans-serif" }}>
        No images uploaded for this variant.
      </Typography>
    );
  }

  // Sort images by display_order
  const sortedImages = [...images].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const handleThumbnailClick = (index) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const maxThumbnails = 4;
  const displayedImages = sortedImages.slice(0, maxThumbnails);
  const remainingCount = sortedImages.length - maxThumbnails;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1.5, fontSize: "0.825rem", fontFamily: "'Inter', sans-serif" }}>
        Variant Images ({sortedImages.length})
      </Typography>

      <Grid container spacing={1.5}>
        {displayedImages.map((img, idx) => {
          const isLast = idx === maxThumbnails - 1 && remainingCount > 0;
          return (
            <Grid item key={img.id || idx} xs={3} sm={2} md={1.5}>
              <Box
                onClick={() => handleThumbnailClick(idx)}
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "100%",
                  borderRadius: "8px",
                  border: img.is_primary ? "2px solid #4f46e5" : "1px solid #e2e8f0",
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "transform 0.15s ease-in-out, border-color 0.15s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    borderColor: "#4f46e5"
                  }
                }}
              >
                <img
                  src={img.image}
                  alt={img.alt_text || `Variant image ${idx + 1}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  loading="lazy"
                />

                {/* Primary Display Tag */}
                {img.is_primary && !isLast && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      bgcolor: "#4f46e5",
                      color: "white",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      px: 0.5,
                      py: 0.1,
                      borderRadius: "3px"
                    }}
                  >
                    Primary
                  </Box>
                )}

                {/* Overlay for +N More */}
                {isLast && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(15, 23, 42, 0.75)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Inter', sans-serif" }}>
                      +{remainingCount} More
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Lightbox / Gallery Modal */}
      <ImagePreviewModal
        open={lightboxOpen}
        images={sortedImages}
        initialImageIndex={selectedIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </Box>
  );
}

export default VariantGallery;
