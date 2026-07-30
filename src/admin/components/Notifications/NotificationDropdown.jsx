import React from "react";
import { Box, Typography, Button, Divider, CircularProgress, Skeleton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationCard from "./NotificationCard";

function NotificationDropdown({
  notifications = [],
  unreadCount = 0,
  loading = false,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClose,
}) {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onClose) onClose();
    navigate("/admin/notifications");
  };

  return (
    <Box
      sx={{
        width: 360,
        bgcolor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.15)",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "#fafbfe",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Box
              sx={{
                bgcolor: "#ef4444",
                color: "#ffffff",
                px: 1,
                py: 0.2,
                borderRadius: "20px",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              {unreadCount} New
            </Box>
          )}
        </Box>
        {unreadCount > 0 && (
          <Button
            size="small"
            onClick={onMarkAllRead}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.75rem",
              color: "#3b82f6",
              p: 0,
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            Mark all read
          </Button>
        )}
      </Box>

      <Divider />

      {/* Notifications List */}
      <Box sx={{ maxHeight: 400, overflowY: "auto", p: 2 }}>
        {loading && notifications.length === 0 ? (
          // Skeletons
          [1, 2, 3].map((i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="100%" height={15} />
              <Skeleton variant="text" width="40%" height={12} />
            </Box>
          ))
        ) : notifications.length === 0 ? (
          // Empty State
          <Box sx={{ py: 6, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 600, mb: 0.5 }}>
              All caught up! 🎉
            </Typography>
            <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
              No new alerts or notifications.
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 10).map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              onCloseDropdown={onClose}
            />
          ))
        )}
      </Box>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 1.5, textAlign: "center", bgcolor: "#fafbfe" }}>
        <Button
          fullWidth
          variant="text"
          onClick={handleViewAll}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#3b82f6",
            py: 0.8,
            borderRadius: "10px",
            "&:hover": { bgcolor: "rgba(59, 130, 246, 0.05)" },
          }}
        >
          View All Notifications
        </Button>
      </Box>
    </Box>
  );
}

export default NotificationDropdown;
