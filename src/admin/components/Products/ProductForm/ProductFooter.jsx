import React from "react";
import { Box, Button } from "@mui/material";

function ProductFooter({ onSaveDraft, onPublish, onCancel, loading }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #e5e7eb",
        pt: 3.5,
        mt: 4,
        pb: 4
      }}
    >
      <Button
        variant="outlined"
        color="inherit"
        onClick={onCancel}
        disabled={loading}
        sx={{
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          px: 3.5,
          py: 1.2,
          borderColor: "#d1d5db",
          color: "#374151",
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.875rem",
          "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" }
        }}
      >
        Cancel
      </Button>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onSaveDraft}
          disabled={loading}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 3.5,
            py: 1.2,
            borderColor: "#4f46e5",
            color: "#4f46e5",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
            "&:hover": { bgcolor: "rgba(79, 70, 229, 0.05)", borderColor: "#4f46e5" }
          }}
        >
          Save Draft
        </Button>
        
        <Button
          variant="contained"
          onClick={onPublish}
          disabled={loading}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            py: 1.2,
            bgcolor: "#4f46e5",
            color: "#ffffff",
            boxShadow: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.875rem",
            "&:hover": {
              bgcolor: "#4338ca",
              boxShadow: "none"
            }
          }}
        >
          {loading ? "Saving Product..." : "+ Publish Product"}
        </Button>
      </Box>
    </Box>
  );
}

export default ProductFooter;
