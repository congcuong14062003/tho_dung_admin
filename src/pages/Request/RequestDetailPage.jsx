import { useEffect, useState } from "react";
import {
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
import { useParams, useNavigate } from "react-router-dom";

import requestApi from "../../service/api/requestApi";
import AssignWorkerModal from "./AssignWorkerModal";
import {
  STATUS_CONFIG,
  STATUS_CONFIG_PAYMENT,
} from "../../config/statusConfig";
import paymentApi from "../../service/api/paymentApi";
import { ShieldAlert } from "lucide-react";
import ImagePreviewModal from "../../components/ImageModal/ImagePreviewModal";

const pageStyle = {
  width: "100%",
  maxWidth: "900px",
  margin: "20px auto",
  background: "#fff",
  borderRadius: "10px",
  padding: "24px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
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

const renderStatus = (stt) => {
  const s = STATUS_CONFIG[stt] || {
    label: "Không xác định",
    color: "#6B7280",
    icon: ShieldAlert,
  };

  const Icon = s.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
        border: `1px solid ${s.color}`,
        color: s.color,
        backgroundColor: `${s.color}1A`,
      }}
    >
      <Icon size={14} strokeWidth={2} />
      {s.label}
    </span>
  );
};

const renderStatusPayment = (stt) => {
  const s = STATUS_CONFIG_PAYMENT[stt] || {
    label: "Không xác định",
    color: "#6B7280",
    icon: ShieldAlert,
  };

  const Icon = s.icon;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
        border: `1px solid ${s.color}`,
        color: s.color,
        backgroundColor: `${s.color}1A`,
      }}
    >
      <Icon size={14} strokeWidth={2} />
      {s.label}
    </span>
  );
};

