import { useState } from "react";
import authApi from "../../service/api/authApi";
import { toast } from "react-toastify";
import userApi from "../../service/api/userApi";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await userApi.changePassword({
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      if (response.status) {
        toast.success("Đổi mật khẩu thành công");
      } else {
        toast.error(response.message || "Đổi mật khẩu thất bại");
      }
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>

      <input
        type="password"
        placeholder="Mật khẩu cũ"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <input
        type="password"
        placeholder="Mật khẩu mới"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded"
      />

      <input
        type="password"
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Lưu thay đổi
      </button>
    </div>
  );
}
