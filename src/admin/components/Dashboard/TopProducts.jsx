import React from "react";
import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";

function TopProducts({ products = [] }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(15, 23, 42, 0.05)",
        height: "100%"
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
        Top Selling Products
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} sx={{ "& td": { py: 1.5, px: 0 } }}>
                <TableCell sx={{ border: 0 }}>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        bgcolor: "#f1f5f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem"
                      }}
                    >
                      📦
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.category}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ border: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {product.sales} Sales
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.revenue}
                  </Typography>
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
