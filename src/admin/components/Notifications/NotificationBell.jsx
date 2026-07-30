import React, { useState, useEffect } from "react";
import { IconButton, Popover } from "@mui/material";
import NotificationBadge from "./NotificationBadge";
import NotificationDropdown from "./NotificationDropdown";
import { useNotifications } from "../../hooks/useNotifications";

function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Use hook with polling enabled
  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markRead,
    markAllRead,
    deleteNotification,
  } = useNotifications(true, 30000);

  // Fetch initial notifications for dropdown on mount
  useEffect(() => {
    fetchNotifications({ limit: 10 });
  }, [fetchNotifications]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    // Refresh to get fresh list
    fetchNotifications({ limit: 10 });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleOpen}
        sx={{
          p: 1,
          borderRadius: "10px",
          bgcolor: "rgba(15, 23, 42, 0.03)",
          "&:hover": { bgcolor: "rgba(15, 23, 42, 0.06)" },
          transition: "all 0.2s ease",
        }}
      >
        <NotificationBadge count={unreadCount}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bell"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </NotificationBadge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            border: "none",
            boxShadow: "none",
            bgcolor: "transparent",
            overflow: "visible",
          },
        }}
      >
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          loading={loading}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
          onDelete={deleteNotification}
          onClose={handleClose}
        />
      </Popover>
    </>
  );
}

export default NotificationBell;
export { NotificationBell };
