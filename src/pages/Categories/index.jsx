import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import categoryApi from "../../service/api/categoryApi";
import { useLoading } from "../../context/LoadingContext";
import { toast } from "react-toastify";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const { setLoading } = useLoading();
  // 🧩 Thêm state tìm kiếm
  const [search, setSearch] = useState("");
  // 🔹 Lấy danh sách danh mục
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getList({
        page: 1,
        size: 50,
        keySearch: search, // ✅ dùng search
      });
      if (res.status && res?.data?.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ debounce tìm kiếm (đợi người dùng dừng gõ)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCategories();
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  const handleDelete = async (id) => {
    try {
      const res = await categoryApi.delete(id);
      if (res?.status) {
        toast?.success(res?.message);
      } else {
        toast.error(res?.message);
      }
      fetchCategories();
    } catch (error) {
      toast.error("Không thể xóa danh mục");
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

  const handleRefresh = () => {
    setSearch("");
    fetchCategories();
  };

  return (
    <div className="p-6">
      {/* Tiêu đề + nút thêm */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý danh mục</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Thêm mới
        </button>
      </div>

      {/* 🧩 Thanh tìm kiếm + nút làm mới */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên danh mục..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-80"
        />
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Làm mới
        </button>
      </div>

      <table className="w-full border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Mã danh mục</th>
            <th className="border p-2">Tên danh mục</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Ảnh</th>
            <th className="border p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                Không có danh mục nào
              </td>
            </tr>
          ) : (
            categories.map((item) => (
              <tr key={item?.id}>
                <td className="border p-2 text-center">{item?.id}</td>
                <td className="border p-2">{item?.name}</td>
                <td className="border p-2">{item?.description}</td>
                <td className="border p-2 text-center">
                  {item?.icon ? (
                    <img
                      src={item?.icon}
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
                    onClick={() => handleDelete(item?.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Form thêm/sửa danh mục */}
      <CategoryForm
        onClose={handleOnClose}
        open={openModal}
        category={selected}
      />
    </div>
  );
}

export default Categories;
