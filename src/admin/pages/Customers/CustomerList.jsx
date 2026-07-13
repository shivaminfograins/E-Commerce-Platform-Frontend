import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, InputAdornment, MenuItem, CircularProgress, Alert, TablePagination, Snackbar } from "@mui/material";
import CustomerTable from "../../components/Customers/CustomerTable";
import customerService from "../../services/customerService";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination states
  const [page, setPage] = useState(0); // MUI uses 0-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // Toast Notification
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchCustomers();
  }, [searchQuery, statusFilter, page, rowsPerPage]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await customerService.getCustomers({
        search: searchQuery,
        status: statusFilter,
        page: page + 1, // backend expect 1-based index
        limit: rowsPerPage
      });
      setCustomers(response.data);
      setTotalCount(response.pagination.total);
    } catch (err) {
      setError("Failed to fetch customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await customerService.updateCustomerStatus(id, newStatus);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
      showToast(`Customer status updated to ${newStatus} successfully!`);
    } catch (err) {
      showToast("Failed to update customer status.", "error");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box>
      {/* Header Row */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Customer Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage customer accounts, search profiles, view metrics, addresses, and order histories.
        </Typography>
      </Box>

      {/* Search and Filters Toolbar */}
      <Box sx={{ mb: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search by name, email, phone..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
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
          label="Status Filter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 180, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value="Active">Active Only</MenuItem>
          <MenuItem value="Inactive">Inactive Only</MenuItem>
        </TextField>
      </Box>

      {/* Content Grid */}
      {loading && customers.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>
      ) : customers.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 2, bgcolor: "white", borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
            👥
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            No Customers Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No customer profiles matched your search terms or filter selection.
          </Typography>
        </Box>
      ) : (
        <>
          <CustomerTable
            customers={customers}
            onToggleStatus={handleToggleStatus}
          />
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        </>
      )}

      {/* Notification Toast */}
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

export default CustomerList;
