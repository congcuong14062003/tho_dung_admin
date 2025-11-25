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

import { Search } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import PaginationContainer from "../../components/PaginationContainer";
import { debounce } from "../../utils/functions";
import { toast } from "react-toastify";

import { useLoading } from "../../context/LoadingContext";
import customerApi from "../../service/api/customerApi";
import apiCommon from "../../service/api/apiCommon";
import images from "../../assets/images/Image";

export default function Customer() {
  const { setLoading } = useLoading();

  const [customers, setCustomers] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);

  // ===== REQUEST giống Categories =====
  const [request, setRequest] = useState({
    page: 1,
    size: 10,
    keySearch: "",
    status: "all",
  });

  const [searchInput, setSearchInput] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
    color: "blue",
  });

  // ========================= FETCH =========================
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerApi.getAll(request);

      setCustomers(res?.data?.data || []);
      setTotalRecord(res?.data?.totalRecord || 0);
    } catch (err) {
      console.error("Lỗi lấy khách hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // ========================= SEARCH (DEBOUNCE) =========================
  const handleOnChangeSearch = useCallback(
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
    fetchCustomers();
  }, [request]);

  // ========================= MODAL BLOCK / UNBLOCK =========================
  const openBlockModal = (userId, fullName) => {
    setConfirmModal({
      open: true,
      title: "Khóa tài khoản khách",
      message: `Bạn có chắc muốn KHÓA tài khoản khách "${fullName}" không?`,
      confirmText: "Khóa ngay",
      color: "red",
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await apiCommon.updateUserStatus({
            userId,
            status: "inactive",
          });
          res.status ? toast.success(res.message) : toast.error(res.message);
          fetchCustomers();
        } finally {
          setLoading(false);
          setConfirmModal((prev) => ({ ...prev, open: false }));
        }
      },
    });
  };

  const openUnblockModal = (userId, fullName) => {
    setConfirmModal({
      open: true,
      title: "Mở khóa tài khoản khách",
      message: `Mở khóa tài khoản khách "${fullName}"?`,
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
          fetchCustomers();
        } finally {
          setLoading(false);
          setConfirmModal((prev) => ({ ...prev, open: false }));
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
      <h2 className="text-xl font-semibold mb-4">Danh sách khách hàng</h2>

      {/* ==== SEARCH + FILTER ==== */}
      <div className="flex items-center gap-3 mb-4">
        <TextField
          label="Tìm theo mã, tên, số điện thoại khách hàng..."
          size="small"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleOnChangeSearch(e.target.value);
          }}
          sx={{ width: 350 }}
        />

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            label="Trạng thái"
            size="small"
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

      {/* ==== TABLE ==== */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "#8ed1fc" }}>
            <TableRow>
              <TableCell>Thông tin khách</TableCell>
              <TableCell>SĐT</TableCell>
              <TableCell>CCCD</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.length > 0 ? (
              customers.map((cus) => (
                <TableRow key={cus.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {cus.avatar_link ? (
                        <img
                          src={cus.avatar_link}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold">
                          {cus.full_name?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="font-medium">{cus.full_name}</div>
                        <div className="text-xs text-gray-500">
                          ID: {cus.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{cus.phone}</TableCell>
                  <TableCell>{cus.id_card || "—"}</TableCell>

                  <TableCell align="center">
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontWeight: 600,
                        background:
                          cus.status === "active" ? "#d4f8d4" : "#ffd7d7",
                        color: cus.status === "active" ? "green" : "red",
                      }}
                    >
                      {cus.status === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    {cus.status === "active" ? (
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => openBlockModal(cus.id, cus.full_name)}
                      >
                        Khóa
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => openUnblockModal(cus.id, cus.full_name)}
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

      {/* ==== PAGINATION ==== */}
      <PaginationContainer
        display={customers.length > 0}
        totalRecord={totalRecord}
        dataFilter={request}
        setDataFilter={setRequest}
      />

      {/* Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        cancelText="Hủy"
        color={confirmModal.color}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
