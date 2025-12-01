import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";
import technicianApi from "../../service/api/technicianApi";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import RejectConfirmModal from "../../components/ConfirmModal/RejectConfirmModal";
import { formatDateTimeVN } from "../../utils/formatdate";

export default function PendingDetail() {
  const { id } = useParams(); // 👈 Lấy request_id từ URL
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [data, setData] = useState(null);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);

  // ================================
  // 🔥 FETCH DETAIL
  // ================================

  console.log("id: ", id);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.getRequestDetail(id);
      if (!res.status) {
        toast.error(res.message || "Không lấy được dữ liệu");
        return navigate(-1);
      }
      setData(res.data);
    } catch (err) {
      toast.error("Lỗi tải dữ liệu");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (!data) return <p className="p-4">Đang tải dữ liệu...</p>;

  // ================================
  // 🔥 APPROVE
  // ================================
  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.approve({
        request_id: data?.request_id,
      });

      res.status ? toast.success("Đã duyệt yêu cầu") : toast.error(res.message);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 🔥 REJECT
  // ================================
  const handleReject = async (reason) => {
    setLoading(true);
    try {
      const res = await technicianApi.reject({
        request_id: data?.request_id,
        reason,
      });

      res.status
        ? toast.success("Đã từ chối yêu cầu")
        : toast.error(res.message);

      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 🔥 UI
  // ================================
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chi tiết yêu cầu thợ</h2>

      <div className="bg-white p-4 rounded-lg shadow-sm border">
        {/* ================== USER ================== */}
        <div className="flex data?s-center gap-4 mb-6">
          {data?.avatar_link ? (
            <img
              src={data?.avatar_link}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-300 rounded-full flex data?s-center justify-center text-xl font-bold">
              {data?.full_name?.charAt(0)}
            </div>
          )}

          <div>
            <p className="text-lg font-semibold">{data?.full_name}</p>
            <p className="text-gray-600">{data?.phone}</p>
            <p className="text-xs text-gray-500">User ID: {data?.user_id}</p>
          </div>
        </div>

        {/* ================== DETAIL INFO ================== */}
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>Loại yêu cầu:</strong>{" "}
            {data?.type === "new"
              ? "Yêu cầu làm thợ"
              : "Chỉnh sửa thông tin thợ"}
          </p>

          <p>
            <strong>Trạng thái:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                data?.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : data?.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {data?.status === "pending"
                ? "Chờ duyệt"
                : data?.status === "approved"
                ? "Đã duyệt"
                : "Bị từ chối"}
            </span>
          </p>

          {data?.status === "rejected" && (
            <p className="col-span-2 text-red-600">
              <strong>Lý do từ chối:</strong> {data?.rejected_reason}
            </p>
          )}

          <p>
            <strong>Năm kinh nghiệm:</strong> {data?.experience_years} năm
          </p>

          <p>
            <strong>Khu vực làm việc:</strong> {data?.working_area}
          </p>

          <p>
            <strong>Ngày tạo yêu cầu:</strong>{" "}
            {formatDateTimeVN(data?.created_at)}
          </p>

          <p>
            <strong>Chứng chỉ:</strong>{" "}
            {data?.certifications ? data?.certifications : "—"}
          </p>

          {/* MÔ TẢ */}
          <div className="col-span-2">
            <strong>Mô tả:</strong>
            <p className="mt-1">{data?.description || "—"}</p>
          </div>

          {/* KỸ NĂNG */}
          <div className="col-span-2">
            <strong>Kỹ năng:</strong>
            <div className="flex gap-2 mt-1 flex-wrap">
              {data?.skills.length > 0 ? (
                data?.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 text-white rounded-full text-xs"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.name}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">Không có kỹ năng</span>
              )}
            </div>
          </div>
        </div>

        {/* ========== BUTTONS ========== */}
        <div className="mt-6 flex gap-3">
          {data?.status === "pending" && (
            <>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                onClick={() => setApproveModal(true)}
              >
                Duyệt
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                onClick={() => setRejectModal(true)}
              >
                Từ chối
              </button>
            </>
          )}

          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </button>
        </div>
      </div>

      {/* MODALS */}
      <ConfirmModal
        isOpen={approveModal}
        title="Xác nhận duyệt"
        message={`Bạn muốn duyệt thợ "${data?.full_name}"?`}
        confirmText="Duyệt ngay"
        onConfirm={handleApprove}
        onCancel={() => setApproveModal(false)}
      />

      <RejectConfirmModal
        isOpen={rejectModal}
        fullName={data?.full_name}
        onConfirm={handleReject}
        onCancel={() => setRejectModal(false)}
      />
    </div>
  );
}
