import { useState, useEffect, useCallback } from "react";
import CategoryForm from "./CategoryForm";
import categoryApi from "../../service/api/categoryApi";
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
  FormControl,
  InputLabel,
} from "@mui/material";

import PaginationContainer from "../../components/PaginationContainer";
import { debounce } from "../../utils/functions";

function Categories() {
  const { setLoading } = useLoading();

  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const [totalRecord, setTotalRecord] = useState(0);

  // Giống Services: 1 object request
  const [request, setRequest] = useState({
    page: 1,
    size: 5,
    keySearch: "",
    status: "all",
  });

  const [searchInput, setSearchInput] = useState("");

  /** ===================== FETCH ===================== */

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getList(request);
      if (res.status && res?.data?.data) {
        setCategories(res.data.data);
        setTotalRecord(res.data.totalRecord || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ===================== SEARCH (DEBOUNCE) ===================== */

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

  /** ===================== ACTIONS ===================== */

  const handleAdd = () => {
    setSelected(null);
    setOpenModal(true);
  };

  const handleEdit = (cat) => {
    setSelected(cat);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await categoryApi.delete(id);
      res?.status ? toast.success(res.message) : toast.error(res.message);
      fetchCategories();
    } catch {
      toast.error("Không thể xóa danh mục");
    }
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

  const handleOnClose = () => {
    setOpenModal(false);
    fetchCategories();
  };

  /** ===================== EFFECTS ===================== */

  useEffect(() => {
    fetchCategories();
  }, [request]);

  /** ===================== RENDER ===================== */

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý danh mục</h2>
        <Button variant="contained" color="success" onClick={handleAdd}>
          + Thêm mới
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <TextField
          label="Tìm kiếm theo mã, tên, mô tả danh mục..."
          size="small"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleOnChangeSearch(e.target.value);
          }}
          sx={{ width: 400 }}
        />

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

        <Button variant="contained" color="primary" onClick={handleRefresh}>
          Làm mới
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "#8ed1fc" }}>
            <TableRow>
              <TableCell>Mã danh mục</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell width={300}>Mô tả</TableCell>
              <TableCell align="center">Màu</TableCell>
              <TableCell align="center">Ảnh</TableCell>
              <TableCell align="center">Trạng thái</TableCell>

              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.length > 0 ? (
              categories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>

                  <TableCell align="center">
                    <div
                      className="inline-block rounded"
                      style={{
                        width: 28,
                        height: 28,
                        background: item.color || "#ddd",
                        border: "1px solid #ccc",
                      }}
                    ></div>
                  </TableCell>

                  <TableCell align="center">
                    {item.icon ? (
                      <img
                        src={item.icon}
                        alt="icon"
                        className="w-10 h-10 rounded mx-auto"
                      />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        color: item.status === "active" ? "green" : "red",
                        fontWeight: 600,
                        background:
                          item.status === "active" ? "#d4f8d4" : "#ffd7d7",
                      }}
                    >
                      {item.status === "active"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </TableCell>

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
        display={categories.length > 0}
        totalRecord={totalRecord}
        setDataFilter={setRequest}
        dataFilter={request}
      />

      {/* Modal */}
      <CategoryForm
        onClose={handleOnClose}
        open={openModal}
        category={selected}
      />
    </div>
  );
}

export default Categories;
