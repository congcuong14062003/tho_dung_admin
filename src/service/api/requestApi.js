import axiosClient from "./axiosClient";

const requestApi = {
  getAll: (data) => axiosClient.post("/requests/get-all-request", data),
  delete: (id) => axiosClient.delete(`/requests/${id}`),
  getDetail: (id) => axiosClient.get(`/requests/${id}/detail-request`), // ✅ API chi tiết
  assignWorker: (data) => axiosClient.post("/requests/assign", data), // ✅ API gán thợ

  rejectQuote: (data) => axiosClient.post("/requests/quotation/admin-reject", data), // ✅ API từ chối yêu cầu
  approveQuote: (data) => axiosClient.post("/requests/quotation/admin-approve", data), // ✅ API duyệt báo giá
};

export default requestApi;
