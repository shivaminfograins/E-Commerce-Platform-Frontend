import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";

function RecentOrders({ orders = [] }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(15, 23, 42, 0.05)"
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
        Recent Orders
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 500 }}>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ fontWeight: 600, color: "#3b82f6" }}>{order.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{order.customer}</TableCell>
                <TableCell color="text.secondary">{order.date}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{order.total}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "50px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      bgcolor:
                        order.status === "Delivered"
                          ? "#d1fae5"
                          : order.status === "Processing"
                          ? "#dbeafe"
                          : "#fef3c7",
                      color:
                        order.status === "Delivered"
                          ? "#065f46"
                          : order.status === "Processing"
                          ? "#1e40af"
                          : "#92400e"
                    }}
                  >
                    {order.status}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default RecentOrders;
