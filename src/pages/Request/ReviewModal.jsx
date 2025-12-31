import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import requestApi from "../../service/api/requestApi";
import { toast } from "react-toastify";

const renderStars = (rating = 0) =>
  Array.from({ length: 5 }).map((_, i) =>
    i < rating ? (
      <StarIcon key={i} sx={{ color: "#facc15" }} />
    ) : (
      <StarBorderIcon key={i} sx={{ color: "#facc15" }} />
    )
  );

export default function ReviewModal({ open, onClose, requestId, request }) {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);

  useEffect(() => {
    if (!open || !requestId) return;
    fetchReview();
  }, [open, requestId]);

  const fetchReview = async () => {
    setLoading(true);
    try {
      const res = await requestApi.getReviewByRequest(requestId);
      if (res.status && res.data) {
        setReview(res.data);
      } else {
        setReview(null);
        toast.info("Yêu cầu chưa có đánh giá");
      }
    } catch (err) {
      toast.error("Không lấy được đánh giá");
      setReview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Đánh giá dịch vụ
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : !review ? (
          <Typography color="text.secondary">
            Không có dữ liệu đánh giá
          </Typography>
        ) : (
          <>
            {/* Người đánh giá */}
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={request.customer?.avatar}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box>
                <Typography fontWeight={600}>
                  {request.customer?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(review.created_at).toLocaleString("vi-VN")}
                </Typography>
              </Box>
            </Box>

            {/* Rating */}
            <Box display="flex" alignItems="center" mb={2}>
              {renderStars(review.rating)}
              <Typography ml={1} fontWeight={600}>
                {review.rating}/5
              </Typography>
            </Box>

            {/* Comment */}
            <Typography
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #eee",
                backgroundColor: "#f9fafb",
                whiteSpace: "pre-line",
              }}
            >
              {review.comment || "Không có nhận xét"}
            </Typography>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
