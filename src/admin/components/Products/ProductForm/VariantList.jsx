import React, { useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import VariantCard from "./VariantCard";

function VariantList({ variants = [], onChange, errors = {}, loading }) {
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, index: null, variantId: null });

  const handleAddVariant = () => {
    const newVariant = {
      id: `temp_var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: "",
      sku: "",
      price: "",
      stock: 0,
      status: "Active",
      images: []
    };
    onChange([...variants, newVariant]);
  };

  const handleUpdateVariant = (index) => (updatedVal) => {
    const updated = [...variants];
    updated[index] = updatedVal;
    onChange(updated);
  };

  const handleDuplicateVariant = (index) => () => {
    const source = variants[index];
    const duplicated = {
      ...source,
      id: `temp_var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sku: source.sku ? `${source.sku}-DUP` : "",
      images: source.images.map((img, idx) => ({
        ...img,
        id: `temp_img_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 9)}`,
        // copy file or image URL
        file: img.file || null,
        url: img.url || img.image || null
      }))
    };
    const updated = [...variants];
    updated.splice(index + 1, 0, duplicated);
    onChange(updated);
  };

  const handleDeleteTrigger = (index, variantId) => () => {
    setDeleteConfirm({ open: true, index, variantId });
  };

  const handleDeleteConfirm = () => {
    const { index, variantId } = deleteConfirm;
    let updated = variants.filter((_, idx) => idx !== index);

    // If it's a backend variant, track the deletion so we can call DELETE on save
    if (typeof variantId === "number") {
      updated = variants.map((v, idx) => idx === index ? { ...v, is_deleted: true } : v);
    }

    onChange(updated);
    setDeleteConfirm({ open: false, index: null, variantId: null });
  };

  const activeVariants = variants.filter(v => !v.is_deleted);

  return (
    <Box sx={{ mb: 3.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography sx={{ fontWeight: 700, color: "#1f2937", fontSize: "1.125rem", fontFamily: "'Inter', sans-serif" }}>
          Product Variants ({activeVariants.length})
        </Typography>

        <Button
          variant="contained"
          onClick={handleAddVariant}
          disabled={loading}
          sx={{
            textTransform: "none",
            bgcolor: "#4f46e5",
            color: "#ffffff",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.825rem",
            px: 2.5,
            py: 0.8,
            boxShadow: "none",
            fontFamily: "'Inter', sans-serif",
            "&:hover": { bgcolor: "#4338ca", boxShadow: "none" }
          }}
        >
          + Add Variant
        </Button>
      </Box>

      {activeVariants.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
            px: 2,
            border: "1.5px dashed #cbd5e1",
            borderRadius: "12px",
            bgcolor: "#f9fafb"
          }}
        >
          <Typography sx={{ color: "#4b5563", fontWeight: 600, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
            No variants created yet
          </Typography>
          <Typography sx={{ color: "#6b7280", fontSize: "0.75rem", mt: 0.5, mb: 2, fontFamily: "'Inter', sans-serif" }}>
            Create at least one variant to enable saving the product.
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={handleAddVariant}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderColor: "#4f46e5",
              color: "#4f46e5",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              "&:hover": { bgcolor: "rgba(79, 70, 229, 0.05)", borderColor: "#4f46e5" }
            }}
          >
            Create First Variant
          </Button>
        </Box>
      ) : (
        activeVariants.map((variant, index) => {
          // find actual index in original variants array (including deleted ones)
          const originalIndex = variants.findIndex(v => v.id === variant.id);
          return (
            <VariantCard
              key={variant.id}
              variant={variant}
              index={index}
              onChange={handleUpdateVariant(originalIndex)}
              onDuplicate={handleDuplicateVariant(originalIndex)}
              onDelete={handleDeleteTrigger(originalIndex, variant.id)}
              errors={errors}
              loading={loading}
            />
          );
        })
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, index: null, variantId: null })}
        PaperProps={{
          style: { borderRadius: "12px", padding: "8px" }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.125rem", fontFamily: "'Inter', sans-serif" }}>
          Delete Product Variant?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#4b5563", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
            Are you sure you want to delete this variant? This action will remove all associated variant data and images.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteConfirm({ open: false, index: null, variantId: null })}
            variant="outlined"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#d1d5db",
              color: "#374151",
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" }
            }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default VariantList;
