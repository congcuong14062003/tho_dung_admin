import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => {
    return axiosClient.post("/auth/admin/login", data);
  },
  logout: (data) => {
    return axiosClient.post("/auth/logout", data);
  }
};

export default authApi;
