import React from "react";
import { Grid, TextField, MenuItem, Box, Typography, Paper, InputAdornment } from "@mui/material";

// Premium icons matching the exact mockup style
const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const AwardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
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

function ProductInformation({ productData, onChange, categories = [], brands = [], errors = {}, loading }) {
  const handleChange = (field) => (e) => {
    onChange({ ...productData, [field]: e.target.value });
  };

  return (
    <Paper sx={{ border: "1px solid #e5e7eb", borderRadius: "12px", p: 3, mb: 3.5, backgroundColor: "#ffffff", boxShadow: "none" }}>
      {/* Card Header Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1.5, mb: 3, borderBottom: "1px solid #f3f4f6" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <Typography sx={{ fontWeight: 700, color: "#4f46e5", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Inter', sans-serif" }}>
          Product Information
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side: Fields */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              Product Name <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter product name"
              value={productData.name || ""}
              onChange={handleChange("name")}
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
              sx={textFieldStyle}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                  Category <span style={{ color: "#ef4444" }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  select
                  value={productData.categoryId || ""}
                  onChange={handleChange("categoryId")}
                  error={Boolean(errors.categoryId)}
                  helperText={errors.categoryId}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                        <FolderIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
                  Brand
                </Typography>
                <TextField
                  fullWidth
                  select
                  value={productData.brand || ""}
                  onChange={handleChange("brand")}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                        <AwardIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyle}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {brands.map((b) => (
                    <MenuItem key={b.id} value={b.id}>
                      {b.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 1 }}>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              Status <span style={{ color: "#ef4444" }}>*</span>
            </Typography>
            <TextField
              fullWidth
              select
              value={productData.status || "Active"}
              onChange={handleChange("status")}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "#4f46e5", mr: 0.5 }}>
                    <ShieldCheckIcon />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
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

        {/* Right Side: Description */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Typography sx={{ fontWeight: 600, color: "#374151", mb: 1, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10.5}
              placeholder="Enter comprehensive product description..."
              value={productData.description || ""}
              onChange={handleChange("description")}
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
    </Paper>
  );
}

const textFieldStyle = {
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
    marginLeft: "4px",
  },
};

export default ProductInformation;
