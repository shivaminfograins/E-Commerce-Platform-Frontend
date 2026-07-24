import React, { useState } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Breadcrumbs from "../../components/Breadcrumbs";
import { AdminThemeProvider, useAdminTheme } from "../context/AdminThemeContext";

function AdminLayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setMobileOpen(!mobileOpen);
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  return (
    <ProtectedRoute>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <CssBaseline />
        
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          mobileOpen={mobileOpen}
          onCloseMobile={handleCloseMobile}
        />

        {/* Core Shell Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            width: "100%",
            minHeight: "100vh",
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <Header onToggleSidebar={handleToggleSidebar} sidebarOpen={sidebarOpen} />

          {/* Main Area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, sm: 3, md: 4 },
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Breadcrumbs />
            <Outlet />
          </Box>

          {/* Footer */}
          <Footer />
        </Box>
      </Box>
    </ProtectedRoute>
  );
}

function AdminLayout() {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent />
    </AdminThemeProvider>
  );
}

export default AdminLayout;
