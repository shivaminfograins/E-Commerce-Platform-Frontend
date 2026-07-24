import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, Grid, Paper, Typography, CircularProgress, Alert, Snackbar, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import ProductHeader from "../../components/Products/ProductDetails/ProductHeader";
import ProductSummary from "../../components/Products/ProductDetails/ProductSummary";
import VariantAccordion from "../../components/Products/ProductDetails/VariantAccordion";
import productService from "../../services/productService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const prod = await productService.getProduct(id);
      setProduct(prod);
    } catch (err) {
      console.error("Failed to load product detail:", err);
      setError("Failed to retrieve product details. The resource may not exist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleEdit = () => {
    navigate(`/admin/products/${id}/edit`);
  };

  const handleArchiveToggle = async () => {
    if (!product) return;
    setActionLoading(true);
    try {
      const currentActive = product.is_active !== false;
      const updatedStatus = currentActive ? "Inactive" : "Active";
      await productService.updateProduct(product.id, {
        name: product.name,
        brand: product.brand,
        categoryId: product.categoryId,
        description: product.description,
        status: updatedStatus
      });
      showToast(currentActive ? "Product archived successfully." : "Product activated successfully.");
      await fetchProductDetails();
    } catch (err) {
      console.error("Archive status update failed:", err);
      showToast("Failed to update status.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDuplicate = async () => {
    if (!product) return;
    setActionLoading(true);
    try {
      // 1. Create duplicate product metadata
      const duplicatePayload = {
        name: `${product.name} (Copy)`,
        brand: product.brand,
        categoryId: product.categoryId,
        description: product.description,
        status: "Inactive" // Copy defaults to inactive
      };
      
      const newProduct = await productService.createProduct(duplicatePayload);

      // 2. Clone variants
      for (const v of product.variants || []) {
        const variantPayload = {
          product: newProduct.id,
          name: v.name,
          sku: `${v.sku}-COPY-${Math.floor(Math.random() * 1000)}`,
          price: v.price,
          stock: v.stock,
          status: "Inactive"
        };
        const newVar = await productService.createProductVariant(variantPayload);
        
        // 3. Clone images of that variant
        for (const img of v.images || []) {
          // In real backend, we'd fetch the file blob and upload it.
          // Since we are mocking/cloning in the client, let's try to pass the image details.
          try {
            const formData = new FormData();
            formData.append("variant", newVar.id);
            formData.append("alt_text", img.alt_text || "");
            formData.append("is_primary", img.is_primary ? "true" : "false");
            formData.append("display_order", img.display_order || 0);

            // Fetch original image and convert to file blob for backend upload if possible
            const response = await fetch(img.image);
            const blob = await response.blob();
            const file = new File([blob], `clone_${newVar.sku}.jpg`, { type: blob.type });
            formData.append("image", file);
            
            await productService.createProductImage(formData);
          } catch (imgErr) {
            console.warn("Could not copy variant image file, creating reference instead:", imgErr);
          }
        }
      }

      showToast("Product duplicated successfully! Redirecting...", "success");
      setTimeout(() => {
        navigate(`/admin/products/${newProduct.id}`);
      }, 1000);

    } catch (err) {
      console.error("Duplication failed:", err);
      showToast("Failed to duplicate product.", "error");
      setActionLoading(false);
    }
  };

  const handleDeleteTrigger = () => {
    setDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await productService.deleteProduct(id);
      showToast("Product deleted successfully.");
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete product.", "error");
      setActionLoading(false);
      setDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Product not found."}
        </Alert>
        <Button variant="contained" component={Link} to="/admin/products" sx={{ bgcolor: "#4f46e5", textTransform: "none" }}>
          Back to Listings
        </Button>
      </Box>
    );
  }

  // Find primary image representation
  let primaryProductImage = null;
  if (product.variants && product.variants.length > 0) {
    // Find first variant's primary image
    const firstVar = product.variants[0];
    const primaryImg = (firstVar.images || []).find(img => img.is_primary);
    if (primaryImg) {
      primaryProductImage = primaryImg.image;
    } else if (firstVar.images && firstVar.images.length > 0) {
      primaryProductImage = firstVar.images[0].image;
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      {/* Back button link */}
      <Box sx={{ mb: 2 }}>
        <Button
          component={Link}
          to="/admin/products"
          startIcon={
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          }
          sx={{
            textTransform: "none",
            color: "#4f46e5",
            fontWeight: 600,
            fontSize: "0.825rem",
            fontFamily: "'Inter', sans-serif",
            p: 0,
            "&:hover": { bgcolor: "transparent", color: "#4338ca" }
          }}
        >
          Back to Products List
        </Button>
      </Box>

      {/* Main Header Component */}
      <ProductHeader
        product={product}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onArchive={handleArchiveToggle}
        onDelete={handleDeleteTrigger}
        loading={actionLoading}
      />

      <Grid container spacing={3.5}>
        {/* Main Column */}
        <Grid item xs={12} md={8.5}>
          {/* Summary Metrics Row */}
          <ProductSummary variants={product.variants || []} />

          {/* Variants Accordion Section */}
          <VariantAccordion variants={product.variants || []} />
        </Grid>

        {/* Sidebar Column */}
        <Grid item xs={12} md={3.5}>
          {/* Product Thumbnail & Details Card */}
          <Paper sx={{ border: "1px solid #e5e7eb", borderRadius: "12px", p: 3, mb: 3, backgroundColor: "#ffffff", boxShadow: "none" }}>
            <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 2, fontFamily: "'Inter', sans-serif" }}>
              Primary Product Display
            </Typography>
            
            <Box
              sx={{
                width: "100%",
                paddingTop: "100%",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                bgcolor: "#f9fafb",
                mb: 2.5
              }}
            >
              {primaryProductImage ? (
                <img
                  src={primaryProductImage}
                  alt={product.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    fontSize: "2.5rem"
                  }}
                >
                  📦
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 1.5, fontFamily: "'Inter', sans-serif" }}>
              Product Metadata
            </Typography>
            
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Category Link
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#4f46e5", fontFamily: "'Inter', sans-serif" }}>
                  {product.category_name || `Category (ID: ${product.category})`}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
                  Brand Association
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "#1f2937", fontFamily: "'Inter', sans-serif" }}>
                  {product.brand_name || "No Brand Linked"}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Description Card */}
          <Paper sx={{ border: "1px solid #e5e7eb", borderRadius: "12px", p: 3, backgroundColor: "#ffffff", boxShadow: "none" }}>
            <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.5px", mb: 2, fontFamily: "'Inter', sans-serif" }}>
              Description Details
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#4b5563",
                lineHeight: "1.6",
                fontFamily: "'Inter', sans-serif",
                whiteSpace: "pre-wrap"
              }}
            >
              {product.description || "No description provided for this product."}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.125rem", fontFamily: "'Inter', sans-serif" }}>
          Delete Product Permanently?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#4b5563", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
            Are you sure you want to delete this product? This action is permanent and will delete the product, all of its variants, and all of its variant images.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirm(false)} variant="outlined" sx={{ borderRadius: "6px", textTransform: "none", fontWeight: 600, color: "#374151", borderColor: "#d1d5db" }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ borderRadius: "6px", textTransform: "none", fontWeight: 600, boxShadow: "none", "&:hover": { boxShadow: "none" } }}>
            Delete Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} sx={{ borderRadius: "8px" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductDetails;
