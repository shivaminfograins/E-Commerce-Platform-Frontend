import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Paper, Typography, Box } from "@mui/material";

function RevenueChart({ data = [] }) {
  const formatCurrencyYAxis = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${val}`;
  };

  return (
    <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Monthly Revenue Trend
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gross monthly income performance metrics
        </Typography>
      </Box>
      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={formatCurrencyYAxis} />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
              contentStyle={{ bgcolor: "white", border: "1px solid rgba(15,23,42,0.1)", borderRadius: "8px" }}
              labelStyle={{ fontWeight: 700 }}
            />
            <Legend verticalAlign="top" height={36} />
            <Area
              name="Gross Revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default RevenueChart;
