import axiosClient from "./axiosClient";

const userApi = {
  changePassword: (data) => {
    return axiosClient.post("/users/change-password", data);
  },
  getMe: () => {
    return axiosClient.get("/users/user-profile");
  },
};

export default userApi;
