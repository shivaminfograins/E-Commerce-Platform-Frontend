import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Grid, Chip } from "@mui/material";
import VariantGallery from "./VariantGallery";

function VariantAccordion({ variants = [] }) {
  const [expandedIndex, setExpandedIndex] = useState(0); // Open first variant by default

  const handleAccordionChange = (index) => (event, isExpanded) => {
    setExpandedIndex(isExpanded ? index : null);
  };

  if (variants.length === 0) {
    return (
      <Box sx={{ border: "1px solid #e5e7eb", borderRadius: "12px", p: 4, textAlign: "center", bgcolor: "#f9fafb" }}>
        <Typography sx={{ fontWeight: 600, color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>
          No variants defined for this product.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontWeight: 700, color: "#1f2937", fontSize: "1.1rem", mb: 2, fontFamily: "'Inter', sans-serif" }}>
        Variants Accordion ({variants.length})
      </Typography>

      {variants.map((v, index) => {
        const isExpanded = expandedIndex === index;
        
        return (
          <Accordion
            key={v.id || index}
            expanded={isExpanded}
            onChange={handleAccordionChange(index)}
            disableGutters
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              mb: 1.5,
              overflow: "hidden",
              "&:before": { display: "none" },
              "&:first-of-type": { borderTopLeftRadius: "12px", borderTopRightRadius: "12px" },
              "&:last-of-type": { borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }
            }}
          >
            {/* Accordion Summary */}
            <AccordionSummary
              sx={{
                bgcolor: isExpanded ? "rgba(79, 70, 229, 0.02)" : "#ffffff",
                borderBottom: isExpanded ? "1px solid #e5e7eb" : "none",
                py: 0.5,
                px: 3,
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }
              }}
              expandIcon={
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9" /></svg>
              }
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box 
                  sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: "50%", 
                    bgcolor: isExpanded ? "#4f46e5" : "#f1f5f9", 
                    color: isExpanded ? "white" : "#4b5563",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {index + 1}
                </Box>
                <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem", fontFamily: "'Inter', sans-serif" }}>
                  {v.name || `Variant #${index + 1}`}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mr: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#6b7280", fontFamily: "'Inter', sans-serif" }}>
                  SKU: {v.sku || "N/A"}
                </Typography>
                <Chip
                  label={v.status || "Active"}
                  size="small"
                  sx={{
                    bgcolor: (v.status || "Active") === "Active" ? "#ecfdf5" : "#f1f5f9",
                    color: (v.status || "Active") === "Active" ? "#10b981" : "#6b7280",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    fontFamily: "'Inter', sans-serif"
                  }}
                />
              </Box>
            </AccordionSummary>

            {/* Accordion Details */}
            <AccordionDetails sx={{ p: 3, bgcolor: "#ffffff" }}>
              <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", fontSize: "0.675rem", fontFamily: "'Inter', sans-serif" }}>
                      SKU Code
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: "#111827", mt: 0.25, fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>
                      {v.sku}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", fontSize: "0.675rem", fontFamily: "'Inter', sans-serif" }}>
                      Price (USD)
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: "#4f46e5", mt: 0.25, fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>
                      ${v.price}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", fontSize: "0.675rem", fontFamily: "'Inter', sans-serif" }}>
                      Inventory Stock
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: v.stock > 0 ? "#111827" : "#ef4444", mt: 0.25, fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>
                      {v.stock} units
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", fontSize: "0.675rem", fontFamily: "'Inter', sans-serif" }}>
                      Publish Status
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: (v.status || "Active") === "Active" ? "#10b981" : "#94a3b8" }} />
                      <Typography sx={{ fontWeight: 600, color: "#111827", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>
                        {v.status || "Active"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Nested Image Gallery for Variant */}
              <VariantGallery images={v.images || []} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

export default VariantAccordion;
