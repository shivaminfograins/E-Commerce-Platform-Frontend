import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, InputAdornment, Alert, Snackbar, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import ProductVariantTable from "../../components/Products/ProductVariantTable";
import ProductVariantForm from "../../components/Products/ProductVariantForm";
import DeleteDialog from "../../components/Categories/DeleteDialog";
import productService from "../../services/productService";

function ProductVariants() {
  const [productVariants, setProductVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals & Action States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [variantsData, productsData] = await Promise.all([
        productService.getProductVariants(),
        productService.getProducts()
      ]);
      setProductVariants(variantsData);
      setProducts(productsData);
    } catch (err) {
      console.error("Failed to load variant details:", err);
      setError("Failed to load product variants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedVariant(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (row) => {
    setSelectedVariant(row);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (row) => {
    setSelectedVariant(row);
    setDeleteOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedVariant) {
        // Edit Mode
        const updated = await productService.updateProductVariant(selectedVariant.id, formData);
        setProductVariants((prev) => prev.map((v) => (v.id === selectedVariant.id ? updated : v)));
        showToast("Product variant updated successfully!");
      } else {
        // Add Mode
        const created = await productService.createProductVariant(formData);
        setProductVariants((prev) => [...prev, created]);
        showToast("Product variant created successfully!");
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
    if (!selectedVariant) return;
    setActionLoading(true);
    try {
      await productService.deleteProductVariant(selectedVariant.id);
      setProductVariants((prev) => prev.filter((v) => v.id !== selectedVariant.id));
      showToast("Product variant deleted successfully!");
      setDeleteOpen(false);
    } catch (err) {
      console.error("Delete variant failed:", err);
      showToast("Failed to delete product variant.", "error");
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
  const filteredVariants = productVariants.filter((row) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const prodName = getProductName(row.product);
    const varName = (row.name || "").toLowerCase();
    const skuCode = (row.sku || "").toLowerCase();

    return (
      prodName.includes(query) ||
      varName.includes(query) ||
      skuCode.includes(query) ||
      row.id.toString().includes(query)
    );
  });

  return (
    <Box>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Product Variant Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configure specific SKU codes, stock levels, and prices for your products.
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
          Add Product Variant
        </Button>
      </Box>

      {/* Search Toolbar */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search by product, variant name, SKU, or ID..."
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
      ) : filteredVariants.length === 0 ? (
        <Paper sx={{ textAlign: "center", py: 8, px: 2, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
            ⚙️
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            No Variants Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchQuery ? "Try refining your search keyword." : "Get started by adding your first product variant."}
          </Typography>
          {!searchQuery && (
            <Button variant="outlined" color="primary" onClick={handleOpenAddModal}>
              Create Variant
            </Button>
          )}
        </Paper>
      ) : (
        <ProductVariantTable
          productVariants={filteredVariants}
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
          <span>{selectedVariant ? "Edit Product Variant" : "Add Product Variant"}</span>
          <IconButton onClick={() => setModalOpen(false)} size="small" sx={{ color: "#64748b" }}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <ProductVariantForm
              key={selectedVariant ? selectedVariant.id : "new-variant-form"}
              initialValues={selectedVariant}
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
        itemName={selectedVariant ? `${selectedVariant.name} (${selectedVariant.sku})` : ""}
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

export default ProductVariants;
