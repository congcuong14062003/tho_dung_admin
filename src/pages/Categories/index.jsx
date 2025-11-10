import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import categoryApi from "../../service/api/categoryApi";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getList({ page: 1, size: 50, keySearch: "" });
      if (res.status && res?.data?.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xóa danh mục này?")) {
      try {
        await categoryApi.delete(id);
        fetchCategories();
      } catch (error) {
        alert("Không thể xóa danh mục");
      }
    }
  };

  const handleOnClose = () => {
    setOpenModal(false);
    fetchCategories();
  };
  const handleAdd = () => {
    setSelected(null);
    setOpenModal(true);
  };

  const handleEdit = (cat) => {
    setSelected(cat);
    setOpenModal(true);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý danh mục</h2>
        <button
          onClick={() => handleAdd()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Thêm mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Tên danh mục</th>
              <th className="border p-2">Mô tả</th>
              <th className="border p-2">Ảnh</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2 text-center">
                  {item.icon ? (
                    <img
                      src={`${item.icon}`}
                      alt=""
                      className="w-10 h-10 mx-auto rounded"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border p-2 text-center space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Popup Form */}
      <CategoryForm
        onClose={handleOnClose}
        open={openModal}
        category={selected}
      />
    </div>
  );
}

export default Categories;
