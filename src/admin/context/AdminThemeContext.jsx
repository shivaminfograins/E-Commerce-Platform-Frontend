import React, { createContext, useState, useContext, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

const AdminThemeContext = createContext();

export function AdminThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("shopease_admin_dark_mode");
    return saved ? JSON.parse(saved) : false;
  });

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("shopease_admin_dark_mode", JSON.stringify(next));
      return next;
    });
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: darkMode ? "#0f172a" : "#f8fafc",
        paper: darkMode ? "#1e293b" : "#ffffff"
      },
      primary: {
        main: "#3b82f6"
      },
      text: {
        primary: darkMode ? "#f8fafc" : "#1e293b",
        secondary: darkMode ? "#94a3b8" : "#64748b"
      }
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: 600
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none"
          }
        }
      }
    }
  });

  return (
    <AdminThemeContext.Provider value={{ darkMode, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}
