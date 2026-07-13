import React from "react";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";

function TopProducts({ products = [] }) {
  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString()}`;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)", height: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Top Performing Products
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Products generating the highest sales counts
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Sales Qty</TableCell>
              <TableCell align="right">Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>
                  {product.name}
                </TableCell>
                <TableCell>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "6px",
                      bgcolor: "#f1f5f9",
                      color: "#475569"
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: "#475569" }}>
                  {product.sales}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#10b981" }}>
                  {formatCurrency(product.revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TopProducts;
