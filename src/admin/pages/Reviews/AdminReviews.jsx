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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Tooltip,
  Checkbox,
  Grid,
} from "@mui/material";
import api from "../../../api/axios";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const fetchReviewsAndAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      // Build query string
      let queryParams = [];
      if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
      if (ratingFilter) queryParams.push(`rating=${ratingFilter}`);
      if (statusFilter) queryParams.push(`status=${statusFilter}`);
      if (verifiedFilter) queryParams.push(`is_verified_purchase=${verifiedFilter}`);

      const reviewsUrl = `/reviews/admin/list/${queryParams.length > 0 ? "?" + queryParams.join("&") : ""}`;
      const [reviewsRes, analyticsRes] = await Promise.all([
        api.get(reviewsUrl),
        api.get("/reviews/admin/analytics/")
      ]);

      if (reviewsRes.data) {
        setReviews(reviewsRes.data.results || reviewsRes.data);
      }
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.analytics);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load review data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsAndAnalytics();
  }, [search, ratingFilter, statusFilter, verifiedFilter]);

  const handleModerate = async (reviewId, newStatus) => {
    try {
      const response = await api.patch(`/reviews/admin/${reviewId}/moderate/`, {
        status: newStatus,
      });
      if (response.data.success) {
        setToast({ open: true, message: `Review status updated to ${newStatus}.`, severity: "success" });
        fetchReviewsAndAnalytics();
        setDetailsOpen(false);
      }
    } catch (err) {
      console.error("Moderation failed:", err);
      setToast({ open: true, message: "Moderation failed. Please try again.", severity: "error" });
    }
  };

  const handleBulkModerate = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      const response = await api.post("/reviews/admin/bulk-moderate/", {
        ids: selectedIds,
        status: newStatus,
      });
      if (response.data.success) {
        setToast({ open: true, message: `Successfully updated ${selectedIds.length} reviews to ${newStatus}.`, severity: "success" });
        setSelectedIds([]);
        fetchReviewsAndAnalytics();
      }
    } catch (err) {
      console.error("Bulk moderation failed:", err);
      setToast({ open: true, message: "Bulk moderation failed.", severity: "error" });
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to soft delete this review?")) return;
    try {
      const response = await api.delete(`/reviews/${reviewId}/`);
      if (response.data.success) {
        setToast({ open: true, message: "Review deleted successfully.", severity: "success" });
        fetchReviewsAndAnalytics();
        setDetailsOpen(false);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setToast({ open: true, message: "Delete failed.", severity: "error" });
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(reviews.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderStars = (rating) => {
    return (
      <Box sx={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} style={{ color: s <= rating ? "#fbbf24" : "#cbd5e1", fontSize: "14px" }}>
            ★
          </span>
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Title */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
          Reviews Moderation & Analytics
        </Typography>
      </Box>

      {/* Analytics Widgets */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: "Total Reviews", val: analytics.total_reviews, color: "#4f46e5" },
            { label: "Average Rating", val: `${analytics.average_rating.toFixed(2)} ★`, color: "#fbbf24" },
            { label: "Pending Reviews", val: analytics.pending_reviews, color: "#ea580c" },
            { label: "Hidden Reviews", val: analytics.hidden_reviews, color: "#64748b" },
            { label: "Reported Reviews", val: analytics.reported_reviews, color: "#dc2626" },
          ].map((w, idx) => (
            <Grid item xs={12} sm={6} md={2.4} key={idx}>
              <Paper sx={{ p: 3, borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "none" }}>
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: "600", mb: 1 }}>
                  {w.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "800", color: w.color }}>
                  {w.val}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Filter Toolbar */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "none" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Reviews"
              placeholder="Product, customer, email, title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              fullWidth
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="hidden">Hidden</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <TextField
              fullWidth
              select
              label="Rating"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="">All Ratings</MenuItem>
              <MenuItem value="5">5★ Only</MenuItem>
              <MenuItem value="4">4★ Only</MenuItem>
              <MenuItem value="3">3★ Only</MenuItem>
              <MenuItem value="2">2★ Only</MenuItem>
              <MenuItem value="1">1★ Only</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3} md={2.5}>
            <TextField
              fullWidth
              select
              label="Verified Purchase"
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Verified Purchases Only</MenuItem>
              <MenuItem value="false">Non-Verified Only</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3} md={2.5} sx={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearch("");
                setRatingFilter("");
                setStatusFilter("");
                setVerifiedFilter("");
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk action buttons */}
      {selectedIds.length > 0 && (
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center", mb: 3, p: 2, bgcolor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <Typography variant="body2" sx={{ fontWeight: "700", color: "#334155" }}>
            {selectedIds.length} items selected:
          </Typography>
          <Button variant="contained" color="success" size="small" onClick={() => handleBulkModerate("approved")}>
            Bulk Approve
          </Button>
          <Button variant="contained" color="warning" size="small" onClick={() => handleBulkModerate("rejected")}>
            Bulk Reject
          </Button>
          <Button variant="contained" color="inherit" size="small" onClick={() => handleBulkModerate("hidden")}>
            Bulk Hide
          </Button>
        </Box>
      )}

      {/* Reviews Table */}
      <TableContainer component={Paper} sx={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "none" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedIds.length > 0 && selectedIds.length < reviews.length}
                  checked={reviews.length > 0 && selectedIds.length === reviews.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "700" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Verified</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Helpful</TableCell>
              <TableCell sx={{ fontWeight: "700" }}>Created Date</TableCell>
              <TableCell align="right" sx={{ fontWeight: "700" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : reviews.length > 0 ? (
              reviews.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onChange={() => handleSelectRow(row.id)}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: "600", color: "#1e293b" }}>
                      {row.product_name}
                    </Typography>
                    {row.variant_name && (
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Variant: {row.variant_name}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{renderStars(row.rating)}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.is_verified_purchase ? "Yes" : "No"}
                      color={row.is_verified_purchase ? "success" : "default"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={
                        row.status === "approved"
                          ? "success"
                          : row.status === "pending"
                          ? "warning"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>👍 {row.helpful_count}</TableCell>
                  <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedReview(row);
                          setDetailsOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    No reviews matching query.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Review Details dialog modal */}
      {selectedReview && (
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "800", borderBottom: "1px solid #e2e8f0", pb: 2 }}>
            Review Moderation Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "700" }}>PRODUCT</Typography>
                <Typography variant="body1" sx={{ fontWeight: "700", color: "#0f172a" }}>
                  {selectedReview.product_name}
                </Typography>
                {selectedReview.variant_name && (
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Variant: {selectedReview.variant_name}
                  </Typography>
                )}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "700" }}>CUSTOMER</Typography>
                <Typography variant="body2">{selectedReview.username}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "700" }}>RATING</Typography>
                {renderStars(selectedReview.rating)}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "700" }}>TITLE</Typography>
                <Typography variant="body2" sx={{ fontWeight: "700" }}>{selectedReview.title}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "700" }}>COMMENT</Typography>
                <Typography variant="body2" sx={{ color: "#475569", lineHeight: "1.5" }}>{selectedReview.comment}</Typography>
              </Box>
              {/* Images */}
              {selectedReview.images && selectedReview.images.length > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "700" }}>PHOTOS</Typography>
                  <Box sx={{ display: "flex", gap: "8px", mt: 1 }}>
                    {selectedReview.images.map((img) => (
                      <img
                        key={img.id}
                        src={img.image}
                        alt="review item"
                        style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "8px" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              {/* Reports info if any */}
              {selectedReview.helpful_count > 0 && (
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748b", fontWeight: "700" }}>HELPFUL VOTES</Typography>
                  <Typography variant="body2">👍 {selectedReview.helpful_count} users marked this review helpful.</Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ borderTop: "1px solid #e2e8f0", p: 2, justifyContent: "space-between" }}>
            <Button color="error" variant="outlined" onClick={() => handleDelete(selectedReview.id)}>
              Delete Review
            </Button>
            <Box sx={{ display: "flex", gap: "8px" }}>
              <Button color="success" variant="contained" onClick={() => handleModerate(selectedReview.id, "approved")}>
                Approve
              </Button>
              <Button color="warning" variant="contained" onClick={() => handleModerate(selectedReview.id, "rejected")}>
                Reject
              </Button>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
            </Box>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar toast alerts */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminReviews;
