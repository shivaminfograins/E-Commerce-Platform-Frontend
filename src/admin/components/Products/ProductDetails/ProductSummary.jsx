import React from "react";
import { Grid, Typography, Paper, Box } from "@mui/material";

function ProductSummary({ variants = [] }) {
  const totalVariants = variants.length;
  const activeVariants = variants.filter(v => (v.status || "Active") === "Active").length;
  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
  
  // Calculate price range
  let priceRange = "N/A";
  if (variants.length > 0) {
    const prices = variants.map(v => parseFloat(v.price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      priceRange = `$${minPrice.toFixed(2)}`;
    } else {
      priceRange = `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
    }
  }

  // Calculate total images
  const totalImages = variants.reduce((sum, v) => sum + (v.images || []).length, 0);

  const stats = [
    { label: "Total Variants", value: totalVariants, color: "#4f46e5", bg: "rgba(79, 70, 229, 0.04)" },
    { label: "Active Variants", value: activeVariants, color: "#10b981", bg: "rgba(16, 185, 129, 0.04)" },
    { label: "Total Inventory Stock", value: `${totalStock} units`, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.04)" },
    { label: "Price Range", value: priceRange, color: "#ec4899", bg: "rgba(236, 72, 153, 0.04)" },
    { label: "Total Image Files", value: totalImages, color: "#06b6d4", bg: "rgba(6, 182, 212, 0.04)" }
  ];

  return (
    <Box sx={{ mb: 4.5 }}>
      <Typography sx={{ fontWeight: 700, color: "#1f2937", fontSize: "1.1rem", mb: 2, fontFamily: "'Inter', sans-serif" }}>
        Product Summary Metrics
      </Typography>

      <Grid container spacing={2.5}>
        {stats.map((stat, idx) => (
          <Grid item key={idx} xs={12} sm={6} md={2.4}>
            <Paper
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                p: 2.5,
                bgcolor: "#ffffff",
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                gap: 0.5
              }}
            >
              <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, textTransform: "uppercase", fontSize: "0.675rem", letterSpacing: "0.5px", fontFamily: "'Inter', sans-serif" }}>
                {stat.label}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: 0.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color, fontFamily: "'Inter', sans-serif" }}>
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductSummary;
