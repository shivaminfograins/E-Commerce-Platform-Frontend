import React from "react";
import { Box, Typography, TextField, MenuItem, Button, Grid, Paper, InputAdornment } from "@mui/material";
import VariantImageUploader from "./VariantImageUploader";

// Inline icons for inputs
const OptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const SkuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const PriceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const StockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

function VariantCard({ variant, index, onChange, onDuplicate, onDelete, errors = {}, loading }) {
  const handleChange = (field) => (e) => {
    onChange({ ...variant, [field]: e.target.value });
  };

  const handleImagesChange = (newImages) => {
    onChange({ ...variant, images: newImages });
  };

  const variantErrors = errors[variant.id] || {};

  return (
    <Paper
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        p: 3,
        mb: 3.5,
        backgroundColor: "#ffffff",
        boxShadow: "none",
        position: "relative"
      }}
    >
      {/* Header section info */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2, mb: 3, borderBottom: "1px solid #f3f4f6" }}>
        <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem", fontFamily: "'Inter', sans-serif" }}>
          Variant #{index + 1}: {variant.name || "Unnamed Variant"}
        </Typography>
        
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={onDuplicate}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderColor: "#e5e7eb",
              color: "#4b5563",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              px: 2,
              borderRadius: "6px",
              "&:hover": { borderColor: "#d1d5db", bgcolor: "#f9fafb" }
            }}
          >
            Duplicate Variant
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={onDelete}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontSize: "0.75rem",
              fontWeight: 600,
              px: 2,
              borderRadius: "6px",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Delete Variant
          </Button>
        </Box>
      </Box>

      {/* Main inputs */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              Variant Name / Options <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. Red / XL"
              value={variant.name || ""}
              onChange={handleChange("name")}
              error={Boolean(variantErrors.name)}
              helperText={variantErrors.name}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                    <OptionsIcon />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              SKU <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. PRO-LP-RED-XL"
              value={variant.sku || ""}
              onChange={handleChange("sku")}
              error={Boolean(variantErrors.sku)}
              helperText={variantErrors.sku}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                    <SkuIcon />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              Price ($) <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="0.00"
              value={variant.price || ""}
              onChange={handleChange("price")}
              error={Boolean(variantErrors.price)}
              helperText={variantErrors.price}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                    <PriceIcon />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              Stock <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              type="number"
              placeholder="0"
              value={variant.stock !== undefined ? variant.stock : ""}
              onChange={handleChange("stock")}
              error={Boolean(variantErrors.stock)}
              helperText={variantErrors.stock}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                    <StockIcon />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              Status <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              select
              value={variant.status || "Active"}
              onChange={handleChange("status")}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                    <ShieldIcon />
                  </InputAdornment>
                ),
              }}
              sx={inputStyle}
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
      </Grid>

      {/* Image Uploader Component */}
      <Box sx={{ mt: 3 }}>
        <VariantImageUploader
          images={variant.images}
          onChange={handleImagesChange}
          loading={loading}
        />
        {variantErrors.images && (
          <Typography color="error" sx={{ fontSize: "0.75rem", mt: 1, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            {variantErrors.images}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

const inputStyle = {
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
    fontSize: "0.725rem",
    marginLeft: "4px",
  },
};

export default VariantCard;
