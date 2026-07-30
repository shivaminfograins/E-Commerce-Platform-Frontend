import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Vanilla helper for dynamic time ago formatting
const formatTimeAgo = (dateString) => {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    
    if (isNaN(diffMs)) return "some time ago";
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch (e) {
    return "recently";
  }
};

// Priority specific config
const PRIORITY_CONFIG = {
  HIGH: { color: "#ef4444", bg: "#fef2f2", label: "High" },
  MEDIUM: { color: "#f59e0b", bg: "#fffbeb", label: "Medium" },
  LOW: { color: "#3b82f6", bg: "#eff6ff", label: "Low" },
};

// Type specific icons/colors config
const TYPE_CONFIG = {
  ORDER: { icon: "📦", color: "#8b5cf6" },
  PAYMENT: { icon: "💳", color: "#10b981" },
  CUSTOMER: { icon: "👤", color: "#3b82f6" },
  PRODUCT: { icon: "🏷️", color: "#ec4899" },
  INVENTORY: { icon: "⚠️", color: "#f59e0b" },
  COUPON: { icon: "🎟️", color: "#10b981" },
  REVIEW: { icon: "⭐", color: "#eab308" },
  SYSTEM: { icon: "⚙️", color: "#64748b" },
};

function NotificationCard({ notification, onMarkRead, onDelete, onCloseDropdown }) {
  const navigate = useNavigate();
  const { id, title, message, notification_type, priority, is_read, created_at, action_url } = notification;

  const typeInfo = TYPE_CONFIG[notification_type] || TYPE_CONFIG.SYSTEM;
  const priorityInfo = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;

  const handleCardClick = (e) => {
    // If user clicked action buttons, do not trigger navigation
    if (e.target.closest("button")) return;
    
    if (!is_read && onMarkRead) {
      onMarkRead(id);
    }
    
    if (onCloseDropdown) {
      onCloseDropdown();
    }

    if (action_url) {
      // In Vite React Router admin routes are prefixed with /admin. 
      // If action_url starts with /admin, navigate there directly.
      const url = action_url.startsWith("/admin") ? action_url : `/admin${action_url}`;
      navigate(url);
    }
  };

  return (
    <Box
      onClick={handleCardClick}
      sx={{
        p: 2,
        mb: 1.5,
        display: "flex",
        position: "relative",
        borderRadius: "12px",
        cursor: action_url ? "pointer" : "default",
        border: "1px solid",
        borderColor: is_read ? "rgba(15, 23, 42, 0.06)" : "rgba(59, 130, 246, 0.15)",
        bgcolor: is_read ? "#ffffff" : "rgba(59, 130, 246, 0.02)",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "rgba(59, 130, 246, 0.3)",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
          transform: action_url ? "translateY(-1px)" : "none",
        },
      }}
    >
      {/* Priority Border/Indicator */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          borderTopLeftRadius: "12px",
          borderBottomLeftRadius: "12px",
          bgcolor: priorityInfo.color,
        }}
      />

      {/* Icon Area */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(15, 23, 42, 0.03)",
          fontSize: "1.2rem",
          mr: 2,
          flexShrink: 0,
        }}
      >
        {typeInfo.icon}
      </Box>

      {/* Content Area */}
      <Box sx={{ flexGrow: 1, pr: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
          <Typography variant="body2" sx={{ fontWeight: is_read ? 600 : 700, color: "#0f172a" }}>
            {title}
          </Typography>
          {!is_read && (
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "#3b82f6",
                boxShadow: "0 0 8px #3b82f6",
              }}
            />
          )}
          
          {/* Priority Label */}
          <Box
            sx={{
              px: 1,
              py: 0.2,
              borderRadius: "4px",
              fontSize: "0.65rem",
              fontWeight: 800,
              textTransform: "uppercase",
              bgcolor: priorityInfo.bg,
              color: priorityInfo.color,
            }}
          >
            {priorityInfo.label}
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: "#475569", display: "block", mb: 1, lineHeight: 1.4 }}>
          {message}
        </Typography>

        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 500 }}>
          {formatTimeAgo(created_at)}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {!is_read && onMarkRead && (
          <Tooltip title="Mark as Read">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onMarkRead(id);
              }}
              sx={{
                color: "#94a3b8",
                "&:hover": { color: "#3b82f6", bgcolor: "rgba(59, 130, 246, 0.05)" },
              }}
            >
              ✔️
            </IconButton>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              sx={{
                color: "#94a3b8",
                "&:hover": { color: "#ef4444", bgcolor: "rgba(239, 68, 68, 0.05)" },
              }}
            >
              🗑️
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

export default NotificationCard;
export { formatTimeAgo };
