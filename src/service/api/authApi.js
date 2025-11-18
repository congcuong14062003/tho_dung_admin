import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => {
    return axiosClient.post("/auth/admin/login", data);
  },
};

export default authApi;
