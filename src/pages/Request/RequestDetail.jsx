import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";
import requestApi from "../../service/api/requestApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

export default function RequestDetail({ open, onClose, requestId }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "—";

  // ✅ Gọi API khi modal mở
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

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "300px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : !request ? (
          <Typography textAlign="center">Không có dữ liệu yêu cầu</Typography>
        ) : (
          <>
            <Typography variant="h6" mb={2} textAlign="center" fontWeight={600}>
              Chi tiết yêu cầu
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Người tạo & thợ */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={request.customer_avatar}
                  alt={request.customer_name}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle2">Người yêu cầu</Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {request.customer_name || "—"}
                  </Typography>
                </Box>
              </Grid>

              {request.technician_name && (
                <Grid
                  item
                  xs={6}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Avatar
                    src={request.technician_avatar}
                    alt={request.technician_name}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle2">Kỹ thuật viên</Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {request.technician_name}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ mb: 2 }} />

            {/* Thông tin yêu cầu */}
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Tên yêu cầu:</strong> {request.name_request || "—"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Dịch vụ:</strong> {request.service_name || "—"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Mô tả dịch vụ:</strong>{" "}
              {request.service_description || "—"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Số điện thoại:</strong> {request.customer_phone || "—"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Địa chỉ:</strong> {request.address || "—"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Mô tả yêu cầu:</strong> {request.description || "—"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Trạng thái:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>
                {request.status || "pending"}
              </span>
            </Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Thời gian yêu cầu sửa chữa:</strong>{" "}
              {request.requested_time} {request.requested_date}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Tạo lúc:</strong> {formatDate(request.created_at)}
            </Typography>
            {request.completed_at && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Hoàn thành lúc:</strong>{" "}
                {formatDate(request.completed_at)}
              </Typography>
            )}

            {request.cancel_reason && (
              <Typography variant="body1" color="error" sx={{ mb: 1 }}>
                <strong>Lý do hủy:</strong> {request.cancel_reason}
              </Typography>
            )}

            {/* Hình ảnh yêu cầu */}
            {request.images && request.images.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" mb={1} fontWeight={600}>
                  Hình ảnh liên quan
                </Typography>

                {["pending"].map((type) => {
                  const imgs = request.images.filter(
                    (img) => img.type === type
                  );
                  if (imgs.length === 0) return null;
                  return (
                    <Box key={type} sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        sx={{ mb: 1, textTransform: "capitalize" }}
                      >
                        {type === "pending"
                          ? "Ảnh tình trạng"
                          : type === "survey"
                          ? "Ảnh khảo sát"
                          : type === "completion"}
                      </Typography>

                      <Grid container spacing={1}>
                        {imgs.map((img, idx) => (
                          <Grid item xs={4} key={idx}>
                            <Box
                              component="img"
                              src={img.image_url}
                              alt={img.type}
                              sx={{
                                width: "100%",
                                height: 120,
                                objectFit: "cover",
                                borderRadius: "8px",
                                cursor: "pointer",
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  );
                })}
              </>
            )}

            <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" color="primary" onClick={onClose}>
                Đóng
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}
