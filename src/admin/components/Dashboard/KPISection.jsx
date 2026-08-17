import React from "react";
import { Grid, Card, CardContent, Typography, Box, LinearProgress } from "@mui/material";
import StatCard from "./StatCard";

function KPISection({ stats = {} }) {
  // Extract values
  const revenueVal = Number(stats.revenue || 0);
  const totalOrdersVal = stats.total_orders || 0;
  const pendingOrdersVal = stats.pending_orders || 0;
  const totalCustomersVal = stats.total_customers || 0;
  const aovVal = Number(stats.average_order_value || 0);
  const unitsSoldVal = stats.units_sold || 0;

  // Format currency helpers
  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Format growth percentage helpers
  const formatGrowth = (val) => {
    if (val === null || val === undefined) return "No comparison data";
    return val >= 0 ? `+${val}% vs last period` : `${val}% vs last period`;
  };

  // Goal values (mock/targets for visualization)
  const monthlyTarget = 300000;
  const monthlyTargetPct = Math.min(Math.round((revenueVal / monthlyTarget) * 100), 100);

  const completedOrders = totalOrdersVal - pendingOrdersVal;
  const fulfillmentPct = totalOrdersVal > 0 ? Math.round((completedOrders / totalOrdersVal) * 100) : 100;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Target/Goal Cards Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
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
                📈 Selected Period Revenue Target
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                  {formatCurrency(revenueVal)}
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

        <Grid item xs={12} md={6}>
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
                📦 Period Order Fulfillment Progress
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

      {/* 5 Premium KPI Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Revenue"
            value={formatCurrency(revenueVal)}
            change={formatGrowth(stats.growth?.revenue)}
            color="#10b981"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Orders"
            value={totalOrdersVal}
            change={formatGrowth(stats.growth?.orders)}
            color="#8b5cf6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Customers"
            value={totalCustomersVal}
            change={formatGrowth(stats.growth?.customers)}
            color="#f59e0b"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Average Order Value"
            value={formatCurrency(aovVal)}
            change={formatGrowth(stats.growth?.aov)}
            color="#3b82f6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Units Sold"
            value={unitsSoldVal}
            change={formatGrowth(stats.growth?.units_sold)}
            color="#06b6d4"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="8" x2="16" y2="16"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="8" x2="8" y2="16"/></svg>}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default KPISection;
