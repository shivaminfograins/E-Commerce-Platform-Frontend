import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, InputAdornment, Alert, Snackbar, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CategoryImageTable from "../../components/Categories/CategoryImageTable";
import CategoryImageForm from "../../components/Categories/CategoryImageForm";
import DeleteDialog from "../../components/Categories/DeleteDialog";
import categoryService from "../../services/categoryService";

function CategoryImages() {
  const [categoryImages, setCategoryImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals & Actions States
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
      const [imagesData, categoriesData] = await Promise.all([
        categoryService.getCategoryImages(),
        categoryService.getCategories()
      ]);
      setCategoryImages(imagesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to load category image data:", err);
      setError("Failed to load category images. Please try again.");
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
        const updated = await categoryService.updateCategoryImage(selectedImage.id, formData);
        setCategoryImages((prev) => prev.map((img) => (img.id === selectedImage.id ? updated : img)));
        showToast("Category image updated successfully!");
      } else {
        // Add Mode
        const created = await categoryService.createCategoryImage(formData);
        setCategoryImages((prev) => [...prev, created]);
        showToast("Category image added successfully!");
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
      await categoryService.deleteCategoryImage(selectedImage.id);
      setCategoryImages((prev) => prev.filter((img) => img.id !== selectedImage.id));
      showToast("Category image deleted successfully!");
      setDeleteOpen(false);
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete category image.", "error");
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

  // Helper to map category ID to name
  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    return cat ? cat.name.toLowerCase() : "";
  };

  // Filter Category Images locally based on Search
  const filteredImages = categoryImages.filter((row) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    const catName = getCategoryName(row.category);
    const altText = (row.alt_text || "").toLowerCase();
    
    return (
      catName.includes(query) ||
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
            Category Image Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload, update, search, and manage showcase images for your product categories.
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
          Add Category Image
        </Button>
      </Box>

      {/* Toolbar / Search Query */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search by category name, alt text or image ID..."
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
      ) : filteredImages.length === 0 ? (
        <Paper sx={{ textAlign: "center", py: 8, px: 2, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
            🖼️
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            No Category Images Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchQuery ? "Try refining your search keyword." : "Get started by adding your first category image showcase."}
          </Typography>
          {!searchQuery && (
            <Button variant="outlined" color="primary" onClick={handleOpenAddModal}>
              Upload Category Image
            </Button>
          )}
        </Paper>
      ) : (
        <CategoryImageTable
          categoryImages={filteredImages}
          categories={categories}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

      {/* Add / Edit Dialog Modal */}
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
          <span>{selectedImage ? "Edit Category Image" : "Add Category Image"}</span>
          <IconButton onClick={() => setModalOpen(false)} size="small" sx={{ color: "#64748b" }}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <CategoryImageForm
              key={selectedImage ? selectedImage.id : "new-image-form"}
              initialValues={selectedImage}
              categories={categories}
              onSubmit={handleModalSubmit}
              onCancel={() => setModalOpen(false)}
              loading={actionLoading}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={selectedImage ? `Category Image (ID: ${selectedImage.id})` : ""}
        loading={actionLoading}
      />

      {/* Toast Notification */}
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

export default CategoryImages;
