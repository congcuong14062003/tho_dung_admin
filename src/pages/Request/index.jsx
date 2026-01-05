import { useState, useEffect, useCallback } from "react";
import requestApi from "../../service/api/requestApi";
// import RequestDetail from "./RequestDetail";
import { STATUS_CONFIG } from "../../config/statusConfig";
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";
import { debounce } from "../../utils/functions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import PaginationContainer from "../../components/PaginationContainer";
import images from "../../assets/images/Image";
import { useNavigate } from "react-router-dom";
import { formatDateToDDMMYYYY } from "../../utils/formatdate";

function Requests() {
  const navigate = useNavigate();

  const { setLoading } = useLoading();

  const [requests, setRequests] = useState([]);
  // const [selected, setSelected] = useState(null);
  // const [openModal, setOpenModal] = useState(false);
  const [totalRecord, setTotalRecord] = useState(0);

  // 🎯 request filter object (giống Category)
  const [filter, setFilter] = useState({
    page: 1,
    size: 5,
    keySearch: "",
    status: "all",

    // gửi backend
    dateFrom: null, // dd/mm/yyyy
    dateTo: null,

    // chỉ để hiển thị input
    dateFromRaw: "",
    dateToRaw: "",
  });

  const [searchInput, setSearchInput] = useState("");

  /** ===================== FETCH ===================== */
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await requestApi.getAll(filter);

      if (res?.status && res.data?.data) {
        setRequests(res?.data?.data);
        setTotalRecord(res?.data?.paging?.total || 0);
      } else {
        toast.error(res?.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  /** ===================== SEARCH (DEBOUNCE) ===================== */
  const handleOnChangeSearch = useCallback(
    debounce((value) => {
      setFilter((prev) => ({
        ...prev,
        keySearch: value,
        page: 1,
      }));
    }, 400),
    []
  );

  /** ===================== EFFECT ===================== */
  useEffect(() => {
    fetchRequests();
  }, [filter]);

  /** ===================== ACTIONS ===================== */

  // const handleViewDetail = (req) => {
  //   setSelected(req);
  //   setOpenModal(true);
  // };

  // const handleCloseModal = () => {
  //   setOpenModal(false);
  //   setSelected(null);
  //   fetchRequests();
  // };

  const handleRefresh = () => {
    setSearchInput("");
    setFilter({
      page: 1,
      size: 5,
      keySearch: "",
      status: "all",
      dateFrom: null,
      dateTo: null,
    });
  };

  const renderStatus = (statusKey) => {
    const s = STATUS_CONFIG[statusKey] || {
      label: "Không xác định",
      color: "#6B7280",
    };

    return (
      <span
        style={{
          padding: "4px 8px",
          borderRadius: 6,
          fontWeight: 600,
          color: s.color,
          background: `${s.color}22`,
          border: `1px solid ${s.color}`,
        }}
      >
        {s.label}
      </span>
    );
  };

  /** ===================== RENDER ===================== */

  return (
    <div className="p-6 bg-white rounded shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý yêu cầu</h2>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-4">
        <TextField
          label="Tìm kiếm theo mã, tên khách, dịch vụ..."
          size="small"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleOnChangeSearch(e.target.value);
          }}
          sx={{ width: 400 }}
        />

        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Trạng thái</InputLabel>

          <Select
            label="Trạng thái"
            size="small"
            value={filter.status}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                status: e.target.value,
                page: 1,
              }))
            }
            sx={{ width: 180 }}
          >
            <MenuItem value="all">Tất cả trạng thái</MenuItem>

            {Object.entries(STATUS_CONFIG).map(([key, s]) => (
              <MenuItem key={key} value={key}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Từ ngày"
          type="date"
          size="small"
          inputProps={{
            max: filter.dateToRaw || undefined,
          }}
          InputLabelProps={{ shrink: true }}
          value={filter.dateFrom ? filter.dateFromRaw : ""}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              dateFromRaw: e.target.value,
              dateFrom: formatDateToDDMMYYYY(e.target.value),
              page: 1,
            }))
          }
        />

        <TextField
          label="Đến ngày"
          type="date"
          size="small"
          inputProps={{
            min: filter.dateFromRaw || undefined,
          }}
          InputLabelProps={{ shrink: true }}
          value={filter.dateTo ? filter.dateToRaw : ""}
          onChange={(e) =>
            setFilter((prev) => ({
              ...prev,
              dateToRaw: e.target.value,
              dateTo: formatDateToDDMMYYYY(e.target.value),
              page: 1,
            }))
          }
        />

        <Button variant="contained" color="primary" onClick={handleRefresh}>
          Làm mới
        </Button>
      </div>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{ maxHeight: "calc(100vh - 260px)", overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead
            sx={{
              "& .MuiTableCell-head": {
                backgroundColor: "#8ed1fc",
                fontWeight: 600,
              },
            }}
          >
            <TableRow>
              <TableCell>Mã yêu cầu</TableCell>
              <TableCell>Tên khách</TableCell>
              <TableCell>Dịch vụ</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell width={"max-content"} align="center">
                Trạng thái
              </TableCell>
              <TableCell align="center">Ngày yêu cầu</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {requests.length > 0 ? (
              requests.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.customer_name}</TableCell>
                  <TableCell>{item.service_name}</TableCell>
                  <TableCell>{item.address}</TableCell>

                  <TableCell align="center">
                    {renderStatus(item.status)}
                  </TableCell>

                  <TableCell align="center">
                    {item.requested_time} {item.requested_date}
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => navigate(`/requests/${item.id}`)}
                    >
                      Xem
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={100}>
                  <div className="py-6 flex flex-col items-center justify-center">
                    <img src={images.emptyBox} width={120} />
                    <p className="text-gray-600 mt-2">Không có dữ liệu</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <PaginationContainer
        display={requests.length > 0}
        totalRecord={totalRecord}
        setDataFilter={setFilter}
        dataFilter={filter}
      />

      {/* Modal Detail */}
      {/* <RequestDetail
        open={openModal}
        onClose={handleCloseModal}
        requestId={selected?.id}
        handleGetList={fetchRequests}
      /> */}
    </div>
  );
}

export default Requests;
