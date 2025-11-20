import { useEffect, useState } from "react";
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

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
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
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [keySearch, setKeySearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const res = await technicianApi.getAll({
        page,
        size,
        keySearch,
        status: "active",
      });
      if (res.status) {
        setWorkers(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách thợ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchWorkers();
  }, [open, page, keySearch]);

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

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2} fontWeight={600}>
          Gán thợ cho yêu cầu
        </Typography>

        <TextField
          label="Tìm kiếm thợ"
          fullWidth
          size="small"
          value={keySearch}
          onChange={(e) => setKeySearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ảnh</TableCell>
                <TableCell>Tên thợ</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Kỹ năng chuyên môn</TableCell>
                <TableCell align="center">Chọn</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers.map((w) => (
                <TableRow
                  key={w.id}
                  hover
                  selected={selectedWorker?.id === w.id}
                  onClick={() => setSelectedWorker(w)}
                >
                  <TableCell>
                    <Avatar src={w.avatar_link} />
                  </TableCell>
                  <TableCell>{w.full_name}</TableCell>
                  <TableCell>{w.phone}</TableCell>
                  <TableCell>{w.skill_category_name}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedWorker?.user_id === w.user_id}
                      onChange={() => setSelectedWorker(w)}
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
          />
        </Box>

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
