import React from "react";
import { MenuItem, TextField } from "@mui/material";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled"
];

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
      return "#4b5563";
  }
};

const StatusDropdown = React.memo(function StatusDropdown({ currentStatus, onStatusChange, size = "small", fullWidth = false }) {
  return (
    <TextField
      select
      size={size}
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      fullWidth={fullWidth}
      sx={{
        "& .MuiSelect-select": {
          fontWeight: 700,
          color: getStatusColor(currentStatus),
          display: "flex",
          alignItems: "center"
        },
        bgcolor: "white",
        borderRadius: "8px",
        "& fieldset": { borderRadius: "8px" }
      }}
    >
      {ORDER_STATUSES.map((status) => (
        <MenuItem
          key={status}
          value={status}
          sx={{
            fontWeight: 600,
            color: getStatusColor(status)
          }}
        >
          {status}
        </MenuItem>
      ))}
    </TextField>
  );
});

export default StatusDropdown;
export { ORDER_STATUSES };
