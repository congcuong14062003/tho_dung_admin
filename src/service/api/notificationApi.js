import axiosClient from "./axiosClient";

const notificationApi = {
  getMyNotifications: () =>
    axiosClient.get("/notifications/list-notifications"),

  markAsRead: (id) => axiosClient.put(`/notifications/mark-read/${id}`),
  getListPaginated: (data) =>
    axiosClient.post("/notifications/list-notifications-paginated", data),
  deleteNotification: (id) => axiosClient.delete(`/notifications/delete/${id}`),
  deleteAllNotifications: () => axiosClient.delete("/notifications/delete-all"),
};

export default notificationApi;
