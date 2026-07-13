import React from "react";
import { Paper, Typography, Box, Grid, Chip } from "@mui/material";

const AddressCard = React.memo(function AddressCard({ address }) {
  if (!address) return null;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "16px",
        border: "1px solid rgba(15, 23, 42, 0.05)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.01)",
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Box>
        {/* Header containing tags */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Chip
            label={address.type}
            color={address.type === "Shipping" ? "primary" : "secondary"}
            size="small"
            sx={{ fontWeight: 700, borderRadius: "6px", fontSize: "0.75rem" }}
          />
          {address.isDefault && (
            <Chip
              label="Default"
              variant="outlined"
              color="success"
              size="small"
              sx={{ fontWeight: 700, borderRadius: "6px", fontSize: "0.75rem" }}
            />
          )}
        </Box>

        {/* Address Content */}
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
          {address.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
          {address.addressLine1}
          {address.addressLine2 && `, ${address.addressLine2}`}
        </Typography>
        <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
          {address.city}, {address.state} {address.zipCode}
        </Typography>
        <Typography variant="body2" sx={{ color: "#475569", fontWeight: 600, mt: 0.5 }}>
          {address.country}
        </Typography>
      </Box>

      {/* Footer Contact */}
      <Box sx={{ mt: 3, pt: 1.5, borderTop: "1px solid rgba(15,23,42,0.05)" }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
          Contact Phone
        </Typography>
        <Typography variant="body2" sx={{ color: "#334155", fontWeight: 500 }}>
          {address.phone}
        </Typography>
      </Box>
    </Paper>
  );
});

export default AddressCard;
