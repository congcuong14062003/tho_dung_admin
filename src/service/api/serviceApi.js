import axiosClient from "./axiosClient";

const serviceApi = {
  getList: (data) => axiosClient.post("/services/admin/list-services", data), // POST + body
  create: (data) => axiosClient.post("/services/admin/create-service", data),
  update: (data) => axiosClient.post("/services/admin/update-service", data),
};

export default serviceApi;
