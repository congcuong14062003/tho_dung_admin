import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  CircularProgress,
  Pagination,
  Button,
  Checkbox,
} from "@mui/material";
import requestApi from "../../service/api/requestApi";
import { toast } from "react-toastify";
import technicianApi from "../../service/api/technicianApi";
import { useLoading } from "../../context/LoadingContext";
import PaginationContainer from "../../components/PaginationContainer";
import { debounce } from "../../utils/functions";
import images from "../../assets/images/Image";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

export default function AssignWorkerModal({
  open,
  onClose,
  requestId,
  onSuccess,
}) {
  const { setLoading } = useLoading();

  const [technicians, setTechnicians] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [assigning, setAssigning] = useState(false);

  // ===== REQUEST giống Customer & Category =====
  const [request, setRequest] = useState({
    page: 1,
    size: 5,
    keySearch: "",
    status: "active",
  });
  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.getAll(request);

      setTechnicians(res?.data?.data || []);
      setTotalRecord(res?.data?.paging?.total || 0);
    } catch (err) {
      console.error("Lỗi lấy danh sách thợ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [open, request]);

  const handleAssign = async () => {
    if (!selectedWorker) return toast.warn("Vui lòng chọn thợ để gán!");
    setAssigning(true);
    try {
      const res = await requestApi.assignWorker({
        request_id: requestId,
        technician_id: selectedWorker.user_id,
      });
      if (res.status) {
        toast.success("Gán thợ thành công!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.message || "Không thể gán thợ!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi gán thợ!");
    } finally {
      setAssigning(false);
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
  const handleRefresh = () => {
    setSearchInput("");
    setRequest({
      page: 1,
      size: 5,
      keySearch: "",
      status: "all", // reset filter
    });
  };
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2} fontWeight={600}>
          Gán thợ cho yêu cầu
        </Typography>

        <div className="flex items-center gap-3 mb-4">
          <TextField
            label="Tìm theo tên hoặc số điện thoại..."
            size="small"
            sx={{ width: 500 }}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              handleSearchChange(e.target.value);
            }}
          />
          <Button variant="contained" color="primary" onClick={handleRefresh}>
            Làm mới
          </Button>
        </div>

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
              <TableCell>Ảnh</TableCell>
              <TableCell>Tên thợ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Kỹ năng chuyên môn</TableCell>
              <TableCell align="center">Chọn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {technicians.length > 0 ? (
              technicians.map((w) => (
                <TableRow key={w.user_id}>
                  <TableCell>
                    <Avatar src={w.avatar_link} />
                  </TableCell>
                  <TableCell>{w.full_name}</TableCell>
                  <TableCell>{w.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {w.skills && w.skills.length > 0 ? (
                        w.skills.map((skill) => (
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
                    <Checkbox
                      checked={selectedWorker?.user_id === w.user_id}
                      onChange={() => setSelectedWorker(w)}
                      color="primary"
                    />
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

        <PaginationContainer
          display={technicians.length > 0}
          totalRecord={totalRecord}
          dataFilter={request}
          setDataFilter={setRequest}
        />

        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleAssign}
            disabled={assigning || !selectedWorker}
          >
            {assigning ? "Đang gán..." : "Xác nhận gán"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
