import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography } from "@mui/material";

function VariantTable({ variants = [], onEdit, onDelete }) {
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "10px", mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: "#f8fafc" }}>
            <TableCell sx={{ fontWeight: 700 }}>Variant Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {variants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 3, color: "#64748b" }}>
                No variants added yet. Click "+ Add Variant" to add one.
              </TableCell>
            </TableRow>
          ) : (
            variants.map((v, idx) => (
              <TableRow key={v.id || idx}>
                <TableCell sx={{ fontWeight: 600 }}>{v.name}</TableCell>
                <TableCell sx={{ fontFamily: "monospace" }}>{v.sku}</TableCell>
                <TableCell>₹{Number(v.price).toLocaleString()}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: v.stock <= 5 ? "#ef4444" : "inherit" }}>
                    {v.stock}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <IconButton size="small" onClick={() => onEdit(v, idx)} sx={{ color: "#3b82f6" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(idx)} sx={{ color: "#ef4444" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default VariantTable;
