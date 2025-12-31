import axiosClient from "./axiosClient";

const notificationApi = {
  getMyNotifications: () =>
    axiosClient.get("/notifications/list-notifications"),

  markAsRead: (id) => axiosClient.put(`/notifications/mark-read/${id}`),
  getListPaginated: (data) =>
    axiosClient.post("/notifications/list-notifications-paginated", data),
};

export default notificationApi;
