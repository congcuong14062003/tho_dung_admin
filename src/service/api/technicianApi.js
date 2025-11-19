import axiosClient from "./axiosClient";

const technicianApi = {
  // Danh sách thợ (admin)
  getAll: (data) => {
    return axiosClient.post("/technicians/get-all-technicians", data);
  },

  // Danh sách chờ duyệt
  getPending: (data) => {
    return axiosClient.post("/technicians/admin/pending", {
      data,
    });
  },

  // Duyệt thợ
  approve: (data) => {
    return axiosClient.post("/technicians/admin/approve", data);
  },

  // Từ chối thợ
  reject: (data) => {
    return axiosClient.post("/technicians/admin/reject", data);
  },
};

export default technicianApi;
