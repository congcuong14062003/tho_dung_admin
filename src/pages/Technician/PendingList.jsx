import { useEffect, useState } from "react";
import technicianApi from "../../service/api/technicianApi";
import { toast } from "react-toastify";

function PendingList() {
  const [data, setData] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      const res = await technicianApi.getAll({
        page,
        size: 10,
        keySearch,
        status: "pending",
      });
      setData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleApprove = async (userId) => {
    try {
      await technicianApi.approve({ user_id: userId });
      toast.success("Duyệt thợ thành công");
      fetchData();
    } catch (err) {
      toast.error("Lỗi duyệt");
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt("Nhập lý do từ chối:");

    if (!reason) return;

    try {
      await technicianApi.reject({ user_id: userId, reason });
      toast.info("Đã từ chối");
      fetchData();
    } catch (err) {
      toast.error("Lỗi từ chối");
    }
  };

  return (
    <div className="rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Danh sách chờ duyệt</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="border p-2 rounded w-full mb-4"
        value={keySearch}
        onChange={(e) => setKeySearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchData()}
      />

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">SĐT</th>
            <th className="p-2 border">Kinh nghiệm</th>
            <th className="p-2 border">Khu vực</th>
            <th className="p-2 border text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item) => (
            <tr key={item.user_id} className="border-b">
              <td className="p-2 border">{item.full_name}</td>
              <td className="p-2 border">{item.phone}</td>
              <td className="p-2 border text-center">
                {item.experience_years} năm
              </td>
              <td className="p-2 border">{item.working_area}</td>

              <td className="p-2 border text-center">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                  onClick={() => handleApprove(item.user_id)}
                >
                  Duyệt
                </button>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleReject(item.user_id)}
                >
                  Từ chối
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PendingList;
