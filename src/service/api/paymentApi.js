import axiosClient from "./axiosClient";

const paymentApi = {
  getDetail: (id) => axiosClient.get(`/payments/detail/${id}`), // ✅ API chi tiết
  assignWorker: (data) => axiosClient.post("/payments/assign", data), // ✅ API gán thợ
};

export default paymentApi;
