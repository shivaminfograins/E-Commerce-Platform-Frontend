import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TableSortLabel, IconButton, Box, Typography, Avatar, Paper } from "@mui/material";

function ProductTable({ products = [], onEdit, onDelete }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const comp = comparator(a[0], b[0]);
      if (comp !== 0) return comp;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  // Helper to compute display price (e.g. lowest variant price)
  const getDisplayPrice = (product) => {
    if (!product.variants || product.variants.length === 0) return "No price";
    const prices = product.variants.map((v) => Number(v.price));
    const minPrice = Math.min(...prices);
    return `₹${minPrice.toLocaleString()}`;
  };

  const filteredSortedProducts = stableSort(products, getComparator(order, orderBy));
  const paginatedProducts = filteredSortedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)" }}>
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
              <TableCell>Image</TableCell>
              <TableCell key="name">
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Product Name
                </TableSortLabel>
              </TableCell>
              <TableCell key="brand">
                <TableSortLabel
                  active={orderBy === "brand"}
                  direction={orderBy === "brand" ? order : "asc"}
                  onClick={() => handleRequestSort("brand")}
                >
                  Brand
                </TableSortLabel>
              </TableCell>
              <TableCell key="category">
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={orderBy === "category" ? order : "asc"}
                  onClick={() => handleRequestSort("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Variants</TableCell>
              <TableCell key="status">
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleRequestSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>
                  <Avatar
                    src={product.image}
                    variant="rounded"
                    sx={{ width: 44, height: 44, bgcolor: "#f1f5f9", border: "1px solid rgba(15,23,42,0.05)" }}
                  >
                    📦
                  </Avatar>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#1e293b" }}>{product.name}</TableCell>
                <TableCell sx={{ fontWeight: 500, color: "#475569" }}>{product.brand || "—"}</TableCell>
                <TableCell>
                  <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: "50px", fontSize: "0.8rem", bgcolor: "#f1f5f9", color: "#475569", fontWeight: 600 }}>
                    {product.category}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{getDisplayPrice(product)}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{product.variants?.length || 0} variants</TableCell>
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
                      bgcolor: product.status === "Active" ? "#d1fae5" : "#f1f5f9",
                      color: product.status === "Active" ? "#065f46" : "#64748b"
                    }}
                  >
                    {product.status}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <IconButton onClick={() => onEdit(product)} sx={{ color: "#3b82f6", p: 1, bgcolor: "rgba(59, 130, 246, 0.05)", "&:hover": { bgcolor: "rgba(59, 130, 246, 0.1)" } }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </IconButton>
                    <IconButton onClick={() => onDelete(product)} sx={{ color: "#ef4444", p: 1, bgcolor: "rgba(239, 68, 68, 0.05)", "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" } }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default ProductTable;
