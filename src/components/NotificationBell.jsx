import React, { useState, useEffect } from "react";
import notificationService from "../services/notificationService";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationService.getUnreadCount();
      if (res.data) {
        setUnreadCount(res.data.unread_count || res.data.count || 0);
      }
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationService.getNotifications({ page_size: 10 });
      if (res.data && res.data.results) {
        setNotifications(res.data.results);
      } else if (Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error("Failed to mark notification read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  return (
    <div className="notification-bell-container" style={{ position: "relative" }}>
      <button
        className="wishlist-icon-btn"
        onClick={handleToggle}
        aria-label="Open Notifications"
        style={{ marginRight: "10px", position: "relative" }}
      >
        <div className="cart-btn-content" style={{ gap: 0 }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && <span className="cart-badge" style={{ backgroundColor: "#2563eb" }}>{unreadCount}</span>}
        </div>
      </button>

      {isOpen && (
        <div
          className="notification-dropdown"
          style={{
            position: "absolute",
            right: 0,
            top: "45px",
            width: "320px",
            maxHeight: "420px",
            overflowY: "auto",
            backgroundColor: "#ffffff",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            borderRadius: "12px",
            zIndex: 1000,
            border: "1px solid #e2e8f0",
            padding: "12px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", paddingBottom: "8px", borderBottom: "1px solid #f1f5f9" }}>
            <span style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{ background: "none", border: "none", color: "#2563eb", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", fontSize: "13px", color: "#64748b" }}>Loading...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "20px", textAlign: "center", fontSize: "13px", color: "#64748b" }}>No notifications</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: n.is_read ? "#ffffff" : "#eff6ff",
                    border: "1px solid",
                    borderColor: n.is_read ? "#f1f5f9" : "#bfdbfe",
                    cursor: "default",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontWeight: "600", fontSize: "13px", color: "#1e293b" }}>{n.title}</span>
                    {!n.is_read && (
                      <button
                        onClick={(e) => handleMarkRead(n.id, e)}
                        title="Mark as read"
                        style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", fontSize: "11px", padding: 0 }}
                      >
                        ?
                      </button>
                    )}
                  </div>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#475569", lineHeight: "1.4" }}>{n.message}</p>
                  <span style={{ fontSize: "10px", color: "#94a3b8", display: "block", marginTop: "6px" }}>
                    {n.created_at_formatted ? new Date(n.created_at_formatted).toLocaleString() : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
