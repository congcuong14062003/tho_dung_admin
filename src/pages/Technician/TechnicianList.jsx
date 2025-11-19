import { useEffect, useState } from "react";
import technicianApi from "../../service/api/technicianApi";

function TechnicianList() {
  const [data, setData] = useState([]);
  const [keySearch, setKeySearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      const res = await technicianApi.getAll({
        page,
        size: 10,
        keySearch,
        status: "all",
      });
      setData(res.data?.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <div className="rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Danh sách thợ</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="border p-2 rounded w-[500px] mb-4"
        value={keySearch}
        onChange={(e) => setKeySearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchData()}
      />

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Tên</th>
            <th className="p-2 border">SĐT</th>
            <th className="p-2 border">Khu vực</th>
            <th className="p-2 border">Năm KN</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((item) => (
            <tr key={item.user_id} className="border-b">
              <td className="p-2 border">{item.full_name}</td>
              <td className="p-2 border">{item.phone}</td>
              <td className="p-2 border">{item.working_area}</td>
              <td className="p-2 border text-center">
                {item.experience_years} năm
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => page > 1 && setPage(page - 1)}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TechnicianList;
