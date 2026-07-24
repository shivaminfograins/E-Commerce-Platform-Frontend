import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Grid, Tooltip, CircularProgress } from "@mui/material";

function VariantImageUploader({ images = [], onChange, loading }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validImageFiles = files.filter(f => f.type.startsWith("image/"));
    if (validImageFiles.length === 0) return;

    const newImages = validImageFiles.map((file, idx) => ({
      id: `temp_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 9)}`,
      file: file,
      url: URL.createObjectURL(file),
      alt_text: file.name,
      is_primary: images.length === 0 && idx === 0, // Auto-set primary if first image
      display_order: images.length + idx,
      progress: 0
    }));

    onChange([...images, ...newImages]);
  };

  const handleRemoveImage = (imgId) => {
    const targetImage = images.find(img => img.id === imgId);
    let updated = images.filter(img => img.id !== imgId);

    // If we're updating a backend product, track deletion by marking it with is_deleted
    if (typeof imgId === "number") {
      updated = [...images.map(img => img.id === imgId ? { ...img, is_deleted: true } : img)];
    }

    // Adjust primary if the deleted image was primary
    const activeImages = updated.filter(img => !img.is_deleted);
    if (targetImage?.is_primary && activeImages.length > 0) {
      // Find first remaining active image and make it primary
      const firstActiveId = activeImages[0].id;
      updated = updated.map(img => img.id === firstActiveId ? { ...img, is_primary: true } : { ...img, is_primary: false });
    }

    onChange(updated);
  };

  const handleSetPrimary = (imgId) => {
    const updated = images.map(img => ({
      ...img,
      is_primary: img.id === imgId
    }));
    onChange(updated);
  };

  const handleMoveLeft = (index) => {
    if (index === 0) return;
    const activeImages = images.filter(img => !img.is_deleted);
    const updatedActive = [...activeImages];
    const temp = updatedActive[index];
    updatedActive[index] = updatedActive[index - 1];
    updatedActive[index - 1] = temp;

    // Apply back display orders
    const updatedOrdered = updatedActive.map((img, idx) => ({
      ...img,
      display_order: idx
    }));

    // Merge back with deleted ones
    const deletedImages = images.filter(img => img.is_deleted);
    onChange([...updatedOrdered, ...deletedImages]);
  };

  const handleMoveRight = (index) => {
    const activeImages = images.filter(img => !img.is_deleted);
    if (index === activeImages.length - 1) return;
    const updatedActive = [...activeImages];
    const temp = updatedActive[index];
    updatedActive[index] = updatedActive[index + 1];
    updatedActive[index + 1] = temp;

    // Apply back display orders
    const updatedOrdered = updatedActive.map((img, idx) => ({
      ...img,
      display_order: idx
    }));

    // Merge back with deleted ones
    const deletedImages = images.filter(img => img.is_deleted);
    onChange([...updatedOrdered, ...deletedImages]);
  };

  const activeImages = images.filter(img => !img.is_deleted);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
        Variant Images
      </Typography>

      {/* Drag and Drop Zone */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2.5,
          border: isDragging ? "1.5px dashed #4f46e5" : "1.5px dashed rgba(79, 70, 229, 0.25)",
          borderRadius: "8px",
          bgcolor: "rgba(79, 70, 229, 0.02)",
          textAlign: "center",
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
          minHeight: "150px",
          mb: 1.5,
          "&:hover": {
            borderColor: "#4f46e5",
            bgcolor: "rgba(79, 70, 229, 0.04)"
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "8px" }}>
          <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.5-2-2.4-3.5-4.5-3.5h-1.2C15.5 4.8 12.8 3 9.7 3 5.4 3 2 6.4 2 10.7c0 2.2.9 4.2 2.4 5.7" />
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
        </svg>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#1f2937", mb: 0.5, fontFamily: "'Inter', sans-serif", fontSize: "0.825rem" }}>
          Drag & drop an image here
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280", mb: 2, fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
          or click to browse
        </Typography>
        <Button
          variant="contained"
          component="label"
          size="small"
          disabled={loading}
          sx={{
            bgcolor: "white",
            color: "#4f46e5",
            border: "1px solid rgba(79, 70, 229, 0.4)",
            borderRadius: "6px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "none",
            fontSize: "0.75rem",
            px: 2.5,
            fontFamily: "'Inter', sans-serif",
            "&:hover": {
              bgcolor: "rgba(79, 70, 229, 0.06)",
              borderColor: "#4f46e5",
              boxShadow: "none"
            }
          }}
        >
          Choose Image
          <input type="file" accept="image/*" multiple hidden onChange={handleFileSelect} />
        </Button>
      </Box>
      <Typography sx={{ color: "#6b7280", mb: 3, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", lineHeight: "1.4" }}>
        Recommended size: 800x800px. Max size: 2MB<br />
        Supported formats: JPG, PNG, WebP
      </Typography>

      {/* Images List Grid */}
      {activeImages.length > 0 && (
        <Grid container spacing={2}>
          {activeImages.map((img, index) => (
            <Grid item key={img.id} xs={6} sm={4} md={3}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "10px",
                  border: img.is_primary ? "2px solid #4f46e5" : "1px solid #e5e7eb",
                  bgcolor: "#ffffff",
                  p: 0.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  overflow: "hidden"
                }}
              >
                {/* Image Aspect ratio box */}
                <Box
                  sx={{
                    width: "100%",
                    paddingTop: "100%",
                    position: "relative",
                    borderRadius: "6px",
                    overflow: "hidden",
                    bgcolor: "#f9fafb"
                  }}
                >
                  <img
                    src={img.url || img.image}
                    alt={img.alt_text}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />

                  {/* Primary Badge */}
                  {img.is_primary && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 6,
                        left: 6,
                        bgcolor: "#4f46e5",
                        color: "#ffffff",
                        fontSize: "0.625rem",
                        fontWeight: 700,
                        px: 1,
                        py: 0.2,
                        borderRadius: "4px",
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      Primary
                    </Box>
                  )}

                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(img.id)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(239, 68, 68, 0.9)",
                      color: "white",
                      width: 22,
                      height: 22,
                      "&:hover": { bgcolor: "#ef4444" }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </IconButton>

                  {/* Uploading progress indicator */}
                  {img.progress > 0 && img.progress < 100 && (
                    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(0,0,0,0.4)" }}>
                      <CircularProgress variant="determinate" value={img.progress} size={24} sx={{ color: "#ffffff" }} />
                    </Box>
                  )}
                </Box>

                {/* Operations Toolbar */}
                <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", mt: 0.5, px: 0.5 }}>
                  <Box sx={{ display: "flex", gap: 0.25 }}>
                    <Tooltip title="Move Left">
                      <span>
                        <IconButton
                          size="small"
                          disabled={index === 0}
                          onClick={() => handleMoveLeft(index)}
                          sx={{ p: 0.5 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Move Right">
                      <span>
                        <IconButton
                          size="small"
                          disabled={index === activeImages.length - 1}
                          onClick={() => handleMoveRight(index)}
                          sx={{ p: 0.5 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>

                  {!img.is_primary && (
                    <Button
                      size="small"
                      onClick={() => handleSetPrimary(img.id)}
                      sx={{
                        fontSize: "0.675rem",
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#4f46e5",
                        p: 0,
                        minWidth: 0,
                        fontFamily: "'Inter', sans-serif"
                      }}
                    >
                      Make Primary
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default VariantImageUploader;
