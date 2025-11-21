import axiosClient from "./axiosClient";

const apiCommon = {
  // 🔹 API cập nhật trạng thái user (customer / technician)
  updateUserStatus: (data) => {
    // data = { id: "", status: "" }
    return axiosClient.post("/users/update-status", data);
  },
};

export default apiCommon;
