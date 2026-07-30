import React from "react";
import { Badge } from "@mui/material";

function NotificationBadge({ count, children, ...props }) {
  return (
    <Badge
      badgeContent={count}
      color="error"
      max={99}
      sx={{
        "& .MuiBadge-badge": {
          right: 3,
          top: 3,
          border: "2px solid #ffffff",
          padding: "0 4px",
          fontWeight: 700,
          fontSize: "0.7rem",
          height: 18,
          minWidth: 18,
          boxShadow: "0 2px 10px rgba(239, 68, 68, 0.4)",
        },
      }}
      {...props}
    >
      {children}
    </Badge>
  );
}

export default NotificationBadge;
