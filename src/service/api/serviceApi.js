import axiosClient from "./axiosClient";

const serviceApi = {
  getByCategory: (
    categoryId,
    keySearch = "" // 👈 Thêm param keySearch
  ) =>
    axiosClient.get(`/services/category/${categoryId}`, {
      params: { keySearch }, // 👈 Gửi query param
    }),

  getList: (data) => axiosClient.post("/services/list-services", data), // POST + body
  create: (data) => axiosClient.post("/services", data),
  update: (id, data) => axiosClient.post(`/services/${id}`, data),
};

export default serviceApi;
