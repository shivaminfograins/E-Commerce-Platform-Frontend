import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#ffffff",
        borderTop: "1px solid rgba(15, 23, 42, 0.08)",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {"© "}
        {new Date().getFullYear()}
        {" ShopEase Admin Panel. All rights reserved."}
      </Typography>
    </Box>
  );
}

export default Footer;
