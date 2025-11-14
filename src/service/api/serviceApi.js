import axiosClient from "./axiosClient";

const serviceApi = {
  getByCategory: (
    categoryId,
    keySearch = "" // 👈 Thêm param keySearch
  ) =>
    axiosClient.get(`/services/category/${categoryId}`, {
      params: { keySearch }, // 👈 Gửi query param
    }),
  create: (data) => axiosClient.post("/services", data),
  update: (id, data) => axiosClient.post(`/services/${id}`, data),
  delete: (id) => axiosClient.delete(`/services/${id}`),
};

export default serviceApi;
