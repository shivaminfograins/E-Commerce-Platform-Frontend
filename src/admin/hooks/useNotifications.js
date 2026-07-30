import { useState, useEffect, useCallback, useRef } from "react";
import notificationService from "../services/notificationService";

export function useNotifications(autoPoll = true, pollIntervalMs = 30000) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0); // Total matching notifications in DB
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  
  // Cache active fetch parameters to allow refreshes
  const activeParamsRef = useRef({});

  // Fetch notifications
  const fetchNotifications = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    activeParamsRef.current = params;
    try {
      const data = await notificationService.getNotifications(params);
      if (Array.isArray(data)) {
        // Handle non-paginated or list payload
        setNotifications(data);
        setCount(data.length);
      } else {
        // Handle paginated payload
        setNotifications(data.results || []);
        setCount(data.count || 0);
        setNext(data.next);
        setPrevious(data.previous);
      }
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error("Failed to load unread count:", err);
    }
  }, []);

  // Refresh both
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchNotifications(activeParamsRef.current),
      fetchUnreadCount()
    ]);
  }, [fetchNotifications, fetchUnreadCount]);

  // Mark single as read
  const markRead = useCallback(async (id) => {
    try {
      await notificationService.markAsRead(id);
      // Optimistic state updates
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(`Failed to mark notification ${id} as read:`, err);
    }
  }, []);

  // Mark all as read
  const markAllRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id) => {
    try {
      const isUnread = notifications.find((n) => n.id === id)?.is_read === false;
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (isUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(`Failed to delete notification ${id}:`, err);
    }
  }, [notifications]);

  // Seed test notification
  const seedTestNotification = useCallback(async (type, priority, title, message) => {
    try {
      await notificationService.createTestNotification({
        notification_type: type,
        priority: priority,
        title: title,
        message: message,
      });
      await refresh();
    } catch (err) {
      console.error("Failed to create test notification:", err);
    }
  }, [refresh]);

  // Automatic Polling
  useEffect(() => {
    // Initial fetch
    fetchUnreadCount();

    if (!autoPoll) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
      // Silently refresh active notifications list (without loading spinner)
      notificationService.getNotifications(activeParamsRef.current)
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
          } else {
            setNotifications(data.results || []);
            setCount(data.count || 0);
          }
        })
        .catch(console.error);
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [autoPoll, pollIntervalMs, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    count,
    next,
    previous,
    fetchNotifications,
    fetchUnreadCount,
    refresh,
    markRead,
    markAllRead,
    deleteNotification,
    seedTestNotification,
  };
}
