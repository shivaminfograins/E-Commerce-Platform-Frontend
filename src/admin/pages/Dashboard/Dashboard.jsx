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
import QuickActionsPanel from "../../components/Dashboard/QuickActionsPanel";

function Dashboard() {
  const navigate = useNavigate();

  // Primary States
  const [stats, setStats] = useState(null);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [ordersTrend, setOrdersTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChartTab, setActiveChartTab] = useState("revenue");

  // Filters State
  const [timeRange, setTimeRange] = useState("last_30_days");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Export Menu State
  const [exportAnchorEl, setExportAnchorEl] = useState(null);
  const openExport = Boolean(exportAnchorEl);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, startDate, endDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { range: timeRange };
      if (timeRange === "custom") {
        params.start_date = startDate;
        params.end_date = endDate;
      }
      const [dashboardRes, revenueRes, salesRes, ordersRes] = await Promise.all([
        api.get("/admin/dashboard/", { params }),
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
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="last_7_days">Last 7 Days</MenuItem>
              <MenuItem value="last_30_days">Last 30 Days</MenuItem>
              <MenuItem value="this_month">This Month</MenuItem>
              <MenuItem value="last_month">Last Month</MenuItem>
              <MenuItem value="this_year">This Year</MenuItem>
              <MenuItem value="custom">Custom Date Range</MenuItem>
            </Select>
          </FormControl>
          {timeRange === "custom" && (
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <TextField
                type="date"
                label="Start Date"
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "background.paper" } }}
              />
              <TextField
                type="date"
                label="End Date"
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", bgcolor: "background.paper" } }}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* SECTION: Action Required */}
      {stats?.action_required && stats.action_required.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#e11d48", mb: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            🚨 Action Required
          </Typography>
          <Grid container spacing={2}>
            {stats.action_required.map((act, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    borderRadius: "16px", 
                    border: `1px solid ${act.severity === "danger" ? "#fecdd3" : "#fef3c7"}`, 
                    bgcolor: act.severity === "danger" ? "#fff5f5" : "#fffbeb",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "space-between"
                  }}
                >
                  <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 }, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 850, color: act.severity === "danger" ? "#991b1b" : "#92400e" }}>
                        {act.message}
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      size="small" 
                      color={act.severity === "danger" ? "error" : "warning"}
                      onClick={() => navigate(act.link)}
                      sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700, whiteSpace: "nowrap" }}
                    >
                      {act.button_text}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* SECTION 1: Business KPI Cards & Targets */}
      <KPISection stats={stats} />

      {/* SECTION: Order Status Overview */}
      {stats?.order_status_summary && stats.order_status_summary.length > 0 && (
        <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.06)", boxShadow: "0 4px 20px rgba(15,23,42,0.03)", mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
              📈 Order Fulfillment Pipeline
            </Typography>
            <Grid container spacing={2}>
              {stats.order_status_summary.map((item) => {
                const displayLabel = item.status.charAt(0).toUpperCase() + item.status.slice(1);
                let statusColor = "#64748b"; // default neutral
                let bg = "#f1f5f9";
                if (item.status === "pending") { statusColor = "#f59e0b"; bg = "#fef3c7"; }
                else if (item.status === "confirmed" || item.status === "processing" || item.status === "packed") { statusColor = "#3b82f6"; bg = "#dbeafe"; }
                else if (item.status === "shipped") { statusColor = "#8b5cf6"; bg = "#ede9fe"; }
                else if (item.status === "delivered") { statusColor = "#10b981"; bg = "#d1fae5"; }
                else if (item.status === "cancelled" || item.status === "refunded") { statusColor = "#ef4444"; bg = "#fee2e2"; }

                return (
                  <Grid item xs={6} sm={4} md={2} key={item.status}>
                    <Box 
                      onClick={() => navigate(`/admin/orders?status=${item.status}`)}
                      sx={{ 
                        p: 2.5, 
                        borderRadius: "12px", 
                        bgcolor: bg, 
                        textAlign: "center", 
                        cursor: "pointer", 
                        border: "1px solid transparent",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          borderColor: statusColor,
                          boxShadow: `0 4px 12px ${statusColor}15`
                        }
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 800, color: statusColor }}>
                        {item.count}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                        {displayLabel}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* SECTION 9: Quick Actions Shortcut Panel */}
      <QuickActionsPanel />

      {/* SALES & ORDERS OVERVIEW */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.06)", boxShadow: "0 4px 20px rgba(15,23,42,0.03)" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    📈 Sales & Orders Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monitor store performance and checkout transactions
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, bgcolor: "#f1f5f9", p: 0.5, borderRadius: "8px" }}>
                  <Button 
                    variant={activeChartTab === "revenue" ? "contained" : "text"} 
                    size="small"
                    onClick={() => setActiveChartTab("revenue")}
                    sx={{ 
                      textTransform: "none", 
                      fontWeight: 700, 
                      borderRadius: "6px",
                      boxShadow: activeChartTab === "revenue" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                      bgcolor: activeChartTab === "revenue" ? "background.paper" : "transparent",
                      color: activeChartTab === "revenue" ? "text.primary" : "text.secondary"
                    }}
                  >
                    Revenue
                  </Button>
                  <Button 
                    variant={activeChartTab === "orders" ? "contained" : "text"} 
                    size="small"
                    onClick={() => setActiveChartTab("orders")}
                    sx={{ 
                      textTransform: "none", 
                      fontWeight: 700, 
                      borderRadius: "6px",
                      boxShadow: activeChartTab === "orders" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                      bgcolor: activeChartTab === "orders" ? "background.paper" : "transparent",
                      color: activeChartTab === "orders" ? "text.primary" : "text.secondary"
                    }}
                  >
                    Orders
                  </Button>
                </Box>
              </Box>

              <Box sx={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {activeChartTab === "revenue" ? (
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
                  ) : (
                    <LineChart data={combinedTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <Tooltip formatter={(value) => [value, "Orders"]} />
                      <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
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
