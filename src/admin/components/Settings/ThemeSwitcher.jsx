import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useAdminTheme } from "../../context/AdminThemeContext";

const ThemeSwitcher = React.memo(function ThemeSwitcher() {
  const { darkMode, toggleTheme } = useAdminTheme();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 2,
        bgcolor: "background.paper"
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Application Theme Mode
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure the default color scheme theme layout preference
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={toggleTheme}
        color={darkMode ? "primary" : "secondary"}
        startIcon={
          darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )
        }
        sx={{
          borderRadius: "10px",
          fontWeight: 700
        }}
      >
        Switch to {darkMode ? "Light Mode" : "Dark Mode"}
      </Button>
    </Paper>
  );
});

export default ThemeSwitcher;
