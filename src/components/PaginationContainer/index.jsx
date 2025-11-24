import React, { useEffect, useState } from "react";

const PaginationContainer = ({ display = false, totalRecord = 0, setDataFilter, dataFilter }) => {
  const [initIdPage, setInitIdPage] = useState(0);
  const [lastIdPage, setLastIdPage] = useState(0);

  const handleChangeResultValue = (e) => {
    const size = Number(e.target.value);
    setDataFilter({ ...dataFilter, size, page: 1 });
  };

  const onPageClick = (value) => {
    setDataFilter({ ...dataFilter, page: value });
    window.scrollTo(0, 0);
  };

  const updateTotalPage = () => {
    const total = totalRecord;
    const size = dataFilter.size;
    const page = dataFilter.page;

    if (total === 0) {
      setInitIdPage(0);
      setLastIdPage(0);
      return;
    }

    setInitIdPage((page - 1) * size + 1);
    const last = page * size;
    setLastIdPage(last > total ? total : last);
  };

  useEffect(() => {
    updateTotalPage();
  }, [dataFilter, totalRecord]);

  const totalPage = Math.ceil(totalRecord / dataFilter.size);

  return (
    <div className={`mt-4 flex flex-wrap justify-between items-center ${!display && "hidden"}`}>
      {/* Left text */}
      <div className="text-gray-700 text-sm">
        {`Hiển thị từ ${initIdPage} đến ${lastIdPage} trong tổng số ${totalRecord} kết quả`}
      </div>

      {/* Page size select */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Hiển thị</span>

        <select
          value={dataFilter.size}
          onChange={handleChangeResultValue}
          className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

        <span className="text-sm">kết quả</span>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageClick(page)}
            className={`px-3 py-1 rounded-lg border text-sm transition 
              ${
                dataFilter.page === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaginationContainer;
