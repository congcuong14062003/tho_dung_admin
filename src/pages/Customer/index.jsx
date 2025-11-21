import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import apiCommon from "../../service/api/apiCommon";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";
import customerApi from "../../service/api/customerApi";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const { loading, setLoading } = useLoading();

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
    color: "blue",
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, status]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getAll({
        search,
        status,
      });

      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =================== KHÓA ===================
  const openBlockModal = (userId, fullName) => {
    setConfirmModal({
      open: true,
      title: "Khóa tài khoản khách",
      message: `Bạn có chắc muốn KHÓA tài khoản khách "${fullName}" không?`,
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
            toast.success(res.message);
            fetchCustomers();
          } else {
            toast.error(res.message);
          }
        } catch (err) {
          toast.error("Lỗi khi khóa tài khoản");
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
      title: "Mở khóa tài khoản khách",
      message: `Mở khóa tài khoản khách "${fullName}"?`,
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
            toast.success(res.message);
            fetchCustomers();
          } else {
            toast.error(res.message);
          }
        } catch (err) {
          toast.error("Lỗi khi mở khóa");
        } finally {
          setLoading(false);
          setConfirmModal((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  return (
    <div className="rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Danh sách khách hàng</h2>

      {/* Search + Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center border rounded px-3 py-2 gap-2 w-80">
          <Search size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none flex-1 bg-transparent"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Ngừng hoạt động</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border text-left">Thông tin khách</th>
              <th className="p-3 border text-left">SĐT</th>
              <th className="p-3 border text-left">CCCD</th>
              <th className="p-3 border text-center">Trạng thái</th>
              <th className="p-3 border text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loadingPage ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Đang tải...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Không có khách hàng nào
                </td>
              </tr>
            ) : (
              customers.map((cus) => (
                <tr key={cus.user_id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border">
                    <div className="flex items-center gap-3">
                      {cus.avatar_link ? (
                        <img
                          src={cus.avatar_link}
                          alt={cus.full_name}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                          {cus.full_name.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="font-medium">{cus.full_name}</div>
                        <div className="text-xs text-gray-500">
                          ID: {cus.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 border font-medium">{cus.phone}</td>
                  <td className="p-3 border">{cus.id_card || "—"}</td>

                  <td className="p-3 border text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cus.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {cus.status === "active" ? "Hoạt động" : "Ngừng"}
                    </span>
                  </td>

                  <td className="p-3 border text-center">
                    {cus.status === "active" ? (
                      <button
                        onClick={() =>
                          openBlockModal(cus.id, cus.full_name)
                        }
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition shadow-sm"
                      >
                        Khóa
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          openUnblockModal(cus.id, cus.full_name)
                        }
                        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition shadow-sm"
                      >
                        Mở khóa
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
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
