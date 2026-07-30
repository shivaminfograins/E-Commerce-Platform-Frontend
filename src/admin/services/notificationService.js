import api from "../../api/axios";

const notificationService = {
  getNotifications: async (params = {}) => {
    // params can include: is_read, notification_type, priority, search, page, ordering, limit
    const response = await api.get("/admin/notifications/", { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/admin/notifications/unread-count/");
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/admin/notifications/${id}/mark-read/`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch("/admin/notifications/mark-all-read/");
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/admin/notifications/${id}/`);
    return response.data;
  },

  createTestNotification: async (data = {}) => {
    const response = await api.post("/admin/notifications/test/", data);
    return response.data;
  },
};

export default notificationService;
