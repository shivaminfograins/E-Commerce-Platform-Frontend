import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4"];

function TopCategories({ categories = [] }) {
  return (
    <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)", height: "100%" }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Sales by Category
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Distribution percentage of sales volume
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: 280, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {categories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Volume Share"]} />
            <Legend verticalAlign="bottom" align="center" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default TopCategories;
export { COLORS };
