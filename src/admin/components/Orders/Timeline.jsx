import React from "react";
import { Box, Typography } from "@mui/material";

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "#ea580c";
    case "Confirmed":
      return "#2563eb";
    case "Packed":
      return "#7c3aed";
    case "Shipped":
      return "#0284c7";
    case "Delivered":
      return "#16a34a";
    case "Cancelled":
      return "#dc2626";
    default:
      return "#64748b";
  }
};

const Timeline = React.memo(function Timeline({ events = [] }) {
  // Sort events chronologically (newest at bottom)
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [events]);

  if (!events || events.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
        No timeline events captured yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ pl: 1, py: 2 }}>
      {sortedEvents.map((event, index) => {
        const color = getStatusColor(event.status);
        const isLast = index === sortedEvents.length - 1;

        return (
          <Box key={index} sx={{ display: "flex", position: "relative", pb: isLast ? 0 : 3 }}>
            {/* Vertical connector line */}
            {!isLast && (
              <Box
                sx={{
                  position: "absolute",
                  left: 9,
                  top: 20,
                  bottom: 0,
                  width: 2,
                  bgcolor: "rgba(148, 163, 184, 0.2)"
                }}
              />
            )}

            {/* Circular milestone node */}
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                bgcolor: "white",
                border: `4px solid ${color}`,
                zIndex: 1,
                mr: 2.5,
                mt: 0.5,
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
              }}
            />

            {/* Event Description Card */}
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5, flexWrap: "wrap" }}>
                <Typography sx={{ fontWeight: 800, color: color, fontSize: "0.95rem" }}>
                  {event.status}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {new Date(event.timestamp).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.4 }}>
                {event.description}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
});

export default Timeline;
