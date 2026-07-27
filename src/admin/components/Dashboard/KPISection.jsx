import React from "react";
import { Grid, Card, CardContent, Typography, Box, LinearProgress } from "@mui/material";
import StatCard from "./StatCard";

function KPISection({ stats = {} }) {
  // Extract values
  const todayRevenueVal = Number(stats.today_revenue || stats.monthly_revenue * 0.05 || 10450); // Fallback for mockup if missing
  const monthlyRevenueVal = Number(stats.revenue || 211284);
  const totalOrdersVal = stats.total_orders || 0;
  const pendingOrdersVal = stats.pending_orders || 0;
  const totalCustomersVal = stats.total_customers || 0;
  const totalProductsVal = stats.total_products || 0;

  // Format currency helpers
  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Goal values (mock/targets)
  const todayTarget = 20000;
  const todayTargetPct = Math.min(Math.round((todayRevenueVal / todayTarget) * 100), 100);

  const monthlyTarget = 300000;
  const monthlyTargetPct = Math.min(Math.round((monthlyRevenueVal / monthlyTarget) * 100), 100);

  const completedOrders = totalOrdersVal - pendingOrdersVal;
  const fulfillmentPct = totalOrdersVal > 0 ? Math.round((completedOrders / totalOrdersVal) * 100) : 100;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Target/Goal Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.05)",
              border: "1px solid rgba(99, 102, 241, 0.1)",
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(99, 102, 241, 0) 100%)"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#6366f1", mb: 1 }}>
                🎯 Today's Sales Target
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                  {formatCurrency(todayRevenueVal)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Goal: {formatCurrency(todayTarget)} ({todayTargetPct}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={todayTargetPct} 
                sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(99, 102, 241, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: "#6366f1" } }} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.05)",
              border: "1px solid rgba(16, 185, 129, 0.1)",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.02) 0%, rgba(16, 185, 129, 0) 100%)"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#10b981", mb: 1 }}>
                📈 Monthly Revenue Target
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                  {formatCurrency(monthlyRevenueVal)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Goal: {formatCurrency(monthlyTarget)} ({monthlyTargetPct}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={monthlyTargetPct} 
                sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(16, 185, 129, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: "#10b981" } }} 
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.05)",
              border: "1px solid rgba(139, 92, 246, 0.1)",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(139, 92, 246, 0) 100%)"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#8b5cf6", mb: 1 }}>
                📦 Order Fulfillment Progress
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                  {completedOrders} / {totalOrdersVal}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Fulfillment Rate: {fulfillmentPct}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={fulfillmentPct} 
                sx={{ height: 8, borderRadius: 4, bgcolor: "rgba(139, 92, 246, 0.1)", "& .MuiLinearProgress-bar": { bgcolor: "#8b5cf6" } }} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 6 Business KPI Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Today's Revenue"
            value={formatCurrency(todayRevenueVal)}
            change="+15.4%"
            color="#3b82f6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(monthlyRevenueVal)}
            change="+14.2%"
            color="#10b981"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="8" x2="16" y2="16"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="8" x2="8" y2="16"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Orders"
            value={totalOrdersVal}
            change="+24 today"
            color="#8b5cf6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Pending Orders"
            value={pendingOrdersVal}
            change="-5 since yesterday"
            color="#ef4444"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Customers"
            value={totalCustomersVal}
            change="+85 this week"
            color="#f59e0b"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Products"
            value={totalProductsVal}
            change="+12 this week"
            color="#06b6d4"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
          />
        </Grid>
      </Grid>

      {/* Coupon Analytics Row */}
      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#475569", mb: 2, mt: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
        🎟️ Coupon & Discount Metrics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Coupon Orders"
            value={stats.coupon_orders || 0}
            change="Orders with coupons"
            color="#10b981"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><path d="M12 9v6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Discount"
            value={formatCurrency(stats.today_discount_given || 0)}
            change="Discount given today"
            color="#ef4444"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="14.5" y1="9.5" x2="9.5" y2="14.5"/><circle cx="10" cy="10" r="1"/><circle cx="14" cy="14" r="1"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Most Used Coupon"
            value={stats.most_used_coupon || "N/A"}
            change="Highest popularity"
            color="#8b5cf6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue After Discounts"
            value={formatCurrency(stats.revenue_after_discounts || stats.revenue || 0)}
            change="Gross net revenue"
            color="#f59e0b"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default KPISection;
