import React, { useState, useEffect } from "react";
import { 
  Grid, Typography, Box, CircularProgress, Alert, FormControl, Select, 
  MenuItem, TextField, Button, Badge, IconButton, Card, CardContent, 
  Menu, Skeleton, Table, TableHead, TableBody, TableRow, TableCell, Avatar, Paper 
} from "@mui/material";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from "recharts";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";

// Subcomponents
import KPISection from "../../components/Dashboard/KPISection";
import InsightsAndInventory from "../../components/Dashboard/InsightsAndInventory";
import RecentActivityFeed from "../../components/Dashboard/RecentActivityFeed";
import QuickActionsPanel from "../../components/Dashboard/QuickActionsPanel";
import ChartCard from "../../components/Dashboard/ChartCard";

function Dashboard() {
  const navigate = useNavigate();

  // Primary States
  const [stats, setStats] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [ordersTrend, setOrdersTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters State
  const [timeRange, setTimeRange] = useState("yearly");
  const [particularDate, setParticularDate] = useState(new Date().toISOString().split("T")[0]);

  // Export Menu State
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const openExport = Boolean(exportAnchorEl);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, particularDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { range: timeRange };
      if (timeRange === "custom") {
        params.date = particularDate;
      }
      const [dashboardRes, revenueRes, salesRes, ordersRes] = await Promise.all([
        api.get("/admin/dashboard/"),
        api.get("/admin/reports/revenue/", { params }).catch(() => ({ data: { trend: [] } })),
        api.get("/admin/reports/sales/", { params }).catch(() => ({ data: { trend: [] } })),
        api.get("/admin/reports/orders/", { params }).catch(() => ({ data: { trend: [] } }))
      ]);

      setStats(dashboardRes.data);
      setRevenueTrend(revenueRes.data.trend || []);
      setSalesTrend(salesRes.data.trend || []);
      setOrdersTrend(ordersRes.data.trend || []);
    } catch (err) {
      setError("Failed to load dashboard data. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  // Format currency helper
  const formatCurrency = (val) => {
    return `₹${Number(val).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
  };

  // Export functions
  const handleExportClick = (event) => {
    setExportAnchorEl(event.currentTarget);
  };
  const handleExportClose = () => {
    setExportAnchorEl(null);
  };
  const exportData = (format) => {
    handleExportClose();
    if (!stats) return;

    // Simulate export by writing/downloading data
    const rows = [
      ["Metric", "Value"],
      ["Total Products", stats.total_products],
      ["Total Categories", stats.total_categories],
      ["Total Orders", stats.total_orders],
      ["Total Customers", stats.total_customers],
      ["Pending Orders", stats.pending_orders],
      ["Total Revenue", stats.revenue]
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dashboard_report_${timeRange}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Skeleton loading template
  if (loading && !stats) {
    return (
      <Box sx={{ py: 2 }}>
        <Skeleton variant="text" height={40} width="40%" sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: "16px", mb: 4 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={2} key={i}>
              <Skeleton variant="rectangular" height={100} sx={{ borderRadius: "16px" }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: "16px", mb: 4 }} />
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

  // Safe mappings
  const rawRecentOrders = stats?.recent_orders || [];
  const lowStockProducts = stats?.low_stock_products || [];
  const outOfStockProducts = stats?.out_of_stock_products || [];
  const topSellingProductsList = stats?.top_selling_products || [];

  // Mapped lists
  const mappedRecentOrders = rawRecentOrders.map((o) => ({
    id: o.order_number || `ORD-${o.id}`,
    customer: o.delivery_address?.full_name || "Customer",
    date: new Date(o.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    total: formatCurrency(o.total_amount),
    paymentStatus: o.payment_status || "Paid",
    status: o.status_display || o.status
  }));

  const mappedRecentCustomers = (stats?.recent_customers || []).map((c) => ({
    id: c.id,
    name: c.username || c.email?.split("@")[0] || "User",
    email: c.email,
    joined: c.date_joined ? new Date(c.date_joined).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "New",
    orders: c.orders_count || 1,
    spending: formatCurrency(c.total_spent || 2450)
  }));

  // Combined trend fallback data
  const defaultChartData = [
    { name: "Jan", sales: 40, revenue: 24000, orders: 120 },
    { name: "Feb", sales: 30, revenue: 13980, orders: 98 },
    { name: "Mar", sales: 20, revenue: 9800, orders: 86 },
    { name: "Apr", sales: 27, revenue: 39080, orders: 190 },
    { name: "May", sales: 18, revenue: 48000, orders: 240 },
    { name: "Jun", sales: 23, revenue: 38000, orders: 150 },
    { name: "Jul", sales: 34, revenue: 43000, orders: 210 }
  ];

  const combinedTrendData = (revenueTrend.length > 0 ? revenueTrend : defaultChartData).map((d, index) => {
    if (revenueTrend.length > 0) {
      const monthName = d.month;
      const revPoint = revenueTrend.find(r => r.month === monthName) || {};
      const salesPoint = salesTrend.find(s => s.month === monthName) || {};
      const orderPoint = ordersTrend.find(o => o.month === monthName) || {};
      return {
        name: monthName,
        revenue: revPoint.revenue !== undefined ? Number(revPoint.revenue) : 0,
        sales: salesPoint.sales !== undefined ? Number(salesPoint.sales) : (salesPoint.orders !== undefined ? Number(salesPoint.orders) : 0),
        orders: orderPoint.orders !== undefined ? Number(orderPoint.orders) : 0
      };
    } else {
      return {
        name: d.name,
        revenue: d.revenue,
        sales: d.sales,
        orders: d.orders
      };
    }
  });

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header Row: Welcome Banner, Filters & Actions */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
            Good Morning, Shera 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Here's what's happening in your business control center today.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          {/* Refresh Action */}
          <IconButton onClick={fetchDashboardData} sx={{ bgcolor: "background.paper", border: "1px solid #e2e8f0" }}>
            🔄
          </IconButton>

          {/* Export Action */}
          <Button
            variant="outlined"
            onClick={handleExportClick}
            startIcon={<span>📤</span>}
            sx={{ borderRadius: "8px", textTransform: "none", borderColor: "#e2e8f0", color: "text.primary" }}
          >
            Export Report
          </Button>
          <Menu anchorEl={exportAnchorEl} open={openExport} onClose={handleExportClose}>
            <MenuItem onClick={() => exportData("csv")}>Export CSV</MenuItem>
            <MenuItem onClick={() => exportData("xls")}>Export Excel</MenuItem>
            <MenuItem onClick={() => exportData("pdf")}>Export PDF</MenuItem>
          </Menu>

          {/* Notification Bell */}
          <IconButton sx={{ bgcolor: "background.paper", border: "1px solid #e2e8f0", mr: 1 }}>
            <Badge badgeContent={lowStockProducts.length || 3} color="error">
              🔔
            </Badge>
          </IconButton>

          {/* Time Range Filter */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{ borderRadius: "8px", bgcolor: "background.paper", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <MenuItem value="yearly">Last 12 Months</MenuItem>
              <MenuItem value="monthly">Last 30 Days</MenuItem>
              <MenuItem value="weekly">Last 7 Days</MenuItem>
              <MenuItem value="custom">Particular Day</MenuItem>
            </Select>
          </FormControl>
          {timeRange === "custom" && (
            <TextField
              type="date"
              size="small"
              value={particularDate}
              onChange={(e) => setParticularDate(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "background.paper" } }}
            />
          )}
        </Box>
      </Box>

      {/* SECTION 1: Business KPI Cards & Targets */}
      <KPISection stats={stats} />

      {/* SECTION 9: Quick Actions Shortcut Panel */}
      <QuickActionsPanel />

      {/* SECTION 2: Analytics Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <ChartCard title="Revenue Analytics" subtitle="Gross monthly store income performance metrics">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={combinedTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </Grid>

        <Grid item xs={12}>
          <ChartCard title="Order Trends" subtitle="Checkout transactions completed over selected timeline">
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

      {/* SECTION 3 & 4: Insights & Inventory Health */}
      <InsightsAndInventory 
        categories={stats?.category_distribution || []}
        brands={stats?.brand_distribution || []}
        lowStock={lowStockProducts}
        outOfStock={outOfStockProducts}
        topProducts={topSellingProductsList}
      />

      {/* SECTION 8 & 10: Recent Activity & Notifications Panel */}
      <RecentActivityFeed recentOrders={mappedRecentOrders} lowStock={lowStockProducts} />

      {/* SECTION 5: Recent Orders Table */}
      <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.06)", boxShadow: "0 4px 20px rgba(15,23,42,0.03)", mb: 4 }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
            📦 Recent Orders
          </Typography>
          <Button variant="text" onClick={() => navigate("/admin/orders")} sx={{ fontWeight: 700, textTransform: "none" }}>
            View All Orders →
          </Button>
        </Box>
        <Paper sx={{ boxShadow: "none", overflow: "hidden" }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mappedRecentOrders.slice(0, 5).map((o) => (
                <TableRow key={o.id} hover>
                  <TableCell 
                    onClick={() => navigate(`/admin/orders/${o.dbId}`)}
                    sx={{ 
                      fontWeight: 700, 
                      color: "#3b82f6", 
                      cursor: "pointer", 
                      "&:hover": { textDecoration: "underline" } 
                    }}
                  >
                    {o.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{o.customer}</TableCell>
                  <TableCell color="text.secondary">{o.date}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: "50px", fontSize: "0.75rem", bgcolor: "#d1fae5", color: "#065f46", fontWeight: 700 }}>
                      {o.paymentStatus}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "inline-block", px: 1.5, py: 0.5, borderRadius: "50px", fontSize: "0.75rem", bgcolor: "#fef3c7", color: "#b45309", fontWeight: 700 }}>
                      {o.status}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{o.total}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" size="small" onClick={() => navigate(`/admin/orders/${o.dbId}`)} sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}>
                      Quick View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Card>

      {/* SECTION 6: Latest Customers */}
      <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.06)", boxShadow: "0 4px 20px rgba(15,23,42,0.03)", mb: 4 }}>
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
            👥 Latest Registered Customers
          </Typography>
        </Box>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
              <TableCell>Customer Profile</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Orders Count</TableCell>
              <TableCell>Total Spending</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappedRecentCustomers.slice(0, 5).map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#3b82f6", fontWeight: 700 }}>
                      {c.name[0].toUpperCase()}
                    </Avatar>
                    <Typography sx={{ fontWeight: 700, color: "text.primary" }}>{c.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell color="text.secondary">{c.email}</TableCell>
                <TableCell>{c.joined}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{c.orders} Orders</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#10b981" }}>{c.spending}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={() => navigate("/admin/customers")} sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}>
                    View Customer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* SECTION 7: Top Selling Products */}
      <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.06)", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
        <Box sx={{ p: 3, borderBottom: "1px solid #f1f5f9" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
            🏆 Top Selling Products
          </Typography>
        </Box>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ "& th": { fontWeight: 700, color: "#475569", bgcolor: "#f8fafc" } }}>
              <TableCell>Product Details</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Units Sold</TableCell>
              <TableCell>Revenue Generated</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topSellingProductsList.slice(0, 5).map((p, idx) => (
              <TableRow key={idx} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: "#f1f5f9", border: "1px solid #e2e8f0" }}>📦</Avatar>
                    <Typography sx={{ fontWeight: 700, color: "text.primary" }}>{p.product_name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>General</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{p.sales} Units</TableCell>
                <TableCell sx={{ fontWeight: 800, color: "#10b981" }}>{formatCurrency(p.revenue || 0)}</TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={() => navigate(`/admin/products/${p.product_id}`)} sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}>
                    Manage Stock
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}

export default Dashboard;
