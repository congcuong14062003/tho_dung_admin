import axiosClient from "./axiosClient";

const technicianApi = {
  // Danh sách thợ (admin)
  getAll: (data) => {
    return axiosClient.post("/technicians/admin/get-all-technicians", data);
  },

  // Danh sách chờ duyệt
  getPending: (data) => {
    return axiosClient.post("/technicians/admin/get-pending-technicians", data);
  },

  // Chi tiết yêu cầu thợ (GET)
  getRequestDetail: (id) => {
    return axiosClient.get(`/technicians/admin/get-request-detail/${id}`);
  },

  // Duyệt thợ
  approve: (data) => {
    return axiosClient.post("/technicians/admin/approve", data);
  },

  // Từ chối thợ
  reject: (data) => {
    return axiosClient.post("/technicians/admin/reject", data);
  },

  // ==================== KHÓA / MỞ KHÓA TÀI KHOẢN ====================
  // Khóa tài khoản thợ (active → banned/inactive)
  block: (data) => {
    return axiosClient.post("/technicians/admin/block", data);
    // data: { user_id: "USR_xxx" } hoặc { technician_id: 123 }
  },

  // Mở khóa tài khoản thợ (banned → active)
  unblock: (data) => {
    return axiosClient.post("/technicians/admin/unblock", data);
    // data: { user_id: "USR_xxx" }
  },
};

export default technicianApi;
