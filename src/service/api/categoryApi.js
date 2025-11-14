import axiosClient from "./axiosClient";

const categoryApi = {
  // 🔹 Lấy danh sách danh mục (có phân trang)
  getList: (data) => {
    return axiosClient.post("/categories/list-category", data);
  },

  // 🔹 Thêm mới danh mục
  create: (data) => {
    return axiosClient.post("/categories/create-category", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 🔹 Cập nhật danh mục
  update: (id, data) => {
    return axiosClient.post(`/categories/update-category/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 🔹 Xóa danh mục
  delete: (id) => {
    return axiosClient.post(`/categories/delete-category/${id}`);
  },
};

export default categoryApi;
