import api from "../api/axios";

const notificationService = {
  // Fetch paginated customer notifications
  getNotifications: async (params = {}) => {
    return api.get("/notifications/", { params });
  },

  // Fetch unread count for badge
  getUnreadCount: async () => {
    return api.get("/notifications/unread-count/");
  },

  // Mark single notification read
  markRead: async (id) => {
    return api.patch(`/notifications/${id}/read/`);
  },

  // Mark all notifications read
  markAllRead: async () => {
    return api.post("/notifications/read-all/");
  },
};

export default notificationService;
