import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

function ChartCard({ title, subtitle, children }) {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
        border: "1px solid rgba(15, 23, 42, 0.06)",
        height: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
          borderColor: "rgba(15, 23, 42, 0.12)",
        }
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
