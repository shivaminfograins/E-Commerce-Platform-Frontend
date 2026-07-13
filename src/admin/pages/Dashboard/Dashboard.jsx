import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, LineChart, Line, Legend } from "recharts";

import StatCard from "../../components/Dashboard/StatCard";
import ChartCard from "../../components/Dashboard/ChartCard";
import RecentOrders from "../../components/Dashboard/RecentOrders";
import RecentCustomers from "../../components/Dashboard/RecentCustomers";
import TopProducts from "../../components/Dashboard/TopProducts";

// DUMMY DATA FOR CHARTS
const salesData = [
  { name: "Jan", sales: 4000, revenue: 24000, orders: 120 },
  { name: "Feb", sales: 3000, revenue: 13980, orders: 98 },
  { name: "Mar", sales: 2000, revenue: 9800, orders: 86 },
  { name: "Apr", sales: 2780, revenue: 39080, orders: 190 },
  { name: "May", sales: 1890, revenue: 48000, orders: 240 },
  { name: "Jun", sales: 2390, revenue: 38000, orders: 150 },
  { name: "Jul", sales: 3490, revenue: 43000, orders: 210 }
];

// DUMMY DATA FOR WIDGETS
const recentOrders = [
  { id: "ORD-9432", customer: "Amir Khan", date: "July 10, 2026", total: "₹12,499", status: "Delivered" },
  { id: "ORD-9431", customer: "Priya Sharma", date: "July 09, 2026", total: "₹4,200", status: "Processing" },
  { id: "ORD-9430", customer: "Rohan Das", date: "July 09, 2026", total: "₹24,999", status: "Pending" },
  { id: "ORD-9429", customer: "Neha Gupta", date: "July 08, 2026", total: "₹1,850", status: "Delivered" }
];

const latestCustomers = [
  { id: 1, name: "Aarav Mehta", email: "aarav.mehta@gmail.com", joined: "Today" },
  { id: 2, name: "Sneha Patel", email: "sneha.patel@yahoo.com", joined: "Yesterday" },
  { id: 3, name: "Kabir Singh", email: "kabir.singh@outlook.com", joined: "2 days ago" },
  { id: 4, name: "Ananya Rao", email: "ananya.rao@gmail.com", joined: "3 days ago" }
];

const topProducts = [
  { id: 1, name: "Pro Gaming Laptop v2", category: "Laptops", sales: 120, revenue: "₹14,40,000" },
  { id: 2, name: "Noise Cancelling Headphones", category: "Audio", sales: 98, revenue: "₹4,90,000" },
  { id: 3, name: "Smart Fitness Watch Ultra", category: "Wearables", sales: 86, revenue: "₹2,58,000" },
  { id: 4, name: "Mechanical Gaming Keyboard", category: "Accessories", sales: 74, revenue: "₹1,48,000" }
];

function Dashboard() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
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
            value="148"
            change="+12 this week"
            color="#3b82f6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Categories"
            value="12"
            change="Stable"
            color="#f59e0b"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Orders"
            value="892"
            change="+24 today"
            color="#10b981"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Customers"
            value="2,450"
            change="+85 this week"
            color="#8b5cf6"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Pending Orders"
            value="18"
            change="-5 since yesterday"
            color="#ef4444"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Revenue"
            value="₹4,89,600"
            change="+14.2% month-on-month"
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
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <ChartCard title="Revenue Chart" subtitle="Gross monthly income performance in INR">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
              <LineChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <RecentOrders orders={recentOrders} />
        </Grid>

        {/* Latest Customers List */}
        <Grid item xs={12} md={6} lg={3}>
          <RecentCustomers customers={latestCustomers} />
        </Grid>

        {/* Top Selling Products List */}
        <Grid item xs={12} md={6} lg={3}>
          <TopProducts products={topProducts} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
