import React from "react";
import { Dialog, DialogTitle, DialogContent, Box, IconButton } from "@mui/material";
import ProductForm from "./ProductForm";

function ProductModal({ open, onClose, onSubmit, initialValues, categories = [], loading }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          borderRadius: "20px",
          padding: "8px"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>{initialValues ? "Edit Product" : "Add New Product"}</span>
        <IconButton onClick={onClose} size="small" sx={{ color: "#64748b" }}>
          ✕
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <ProductForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            onCancel={onClose}
            categories={categories}
            loading={loading}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ProductModal;
