import { useState, useEffect, useCallback } from "react";
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

import { debounce } from "../../utils/functions";
import technicianApi from "../../service/api/technicianApi";
import { useLoading } from "../../context/LoadingContext";
import PaginationContainer from "../../components/PaginationContainer";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import apiCommon from "../../service/api/apiCommon";
import images from "../../assets/images/Image";
import { toast } from "react-toastify";

export default function TechnicianList() {
  const { setLoading } = useLoading();

  const [technicians, setTechnicians] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  // ===== REQUEST giống Customer & Category =====
  const [request, setRequest] = useState({
    page: 1,
    size: 10,
    keySearch: "",
    status: "all",
  });

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
    color: "blue",
  });

  // ================================= FETCH =================================
  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.getAll(request);

      setTechnicians(res?.data?.data || []);
      setTotalRecord(res?.data?.totalRecord || 0);
    } catch (err) {
      console.error("Lỗi lấy danh sách thợ:", err);
    } finally {
      setLoading(false);
    }
  };

  // ========================= SEARCH DEBOUNCE =========================
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
    fetchTechnicians();
  }, [request]);

  // ========================= MODAL BLOCK / UNBLOCK =========================
  const openBlockModal = (userId, fullName) => {
    setConfirmModal({
      open: true,
      title: "Khóa tài khoản thợ",
      message: `Bạn có chắc muốn khóa thợ "${fullName}"?`,
      confirmText: "Khóa",
      color: "red",
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await apiCommon.updateUserStatus({
            userId,
            status: "inactive",
          });

          res.status ? toast.success(res.message) : toast.error(res.message);
          fetchTechnicians();
        } finally {
          setLoading(false);
          setConfirmModal((p) => ({ ...p, open: false }));
        }
      },
    });
  };

  const openUnblockModal = (userId, fullName) => {
    setConfirmModal({
      open: true,
      title: "Mở khóa tài khoản thợ",
      message: `Bạn muốn mở khóa thợ "${fullName}"?`,
      confirmText: "Mở khóa",
      color: "green",
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await apiCommon.updateUserStatus({
            userId,
            status: "active",
          });

          res.status ? toast.success(res.message) : toast.error(res.message);
          fetchTechnicians();
        } finally {
          setLoading(false);
          setConfirmModal((p) => ({ ...p, open: false }));
        }
      },
    });
  };
  const handleRefresh = () => {
    setSearchInput("");
    setRequest({
      page: 1,
      size: 10,
      keySearch: "",
      status: "all", // reset filter
    });
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Danh sách thợ</h2>

      {/* ===== SEARCH + FILTER ===== */}
      <div className="flex items-center gap-3 mb-4">
        <TextField
          label="Tìm theo mã, tên, số điện thoại thợ..."
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
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleRefresh}>
          Làm mới
        </Button>
      </div>

      {/* ===== TABLE ===== */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "#8ed1fc" }}>
            <TableRow>
              <TableCell>Thông tin thợ</TableCell>
              <TableCell>Kỹ năng</TableCell>
              <TableCell align="center">Kinh nghiệm</TableCell>
              <TableCell align="center">Khu vực</TableCell>
              <TableCell width={300}>Mô tả</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {technicians.length > 0 ? (
              technicians.map((t) => (
                <TableRow key={t.user_id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {t.avatar_link ? (
                        <img
                          src={t.avatar_link}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                          {t.full_name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{t.full_name}</div>
                        <div className="text-xs text-gray-500">
                          ID: {t.user_id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {t.skills && t.skills.length > 0 ? (
                        t.skills.map((skill) => (
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

                  <TableCell align="center">{t.experience_years} năm</TableCell>

                  <TableCell align="center">{t.working_area}</TableCell>

                  <TableCell>{t.description || "—"}</TableCell>

                  <TableCell align="center">
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontWeight: 600,
                        background:
                          t.status === "active" ? "#d4f8d4" : "#ffd7d7",
                        color: t.status === "active" ? "green" : "red",
                      }}
                    >
                      {t.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    {t.status === "active" ? (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => openBlockModal(t.user_id, t.full_name)}
                      >
                        Khóa
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => openUnblockModal(t.user_id, t.full_name)}
                      >
                        Mở khóa
                      </Button>
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
        display={technicians.length > 0}
        totalRecord={totalRecord}
        dataFilter={request}
        setDataFilter={setRequest}
      />

      {/* ===== MODAL ===== */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText="Hủy"
        color={confirmModal.color}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
