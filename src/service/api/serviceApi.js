import axiosClient from "./axiosClient";

const serviceApi = {
  getByCategory: (categoryId) =>
    axiosClient.get(`/services/category/${categoryId}`),
  create: (data) => axiosClient.post("/services", data),
  update: (id, data) => axiosClient.post(`/services/${id}`, data),
  delete: (id) => axiosClient.delete(`/services/${id}`),
};

export default serviceApi;
