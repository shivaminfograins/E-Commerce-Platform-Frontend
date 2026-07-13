import React from "react";
import { Drawer, Box, Typography, IconButton, Divider, Grid, Card, CardContent } from "@mui/material";
import StatusDropdown from "./StatusDropdown";
import Timeline from "./Timeline";

function OrderDetailsDrawer({ open, onClose, order, onStatusUpdate }) {
  if (!order) return null;

  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", sm: 450, md: 500 },
          boxSizing: "border-box",
          p: 3,
          bgcolor: "#f8fafc"
        }
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Order details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: #{order.id}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#64748b" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Main content scroll container */}
      <Box sx={{ overflowY: "auto", flexGrow: 1, pr: 0.5 }}>
        {/* Status manager card */}
        <Card sx={{ mb: 3, borderRadius: "12px", border: "1px solid rgba(15,23,42,0.05)" }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: "#475569" }}>
              Order Status Management
            </Typography>
            <StatusDropdown
              currentStatus={order.status}
              onStatusChange={(newStatus) => onStatusUpdate(order.id, newStatus)}
              fullWidth
            />
          </CardContent>
        </Card>

        {/* Customer card info */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
          Customer Info
        </Typography>
        <Card sx={{ mb: 3, borderRadius: "12px", border: "1px solid rgba(15,23,42,0.05)" }}>
          <CardContent sx={{ py: 2 }}>
            <Typography sx={{ fontWeight: 700, color: "#334155" }}>
              {order.customerName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Email: {order.customerEmail}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: {order.customerPhone}
            </Typography>
          </CardContent>
        </Card>

        {/* Shipping address card */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
          Delivery Address
        </Typography>
        <Card sx={{ mb: 3, borderRadius: "12px", border: "1px solid rgba(15,23,42,0.05)" }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ color: "#334155", fontWeight: 500 }}>
              {order.shippingAddress.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {order.shippingAddress.country}
            </Typography>
          </CardContent>
        </Card>

        {/* Items List */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
          Items Summary
        </Typography>
        <Card sx={{ mb: 3, borderRadius: "12px", border: "1px solid rgba(15,23,42,0.05)" }}>
          <CardContent sx={{ py: 2 }}>
            {order.items.map((item, idx) => (
              <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", py: 1.5, borderBottom: idx === order.items.length - 1 ? "none" : "1px solid rgba(15,23,42,0.05)" }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#334155", fontSize: "0.9rem" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Variant: {item.variant} | SKU: {item.sku}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                    {formatCurrency(item.price * item.quantity)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.quantity} x {formatCurrency(item.price)}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
              <Typography sx={{ fontWeight: 800, color: "#1e293b" }}>Total</Typography>
              <Typography sx={{ fontWeight: 800, color: "#10b981", fontSize: "1.1rem" }}>
                {formatCurrency(order.total)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Order History Timeline */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
          Activity Timeline
        </Typography>
        <Card sx={{ borderRadius: "12px", border: "1px solid rgba(15,23,42,0.05)", p: 2, mb: 2 }}>
          <Timeline events={order.timeline} />
        </Card>
      </Box>
    </Drawer>
  );
}

export default OrderDetailsDrawer;
