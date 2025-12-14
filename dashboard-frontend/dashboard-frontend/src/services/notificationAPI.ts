import api from "./api";

const notificationAPI = {
  getAllNotifications: () => api.get("/api/notifications"),
  markAsRead: (id: number) => api.post(`/api/notifications/${id}/read`),
  clearAll: () => api.post("/api/notifications/clear"),
};

export default notificationAPI;
