import React from "react";
import { Box, CircularProgress } from "@mui/material";

function Loader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "#f8fafc"
      }}
    >
      <CircularProgress size={50} thickness={4.5} sx={{ color: "#3b82f6" }} />
    </Box>
  );
}

export default Loader;
