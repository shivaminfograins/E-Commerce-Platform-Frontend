import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, IconButton } from "@mui/material";
import CategoryForm from "./CategoryForm";

function CategoryModal({ open, onClose, onSubmit, initialValues, loading }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          borderRadius: "16px",
          padding: "16px",
          backgroundColor: "#ffffff"
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2.5, px: 3, pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#4f46e5",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 10px rgba(79, 70, 229, 0.15)"
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", fontFamily: "'Inter', sans-serif" }}>
              {initialValues ? "Edit Category" : "Add New Category"}
            </span>
            <span style={{ fontSize: "0.875rem", color: "#6b7280", fontFamily: "'Inter', sans-serif", marginTop: "2px" }}>
              {initialValues ? "Update category details and media" : "Create a new category to organize your products"}
            </span>
          </Box>
        </Box>
        <IconButton 
          onClick={onClose} 
          size="small" 
          sx={{ 
            color: "#4b5563", 
            border: "1px solid #e5e7eb", 
            borderRadius: "8px",
            p: 1,
            "&:hover": { bgcolor: "#f3f4f6" } 
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 1 }}>
        <Box>
          <CategoryForm
            key={initialValues?.id || "new"}
            initialValues={initialValues}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryModal;
