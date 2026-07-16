import { useState } from "react";
import { Box, TextField, Button, MenuItem, Typography, Avatar, IconButton, FormHelperText } from "@mui/material";

const BACKEND_ORIGIN = import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

const normalizeMediaUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("/media/")) return BACKEND_ORIGIN + url;
  return url;
};

function ProductImageForm({ initialValues, products = [], onSubmit, onCancel, loading }) {
  const [product, setProduct] = useState(initialValues?.product || "");
  const [altText, setAltText] = useState(initialValues?.alt_text || "");
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    normalizeMediaUrl(initialValues?.image) || null
  );

  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!product) {
      newErrors.product = "Please select a product";
    }
    if (!initialValues && !imagePreview) {
      newErrors.image = "Please choose an image file";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = new FormData();
    payload.append("product", product);
    payload.append("alt_text", altText);
    if (imageFile) {
      payload.append("image", imageFile);
    }

    onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {/* Product Select dropdown */}
      <TextField
        fullWidth
        select
        label="Select Product"
        variant="outlined"
        margin="normal"
        value={product}
        onChange={(e) => {
          setProduct(e.target.value);
          setErrors((prev) => ({ ...prev, product: "" }));
        }}
        error={Boolean(errors.product)}
        helperText={errors.product}
        disabled={loading}
        InputProps={{ style: { borderRadius: "10px" } }}
      >
        {products.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name} (ID: {p.id})
          </MenuItem>
        ))}
      </TextField>

      {/* Image selector */}
      <Box sx={{ mt: 2, mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1 }}>
          Product Image File
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            p: 2,
            border: errors.image ? "1.5px dashed #ef4444" : "1.5px dashed rgba(15, 23, 42, 0.15)",
            borderRadius: "12px",
            bgcolor: "#f8fafc"
          }}
        >
          {imagePreview ? (
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={imagePreview}
                variant="rounded"
                sx={{ width: 80, height: 80, border: "1px solid rgba(15, 23, 42, 0.08)", bgcolor: "white" }}
              />
              <IconButton
                onClick={handleRemoveImage}
                size="small"
                disabled={loading}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  bgcolor: "#ef4444",
                  color: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  p: 0.5,
                  "&:hover": { bgcolor: "#dc2626" }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </IconButton>
            </Box>
          ) : (
            <Avatar
              variant="rounded"
              sx={{ width: 80, height: 80, bgcolor: "#e2e8f0", color: "#64748b", fontSize: "2rem" }}
            >
              🖼️
            </Avatar>
          )}

          <Box>
            <Button
              variant="outlined"
              component="label"
              size="small"
              disabled={loading}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                borderColor: errors.image ? "#ef4444" : "rgba(15, 23, 42, 0.15)",
                color: errors.image ? "#ef4444" : "#1e293b",
                "&:hover": { borderColor: "#1e293b", bgcolor: "rgba(15, 23, 42, 0.02)" }
              }}
            >
              Choose Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: "#64748b" }}>
              Recommended: Product showcase image, PNG or JPG, max 2MB.
            </Typography>
            {errors.image && (
              <FormHelperText error sx={{ mt: 0.5, fontWeight: 600 }}>
                {errors.image}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </Box>

      {/* Alt Text SEO input */}
      <TextField
        fullWidth
        label="Alt Text (SEO Showcase Description)"
        variant="outlined"
        margin="normal"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        disabled={loading}
        InputProps={{ style: { borderRadius: "10px" } }}
      />

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : initialValues ? "Update Image" : "Add Image"}
        </Button>
      </Box>
    </Box>
  );
}

export default ProductImageForm;
