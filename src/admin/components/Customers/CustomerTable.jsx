import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, Typography, Avatar, Paper, Switch, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const formatCurrency = (val) => {
  return `₹${Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const CustomerTable = React.memo(function CustomerTable({ customers = [], onToggleStatus }) {
  const navigate = useNavigate();

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)" }}>
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
              <TableCell>Customer</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell align="center">Total Orders</TableCell>
              <TableCell align="right">Lifetime Value</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      src={customer.avatar}
                      sx={{ width: 40, height: 40, bgcolor: "#3b82f6", fontWeight: 700, color: "white" }}
                    >
                      {customer.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.95rem" }}>
                        {customer.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: #{customer.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: "0.9rem", color: "#334155" }}>{customer.email}</Typography>
                  <Typography variant="caption" color="text.secondary">{customer.phone || "No phone"}</Typography>
                </TableCell>
                <TableCell sx={{ color: "#475569", fontSize: "0.9rem" }}>
                  {new Date(customer.dateJoined).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: "#475569" }}>
                  {customer.totalOrders}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#0f172a" }}>
                  {formatCurrency(customer.lifetimeValue)}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.2,
                        py: 0.3,
                        borderRadius: "50px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        bgcolor: customer.status === "Active" ? "#d1fae5" : "#fee2e2",
                        color: customer.status === "Active" ? "#065f46" : "#991b1b",
                        mb: 0.5
                      }}
                    >
                      {customer.status}
                    </Box>
                    <Switch
                      size="small"
                      checked={customer.status === "Active"}
                      onChange={(e) => onToggleStatus(customer.id, e.target.checked ? "Active" : "Inactive")}
                      color="primary"
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Tooltip title="View Profile Details">
                      <IconButton
                        onClick={() => navigate(`/admin/customers/${customer.id}`)}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
});

export default CustomerTable;
