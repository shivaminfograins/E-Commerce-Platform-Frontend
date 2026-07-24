import React from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";

function ProductSummary({ productData, variants = [] }) {
  const activeVariants = variants.filter(v => !v.is_deleted);
  
  const totalVariants = activeVariants.length;
  
  const totalImages = activeVariants.reduce((sum, v) => {
    const activeImages = (v.images || []).filter(img => !img.is_deleted);
    return sum + activeImages.length;
  }, 0);

  // Estimated Status logic
  let estimatedStatus = productData.status || "Inactive";
  if (totalVariants === 0) {
    estimatedStatus = "Inactive (Draft)";
  }

  return (
    <Paper sx={{ border: "1px solid #e5e7eb", borderRadius: "12px", p: 3, mb: 3.5, backgroundColor: "#ffffff", boxShadow: "none" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1.5, mb: 3, borderBottom: "1px solid #f3f4f6" }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
        <Typography sx={{ fontWeight: 700, color: "#4f46e5", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Inter', sans-serif" }}>
          Product Summary
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, border: "1px solid #f1f5f9", borderRadius: "8px", bgcolor: "#f9fafb" }}>
            <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, textTransform: "uppercase", fontSize: "0.675rem", letterSpacing: "0.5px", fontFamily: "'Inter', sans-serif" }}>
              Total Variants
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827", mt: 0.5, fontFamily: "'Inter', sans-serif" }}>
              {totalVariants}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, border: "1px solid #f1f5f9", borderRadius: "8px", bgcolor: "#f9fafb" }}>
            <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, textTransform: "uppercase", fontSize: "0.675rem", letterSpacing: "0.5px", fontFamily: "'Inter', sans-serif" }}>
              Total Images
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827", mt: 0.5, fontFamily: "'Inter', sans-serif" }}>
              {totalImages}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Box sx={{ p: 2, border: "1px solid #f1f5f9", borderRadius: "8px", bgcolor: "#f9fafb" }}>
            <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, textTransform: "uppercase", fontSize: "0.675rem", letterSpacing: "0.5px", fontFamily: "'Inter', sans-serif" }}>
              Estimated Status
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.75 }}>
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: "50%", 
                  bgcolor: estimatedStatus.startsWith("Active") ? "#10b981" : "#94a3b8" 
                }} 
              />
              <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem", fontFamily: "'Inter', sans-serif" }}>
                {estimatedStatus}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ProductSummary;
