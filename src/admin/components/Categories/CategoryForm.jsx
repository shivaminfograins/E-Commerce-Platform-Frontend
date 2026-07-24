import { useState } from "react";
import { Grid, TextField, MenuItem, Button, Box, Typography, Avatar, FormHelperText, Fade, InputAdornment } from "@mui/material";

// SVGs matching the exact icons from the reference design image
const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const AlignLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="17" y1="10" x2="3" y2="10" />
    <line x1="21" y1="6" x2="3" y2="6" />
    <line x1="21" y1="14" x2="3" y2="14" />
    <line x1="17" y1="18" x2="3" y2="18" />
  </svg>
);

const TextFormatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const CloudUploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.5-2-2.4-3.5-4.5-3.5h-1.2C15.5 4.8 12.8 3 9.7 3 5.4 3 2 6.4 2 10.7c0 2.2.9 4.2 2.4 5.7" />
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
  </svg>
);

const InfoCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const BACKEND_ORIGIN = import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

const normalizeMediaUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("/media/")) return BACKEND_ORIGIN + url;
  return url;
};

function CategoryForm({ initialValues, onSubmit, onCancel, loading }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [status, setStatus] = useState(initialValues?.status || "Active");
  const [altText, setAltText] = useState(initialValues?.alt_text || "");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    normalizeMediaUrl(initialValues?.image) || null
  );

  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image size must be less than 2MB." }));
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

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
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Category name is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name,
      description,
      status,
      image: imageFile,
      alt_text: altText
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {/* 1. General Information Card */}
      <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "12px", p: 3, mb: 3.5, backgroundColor: "#ffffff" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1.5, mb: 3, borderBottom: "1px solid #f3f4f6" }}>
          <InfoCircleIcon />
          <Typography sx={{ fontWeight: 700, color: "#4f46e5", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Inter', sans-serif" }}>
            General Information
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column: Name & Status */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                Category Name <span style={{ color: "#ef4444" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                      <TagIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    height: "44px",
                    "& fieldset": {
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4f46e5",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.75rem",
                    marginLeft: "4px"
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                Status <span style={{ color: "#ef4444" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    height: "44px",
                    "& fieldset": {
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4f46e5",
                      borderWidth: "1.5px",
                    },
                  },
                }}
              >
                <MenuItem value="Active">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem" }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
                    Active
                  </Box>
                </MenuItem>
                <MenuItem value="Inactive">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, fontFamily: "'Inter', sans-serif", fontSize: "0.875rem" }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#94a3b8" }} />
                    Inactive
                  </Box>
                </MenuItem>
              </TextField>
            </Box>
          </Grid>

          {/* Right Column: Description */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Enter category description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5, alignSelf: "flex-start", mt: 1.2 }}>
                      <AlignLeftIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    alignItems: "flex-start",
                    "& fieldset": {
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4f46e5",
                      borderWidth: "1.5px",
                    },
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* 2. Media & SEO Card */}
      <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "12px", p: 3, mb: 4, backgroundColor: "#ffffff" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1.5, mb: 3, borderBottom: "1px solid #f3f4f6" }}>
          <ImageIcon />
          <Typography sx={{ fontWeight: 700, color: "#4f46e5", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Inter', sans-serif" }}>
            Media & SEO
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column: Image Uploader */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                Category Image
              </Typography>
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
                  position: "relative",
                  minHeight: "155px",
                  "&:hover": {
                    borderColor: "#4f46e5",
                    bgcolor: "rgba(79, 70, 229, 0.04)"
                  }
                }}
              >
                {imagePreview ? (
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={imagePreview}
                      variant="rounded"
                      sx={{
                        width: 110,
                        height: 110,
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                        border: "1px solid #e2e8f0",
                        bgcolor: "white"
                      }}
                    />
                    <Fade in={true}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        variant="contained"
                        color="error"
                        size="small"
                        disabled={loading}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          borderRadius: "50%",
                          minWidth: 0,
                          width: 22,
                          height: 22,
                          p: 0,
                          bgcolor: "#ef4444",
                          boxShadow: "0 2px 8px rgba(239, 68, 68, 0.2)",
                          "&:hover": { bgcolor: "#dc2626" }
                        }}
                      >
                        ✕
                      </Button>
                    </Fade>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <CloudUploadIcon />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1f2937", mb: 0.5, mt: 1.5, fontFamily: "'Inter', sans-serif", fontSize: "0.825rem" }}>
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
                        px: 2,
                        fontFamily: "'Inter', sans-serif",
                        "&:hover": {
                          bgcolor: "rgba(79, 70, 229, 0.06)",
                          borderColor: "#4f46e5",
                          boxShadow: "none"
                        }
                      }}
                    >
                      Choose Image
                      <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                  </Box>
                )}
              </Box>
              <Typography sx={{ color: "#6b7280", mt: 1, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif", lineHeight: "1.4" }}>
                Recommended size: 800x800px. Max size: 2MB<br />
                Supported formats: JPG, PNG, WebP
              </Typography>
            </Box>
          </Grid>

          {/* Right Column: SEO Alt Text */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                Image Alt Text (SEO)
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter alt text for the image (optional)"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: "#6b7280", mr: 1 }}>
                      <TextFormatIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.875rem",
                    height: "44px",
                    "& fieldset": {
                      borderColor: "#d1d5db",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4f46e5",
                      borderWidth: "1.5px",
                    },
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Action Buttons Row */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="inherit"
          disabled={loading}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3.5,
            py: 1.1,
            borderColor: "#d1d5db",
            color: "#374151",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
            "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3.5,
            py: 1.1,
            bgcolor: "#4f46e5",
            color: "#ffffff",
            boxShadow: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            "&:hover": {
              bgcolor: "#4338ca",
              boxShadow: "none"
            }
          }}
        >
          <span>+</span>
          <span>{loading ? "Saving..." : initialValues ? "Save Changes" : "Create Category"}</span>
        </Button>
      </Box>
    </Box>
  );
}

export default CategoryForm;
