import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, InputAdornment, Alert, Snackbar, CircularProgress, MenuItem, Paper, Drawer, IconButton } from "@mui/material";
import ProductTable from "../../components/Products/ProductTable";
import DeleteDialog from "../../components/Products/DeleteDialog";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import brandService from "../../services/brandService";
import ProductFormContainer from "./ProductFormContainer";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // CRUD States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [prodData, catData, brandData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
        brandService.getBrands()
      ]);
      setProducts(prodData);
      setCategories(catData.filter(c => c.status === "Active"));
      setBrands(brandData.filter(b => b.status === "Active"));
    } catch {
      setError("Failed to fetch product data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    navigate("/admin/products/create");
  };

  const handleOpenEditModal = (product) => {
    navigate(`/admin/products/${product.id}/edit`);
  };

  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    setActionLoading(true);
    try {
      await productService.deleteProduct(selectedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      showToast("Product deleted successfully!");
      setDeleteOpen(false);
    } catch {
      showToast("Failed to delete product.", "error");
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

  // Filter products based on search, category & brand selection
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategoryFilter === "All" || product.categoryId === Number(selectedCategoryFilter);

    const matchesBrand =
      selectedBrandFilter === "All" || product.brand === Number(selectedBrandFilter);

    const brandObj = brands.find((b) => b.id === product.brand);
    const brandName = brandObj ? brandObj.name : "";

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      brandName.toLowerCase().includes(query) ||
      product.id.toString().includes(query);

    return matchesCategory && matchesBrand && matchesSearch;
  });

  return (
    <Box>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Product Listings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configure and maintain items, listings, pricing variations, and stock values.
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
          Add Product
        </Button>
      </Box>

      {/* Toolbar - Filters and Search */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search products by name, brand or ID..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: 350 }, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: "#64748b" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </InputAdornment>
            )
          }}
        />

        <TextField
          select
          size="small"
          label="Category Filter"
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          sx={{ minWidth: 180, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
        >
          <MenuItem value="All">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          size="small"
          label="Brand Filter"
          value={selectedBrandFilter}
          onChange={(e) => setSelectedBrandFilter(e.target.value)}
          sx={{ minWidth: 180, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
        >
          <MenuItem value="All">All Brands</MenuItem>
          {brands.map((b) => (
            <MenuItem key={b.id} value={b.id}>
              {b.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Content Area */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>
      ) : filteredProducts.length === 0 ? (
        <Paper sx={{ textAlign: "center", py: 8, px: 2, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
            📦
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            No Products Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            Try refining your keyword query or category selection filter.
          </Typography>
        </Paper>
      ) : (
        <ProductTable
          products={filteredProducts}
          categories={categories}
          brands={brands}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}



      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedProduct?.name || ""}
        loading={actionLoading}
      />

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

export default Products;
