import { useState, useEffect } from "react";
import requestApi from "../../service/api/requestApi";
import RequestDetail from "./RequestDetail";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // 🧩 Bộ lọc
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await requestApi.getAll({
        page: 1,
        size: 100,
        keySearch: search,
        status,
      });
      if (res.status && res.data?.data) {
        setRequests(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchRequests, 400); // debounce search
    return () => clearTimeout(delay);
  }, [search, status]);

  const handleViewDetail = (req) => {
    setSelected(req);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelected(null);
  };


  const handleRefresh = () => {
    fetchRequests();
    setSearch("");
    setStatus("all");
  }
  // 🔧 Hàm đổi màu trạng thái
  const getStatusColor = (stt) => {
    switch (stt) {
      case "pending":
        return "bg-yellow-500";
      case "assigned":
        return "bg-blue-400";
      case "quoted":
        return "bg-purple-500";
      case "in_progress":
        return "bg-sky-500";
      case "completed":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-500";
      case "maintenance":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách yêu cầu</h2>
      </div>

      {/* 🧩 Thanh tìm kiếm + bộ lọc */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã, tên yêu cầu, địa chỉ, dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-100"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Đang chờ</option>
          <option value="assigned">Đã phân công</option>
          <option value="quoted">Đã báo giá</option>
          <option value="in_progress">Đang xử lý</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
          <option value="maintenance">Bảo trì</option>
        </select>
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Làm mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Mã yêu cầu</th>
              <th className="border p-2">Người yêu cầu</th>
              <th className="border p-2">Dịch vụ</th>
              <th className="border p-2">Địa chỉ</th>
              <th className="border p-2 text-center">Trạng thái</th>
              <th className="border p-2 text-center">Ngày yêu cầu</th>
              <th className="border p-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  Không có yêu cầu nào
                </td>
              </tr>
            ) : (
              requests.map((item, index) => (
                <tr key={item?.id}>
                  <td className="border p-2 text-center">{item?.id}</td>
                  <td className="border p-2">{item?.customer_name}</td>
                  <td className="border p-2">{item?.service_name}</td>
                  <td className="border p-2">{item?.address}</td>
                  <td className="border p-2 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white ${getStatusColor(
                        item?.status
                      )}`}
                    >
                      {item?.status}
                    </span>
                  </td>
                  <td className="border p-2 text-center">
                    {item?.requested_time} {item?.requested_date}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {openModal && (
        <RequestDetail
          open={openModal}
          onClose={handleCloseModal}
          requestId={selected.id}
        />
      )}
    </div>
  );
}

export default Requests;
