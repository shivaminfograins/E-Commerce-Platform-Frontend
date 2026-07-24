import React from "react";
import { Grid, Card, CardContent, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function QuickActionsPanel() {
  const navigate = useNavigate();

  const actions = [
    { label: "Add Product", path: "/admin/products/create", icon: "📦", color: "#3b82f6" },
    { label: "Add Category", path: "/admin/categories", icon: "📂", color: "#10b981" },
    { label: "Add Brand", path: "/admin/brands", icon: "🏷️", color: "#f59e0b" },
    { label: "Create Coupon", path: "/admin/settings", icon: "🎫", color: "#8b5cf6" },
    { label: "View Orders", path: "/admin/orders", icon: "🚚", color: "#ef4444" },
    { label: "View Reports", path: "/admin/reports", icon: "📈", color: "#06b6d4" }
  ];

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
        border: "1px solid rgba(15, 23, 42, 0.06)",
        mb: 4,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
          borderColor: "rgba(15, 23, 42, 0.12)"
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
          ⚡ Quick Business Actions
        </Typography>
        <Grid container spacing={2}>
          {actions.map((act) => (
            <Grid item xs={6} sm={4} md={2} key={act.label}>
              <Button
                variant="text"
                fullWidth
                onClick={() => navigate(act.path)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 2.5,
                  px: 1,
                  borderRadius: "12px",
                  border: "1px solid #f1f5f9",
                  bgcolor: "#f8fafc",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: act.color,
                    bgcolor: `${act.color}08`,
                    boxShadow: `0 4px 12px ${act.color}15`
                  }
                }}
              >
                <Box sx={{ fontSize: "1.75rem", mb: 1 }}>{act.icon}</Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#1e293b", textTransform: "none" }}>
                  {act.label}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default QuickActionsPanel;
