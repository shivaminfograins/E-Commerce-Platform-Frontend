import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

function ImageUploader({ imageUrl, onImageUpload, disabled }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    // Simulate image uploading
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }, 1500);
  };

  return (
    <Box sx={{ border: "2px dashed #cbd5e1", borderRadius: "16px", p: 3, textAlign: "center", bgcolor: "#f8fafc", position: "relative" }}>
      {loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 2 }}>
          <CircularProgress size={30} sx={{ mb: 1 }} />
          <Typography variant="caption" color="text.secondary">Uploading image...</Typography>
        </Box>
      ) : imageUrl ? (
        <Box sx={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
          <img
            src={imageUrl}
            alt="Preview"
            style={{ maxHeight: 150, borderRadius: "12px", objectFit: "cover" }}
          />
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => onImageUpload("")}
            disabled={disabled}
            sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24, borderRadius: "50%", p: 0 }}
          >
            ✕
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Drag and drop product image or click below to upload
          </Typography>
          <Button
            variant="outlined"
            component="label"
            size="small"
            disabled={disabled}
            sx={{ borderRadius: "8px" }}
          >
            Choose Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default ImageUploader;
