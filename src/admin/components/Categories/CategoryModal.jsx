import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, IconButton } from "@mui/material";
import CategoryForm from "./CategoryForm";

function CategoryModal({ open, onClose, onSubmit, initialValues, loading }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          borderRadius: "20px",
          padding: "8px"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{initialValues ? "Edit Category" : "Add New Category"}</span>
        <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
          ✕
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <CategoryForm
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
