import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Switch,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import couponService from "../../../services/couponService";

const DeleteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // All, Active, Inactive
  const [expiredFilter, setExpiredFilter] = useState("All"); // All, Expired, Active (non-expired)

  // Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_purchase_amount: "0.00",
    max_discount_amount: "",
    start_date: "",
    end_date: "",
    is_active: true,
    usage_limit: "",
    per_user_limit: "1",
  });

  // Toast
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await couponService.getCoupons();
      setCoupons(response.data.results || response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleToggleStatus = async (coupon) => {
    try {
      await couponService.toggleCouponStatus(coupon.id);
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c))
      );
      showToast(`Coupon status updated successfully.`);
    } catch {
      showToast("Failed to toggle coupon status.", "error");
    }
  };

  const handleOpenAddForm = () => {
    setSelectedCoupon(null);
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      min_purchase_amount: "0.00",
      max_discount_amount: "",
      start_date: new Date().toISOString().substring(0, 16),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16),
      is_active: true,
      usage_limit: "",
      per_user_limit: "1",
    });
    setFormOpen(true);
  };

  const handleOpenEditForm = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_purchase_amount: coupon.min_purchase_amount,
      max_discount_amount: coupon.max_discount_amount || "",
      start_date: coupon.start_date ? coupon.start_date.substring(0, 16) : "",
      end_date: coupon.end_date ? coupon.end_date.substring(0, 16) : "",
      is_active: coupon.is_active,
      usage_limit: coupon.usage_limit || "",
      per_user_limit: coupon.per_user_limit,
    });
    setFormOpen(true);
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...formData,
      discount_value: parseFloat(formData.discount_value),
      min_purchase_amount: parseFloat(formData.min_purchase_amount),
      max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      per_user_limit: parseInt(formData.per_user_limit),
    };

    try {
      if (selectedCoupon) {
        const response = await couponService.updateCoupon(selectedCoupon.id, payload);
        setCoupons((prev) =>
          prev.map((c) => (c.id === selectedCoupon.id ? response.data : c))
        );
        showToast("Coupon updated successfully!");
      } else {
        const response = await couponService.createCoupon(payload);
        setCoupons((prev) => [response.data, ...prev]);
        showToast("Coupon created successfully!");
      }
      setFormOpen(false);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || err.response?.data?.message || "Failed to save coupon.";
      showToast(detail, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDelete = (coupon) => {
    setSelectedCoupon(coupon);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    try {
      await couponService.deleteCoupon(selectedCoupon.id);
      setCoupons((prev) => prev.filter((c) => c.id !== selectedCoupon.id));
      showToast("Coupon deleted successfully!");
      setDeleteOpen(false);
    } catch {
      showToast("Failed to delete coupon.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtering Logic
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && coupon.is_active) ||
      (statusFilter === "Inactive" && !coupon.is_active);

    const isExpired = new Date(coupon.end_date) < new Date();
    const matchesExpired =
      expiredFilter === "All" ||
      (expiredFilter === "Expired" && isExpired) ||
      (expiredFilter === "Active" && !isExpired);

    return matchesSearch && matchesStatus && matchesExpired;
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Coupon Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Create, update, and monitor coupon codes and sales discount rules.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddForm}
          sx={{
            py: 1.2,
            px: 2.5,
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
            fontWeight: 700,
          }}
        >
          + Add Coupon
        </Button>
      </Box>

      {/* Filters Toolbar */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search by code or description..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: 300, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
        />
        <TextField
          select
          label="Status"
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 150, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Active">Active Only</MenuItem>
          <MenuItem value="Inactive">Inactive Only</MenuItem>
        </TextField>

        <TextField
          select
          label="Expiry Status"
          size="small"
          value={expiredFilter}
          onChange={(e) => setExpiredFilter(e.target.value)}
          sx={{ width: 180, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
        >
          <MenuItem value="All">All Coupons</MenuItem>
          <MenuItem value="Active">Active (Non-Expired)</MenuItem>
          <MenuItem value="Expired">Expired Only</MenuItem>
        </TextField>
      </Box>

      {/* Main Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Discount</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Min Purchase</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Usage Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Validity</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Expiry Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Active Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    No coupons found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isExpired = new Date(coupon.end_date) < new Date();
                  return (
                    <TableRow key={coupon.id} hover>
                      <TableCell>
                        <Chip
                          label={coupon.code}
                          variant="outlined"
                          color="primary"
                          sx={{ fontWeight: "700", textTransform: "uppercase", borderRadius: "6px" }}
                        />
                        {coupon.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {coupon.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: "600" }}>
                          {coupon.discount_type === "percentage"
                            ? `${parseFloat(coupon.discount_value)}% OFF`
                            : `₹${parseFloat(coupon.discount_value)} OFF`}
                        </Typography>
                        {coupon.max_discount_amount && (
                          <Typography variant="caption" color="text.secondary">
                            Capped at ₹{parseFloat(coupon.max_discount_amount)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>₹{parseFloat(coupon.min_purchase_amount)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          <strong>{coupon.usage_count}</strong> / {coupon.usage_limit || "∞"} used
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Per user limit: {coupon.per_user_limit}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: "13px" }}>
                        <div>Start: {new Date(coupon.start_date).toLocaleDateString()}</div>
                        <div>End: {new Date(coupon.end_date).toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        {isExpired ? (
                          <Chip label="Expired" size="small" color="error" sx={{ fontWeight: 600 }} />
                        ) : (
                          <Chip label="Valid" size="small" color="success" sx={{ fontWeight: 600 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={coupon.is_active}
                          onChange={() => handleToggleStatus(coupon)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton onClick={() => handleOpenEditForm(coupon)} color="info">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton onClick={() => handleOpenDelete(coupon)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSaveCoupon}>
          <DialogTitle sx={{ fontWeight: 700 }}>
            {selectedCoupon ? "Edit Coupon" : "Create New Coupon"}
          </DialogTitle>
          <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Coupon Code"
              required
              fullWidth
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              inputProps={{ style: { textTransform: "uppercase" } }}
              placeholder="e.g. SAVE20"
              disabled={!!selectedCoupon}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this coupon offers"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                select
                label="Discount Type"
                required
                fullWidth
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
              >
                <MenuItem value="percentage">Percentage Discount (%)</MenuItem>
                <MenuItem value="fixed">Fixed Amount Discount (₹)</MenuItem>
              </TextField>
              <TextField
                label="Discount Value"
                type="number"
                required
                fullWidth
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                inputProps={{ step: "any", min: "0.01" }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Min Purchase Amount (₹)"
                type="number"
                fullWidth
                value={formData.min_purchase_amount}
                onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
                inputProps={{ step: "any", min: "0" }}
              />
              <TextField
                label="Max Discount Amount (₹)"
                type="number"
                fullWidth
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                inputProps={{ step: "any", min: "0" }}
                disabled={formData.discount_type !== "percentage"}
                placeholder="Optional"
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date & Time"
                type="datetime-local"
                required
                fullWidth
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date & Time"
                type="datetime-local"
                required
                fullWidth
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Total Usage Limit"
                type="number"
                fullWidth
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                inputProps={{ min: "1" }}
                placeholder="Leave blank for unlimited"
              />
              <TextField
                label="Per User Limit"
                type="number"
                required
                fullWidth
                value={formData.per_user_limit}
                onChange={(e) => setFormData({ ...formData, per_user_limit: e.target.value })}
                inputProps={{ min: "1" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={actionLoading}>
              {actionLoading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the coupon <strong>{selectedCoupon?.code}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Coupons;
