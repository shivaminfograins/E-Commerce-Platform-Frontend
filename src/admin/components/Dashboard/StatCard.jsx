import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

function StatCard({ title, value, change, color, icon }) {
  const isPositive = change?.startsWith("+");
  const isNegative = change?.startsWith("-");

  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(15, 23, 42, 0.05)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#64748b" }}>
            {title}
          </Typography>
          <Box
            sx={{
              color: color || "#3b82f6",
              p: 1,
              borderRadius: "10px",
              bgcolor: `${color || "#3b82f6"}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
          {value}
        </Typography>
        {change && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: isPositive ? "#10b981" : isNegative ? "#ef4444" : "#64748b",
            }}
          >
            {change}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default StatCard;
