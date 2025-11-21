import axiosClient from "./axiosClient";

const paymentApi = {
  getDetail: (id) => axiosClient.get(`/payments/detail/${id}`), // ✅ API chi tiết
  assignWorker: (data) => axiosClient.post("/payments/assign", data), // ✅ API gán thợ
  verifyPayment: (data) =>
    axiosClient.post("payments/admin/verify-payment", data),
};

export default paymentApi;
