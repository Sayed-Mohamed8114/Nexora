import api from "@/Api/axios";

export const getNotifications = async () => {
  const response = await api.get("/api/Notifications");
  return response.data;
};

export const unreadCount = async () => {
  const response = await api.get("/api/Notifications/unread-count");
  return response.data;
};

export const readNotification = async ({ notificationId }) => {
  const response = await api.put(`/api/Notifications/${notificationId}/read`);
  return response.data;
};

export const readAllNotifications = async () => {
  const response = await api.get("/api/Notifications/read-all");
  return response.data;
};
