import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { useAdminAuth } from "../../context/AdminAuthContext";

function Header({ onToggleSidebar, sidebarOpen }) {
  const { adminUser, logout } = useAdminAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logout();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        color: "#1e293b",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        {/* Toggle Sidebar Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onToggleSidebar}
            edge="start"
            sx={{
              mr: 2,
              p: 1,
              borderRadius: "10px",
              bgcolor: "rgba(15, 23, 42, 0.03)",
              "&:hover": { bgcolor: "rgba(15, 23, 42, 0.06)" }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: "#1e293b" }}>
            ShopEase Admin Panel
          </Typography>
        </Box>

        {/* Admin profile options */}
        {adminUser && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                {adminUser.fullName}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Administrator
              </Typography>
            </Box>
            
            <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  bgcolor: "#3b82f6",
                  width: 40,
                  height: 40,
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}
              >
                {adminUser.fullName ? adminUser.fullName.charAt(0).toUpperCase() : "A"}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                  mt: 1.5,
                  borderRadius: "12px",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  minWidth: 160,
                  "& .MuiMenuItem-root": {
                    py: 1.2,
                    px: 2,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }
                }
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #f1f5f9" }}>
                <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                  {adminUser.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {adminUser.email}
                </Typography>
              </Box>
              <MenuItem onClick={handleLogoutClick} sx={{ color: "#ef4444" }}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
