import { useEffect, useState } from "react";
import TechnicianList from "./TechnicianList";
import PendingList from "./PendingList";

function Technician() {
  const [tab, setTab] = useState("list");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Quản lý thợ</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            tab === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("list")}
        >
          Danh sách thợ
        </button>

        <button
          className={`px-4 py-2 rounded ${
            tab === "pending" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("pending")}
        >
          Quản lý yêu cầu làm thợ
        </button>
      </div>

      {tab === "list" && <TechnicianList />}
      {tab === "pending" && <PendingList />}
    </div>
  );
}

export default Technician;
