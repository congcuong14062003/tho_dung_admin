import { useEffect, useState } from "react";
import technicianApi from "../../service/api/technicianApi";
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import RejectConfirmModal from "../../components/ConfirmModal/RejectConfirmModal";
import { formatDateTimeVN } from "../../utils/formatdate";

function PendingList() {
  const [data, setData] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [page, setPage] = useState(1);

  const { loading, setLoading } = useLoading();

  // Modal duyệt (dùng ConfirmModal chung)
  const [approveModal, setApproveModal] = useState({
    open: false,
    requestId: null,
    fullName: "",
  });

  // Modal từ chối riêng
  const [rejectModal, setRejectModal] = useState({
    open: false,
    requestId: null,
    fullName: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.getPending({
        page,
        size: 10,
        keySearch,
      });

      if (res.status) {
        setData(res.data?.data || []);
      } else {
        toast.error(res.message || "Không thể tải danh sách chờ duyệt");
      }
    } catch (err) {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchData();
    }, 400); // chỉ gọi API nếu user ngừng gõ 400ms

    return () => clearTimeout(delay);
  }, [page, keySearch]);

  // =================== DUYỆT THỢ ===================
  const openApprove = (requestId, fullName) => {
    setApproveModal({ open: true, requestId, fullName });
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.approve({
        request_id: approveModal.requestId,
      });
      if (res.status) {
        toast.success(res.message || "Đã duyệt thành công");
        fetchData();
        setApproveModal({ open: false, requestId: null, fullName: "" });
      } else {
        toast.error(res.message || "Duyệt thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi duyệt thợ");
    } finally {
      setLoading(false);
    }
  };

  // =================== TỪ CHỐI THỢ ===================
  const openReject = (requestId, fullName) => {
    setRejectModal({ open: true, requestId, fullName });
  };

  const handleReject = async (reason) => {
    setLoading(true);
    try {
      const res = await technicianApi.reject({
        request_id: rejectModal.requestId,
        reason,
      });

      if (res.status) {
        toast.success(res.message || "Đã từ chối yêu cầu");
        fetchData();
        setRejectModal({ open: false, requestId: null, fullName: "" });
      } else {
        toast.error(res.message || "Từ chối thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi từ chối");
    } finally {
      setLoading(false);
    }
  };
  const handleRefresh = () => {
    setKeySearch("");
    fetchData();
  };

  return (
    <div className="rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Danh sách quản lý duyệt thợ</h2>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {" "}
        <input
          type="text"
          placeholder="Tìm kiếm tên hoặc số điện thoại..."
          className="border p-2 rounded w-[500px] "
          value={keySearch}
          onChange={(e) => setKeySearch(e.target.value)}
        />
        <button
          onClick={handleRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Làm mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Thợ đăng ký</th>
              <th className="p-3 border text-left">SĐT</th>
              <th className="p-3 border text-left">Chuyên môn</th>
              <th className="p-3 border text-center">Năm KN</th>
              <th className="p-3 border text-left">Khu vực</th>
              <th className="p-3 border text-left">Mô tả</th>
              <th className="p-3 border text-center">Chứng chỉ</th>
              <th className="p-3 border text-center">Trạng thái</th>
              <th className="p-3 border text-center">Ngày nộp</th>
              <th className="p-3 border text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.request_id} className="hover:bg-gray-50 transition">
                {/* Avatar + Tên */}
                <td className="p-3 border">
                  <div className="flex items-center gap-3">
                    {item.avatar_link ? (
                      <img
                        src={item.avatar_link}
                        alt={item.full_name}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                        {item.full_name?.charAt(0) || "?"}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{item.full_name}</div>
                      <div className="text-xs text-gray-500">
                        ID: {item.user_id}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="p-3 border font-medium">{item.phone}</td>

                <td className="p-3 border">
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{
                      backgroundColor: item.skill_category_color || "#666",
                    }}
                  >
                    {item.skill_category_name || "Chưa chọn"}
                  </span>
                </td>

                <td className="p-3 border text-center font-semibold text-blue-600">
                  {item.experience_years} năm
                </td>

                <td className="p-3 border">{item.working_area || "-"}</td>

                <td className="p-3 border max-w-[200px] text-gray-700 whitespace-pre-wrap break-words">
                  {item.description || (
                    <i className="text-gray-400">Chưa có mô tả</i>
                  )}
                </td>

                <td className="p-3 border text-center">
                  {item.certifications && item.certifications !== "none"
                    ? "Có"
                    : "—"}
                </td>

                {/* Trạng thái */}
                <td className="p-3 max-w-[200px] border text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : item.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status === "pending"
                      ? "Chờ duyệt"
                      : item.status === "approved"
                      ? "Đã duyệt"
                      : "Bị từ chối"}
                  </span>
                  {item.status === "rejected" && (
                    <p>Lý do từ chối: {item?.rejected_reason}</p>
                  )}
                </td>

                <td className="p-3 border text-center text-xs">
                  {formatDateTimeVN(item.created_at)}
                </td>

                {/* Hành động */}
                <td className="p-3 border text-center space-x-2">
                  {item.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          openApprove(item.request_id, item.full_name)
                        }
                        className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium transition shadow-sm"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() =>
                          openReject(item.request_id, item.full_name)
                        }
                        className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition shadow-sm"
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 text-xs italic">
                      Đã xử lý
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Duyệt - dùng ConfirmModal chung */}
      <ConfirmModal
        isOpen={approveModal.open}
        title="Xác nhận duyệt thợ"
        message={`Bạn có chắc muốn DUYỆT thợ "${approveModal.fullName}" không?`}
        confirmText="Duyệt ngay"
        cancelText="Hủy"
        color="green"
        loading={loading}
        onConfirm={handleApprove}
        onCancel={() =>
          setApproveModal({ open: false, requestId: null, fullName: "" })
        }
      />

      {/* Modal Từ chối riêng - đã tách file */}
      <RejectConfirmModal
        isOpen={rejectModal.open}
        fullName={rejectModal.fullName}
        loading={loading}
        onConfirm={handleReject}
        onCancel={() =>
          setRejectModal({ open: false, requestId: null, fullName: "" })
        }
      />
    </div>
  );
}

export default PendingList;