export default function RequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString("vi-VN") : "—";

  useEffect(() => {
    if (!id) return;
    fetchDetail();
    fetchPaymentDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await requestApi.getDetail(id);
      if (res.status && res.data) {
        setRequest(res.data);
      } else {
        setRequest(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết yêu cầu:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentDetail = async () => {
    try {
      const res = await paymentApi.getDetail(id);
      if (res.status && res.data) setPaymentDetail(res.data);
    } catch (err) {
      console.log("Lỗi payment:", err);
    }
  };

  const handleApprovePayment = async () => {
    setLoading(true);
    try {
      const payload = {
        payment_id: paymentDetail?.id,
        action: "approve",
      };
      const res = await paymentApi.verifyPayment(payload);
      if (res.status) setPaymentDetail(res.data);
    } catch (err) {
      console.log("Lỗi duyệt payment:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !request)
    return (
      <Box sx={pageStyle} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  const category = request.category;
  const textColor = category?.color || "#000";
  const bgColor = category?.color
    ? hexToRgba(category.color, 0.2)
    : "transparent";

  return (
    <Box sx={pageStyle}>
      {/* Title */}
      <Typography variant="h6" textAlign="center" fontWeight={600} mb={2}>
        Chi tiết yêu cầu dịch vụ
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* Back button */}
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Quay lại
      </Button>

      {/* ===== 1. THÔNG TIN KHÁCH ===== */}
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

      {/* ===== 2. THÔNG TIN YÊU CẦU ===== */}
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
        <strong>Trạng thái:</strong> {renderStatus(request.status)}
      </Typography>

      {/* ===== 3. THỢ ===== */}
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
              <Typography fontWeight={500}>{request.technician?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {request.technician?.phone}
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {/* ===== 4. ẢNH HIỆN TRƯỜNG ===== */}
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
                alt=""
                onClick={() => setPreviewImage(img.image_url)}
                sx={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #eee",
                  cursor: "pointer",
                }}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary">
          Không có hình ảnh hiện trường
        </Typography>
      )}

      {/* ===== 5. ẢNH KHẢO SÁT ===== */}
      {request.survey_images?.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Ảnh khảo sát
          </Typography>

          <Grid container spacing={1}>
            {request.survey_images.map((img, idx) => (
              <Grid item xs={4} key={idx}>
                <Box
                  component="img"
                  src={img.image_url}
                  alt=""
                  onClick={() => setPreviewImage(img.image_url)}
                  sx={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #eee",
                    cursor: "pointer",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* ===== 6. BÁO GIÁ ===== */}
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
                <TableCell>Đơn giá</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Phản hồi khách</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {request.quotations.data.map((qtn) => (
                <TableRow key={qtn.id}>
                  <TableCell>{qtn.name}</TableCell>
                  <TableCell>
                    {qtn.price.toLocaleString("vi-VN")}₫
                  </TableCell>
                  <TableCell>
                    {qtn.status === "in_progress"
                      ? "Đang tiến hành"
                      : "Hoàn thành"}
                  </TableCell>
                  <TableCell>{qtn.note}</TableCell>
                  <TableCell>{qtn.reason}</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Tổng cộng</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  {request.quotations.total_price.toLocaleString("vi-VN")}₫
                </TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}

      {/* ===== 7. THỜI GIAN ===== */}
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

      {/* ===== 8. THANH TOÁN ===== */}
      <Divider sx={{ my: 2 }} />

      {paymentDetail && (
        <>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Thông tin thanh toán
          </Typography>

          <Box
            sx={{
              p: 2,
              border: "1px solid #eee",
              borderRadius: 2,
              background: "#fafafa",
              mb: 2,
            }}
          >
            <Typography>
              <strong>Mã thanh toán:</strong> {paymentDetail.payment_id}
            </Typography>

            <Typography>
              <strong>Số tiền:</strong>{" "}
              {paymentDetail.amount.toLocaleString("vi-VN")}₫
            </Typography>

            <Typography>
              <strong>Phương thức:</strong> {paymentDetail.payment_method}
            </Typography>

            <Typography>
              <strong>Trạng thái:</strong>{" "}
              {renderStatusPayment(paymentDetail.payment_status)}
            </Typography>

            {paymentDetail.qr_code_url && (
              <Box mt={2}>
                <img
                  src={paymentDetail.qr_code_url}
                  alt="QR"
                  style={{ width: 200, borderRadius: 6 }}
                />
              </Box>
            )}

            {paymentDetail.company_bank && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 2,
                  background: "#fff",
                }}
              >
                <Typography fontWeight={600} mb={1}>
                  Tài khoản công ty
                </Typography>

                <Typography>
                  <strong>Ngân hàng:</strong>{" "}
                  {paymentDetail.company_bank.bank_name} (
                  {paymentDetail.company_bank.bank_code})
                </Typography>

                <Typography>
                  <strong>Số tài khoản:</strong>{" "}
                  {paymentDetail.company_bank.account_number}
                </Typography>

                <Typography>
                  <strong>Chủ tài khoản:</strong>{" "}
                  {paymentDetail.company_bank.account_name}
                </Typography>

                <Typography>
                  <strong>Nội dung:</strong>{" "}
                  {paymentDetail.company_bank.content}
                </Typography>
              </Box>
            )}

            {/* Ảnh bill */}
            <Typography fontWeight={600} mt={2}>
              Ảnh bill thanh toán
            </Typography>

            {paymentDetail.proofs?.length > 0 ? (
              <Grid container spacing={1} mt={1}>
                {paymentDetail.proofs.map((pf) => (
                  <Grid item xs={4} key={pf.id}>
                    <img
                      src={pf.url}
                      onClick={() => setPreviewImage(pf.url)}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography color="text.secondary">
                Chưa có ảnh bill được tải lên
              </Typography>
            )}

            {paymentDetail.payment_status === "customer_review" && (
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={handleApprovePayment}
              >
                Duyệt thanh toán
              </Button>
            )}
          </Box>
        </>
      )}

      {/* ===== BUTTONS ===== */}
      <Box mt={3} textAlign="right">
        {request.status === "pending" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setOpenAssign(true)}
            sx={{ mr: 2 }}
          >
            Gán thợ
          </Button>
        )}
      </Box>

      {/* Assign worker modal */}
      <AssignWorkerModal
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        requestId={id}
        onSuccess={() => {
          setOpenAssign(false);
          fetchDetail();
        }}
      />

      {/* Modal xem ảnh */}
      <ImagePreviewModal
        open={!!previewImage}
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </Box>
  );
}
