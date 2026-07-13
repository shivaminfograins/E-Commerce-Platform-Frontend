import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, InputAdornment, Alert, Snackbar, CircularProgress, Paper } from "@mui/material";
import CategoryTable from "../../components/Categories/CategoryTable";
import CategoryModal from "../../components/Categories/CategoryModal";
import DeleteDialog from "../../components/Categories/DeleteDialog";
import categoryService from "../../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modals & Action States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Toast Notification State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (category) => {
    setSelectedCategory(category);
    setDeleteOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedCategory) {
        // Edit Mode
        const updated = await categoryService.updateCategory(selectedCategory.id, formData);
        setCategories((prev) => prev.map((c) => (c.id === selectedCategory.id ? updated : c)));
        showToast("Category updated successfully!");
      } else {
        // Add Mode
        const created = await categoryService.createCategory(formData);
        setCategories((prev) => [...prev, created]);
        showToast("Category added successfully!");
      }
      setModalOpen(false);
    } catch (err) {
      showToast("Operation failed. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    setActionLoading(true);
    try {
      await categoryService.deleteCategory(selectedCategory.id);
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id));
      showToast("Category deleted successfully!");
      setDeleteOpen(false);
    } catch (err) {
      showToast("Failed to delete category.", "error");
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

  // Filter Categories locally based on Search
  const filteredCategories = categories.filter((category) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      category.name.toLowerCase().includes(query) ||
      (category.description && category.description.toLowerCase().includes(query)) ||
      category.id.toString().includes(query)
    );
  });

  return (
    <Box>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Category Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create, update, search, and delete your shop product categories.
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
          Add Category
        </Button>
      </Box>

      {/* Toolbar / Search Query */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search categories by name, ID or description..."
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

      {/* Main Content Area */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>
      ) : filteredCategories.length === 0 ? (
        // Empty State
        <Paper sx={{ textAlign: "center", py: 8, px: 2, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
            📂
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            No Categories Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchQuery ? "Try refining your search keyword." : "Get started by adding your first product category."}
          </Typography>
          {!searchQuery && (
            <Button variant="outlined" color="primary" onClick={handleOpenAddModal}>
              Create Category
            </Button>
          )}
        </Paper>
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

      {/* CRUD Modals & Dialogs */}
      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialValues={selectedCategory}
        loading={actionLoading}
      />

      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedCategory?.name || ""}
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

export default Categories;
