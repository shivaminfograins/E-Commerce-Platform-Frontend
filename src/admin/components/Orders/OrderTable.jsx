import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Typography, Paper, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const formatCurrency = (val) => {
  return `₹${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return { bg: "#fef3c7", text: "#d97706" };
    case "Confirmed":
      return { bg: "#dbeafe", text: "#2563eb" };
    case "Packed":
      return { bg: "#f3e8ff", text: "#7c3aed" };
    case "Shipped":
      return { bg: "#e0f2fe", text: "#0284c7" };
    case "Delivered":
      return { bg: "#d1fae5", text: "#16a34a" };
    case "Cancelled":
      return { bg: "#fee2e2", text: "#dc2626" };
    default:
      return { bg: "#f1f5f9", text: "#64748b" };
  }
};

const OrderTable = React.memo(function OrderTable({ orders = [] }) {
  const navigate = useNavigate();

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)" }}>
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="center">Payment Method</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const statusStyle = getStatusColor(order.status);
              return (
                <TableRow key={order.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 800, color: "#1e293b" }}>
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, color: "#334155", fontSize: "0.92rem" }}>
                      {order.customerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.customerEmail}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontSize: "0.9rem" }}>
                    {new Date(order.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: "50px", fontSize: "0.8rem", bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600 }}>
                      {order.paymentMethod}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        bgcolor: statusStyle.bg,
                        color: statusStyle.text
                      }}
                    >
                      {order.status}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Tooltip title="View Full Details">
                        <IconButton
                          onClick={() => navigate(`/admin/orders/${order.dbId || order.id}`)}
                          sx={{
                            color: "#3b82f6",
                            p: 1,
                            bgcolor: "rgba(59, 130, 246, 0.05)",
                            "&:hover": { bgcolor: "rgba(59, 130, 246, 0.1)" }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
});

export default OrderTable;
