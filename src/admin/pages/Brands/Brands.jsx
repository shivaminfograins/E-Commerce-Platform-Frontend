import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, InputAdornment, Alert, Snackbar, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import BrandTable from "../../components/Brands/BrandTable";
import BrandForm from "../../components/Brands/BrandForm";
import DeleteDialog from "../../components/Categories/DeleteDialog";
import brandService from "../../services/brandService";

function Brands() {
  const [brands, setBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals & Action States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await brandService.getBrands();
      setBrands(data);
    } catch {
      setError("Failed to load brands. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedBrand(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (brand) => {
    setSelectedBrand(brand);
    setModalOpen(true);
  };

  const handleOpenDeleteDialog = (brand) => {
    setSelectedBrand(brand);
    setDeleteOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedBrand) {
        // Edit Mode
        const updated = await brandService.updateBrand(selectedBrand.id, formData);
        setBrands((prev) => prev.map((b) => (b.id === selectedBrand.id ? updated : b)));
        showToast("Brand updated successfully!");
      } else {
        // Add Mode
        const created = await brandService.createBrand(formData);
        setBrands((prev) => [...prev, created]);
        showToast("Brand added successfully!");
      }
      setModalOpen(false);
    } catch {
      showToast("Operation failed. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBrand) return;
    setActionLoading(true);
    try {
      await brandService.deleteBrand(selectedBrand.id);
      setBrands((prev) => prev.filter((b) => b.id !== selectedBrand.id));
      showToast("Brand deleted successfully!");
      setDeleteOpen(false);
    } catch {
      showToast("Failed to delete brand.", "error");
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

  // Filter local state based on Search
  const filteredBrands = brands.filter((brand) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      brand.name.toLowerCase().includes(query) ||
      (brand.description || "").toLowerCase().includes(query) ||
      brand.id.toString().includes(query)
    );
  });

  return (
    <Box>
      {/* Header Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Brand Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configure and maintain partner brand accounts, slugs, logos, and status indicators.
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
          Add Brand
        </Button>
      </Box>

      {/* Search Toolbar */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, alignItems: "center" }}>
        <TextField
          placeholder="Search by brand name, description or ID..."
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
      ) : filteredBrands.length === 0 ? (
        <Paper sx={{ textAlign: "center", py: 8, px: 2, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
            🏷️
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            No Brands Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
            {searchQuery ? "Try refining your search keyword." : "Get started by adding your first product brand partner."}
          </Typography>
          {!searchQuery && (
            <Button variant="outlined" color="primary" onClick={handleOpenAddModal}>
              Create Brand
            </Button>
          )}
        </Paper>
      ) : (
        <BrandTable
          brands={filteredBrands}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

      {/* Dialog Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
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
          <span>{selectedBrand ? "Edit Brand Details" : "Add Brand"}</span>
          <IconButton onClick={() => setModalOpen(false)} size="small" sx={{ color: "#64748b" }}>
            ✕
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <BrandForm
              key={selectedBrand ? selectedBrand.id : "new-brand-form"}
              initialValues={selectedBrand}
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
        itemName={selectedBrand?.name || ""}
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

export default Brands;
