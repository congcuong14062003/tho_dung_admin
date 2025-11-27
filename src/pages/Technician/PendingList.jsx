import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

import { debounce } from "../../utils/functions";
import technicianApi from "../../service/api/technicianApi";
import PaginationContainer from "../../components/PaginationContainer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import RejectConfirmModal from "../../components/ConfirmModal/RejectConfirmModal";
import { useLoading } from "../../context/LoadingContext";
import { toast } from "react-toastify";
import images from "../../assets/images/Image";
import { formatDateTimeVN } from "../../utils/formatdate";

export default function PendingList() {
  const { setLoading } = useLoading();

  const [data, setData] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  // ===== REQUEST FILTER =====
  const [request, setRequest] = useState({
    page: 1,
    size: 5,
    keySearch: "",
    status: "all",
  });

  // ===== MODALS =====
  const [approveModal, setApproveModal] = useState({
    open: false,
    requestId: null,
    fullName: "",
  });

  const [rejectModal, setRejectModal] = useState({
    open: false,
    requestId: null,
    fullName: "",
  });

  // ================== FETCH API ==================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.getPending(request);

      if (res.status) {
        setData(res.data?.data || []);
        setTotalRecord(res.data?.totalRecord || 0);
      } else {
        toast.error(res.message || "Không thể tải danh sách");
      }
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  // ================== SEARCH DEBOUNCE ==================
  const handleSearchChange = useCallback(
    debounce((value) => {
      setRequest((prev) => ({
        ...prev,
        keySearch: value,
        page: 1,
      }));
    }, 400),
    []
  );

  useEffect(() => {
    fetchData();
  }, [request]);

  // ================== APPROVE ==================
  const openApprove = (requestId, fullName) => {
    setApproveModal({ open: true, requestId, fullName });
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.approve({
        request_id: approveModal.requestId,
      });

      res.status
        ? toast.success("Đã duyệt thành công")
        : toast.error(res.message || "Duyệt thất bại");

      fetchData();
      setApproveModal({ open: false, requestId: null, fullName: "" });
    } finally {
      setLoading(false);
    }
  };

  // ================== REJECT ==================
  const openReject = (requestId, fullName) => {
    setRejectModal({ open: true, requestId, fullName });
  };

  const handleReject = async (reason) => {
    setLoading(true);
    try {
      const res = await technicianApi.reject({
        request_id: rejectModal.requestId,
        reason,
      });

      res.status
        ? toast.success("Đã từ chối yêu cầu")
        : toast.error(res.message || "Từ chối thất bại");

      fetchData();
      setRejectModal({ open: false, requestId: null, fullName: "" });
    } finally {
      setLoading(false);
    }
  };

  // ================== RESET ==================
  const handleRefresh = () => {
    setSearchInput("");
    setRequest({
      page: 1,
      size: 5,
      keySearch: "",
      status: "all",
    });
  };

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold mb-4">
        Danh sách quản lý duyệt thợ
      </h2>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="flex items-center gap-3 mb-4">
        <TextField
          label="Tìm theo mã, tên, số điện thoại..."
          size="small"
          sx={{ width: 350 }}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleSearchChange(e.target.value);
          }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            value={request.status}
            onChange={(e) =>
              setRequest((prev) => ({
                ...prev,
                status: e.target.value,
                page: 1,
              }))
            }
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
            <MenuItem value="rejected">Từ chối</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleRefresh}>
          Làm mới
        </Button>
      </div>

      {/* ===== TABLE ===== */}
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
              <TableCell>Thợ đăng ký</TableCell>
              <TableCell>SĐT</TableCell>
              <TableCell align="center">Loại yêu cầu</TableCell>

              <TableCell width={120}>Chuyên môn</TableCell>
              <TableCell align="center">Năm KN</TableCell>
              <TableCell width={100}> Khu vực</TableCell>
              <TableCell width={150}>Mô tả</TableCell>
              <TableCell align="center">Chứng chỉ</TableCell>
              <TableCell width={150} align="center">
                Trạng thái
              </TableCell>
              <TableCell align="center">Ngày nộp</TableCell>
              <TableCell width={200} align="center">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.request_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {item.avatar_link ? (
                        <img
                          src={item.avatar_link}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                          {item.full_name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{item.full_name}</div>
                        <div className="text-xs text-gray-500">
                          ID: {item.user_id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.phone}</TableCell>

                  <TableCell align="center">
                    <p>
                      {item.type === "new"
                        ? "Yêu cầu làm thợ"
                        : "Chỉnh sửa thông tin thợ"}
                    </p>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {item.skills && item.skills.length > 0 ? (
                        item.skills.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-3 py-1 text-white rounded-full text-xs"
                            style={{
                              backgroundColor: skill.color || "#666",
                            }}
                          >
                            {skill.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Chưa có kỹ năng
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell align="center">
                    {item.experience_years} năm
                  </TableCell>

                  <TableCell>{item.working_area}</TableCell>

                  <TableCell className="max-w-[220px]">
                    {item.description || "—"}
                  </TableCell>

                  <TableCell align="center">
                    {item.certifications && item.certifications}
                  </TableCell>

                  <TableCell align="center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status === "pending"
                        ? "Chờ duyệt"
                        : item.status === "approved"
                        ? "Đã duyệt"
                        : "Bị từ chối"}
                    </span>

                    {item.status === "rejected" && (
                      <p className="text-xs text-red-600">
                        Lý do: {item.rejected_reason}
                      </p>
                    )}
                  </TableCell>

                  <TableCell align="center">
                    {formatDateTimeVN(item.created_at)}
                  </TableCell>

                  <TableCell align="center">
                    {item.status === "pending" ? (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          sx={{ mr: 1 }}
                          onClick={() =>
                            openApprove(item.request_id, item.full_name)
                          }
                        >
                          Duyệt
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() =>
                            openReject(item.request_id, item.full_name)
                          }
                        >
                          Từ chối
                        </Button>
                      </>
                    ) : (
                      <span className="text-gray-500 text-xs italic">
                        Đã xử lý
                      </span>
                    )}
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

      {/* ===== PAGINATION ===== */}
      <PaginationContainer
        display={data.length > 0}
        totalRecord={totalRecord}
        dataFilter={request}
        setDataFilter={setRequest}
      />

      {/* ===== MODALS ===== */}
      <ConfirmModal
        isOpen={approveModal.open}
        title="Xác nhận duyệt thợ"
        message={`Bạn có chắc muốn DUYỆT thợ "${approveModal.fullName}"?`}
        confirmText="Duyệt ngay"
        cancelText="Hủy"
        color="green"
        onConfirm={handleApprove}
        onCancel={() =>
          setApproveModal({ open: false, requestId: null, fullName: "" })
        }
      />

      <RejectConfirmModal
        isOpen={rejectModal.open}
        fullName={rejectModal.fullName}
        onConfirm={handleReject}
        onCancel={() =>
          setRejectModal({ open: false, requestId: null, fullName: "" })
        }
      />
    </div>
  );
}
