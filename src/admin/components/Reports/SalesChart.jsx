import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Paper, Typography, Box } from "@mui/material";

function SalesChart({ data = [] }) {
  return (
    <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Monthly Order Trends
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Historical order checkouts completed monthly
        </Typography>
      </Box>
      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{ bgcolor: "white", border: "1px solid rgba(15,23,42,0.1)", borderRadius: "8px" }}
              labelStyle={{ fontWeight: 700 }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              name="Orders Count"
              type="monotone"
              dataKey="orders"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default SalesChart;
