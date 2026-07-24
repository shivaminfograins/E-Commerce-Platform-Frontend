import React from "react";
import { Grid, Card, CardContent, Typography, Box, Alert, AlertTitle } from "@mui/material";

function RecentActivityFeed({ recentOrders = [], lowStock = [] }) {
  // Generate mock activities dynamically from recent orders
  const baseActivities = [
    { type: "Product Added", desc: "Wireless Gaming Mouse was added to listings", time: "2 hours ago", color: "#3b82f6" },
    { type: "Category Updated", desc: "Category 'Laptops' metadata updated", time: "4 hours ago", color: "#10b981" },
    { type: "Customer Registered", desc: "New customer shera registered", time: "Yesterday", color: "#f59e0b" }
  ];

  const orderActivities = recentOrders.slice(0, 3).map((o) => ({
    type: o.status === "Cancelled" ? "Order Cancelled" : "Order Created",
    desc: `Order #${o.id} value ${o.total} by ${o.customer}`,
    time: o.date || "Just now",
    color: o.status === "Cancelled" ? "#ef4444" : "#8b5cf6"
  }));

  const activities = [...orderActivities, ...baseActivities].slice(0, 5);

  // Generate system notifications
  const alerts = [
    { severity: "warning", title: "Low Stock Alert", desc: `${lowStock.length || 3} product variants have dropped below threshold stock of 10.` },
    { severity: "info", title: "Return Requests", desc: "2 product return authorization requests are pending processing." },
    { severity: "error", title: "Payment Failure Alert", desc: "1 Stripe webhook transaction reconciliation failed recently." },
    { severity: "success", title: "Fulfillment Sync Completed", desc: "All local inventory databases synchronized with courier nodes." }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* SECTION 8: Recent Activity Timeline */}
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
              🕒 Recent Activity Feed
            </Typography>

            <Box sx={{ position: "relative", pl: 3.5, "&::before": { content: '""', position: "absolute", left: 7, top: 8, bottom: 8, width: 2, bgcolor: "#e2e8f0" } }}>
              {activities.map((act, idx) => (
                <Box key={idx} sx={{ position: "relative", mb: 3, "&:last-child": { mb: 0 } }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: -28 - 4, // Align centered on the timeline border
                      top: 4,
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: act.color,
                      border: "2px solid white",
                      boxShadow: "0 0 0 3px rgba(226, 232, 240, 0.5)"
                    }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      {act.type}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      {act.time}
                    </Typography>
                    <Typography variant="caption" color="text.primary" sx={{ fontSize: "0.82rem" }}>
                      {act.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* SECTION 10: Notifications Panel */}
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
              🔔 Notifications Panel
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {alerts.map((alert, idx) => (
                <Alert
                  key={idx}
                  severity={alert.severity}
                  sx={{
                    borderRadius: "12px",
                    alignItems: "center",
                    "& .MuiAlert-icon": { py: 0 }
                  }}
                >
                  <AlertTitle sx={{ fontWeight: 700, m: 0 }}>{alert.title}</AlertTitle>
                  <Typography variant="caption" color="text.primary" sx={{ fontSize: "0.8rem", mt: 0.5, display: "block" }}>
                    {alert.desc}
                  </Typography>
                </Alert>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default RecentActivityFeed;
