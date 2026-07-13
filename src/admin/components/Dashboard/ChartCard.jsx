import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

function ChartCard({ title, subtitle, children }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(15, 23, 42, 0.05)",
        height: "100%"
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ width: "100%", height: 300 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ChartCard;
