import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, Card, CardContent, Divider, CircularProgress, Alert, Table, TableHead, TableRow, TableCell, TableBody, Snackbar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import StatusDropdown from "../../components/Orders/StatusDropdown";
import Timeline from "../../components/Orders/Timeline";
import orderService from "../../services/orderService";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Toast notification
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
    } catch (err) {
      setError("Order details not found or failed to load.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!order) return;
    try {
      const response = await orderService.updateOrderStatus(order.id, newStatus);
      setOrder(response.data);
      showToast(`Order status updated to ${newStatus} successfully!`);
    } catch (err) {
      showToast("Failed to update order status.", "error");
    }
  };

  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8, flexGrow: 1 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box sx={{ py: 4 }}>
        <Button
          onClick={() => navigate("/admin/orders")}
          startIcon={<span>←</span>}
          sx={{ mb: 3 }}
        >
          Back to Orders
        </Button>
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error || "Unable to display order details."}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Top Breadcrumb & Action Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Button
            onClick={() => navigate("/admin/orders")}
            sx={{
              mb: 1.5,
              color: "#64748b",
              fontWeight: 700,
              p: 0,
              minWidth: 0,
              "&:hover": { bg: "transparent", color: "#3b82f6" }
            }}
            startIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
            }
          >
            Back to Orders
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Order {order.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Placed on {new Date(order.date).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
          </Typography>
        </Box>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={3}>
        {/* Left Column: Order Items & Delivery address */}
        <Grid item xs={12} lg={8}>
          {/* Ordered items Table card */}
          <Card sx={{ mb: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ p: 3, pb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                  Items Ordered
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
                      <TableCell>Item Description</TableCell>
                      <TableCell align="right">Unit Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id} sx={{ "&:last-child td": { border: 0 } }}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 700, color: "#334155", fontSize: "0.95rem" }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Variant: {item.variant} | SKU: {item.sku}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {formatCurrency(item.price)}
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>
                          {item.quantity}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: "#0f172a" }}>
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Delivery & Billing information */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155" }}>
                    {order.shippingAddress.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                    {order.shippingAddress.addressLine1}
                    {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.5 }}>
                    {order.shippingAddress.country}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                    Contact Phone
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
                    {order.shippingAddress.phone}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
                    Billing details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Same as shipping address details.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Payment Mode
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
                    {order.paymentMethod}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    Transaction Payment Status
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "50px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      bgcolor: order.paymentStatus === "Paid" ? "#d1fae5" : "#fee2e2",
                      color: order.paymentStatus === "Paid" ? "#065f46" : "#dc2626",
                      mt: 0.5
                    }}
                  >
                    {order.paymentStatus}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column: Status controllers, Summary, and Timeline */}
        <Grid item xs={12} lg={4}>
          {/* Status settings */}
          <Card sx={{ mb: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#475569", mb: 1.5 }}>
                Order Status Controls
              </Typography>
              <StatusDropdown
                currentStatus={order.status}
                onStatusChange={handleStatusUpdate}
                fullWidth
              />
            </CardContent>
          </Card>

          {/* Pricing summary */}
          <Card sx={{ mb: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
                Financial Summary
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(order.total)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary">Shipping Fee</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>FREE</Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 800 }}>Grand Total</Typography>
                <Typography sx={{ fontWeight: 800, color: "#10b981", fontSize: "1.15rem" }}>
                  {formatCurrency(order.total)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Chronological timeline track */}
          <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
                Fulfillment Logs
              </Typography>
              <Timeline events={order.timeline} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar alerts */}
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

export default OrderDetails;
