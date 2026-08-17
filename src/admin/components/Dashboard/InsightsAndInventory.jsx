import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Box, Tabs, Tab, Button, Avatar, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function InsightsAndInventory({ categories = [], brands = [], lowStock = [], outOfStock = [], topProducts = [] }) {
  const navigate = useNavigate();
  const [activeInventoryTab, setActiveInventoryTab] = useState(0);

  // Group low stock, out of stock
  const inventoryTabs = [
    { label: "Low Stock", data: lowStock },
    { label: "Out of Stock", data: outOfStock }
  ];

  // Dummy categories distribution fallback if empty
  const defaultCats = [
    { name: "Electronics", value: 15, total: 40 },
    { name: "Fashion", value: 10, total: 40 },
    { name: "Accessories", value: 8, total: 40 },
    { name: "Home Appliances", value: 5, total: 40 },
    { name: "Books", value: 2, total: 40 }
  ];

  const catData = categories.length > 0
    ? categories.map(c => ({ name: c.name, value: c.value || c.count || 0, total: Math.max(...categories.map(cat => cat.value || cat.count || 1)) }))
    : defaultCats;

  // Render Horizontal Bar Row
  const renderInsightBar = (name, value, total, color = "#6366f1") => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <Box key={name} sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "#334155" }}>
            {name}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 800, color: "#64748b" }}>
            {value} items ({pct}%)
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={pct} 
          sx={{ height: 8, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: color } }} 
        />
      </Box>
    );
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* SECTION 3: Business Insights */}
      <Grid item xs={12} lg={6}>
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            height: "100%",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
              borderColor: "rgba(15, 23, 42, 0.12)"
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
              📊 Business Insights
            </Typography>

            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#64748b", mb: 2, textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
              Top Selling Categories
            </Typography>
            {catData.slice(0, 4).map(c => renderInsightBar(c.name, c.value, c.total, "#10b981"))}


          </CardContent>
        </Card>
      </Grid>

      {/* SECTION 4: Inventory Management */}
      <Grid item xs={12} lg={6}>
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            height: "100%",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
              borderColor: "rgba(15, 23, 42, 0.12)"
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                🛡️ Inventory Health
              </Typography>
              <Tabs
                value={activeInventoryTab}
                onChange={(e, val) => setActiveInventoryTab(val)}
                sx={{
                  minHeight: 0,
                  "& .MuiTab-root": {
                    minHeight: 0,
                    py: 0.8,
                    px: 1.5,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: "8px"
                  }
                }}
              >
                <Tab label="Low Stock" />
                <Tab label="Out of Stock" />
              </Tabs>
            </Box>

            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
              {inventoryTabs[activeInventoryTab].data.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                  <Typography variant="body2">No products in this category.</Typography>
                </Box>
              ) : (
                inventoryTabs[activeInventoryTab].data.slice(0, 5).map((p) => {
                  const stockVal = p.stock !== undefined ? p.stock : 0;
                  const isOutOfStock = stockVal === 0;
                  return (
                    <Box
                      key={p.variant_id || p.product_id || p.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#f8fafc",
                        border: "1px solid #f1f5f9"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          variant="rounded"
                          src={p.image || "/placeholder-product.png"}
                          sx={{ width: 44, height: 44, bgcolor: "#e2e8f0" }}
                        >
                          📦
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                            {p.product_name || p.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.variant_name ? `Variant: ${p.variant_name}` : `SKU: ${p.sku || "N/A"}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: isOutOfStock ? "#ef4444" : "#f59e0b" }}>
                            {isOutOfStock ? "Out of Stock" : `${stockVal} left`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Status: {isOutOfStock ? "Inactive" : "Active"}
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/admin/products/${p.product_id || p.id}`)}
                          sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            borderColor: "divider",
                            color: "text.primary"
                          }}
                        >
                          Quick Edit
                        </Button>
                      </Box>
                    </Box>
                  );
                })
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default InsightsAndInventory;
