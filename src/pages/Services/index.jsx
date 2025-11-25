import { useState, useEffect, useCallback } from "react";
import categoryApi from "../../service/api/categoryApi";
import serviceApi from "../../service/api/serviceApi";
import ServiceForm from "./ServiceForm";
import { formatPrice } from "../../utils/formatNumber";
import { useLoading } from "../../context/LoadingContext";
import { toast } from "react-toastify";
import images from "../../assets/images/Image";

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
  InputLabel,
  FormControl,
} from "@mui/material";
import { debounce } from "../../utils/functions";
import PaginationContainer from "../../components/PaginationContainer";

function Services() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [totalRecord, setTotalRecord] = useState(0);
  const { setLoading } = useLoading();

  // ❗ Chỉ dùng 1 object request (page, size, keySearch, catId)
  const [request, setRequest] = useState({
    page: 1,
    size: 5,
    keySearch: "",
    catId: "all",
    status: "all", // thêm trường status để lọc
  });
  const [searchInput, setSearchInput] = useState("");
  /** ===================== FETCH ===================== */

  const fetchCategories = async () => {
    const res = await categoryApi.getList({ page: 1, size: 50, keySearch: "" });
    if (res.status && res?.data?.data) setCategories(res.data.data);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceApi.getList(request); // Gửi đúng params phân trang
      if (res.status && res?.data) {
        setServices(res.data.services || []);
        setTotalRecord(res.data.totalRecord || 0);
      } else {
        toast.error(res?.message || "Lỗi khi lấy dịch vụ");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /** ===================== SEARCH (DEBOUNCE) ===================== */

  const handleOnChangeSearch = useCallback(
    debounce((value) => {
      setRequest((prev) => ({ ...prev, keySearch: value, page: 1 }));
    }, 500),
    []
  );

  /** ===================== ACTIONS ===================== */

  const handleAdd = () => {
    setSelected(null);
    setOpenModal(true);
  };

  const handleEdit = (svc) => {
    setSelected(svc);
    setOpenModal(true);
  };

  const handleOnClose = () => {
    setOpenModal(false);
    fetchServices();
  };
  const handleRefresh = () => {
    setSearchInput("");
    setRequest({
      page: 1,
      size: 10,
      keySearch: "",
      catId: "all",
      status: "all", // reset filter
    });
  };

  /** ===================== FETCH INIT ===================== */

  useEffect(() => {
    fetchCategories();
  }, []);

  // Gọi API khi request thay đổi
  useEffect(() => {
    fetchServices();
  }, [request]);

  /** ===================== RENDER ===================== */

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý dịch vụ</h2>
        <Button variant="contained" color="success" onClick={handleAdd}>
          + Thêm mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <TextField
          label="Tìm kiếm theo mã, tên, mô tả dịch vụ..."
          size="small"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleOnChangeSearch(e.target.value);
          }}
          sx={{ width: 400 }}
        />
        <FormControl sx={{ minWidth: 240 }} size="small">
          <InputLabel>Danh mục</InputLabel>
          <Select
            label="Danh mục"
            value={request.catId}
            onChange={(e) =>
              setRequest((prev) => ({
                ...prev,
                catId: e.target.value || "all",
                page: 1,
              }))
            }
          >
            <MenuItem value="all">-- Tất cả --</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Trạng thái</InputLabel>
          {/* 🔥 Select lọc status */}
          <Select
            label="Trạng thái"
            size="small"
            value={request.status ?? "all"}
            onChange={(e) =>
              setRequest((prev) => ({
                ...prev,
                status: e.target.value,
                page: 1,
              }))
            }
            displayEmpty // 🔥 Quan trọng
            sx={{ width: 160 }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleRefresh}>
          Làm mới
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "#8ed1fc" }}>
            <TableRow>
              <TableCell>Mã dịch vụ</TableCell>
              <TableCell>Tên dịch vụ</TableCell>
              <TableCell width={300}>Mô tả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Danh mục</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {services.length > 0 ? (
              services.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item?.id}</TableCell>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.description}</TableCell>
                  <TableCell>{formatPrice(item?.base_price)} VNĐ</TableCell>

                  <TableCell align="center">
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        color: item?.status === "active" ? "green" : "red",
                        fontWeight: 600,
                        background:
                          item?.status === "active" ? "#d4f8d4" : "#ffd7d7",
                      }}
                    >
                      {item?.status === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </TableCell>
                  <TableCell align="center">{item?.category_name}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(item)}
                    >
                      Sửa
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={100} align="center">
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

      <PaginationContainer
        display={services.length > 0}
        totalRecord={totalRecord}
        setDataFilter={setRequest}
        dataFilter={request}
      />

      {/* Modal Form */}
      <ServiceForm
        open={openModal}
        onClose={handleOnClose}
        service={selected}
      />
    </div>
  );
}

export default Services;
