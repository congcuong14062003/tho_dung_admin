// src/components/ConfirmModal.jsx
import React from "react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
  loading = false,
  color = "blue", // blue, green, red
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
  };

  return (
    <>
      <div className="fixed inset-0 bg-opacity-50 z-40" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <p className="text-gray-700 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition disabled:opacity-50"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-white rounded transition disabled:opacity-50 flex items-center gap-2 ${colorClasses[color] || colorClasses.blue}`}
            >
              {loading && <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.3"/><path fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmModal;