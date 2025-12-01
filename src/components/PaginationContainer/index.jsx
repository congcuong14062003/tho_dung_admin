import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import Select from "react-select";
import { customSelect, listResultValues } from "../../shared/StyleShare";

const PaginationContainer = ({ display, totalRecord, dataFilter, setDataFilter }) => {
  const [initIdPage, setInitIdPage] = useState(0);
  const [lastIdPage, setLastIdPage] = useState(0);

  // Đổi số bản ghi mỗi trang
  const handleChangeResultValue = (data) => {
    setDataFilter({
      ...dataFilter,
      size: data.value,
      page: 1,
    });
  };

  // Chuyển trang
  const onPageClick = (_, value) => {
    setDataFilter({ ...dataFilter, page: value });
    window.scrollTo(0, 0);
  };

  // Tính offset hiển thị
  useEffect(() => {
    if (totalRecord === 0) {
      setInitIdPage(0);
      setLastIdPage(0);
      return;
    }

    const { page, size } = dataFilter;
    const start = (page - 1) * size + 1;
    const end = Math.min(page * size, totalRecord);

    setInitIdPage(start);
    setLastIdPage(end);
  }, [dataFilter, totalRecord]);

  const totalPage = Math.ceil(totalRecord / dataFilter.size);

  return (
    <div className={`flex justify-between mt-3 ${!display ? "hidden" : ""}`}>
      {/* Text hiển thị */}
      <div>
        {display && (
          <span>
            {`Hiển thị từ ${initIdPage} đến ${lastIdPage} trong tổng số ${totalRecord} kết quả`}
          </span>
        )}
      </div>

      {/* Select size */}
      <div className="flex items-center">
        {display && <span className="px-2">Hiển thị</span>}

        {display && (
          <div className="w-[90px]">
            <Select
              menuPlacement="top"
              menuPosition="absolute"
              options={listResultValues}
              styles={customSelect}
              onChange={handleChangeResultValue}
              value={listResultValues.find((o) => o.value === dataFilter.size)}
              placeholder={dataFilter.size}
            />
          </div>
        )}

        {display && <span className="px-2">kết quả</span>}
      </div>

      {/* Pagination */}
      <Pagination
        className={`${display ? "block" : "hidden"} float-right`}
        page={dataFilter.page}
        count={totalPage}
        onChange={onPageClick}
      />
    </div>
  );
};

export default PaginationContainer;
