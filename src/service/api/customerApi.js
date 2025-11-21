import axiosClient from "./axiosClient";

const customerApi = {
  getAll: (data) => axiosClient.post("/users/get-all-customers", data),
  block: (data) => axiosClient.post("/users/block", data),
  unblock: (data) => axiosClient.post("/users/unblock", data),
};

export default customerApi;
