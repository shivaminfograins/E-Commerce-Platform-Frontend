import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, Legend } from "recharts";
import api from "../../../api/axios";

import StatCard from "../../components/Dashboard/StatCard";
import ChartCard from "../../components/Dashboard/ChartCard";
import RecentOrders from "../../components/Dashboard/RecentOrders";
import RecentCustomers from "../../components/Dashboard/RecentCustomers";
import TopProducts from "../../components/Dashboard/TopProducts";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [ordersTrend, setOrdersTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboardRes, revenueRes, salesRes, ordersRes] = await Promise.all([
        api.get("/admin/dashboard/"),
        api.get("/admin/reports/revenue/").catch(() => ({ data: { trend: [] } })),
        api.get("/admin/reports/sales/").catch(() => ({ data: { trend: [] } })),
        api.get("/admin/reports/orders/").catch(() => ({ data: { trend: [] } }))
      ]);

      setStats(dashboardRes.data);
      setRevenueTrend(revenueRes.data.trend || []);
      setSalesTrend(salesRes.data.trend || []);
      setOrdersTrend(ordersRes.data.trend || []);
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error}</Alert>
      </Box>
    );
  }

  // Format currency helper
  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Map backend stats to cards & tables
  const totalProducts = stats.total_products || 0;
  const totalCategories = stats.total_categories || 0;
  const totalOrders = stats.total_orders || 0;
  const totalCustomers = stats.total_customers || 0;
  const pendingOrders = stats.pending_orders || 0;
  const grossRevenue = formatCurrency(stats.revenue || 0);

  const mappedRecentOrders = (stats.recent_orders || []).map((o) => ({
    id: o.order_number || `ORD-${o.id}`,
    customer: o.delivery_address?.full_name || "Customer",
    date: new Date(o.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    total: formatCurrency(o.total_amount),
    status: o.status_display || o.status
  }));

  const mappedRecentCustomers = (stats.recent_customers || []).map((c) => ({
    id: c.id,
    name: c.username || c.email?.split("@")[0] || "User",
    email: c.email,
    phone: c.phone || "",
    isActive: c.is_active !== false,
    joined: c.date_joined
      ? new Date(c.date_joined).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
      : "New"
  }));

  const mappedTopProducts = (stats.top_selling_products || []).map((p, idx) => ({
    id: idx + 1,
    name: p.product_name,
    category: p.category || "General",
    sales: p.sales,
    revenue: formatCurrency(p.revenue)
  }));

  // Fallback charts trend logic if backend returns empty lists
  const defaultChartData = [
    { name: "Jan", sales: 40, revenue: 24000, orders: 120 },
    { name: "Feb", sales: 30, revenue: 13980, orders: 98 },
    { name: "Mar", sales: 20, revenue: 9800, orders: 86 },
    { name: "Apr", sales: 27, revenue: 39080, orders: 190 },
    { name: "May", sales: 18, revenue: 48000, orders: 240 },
    { name: "Jun", sales: 23, revenue: 38000, orders: 150 },
    { name: "Jul", sales: 34, revenue: 43000, orders: 210 }
  ];

  // Merge report trends to display Recharts visual lines
  const combinedTrendData = defaultChartData.map((d, index) => {
    const revPoint = revenueTrend[index] || {};
    const salesPoint = salesTrend[index] || {};
    const orderPoint = ordersTrend[index] || {};

    return {
      name: revPoint.month || salesPoint.month || orderPoint.month || d.name,
      revenue: revPoint.revenue !== undefined ? Number(revPoint.revenue) : d.revenue,
      sales: salesPoint.orders !== undefined ? Number(salesPoint.orders) : d.sales,
      orders: orderPoint.orders !== undefined ? Number(orderPoint.orders) : d.orders
    };
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Real-time metrics, order status, and performance analysis.
        </Typography>
      </Box>

      {/* Stats Cards (6 metrics) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            change="+12 this week"
            color="#3b82f6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Categories"
            value={totalCategories}
            change="Stable"
            color="#f59e0b"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            change="+24 today"
            color="#10b981"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            change="+85 this week"
            color="#8b5cf6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            change="-5 since yesterday"
            color="#ef4444"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Revenue"
            value={grossRevenue}
            change="+14.2% MoM"
            color="#06b6d4"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </Grid>
      </Grid>

      {/* Charts Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Chart */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Sales Chart" subtitle="Monthly product sales units">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Revenue Chart" subtitle="Gross monthly income performance">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={combinedTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        {/* Orders Chart */}
        <Grid item xs={12} md={4}>
          <ChartCard title="Orders Chart" subtitle="Monthly order checkout volume count">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>
      </Grid>

      {/* Recent Activity widgets */}
      <Grid container spacing={3}>
        {/* Recent Orders table */}
        <Grid item xs={12} lg={6}>
          <RecentOrders orders={mappedRecentOrders} />
        </Grid>

        {/* Latest Customers List */}
        <Grid item xs={12} md={6} lg={3}>
          <RecentCustomers customers={mappedRecentCustomers} />
        </Grid>

        {/* Top Selling Products List */}
        <Grid item xs={12} md={6} lg={3}>
          <TopProducts products={mappedTopProducts} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
