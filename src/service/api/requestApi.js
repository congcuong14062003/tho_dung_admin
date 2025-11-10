import axiosClient from "./axiosClient";

const requestApi = {
  getAll: (data) => axiosClient.post("/requests/get-all-request", data),
  delete: (id) => axiosClient.delete(`/requests/${id}`),
  getDetail: (id) => axiosClient.get(`/requests/${id}/detail`), // ✅ API chi tiết

};

export default requestApi;
