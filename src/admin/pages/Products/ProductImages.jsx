import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, InputAdornment, Alert, Snackbar, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import ProductImageTable from "../../components/Products/ProductImageTable";
import ProductImageForm from "../../components/Products/ProductImageForm";
import DeleteDialog from "../../components/Categories/DeleteDialog";
import productService from "../../services/productService";

function ProductImages() {
  const [productImages, setProductImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals & Action States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [imagesData, productsData] = await Promise.all([
        productService.getProductImages(),
        productService.getProducts()
      ]);
      setProductImages(imagesData);
      setProducts(productsData);
    } catch (err) {
      console.error("Failed to load product image details:", err);
      setError("Failed to load product images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedImage(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (row) => {
    setSelectedImage(row);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (row) => {
    setSelectedImage(row);
    setDeleteOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedImage) {
        // Edit Mode
        const updated = await productService.updateProductImage(selectedImage.id, formData);
        setProductImages((prev) => prev.map((img) => (img.id === selectedImage.id ? updated : img)));
        showToast("Product image updated successfully!");
      } else {
        // Add Mode
        const created = await productService.createProductImage(formData);
        setProductImages((prev) => [...prev, created]);
        showToast("Product image uploaded successfully!");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Operation failed:", err);
      showToast("Operation failed. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedImage) return;
    setActionLoading(true);
    try {
      await productService.deleteProductImage(selectedImage.id);
      setProductImages((prev) => prev.filter((img) => img.id !== selectedImage.id));
      showToast("Product image deleted successfully!");
      setDeleteOpen(false);
    } catch (err) {
      console.error("Delete product image failed:", err);
      showToast("Failed to delete product image.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const getProductName = (prodId) => {
    const prod = products.find((p) => p.id === prodId);
    return prod ? prod.name.toLowerCase() : "";
  };

  // Filter local state based on Search
  const filteredImages = productImages.filter((row) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const prodName = getProductName(row.product);
    const altText = (row.alt_text || "").toLowerCase();

    return (
      prodName.includes(query) ||
      altText.includes(query) ||
      row.id.toString().includes(query)
    );
  });

  return (
    <Box>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Product Image Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload, update, search, and manage showcase images for your products.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddModal}
          startIcon={<span>+</span>}
          sx={{
            py: 1.2,
            px: 2.5,
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
            fontWeight: 700
          }}
        >
          Add Product Image
        </Button>
      </Box>

      {/* Search Toolbar */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search by product, alt text, or ID..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: 400 }, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: "#64748b" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Main Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>
      ) : filteredImages.length === 0 ? (
        <Paper sx={{ textAlign: "center", py: 8, px: 2, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
            🖼️
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            No Product Images Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchQuery ? "Try refining your search keyword." : "Get started by uploading your first product image showcase."}
          </Typography>
          {!searchQuery && (
            <Button variant="outlined" color="primary" onClick={handleOpenAddModal}>
              Upload Product Image
            </Button>
          )}
        </Paper>
      ) : (
        <ProductImageTable
          productImages={filteredImages}
          products={products}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

      {/* Dialog Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
          <span>{selectedImage ? "Edit Product Image" : "Add Product Image"}</span>
          <IconButton onClick={() => setModalOpen(false)} size="small" sx={{ color: "#64748b" }}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ProductImageForm
              key={selectedImage ? selectedImage.id : "new-image-form"}
              initialValues={selectedImage}
              products={products}
              onSubmit={handleModalSubmit}
              onCancel={() => setModalOpen(false)}
              loading={actionLoading}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedImage ? `Product Image (ID: ${selectedImage.id})` : ""}
        loading={actionLoading}
      />

      {/* Snackbar Toasts */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: "100%", borderRadius: "10px" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductImages;
