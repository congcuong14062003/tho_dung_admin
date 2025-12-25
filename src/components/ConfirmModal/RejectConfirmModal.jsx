// src/components/RejectConfirmModal/RejectConfirmModal.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";

const RejectConfirmModal = ({
  isOpen,
  title = "Từ chối yêu cầu",
  message, // ReactNode (có thể truyền JSX để format tùy ý, ví dụ highlight từ chối, tên yêu cầu...)
  placeholder = "Ví dụ: Hồ sơ chưa đủ chứng chỉ, kinh nghiệm chưa phù hợp, thông tin không chính xác...",
  confirmButtonText = "Xác nhận từ chối",
  onConfirm,   // hàm nhận lý do: (reason) => {...}
  onCancel,
  loading = false,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối!");
      return;
    }
    onConfirm(reason.trim());
    setReason(""); // reset sau khi confirm thành công (caller sẽ đóng modal)
  };

  const handleCancel = () => {
    setReason(""); // reset khi đóng
    onCancel();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-opacity-50 z-40"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {title}
            </h3>
          </div>

          {/* Nội dung message (linh hoạt - caller truyền JSX) */}
          {message && (
            <div className="text-gray-700 mb-6 leading-relaxed">
              {message}
            </div>
          )}

          {/* Lý do từ chối */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 font-medium"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || !reason.trim()}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium flex items-center gap-2"
            >
              {loading && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RejectConfirmModal;