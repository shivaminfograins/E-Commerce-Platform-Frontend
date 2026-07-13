import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

function OrderHistory({ orders = [] }) {
  // Helper to format currency
  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper to color statuses
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { bg: "#d1fae5", text: "#065f46" };
      case "Shipped":
        return { bg: "#dbeafe", text: "#1e40af" };
      case "Processing":
        return { bg: "#fef3c7", text: "#92400e" };
      case "Cancelled":
        return { bg: "#fee2e2", text: "#991b1b" };
      default:
        return { bg: "#f1f5f9", text: "#475569" };
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", border: "1px solid rgba(15,23,42,0.05)" }}>
        <Typography variant="h6" sx={{ color: "#64748b" }}>
          No order records found for this customer.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
              <TableCell>Order ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Items Count</TableCell>
              <TableCell align="right">Amount Paid</TableCell>
              <TableCell align="center">Payment Status</TableCell>
              <TableCell align="center">Delivery Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const orderStyle = getStatusStyle(order.status);
              return (
                <TableRow key={order.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 700, color: "#3b82f6" }}>
                    {order.id}
                  </TableCell>
                  <TableCell sx={{ color: "#475569" }}>
                    {new Date(order.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 500 }}>
                    {order.itemsCount}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.2,
                        py: 0.3,
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        bgcolor: order.paymentStatus === "Paid" ? "#d1fae5" : "#fee2e2",
                        color: order.paymentStatus === "Paid" ? "#065f46" : "#991b1b",
                      }}
                    >
                      {order.paymentStatus}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.2,
                        py: 0.3,
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        bgcolor: orderStyle.bg,
                        color: orderStyle.text,
                      }}
                    >
                      {order.status}
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
}

export default OrderHistory;
