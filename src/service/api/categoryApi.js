import axiosClient from "./axiosClient";

const categoryApi = {
  // 🔹 Lấy danh sách danh mục (có phân trang)
  getList: (data) => {
    return axiosClient.post("/categories/admin/list-category", data);
  },
  // 🔹 Thêm mới danh mục
  create: (data) => {
    return axiosClient.post("/categories/admin/create-category", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  // 🔹 Cập nhật danh mục
  update: (data) => {
    return axiosClient.post("/categories/admin/update-category", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default categoryApi;
