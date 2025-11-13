import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Avatar,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import requestApi from "../../service/api/requestApi";
import AssignWorkerModal from "./AssignWorkerModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const hexToRgba = (hex, opacity = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}, ${opacity})`
    : hex;
};

export default function RequestDetail({
  open,
  onClose,
  requestId,
  handleGetList,
}) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "—";

  useEffect(() => {
    if (!open || !requestId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await requestApi.getDetail(requestId);
        if (res.status && res.data) {
          setRequest(res.data);
        } else {
          setRequest(null);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết yêu cầu:", error);
        setRequest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, requestId]);

  if (loading) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box
          sx={style}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
        >
          <CircularProgress />
        </Box>
      </Modal>
    );
  }

  if (!request) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography textAlign="center">Không có dữ liệu yêu cầu</Typography>
        </Box>
      </Modal>
    );
  }

  const category = request.category;
  const textColor = category?.color || "#000";
  const bgColor = category?.color
    ? hexToRgba(category.color, 0.2)
    : "transparent";

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2} textAlign="center" fontWeight={600}>
          Chi tiết yêu cầu dịch vụ
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* 1️⃣ Thông tin khách hàng */}
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Thông tin khách hàng
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={request.customer?.avatar}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography fontWeight={500}>{request.customer?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {request.customer?.phone}
            </Typography>
          </Box>
        </Box>

        {/* 2️⃣ Thông tin yêu cầu */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Thông tin yêu cầu
        </Typography>

        <Typography>
          <strong>Tên yêu cầu:</strong> {request.name_request}
        </Typography>
        <Typography>
          <strong>Mô tả:</strong> {request.description}
        </Typography>
        <Typography>
          <strong>Địa chỉ:</strong> {request.address}
        </Typography>
        <Typography>
          <strong>Thời gian mong muốn:</strong> {request.requested_time} -{" "}
          {request.requested_date}
        </Typography>
        <Typography>
          <strong>Danh mục:</strong>{" "}
          <span
            style={{
              backgroundColor: bgColor,
              color: textColor,
              padding: "2px 8px",
              borderRadius: 6,
            }}
          >
            {category?.name}
          </span>
        </Typography>
        <Typography>
          <strong>Dịch vụ:</strong> {request.service?.name}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Trạng thái:</strong>{" "}
          <span style={{ textTransform: "capitalize" }}>{request.status}</span>
        </Typography>

        {/* 3️⃣ Thông tin kỹ thuật viên */}
        {request.technician && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Kỹ thuật viên phụ trách
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={request.technician?.avatar}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box>
                <Typography fontWeight={500}>
                  {request.technician?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.technician?.phone}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {/* 4️⃣ Hình ảnh hiện trường & khảo sát */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Hình ảnh hiện trường
        </Typography>
        {request.scene_images?.length > 0 ? (
          <Grid container spacing={1} mb={2}>
            {request.scene_images.map((img, idx) => (
              <Grid item xs={4} key={idx}>
                <Box
                  component="img"
                  src={img.image_url}
                  alt="scene"
                  sx={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #eee",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Không có hình ảnh hiện trường
          </Typography>
        )}

        {request.survey_images?.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Ảnh khảo sát của thợ
            </Typography>
            <Grid container spacing={1} mb={2}>
              {request.survey_images.map((img, idx) => (
                <Grid item xs={4} key={idx}>
                  <Box
                    component="img"
                    src={img.image_url}
                    alt="survey"
                    sx={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid #eee",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* 5️⃣ Báo giá của thợ */}
        {request.quotations?.data?.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Báo giá chi tiết
            </Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Hạng mục</TableCell>
                  <TableCell align="right">Đơn giá (₫)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {request.quotations.data.map((qtn) => (
                  <TableRow key={qtn.id}>
                    <TableCell>{qtn.name}</TableCell>
                    <TableCell align="right">
                      {qtn.price.toLocaleString("vi-VN")}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Tổng cộng</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {request.quotations.total_price.toLocaleString("vi-VN")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}

        {/* 6️⃣ Thời gian & lịch sử */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Thông tin thời gian
        </Typography>
        <Typography>
          <strong>Tạo lúc:</strong> {formatDate(request.created_at)}
        </Typography>
        {request.completed_at && (
          <Typography>
            <strong>Hoàn thành:</strong> {formatDate(request.completed_at)}
          </Typography>
        )}
        {request.cancel_reason && (
          <Typography color="error">
            <strong>Lý do hủy:</strong> {request.cancel_reason}
          </Typography>
        )}

        <Box mt={3} textAlign="right">
          {request.status === "pending" && (
            <Button
              variant="contained"
              color="red"
              onClick={() => setOpenAssign(true)}
              sx={{ mr: 2 }}
            >
              Gán thợ
            </Button>
          )}
          <Button variant="contained" onClick={onClose}>
            Đóng
          </Button>
        </Box>
        <AssignWorkerModal
          open={openAssign}
          onClose={() => setOpenAssign(false)}
          requestId={requestId}
          onSuccess={() => {
            setOpenAssign(false);
            // Reload lại chi tiết yêu cầu sau khi gán
            setLoading(true);
            requestApi.getDetail(requestId).then((res) => {
              if (res.status) setRequest(res.data);
              setLoading(false);
            });
          }}
        />
      </Box>
    </Modal>
  );
}
