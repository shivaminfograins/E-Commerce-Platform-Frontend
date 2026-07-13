import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, InputAdornment, Tabs, Tab, CircularProgress, Alert, TablePagination, Snackbar } from "@mui/material";
import OrderTable from "../../components/Orders/OrderTable";
import OrderDetailsDrawer from "../../components/Orders/OrderDetailsDrawer";
import orderService from "../../services/orderService";

const STATUS_TABS = ["All", "Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState(0); // Index of STATUS_TABS

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination states
  const [page, setPage] = useState(0); // MUI 0-based
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Toast state
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchOrders();
  }, [searchQuery, selectedStatusTab, page, rowsPerPage]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const activeStatus = STATUS_TABS[selectedStatusTab];
      const response = await orderService.getOrders({
        search: searchQuery,
        status: activeStatus,
        page: page + 1, // backend expect 1-based index
        limit: rowsPerPage
      });
      setOrders(response.data);
      setTotalCount(response.pagination.total);

      // If drawer is open, keep the selected order detail fresh
      if (drawerOpen && selectedOrder) {
        const freshOrder = response.data.find(o => o.id === selectedOrder.id);
        if (freshOrder) {
          setSelectedOrder(freshOrder);
        }
      }
    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await orderService.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus} successfully!`);
      
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? response.data : o))
      );
      
      // Update selected drawer order
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(response.data);
      }
    } catch (err) {
      showToast("Failed to update status. Please try again.", "error");
    }
  };

  const handleOpenDrawer = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedStatusTab(newValue);
    setPage(0);
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
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Order Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Monitor, track shipping progress, packing slips, status progressions, and payment reconciliations.
        </Typography>
      </Box>

      {/* Toolbar Search */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search by Order ID or customer details..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(0);
          }}
          sx={{ width: { xs: "100%", sm: 380 }, bgcolor: "white", borderRadius: "10px", "& fieldset": { borderRadius: "10px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ color: "#64748b" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* Status Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={selectedStatusTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "0.9rem",
              textTransform: "none",
              px: 3,
            }
          }}
        >
          {STATUS_TABS.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>
      </Box>

      {/* Main Content Area */}
      {loading && orders.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>
      ) : orders.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, px: 2, bgcolor: "white", borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
          <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
            📦
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            No Orders Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            There are no orders that match the selected status or keywords.
          </Typography>
        </Box>
      ) : (
        <>
          <OrderTable
            orders={orders}
            onViewQuick={handleOpenDrawer}
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

      {/* Slide out quick view drawer */}
      <OrderDetailsDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        order={selectedOrder}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Notifications Toast */}
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

export default OrderList;
