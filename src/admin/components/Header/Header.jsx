import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";
import profileService from "../../services/profileService";
import NotificationBell from "../Notifications/NotificationBell";

function Header({ onToggleSidebar, sidebarOpen }) {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (adminUser) {
      const fetchProfile = async () => {
        try {
          const response = await profileService.getProfile();
          setProfileData(response.data);
        } catch (e) {
          console.error("Failed to fetch admin profile for header", e);
        }
      };
      fetchProfile();
    }
  }, [adminUser]);

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

  // Get active fields from profileData with fallbacks
  const displayName = profileData?.name || adminUser?.fullName || "Administrator";
  const displayEmail = profileData?.email || adminUser?.email || "";
  const displayAvatar = profileData?.avatar || adminUser?.avatar || "";
  const displayPhone = profileData?.phone || adminUser?.phone || "Not Set";
  const displayRole = profileData?.role || adminUser?.role || "Super Admin";
  const displayJoined = profileData?.joinedDate || adminUser?.joinedDate || "Jan 2025";

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
            <NotificationBell />
            <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "right" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: "#3b82f6", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }}></span>
                {displayRole}
              </Typography>
            </Box>
            
            <IconButton 
              onClick={handleMenuOpen} 
              sx={{ 
                p: 0.5,
                border: "2px solid rgba(59, 130, 246, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  border: "2px solid #3b82f6",
                  transform: "scale(1.05)"
                }
              }}
            >
              <Avatar
                src={displayAvatar}
                sx={{
                  bgcolor: "#3b82f6",
                  width: 38,
                  height: 38,
                  fontWeight: 700,
                  fontSize: "0.95rem"
                }}
              >
                {displayName.charAt(0).toUpperCase()}
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
                  filter: "drop-shadow(0px 10px 30px rgba(0,0,0,0.15))",
                  mt: 1.5,
                  borderRadius: "20px",
                  border: "none",
                  p: 0,
                  bgcolor: "transparent",
                  boxShadow: "none"
                }
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* Premium GUI Card inside the popup */}
              <Box
                sx={{
                  width: 310,
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                  borderRadius: "20px",
                  p: 3,
                  position: "relative",
                  color: "#ffffff",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-40%",
                    left: "-40%",
                    width: "180%",
                    height: "180%",
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }
                }}
              >
                {/* Chip & Brand */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 28,
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                      borderRadius: "6px",
                      position: "relative",
                      border: "1px solid #b45309",
                      boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "80%",
                        height: "1px",
                        bgcolor: "rgba(0,0,0,0.15)",
                        top: "50%",
                        left: "10%",
                      }
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      textTransform: "uppercase", 
                      letterSpacing: 2, 
                      fontWeight: 800, 
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: "0.7rem" 
                    }}
                  >
                    ShopEase Admin
                  </Typography>
                </Box>

                {/* Profile Photo & Basic Info */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2.5, position: "relative", zIndex: 1 }}>
                  <Box sx={{ position: "relative", mb: 1.5 }}>
                    <Avatar
                      src={displayAvatar}
                      sx={{
                        width: 84,
                        height: 84,
                        border: "3px solid #3b82f6",
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
                        bgcolor: "#1e3a8a",
                        fontSize: "2.2rem",
                        fontWeight: 800
                      }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 3,
                        right: 3,
                        width: 14,
                        height: 14,
                        bgcolor: "#10b981",
                        border: "2.5px solid #0f172a",
                        borderRadius: "50%",
                        boxShadow: "0 0 10px #10b981",
                        animation: "pulse 2s infinite"
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, textAlign: "center", mb: 0.5, letterSpacing: 0.5, fontSize: "1.1rem" }}>
                    {displayName}
                  </Typography>
                  
                  <Box
                    sx={{
                      background: "linear-gradient(90deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)",
                      px: 2,
                      py: 0.4,
                      borderRadius: "20px",
                      border: "1px solid rgba(59, 130, 246, 0.3)"
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color: "#60a5fa", fontSize: "0.68rem" }}>
                      {displayRole}
                    </Typography>
                  </Box>
                </Box>

                {/* Details Section */}
                <Box 
                  sx={{ 
                    bgcolor: "rgba(255, 255, 255, 0.03)", 
                    borderRadius: "14px", 
                    p: 2, 
                    border: "1px solid rgba(255, 255, 255, 0.06)", 
                    mb: 2.5 
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.45)", fontWeight: 700 }}>EMAIL</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#f8fafc", maxWidth: "170px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {displayEmail}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.45)", fontWeight: 700 }}>PHONE</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#f8fafc" }}>
                      {displayPhone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.45)", fontWeight: 700 }}>JOINED</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#f8fafc" }}>
                      {displayJoined}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={() => {
                      handleMenuClose();
                      navigate("/admin/settings");
                    }}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.06)",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      py: 0.8,
                      fontSize: "0.8rem",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.12)",
                        border: "1px solid rgba(255, 255, 255, 0.2)"
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={handleLogoutClick}
                    sx={{
                      bgcolor: "#ef4444",
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      py: 0.8,
                      fontSize: "0.8rem",
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                      "&:hover": {
                        bgcolor: "#dc2626",
                        boxShadow: "0 6px 16px rgba(239, 68, 68, 0.3)"
                      }
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
