import React, { useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Alert, AlertTitle, Button, Link, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import { formatTimeAgo } from "../Notifications/NotificationCard";

// Map Priority to Alert Severity
const getSeverity = (priority) => {
  if (priority === "HIGH") return "error";
  if (priority === "MEDIUM") return "warning";
  return "info";
};

function RecentActivityFeed({ recentOrders = [], lowStock = [] }) {
  const navigate = useNavigate();
  
  // Load real notifications from backend with polling
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markRead,
  } = useNotifications(true, 30000);

  useEffect(() => {
    fetchNotifications({ limit: 5 });
  }, [fetchNotifications]);

  // Generate activities dynamically from recent orders
  const baseActivities = [
    { type: "Product Catalog", desc: "Catalog synchronization verified.", time: "1 hour ago", color: "#3b82f6" },
    { type: "Admin Session", desc: "Security access logs archived.", time: "4 hours ago", color: "#10b981" },
  ];

  const orderActivities = recentOrders.slice(0, 3).map((o) => ({
    type: o.status === "Cancelled" ? "Order Cancelled" : "Order Created",
    desc: `Order #${o.id} value ${o.total} by ${o.customer}`,
    time: o.date || "Just now",
    color: o.status === "Cancelled" ? "#ef4444" : "#8b5cf6"
  }));

  const activities = [...orderActivities, ...baseActivities].slice(0, 5);

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* LEFT: Recent Activity Timeline */}
      <Grid item xs={12} lg={6}>
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            height: "100%",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
              borderColor: "rgba(15, 23, 42, 0.12)"
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
              🕒 System Activity Feed
            </Typography>

            <Box sx={{ position: "relative", pl: 3.5, "&::before": { content: '""', position: "absolute", left: 7, top: 8, bottom: 8, width: 2, bgcolor: "#e2e8f0" } }}>
              {activities.map((act, idx) => (
                <Box key={idx} sx={{ position: "relative", mb: 3, "&:last-child": { mb: 0 } }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: -28 - 4,
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

      {/* RIGHT: Notifications Panel */}
      <Grid item xs={12} lg={6}>
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
            border: "1px solid rgba(15, 23, 42, 0.06)",
            height: "100%",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
              borderColor: "rgba(15, 23, 42, 0.12)"
            }
          }}
        >
          <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                🔔 Admin Notifications ({unreadCount} Unread)
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/admin/notifications")}
                sx={{ fontWeight: 700, textTransform: "none", p: 0 }}
              >
                View Center →
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flexGrow: 1 }}>
              {loading && notifications.length === 0 ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rectangular" height={70} sx={{ borderRadius: "12px" }} />
                ))
              ) : notifications.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 700 }}>
                    No notifications yet 🎉
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                    Everything is running smoothly!
                  </Typography>
                </Box>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <Alert
                    key={n.id}
                    severity={getSeverity(n.priority)}
                    onClick={() => {
                      if (!n.is_read) markRead(n.id);
                      if (n.action_url) navigate(n.action_url.startsWith("/admin") ? n.action_url : `/admin${n.action_url}`);
                    }}
                    sx={{
                      borderRadius: "12px",
                      alignItems: "center",
                      cursor: n.action_url ? "pointer" : "default",
                      opacity: n.is_read ? 0.75 : 1,
                      border: n.is_read ? "none" : "1px solid rgba(59, 130, 246, 0.15)",
                      bgcolor: n.is_read ? "rgba(248, 250, 252, 0.5)" : undefined,
                      "& .MuiAlert-icon": { py: 0 },
                      "&:hover": {
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
                        transform: "translateY(-1px)",
                        transition: "all 0.2s ease"
                      }
                    }}
                  >
                    <AlertTitle sx={{ fontWeight: 700, m: 0, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 1 }}>
                      {n.title}
                      <Typography variant="caption" sx={{ fontWeight: 500, color: "text.secondary" }}>
                        • {formatTimeAgo(n.created_at)}
                      </Typography>
                    </AlertTitle>
                    <Typography variant="caption" color="text.primary" sx={{ fontSize: "0.8rem", mt: 0.5, display: "block" }}>
                      {n.message}
                    </Typography>
                  </Alert>
                ))
              )}
            </Box>
            
            {/* Quick Links section */}
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #f1f5f9", display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748b", alignSelf: "center" }}>
                QUICK LINKS:
              </Typography>
              <Link href="/admin/orders" sx={{ fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", color: "#3b82f6" }}>
                Manage Orders
              </Link>
              <Link href="/admin/products" sx={{ fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", color: "#3b82f6" }}>
                Inventory
              </Link>
              <Link href="/admin/coupons" sx={{ fontSize: "0.75rem", fontWeight: 700, textDecoration: "none", color: "#3b82f6" }}>
                Coupons
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default RecentActivityFeed;
