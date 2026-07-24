import React from "react";
import { Box, Typography, Button, Chip } from "@mui/material";

function ProductHeader({ product = {}, onEdit, onDuplicate, onArchive, onDelete, loading }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  };

  const isActive = product.is_active !== false;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2.5,
        pb: 3,
        mb: 4,
        borderBottom: "1px solid #e5e7eb"
      }}
    >
      {/* Title & Metadata */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", fontFamily: "'Inter', sans-serif" }}>
            {product.name}
          </Typography>
          <Chip
            label={isActive ? "Active" : "Archived"}
            color={isActive ? "success" : "default"}
            size="small"
            sx={{ fontWeight: 700, fontSize: "0.7rem", fontFamily: "'Inter', sans-serif" }}
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", mb: 0.5 }}>
          Category: <span style={{ fontWeight: 600, color: "#4f46e5" }}>{product.category_name || `Category (ID: ${product.category})`}</span>
          {product.brand_name && (
            <>
              {" "}• Brand: <span style={{ fontWeight: 600, color: "#4f46e5" }}>{product.brand_name}</span>
            </>
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontFamily: "'Inter', sans-serif", fontSize: "0.75rem" }}>
          Created: <span style={{ color: "#374151", fontWeight: 500 }}>{formatDate(product.created_at)}</span> • Last Updated: <span style={{ color: "#374151", fontWeight: 500 }}>{formatDate(product.updated_at)}</span>
        </Typography>
      </Box>

      {/* Action Buttons Toolbar */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          onClick={onArchive}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#d1d5db",
            color: "#374151",
            fontWeight: 600,
            fontSize: "0.825rem",
            px: 2.5,
            py: 1,
            fontFamily: "'Inter', sans-serif",
            "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" }
          }}
        >
          {isActive ? "Archive Product" : "Activate Product"}
        </Button>

        <Button
          variant="outlined"
          onClick={onDuplicate}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            borderColor: "#d1d5db",
            color: "#374151",
            fontWeight: 600,
            fontSize: "0.825rem",
            px: 2.5,
            py: 1,
            fontFamily: "'Inter', sans-serif",
            "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" }
          }}
        >
          Duplicate
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={onDelete}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.825rem",
            px: 2.5,
            py: 1,
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          onClick={onEdit}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            bgcolor: "#4f46e5",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.825rem",
            px: 3,
            py: 1,
            boxShadow: "none",
            fontFamily: "'Inter', sans-serif",
            "&:hover": { bgcolor: "#4338ca", boxShadow: "none" }
          }}
        >
          Edit Product
        </Button>
      </Box>
    </Box>
  );
}

export default ProductHeader;
