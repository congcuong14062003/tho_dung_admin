import axiosClient from "./axiosClient";

const userApi = {
  changePassword: (data) => {
    return axiosClient.post("/users/change-password", data);
  },
};

export default userApi;
