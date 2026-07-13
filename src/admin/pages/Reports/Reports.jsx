import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, CircularProgress, Alert } from "@mui/material";
import StatCard from "../../components/Dashboard/StatCard";
import SalesChart from "../../components/Reports/SalesChart";
import RevenueChart from "../../components/Reports/RevenueChart";
import TopProducts from "../../components/Reports/TopProducts";
import TopCategories from "../../components/Reports/TopCategories";
import reportService from "../../services/reportService";

function Reports() {
  const [metrics, setMetrics] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    setError("");
    try {
      const [
        metricsRes,
        revenueRes,
        salesRes,
        productsRes,
        categoriesRes
      ] = await Promise.all([
        reportService.getSummaryMetrics(),
        reportService.getRevenueData(),
        reportService.getSalesData(),
        reportService.getTopProducts(),
        reportService.getTopCategories()
      ]);

      setMetrics(metricsRes.data);
      setRevenueData(revenueRes.data);
      setSalesData(salesRes.data);
      setTopProducts(productsRes.data);
      setTopCategories(categoriesRes.data);
    } catch (err) {
      setError("Failed to fetch reports and analytics data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8, flexGrow: 1 }}>
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Analyze store sales volume, performance trends, products, and categories distributions.
        </Typography>
      </Box>

      {/* Metrics Row (5 cards) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Sales Volume"
            value={metrics.sales.value}
            change={metrics.sales.change}
            color="#3b82f6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Revenue"
            value={metrics.revenue.value}
            change={metrics.revenue.change}
            color="#10b981"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Total Orders"
            value={metrics.orders.value}
            change={metrics.orders.change}
            color="#8b5cf6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Registered Customers"
            value={metrics.customers.value}
            change={metrics.customers.change}
            color="#ec4899"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            title="Listed Products"
            value={metrics.products.value}
            change={metrics.products.change}
            color="#f59e0b"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
          />
        </Grid>
      </Grid>

      {/* Primary Graphs Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <RevenueChart data={revenueData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SalesChart data={salesData} />
        </Grid>
      </Grid>

      {/* Bottom Lists & Category Distribution */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <TopCategories categories={topCategories} />
        </Grid>
        <Grid item xs={12} md={6} lg={8}>
          <TopProducts products={topProducts} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Reports;
