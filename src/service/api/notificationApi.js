import axiosClient from "./axiosClient";

const notificationApi = {
  getMyNotifications: () =>
    axiosClient.get("/notifications/list-notifications"),

  markAsRead: (id) => axiosClient.put(`/notifications/mark-read/${id}`),
};

export default notificationApi;
