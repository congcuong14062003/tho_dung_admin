// src/pages/admin/TechnicianList.jsx
import { useEffect, useState } from "react";
import technicianApi from "../../service/api/technicianApi";
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import apiCommon from "../../service/api/apiCommon";

function TechnicianList() {
  const [data, setData] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [page, setPage] = useState(1);

  const { loading, setLoading } = useLoading();

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
    color: "blue",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.getAll({
        page,
        size: 10,
        keySearch,
        status: "all",
      });

      // Chuẩn backend: kiểm tra res.status
      if (res.status) {
        setData(res.data?.data || []);
      } else {
        toast.error(res.message || "Không thể tải danh sách thợ");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Lỗi kết nối server";
      toast.error(errorMsg);
      console.error(err);
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

  // =================== KHÓA TÀI KHOẢN ===================
  const openBlockModal = (userId, fullName) => {
    setConfirmModal({
      open: true,
      title: "Khóa tài khoản thợ",
      message: `Bạn có chắc muốn KHÓA tài khoản thợ "${fullName}" không?\n\nSau khi khóa, thợ sẽ không thể đăng nhập và nhận việc nữa.`,
      confirmText: "Khóa ngay",
      color: "red",
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await apiCommon.updateUserStatus({
            userId: userId,
            status: "inactive",
          });

          if (res.status) {
            toast.success(res.message || "Đã khóa tài khoản thợ");
            fetchData();
          } else {
            toast.error(res.message || "Khóa tài khoản thất bại");
          }
        } catch (err) {
          const errorMsg =
            err.response?.data?.message || "Lỗi khi khóa tài khoản";
          toast.error(errorMsg);
        } finally {
          setLoading(false);
          setConfirmModal((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  // =================== MỞ KHÓA ===================
  const openUnblockModal = (userId, fullName) => {
    setConfirmModal({
      open: true,
      title: "Mở khóa tài khoản thợ",
      message: `Bạn có chắc muốn MỞ KHÓA tài khoản thợ "${fullName}" không?\n\nThợ sẽ được hoạt động bình thường trở lại.`,
      confirmText: "Mở khóa",
      color: "green",
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await apiCommon.updateUserStatus({
            userId: userId,
            status: "active",
          });

          if (res.status) {
            toast.success(res.message || "Đã mở khóa tài khoản");
            fetchData();
          } else {
            toast.error(res.message || "Mở khóa thất bại");
          }
        } catch (err) {
          const errorMsg = err.response?.data?.message || "Lỗi khi mở khóa";
          toast.error(errorMsg);
        } finally {
          setLoading(false);
          setConfirmModal((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  const handleRefresh = () => {
    setKeySearch("");
    fetchData();
  };

  return (
    <div className="rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Danh sách thợ</h2>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm tên hoặc số điện thoại..."
          className="border p-2 rounded w-[500px]"
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
              <th className="p-3 border text-left">Tên thợ</th>
              <th className="p-3 border text-left">SĐT</th>
              <th className="p-3 border text-left">Kỹ năng chuyên môn</th>
              <th className="p-3 border text-center">Kinh nghiệm</th>
              <th className="p-3 border text-left">Khu vực hoạt động</th>
              <th className="p-3 border text-left">Mô tả</th>
              <th className="p-3 border text-center">Chứng chỉ</th>
              <th className="p-3 border text-center">Trạng thái</th>
              <th className="p-3 border text-center">Ngày đăng ký</th>
              <th className="p-3 border text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.user_id} className="hover:bg-gray-50 transition">
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
                        {item.full_name.charAt(0)}
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
                    {item.skill_category_name}
                  </span>
                </td>

                <td className="p-3 border text-center font-semibold text-blue-600">
                  {item.experience_years} năm
                </td>

                <td className="p-3 border">Khu vực {item.working_area}</td>

                <td className="p-3 border max-w-[200px] text-gray-700">
                  {item.description || (
                    <i className="text-gray-400">Chưa có mô tả</i>
                  )}
                </td>

                <td className="p-3 border text-center">
                  {item.certifications && item.certifications !== "none"
                    ? "Có"
                    : "—"}
                </td>

                <td className="p-3 border text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "active"
                        ? "bg-green-100 text-green-800"
                        : item.status === "inactive"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status === "active"
                      ? "Hoạt động"
                      : item.status === "inactive"
                      ? "Bị khóa"
                      : "Chờ duyệt"}
                  </span>
                </td>

                <td className="p-3 border text-center text-xs">
                  {new Date(item.created_at).toLocaleDateString("vi-VN")}
                </td>

                <td className="p-3 border text-center">
                  {item.status === "active" ? (
                    <button
                      onClick={() =>
                        openBlockModal(item.user_id, item.full_name)
                      }
                      className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition shadow-sm"
                    >
                      Khóa tài khoản
                    </button>
                  ) : item.status === "inactive" ? (
                    <button
                      onClick={() =>
                        openUnblockModal(item.user_id, item.full_name)
                      }
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition shadow-sm"
                    >
                      Mở khóa
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs italic">
                      Chờ duyệt
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText="Hủy"
        loading={loading}
        color={confirmModal.color}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}

export default TechnicianList;
