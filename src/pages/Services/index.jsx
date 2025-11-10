import { useState, useEffect } from "react";
import categoryApi from "../../service/api/categoryApi";
import serviceApi from "../../service/api/serviceApi";
import ServiceForm from "./ServiceForm";
import { formatPrice } from "../../utils/formatNumber";

function Services() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const res = await categoryApi.getList({ page: 1, size: 50, keySearch: "" });
    if (res.status && res?.data?.data) setCategories(res.data.data);
  };

  const fetchServices = async (catId) => {
    if (!catId) return;
    setLoading(true);
    try {
      const res = await serviceApi.getByCategory(catId);
      if (res.status && res?.data?.services) {
        setServices(res.data.services);
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

  useEffect(() => {
    if (selectedCategory) fetchServices(selectedCategory);
  }, [selectedCategory]);

  const handleAdd = () => {
    setSelected(null);
    setOpenModal(true);
  };

  const handleEdit = (svc) => {
    setSelected(svc);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa dịch vụ này?")) {
      await serviceApi.delete(id);
      fetchServices(selectedCategory);
    }
  };

  const handleOnClose = () => {
    setOpenModal(false);
    fetchServices(selectedCategory);
  };

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

      <div className="mb-4">
        <label className="font-medium">Chọn danh mục:</label>
        <select
          className="border p-2 ml-2 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Chọn danh mục --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">Tên dịch vụ</th>
              <th className="border p-2">Mô tả</th>
              <th className="border p-2">Giá</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">{item?.name}</td>
                <td className="border p-2">{item?.description}</td>
                <td className="border p-2">{formatPrice(item?.base_price)} VNĐ</td>
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

      <ServiceForm
        open={openModal}
        onClose={handleOnClose}
        service={selected}
      />
    </div>
  );
}

export default Services;
