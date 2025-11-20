import { useState, useEffect } from "react";
import categoryApi from "../../service/api/categoryApi";
import serviceApi from "../../service/api/serviceApi";
import ServiceForm from "./ServiceForm";
import { formatPrice } from "../../utils/formatNumber";
import { useLoading } from "../../context/LoadingContext";
import { toast } from "react-toastify";

function Services() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const { setLoading } = useLoading();

  const fetchCategories = async () => {
    const res = await categoryApi.getList({ page: 1, size: 50, keySearch: "" });
    if (res.status && res?.data?.data) setCategories(res.data.data);
  };

  const fetchServices = async (catId = "", keySearch = "") => {
    setLoading(true);
    try {
      const res = await serviceApi.getByCategory(catId || "all", keySearch); // 👈 Gửi "all"
      if (res.status && res?.data?.services) {
        setServices(res.data.services);
      } else {
        toast.error(res?.message || "Lỗi khi lấy dịch vụ");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelected(null);
    setOpenModal(true);
  };

  const handleEdit = (svc) => {
    setSelected(svc);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await serviceApi.delete(id);
      if (res?.status) {
        toast?.success(res?.message);
      } else {
        toast.error(res?.message);
      }
      fetchServices(selectedCategory, search);
    } catch (error) {
      toast.error("Không thể xóa danh mục");
    }
  };

  const handleOnClose = () => {
    setOpenModal(false);
    fetchServices(selectedCategory, search);
  };

  const handleRefresh = () => {
    setSearch("");
    if (selectedCategory) fetchServices(selectedCategory, "");
  };

  useEffect(() => {
    // Nếu lần đầu vào trang → gọi ngay
    if (selectedCategory === "" && search === "") {
      fetchServices("all", "");
      return;
    }

    // Tìm kiếm → có debounce
    const delay = setTimeout(() => {
      fetchServices(selectedCategory || "all", search);
    }, 400);

    return () => clearTimeout(delay);
  }, [selectedCategory, search]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý dịch vụ</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Thêm mới
        </button>
      </div>

      {/* 🔍 Bộ lọc */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="font-medium">Danh mục:</label>
        <select
          className="border p-2 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Tất cả dịch vụ --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tìm kiếm theo tên, mô tả, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-[500px]"
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
            <th className="border p-2">Mã dịch vụ</th>
            <th className="border p-2">Tên dịch vụ</th>
            <th className="border p-2">Mô tả</th>
            <th className="border p-2">Giá</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {services.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                Không có dịch vụ nào
              </td>
            </tr>
          ) : (
            services.map((item) => (
              <tr key={item?.id}>
                <td className="border p-2">{item?.id}</td>
                <td className="border p-2">{item?.name}</td>
                <td className="border p-2">{item?.description}</td>
                <td className="border p-2">
                  {formatPrice(item?.base_price)} VNĐ
                </td>
                <td className="border p-2 space-x-2 text-center">
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

      <ServiceForm
        open={openModal}
        onClose={handleOnClose}
        service={selected}
      />
    </div>
  );
}

export default Services;
