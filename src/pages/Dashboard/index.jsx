import React from "react";

// ================= MUI Core =================
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";

// ================= Icons =================
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";

/* ==================================================
   FAKE DATA (mock – thay bằng API sau)
================================================== */
const dashboardStats = {
  totalCustomers: 1240,
  totalTechnicians: 320,
  activeRequests: 87,
  completedToday: 19,
  revenueToday: 12500000,
  avgRating: 4.6,
};

const requestStatusStats = [
  { label: "Chờ xử lý", value: 18, color: "warning" },
  { label: "Đang phân thợ", value: 12, color: "info" },
  { label: "Đang làm", value: 25, color: "primary" },
  { label: "Chờ thanh toán", value: 9, color: "secondary" },
  { label: "Hoàn thành", value: 210, color: "success" },
  { label: "Đã huỷ", value: 14, color: "error" },
];

const topTechnicians = [
  { name: "Nguyễn Văn A", jobs: 120, rating: 4.9 },
  { name: "Trần Văn B", jobs: 98, rating: 4.8 },
  { name: "Lê Văn C", jobs: 87, rating: 4.7 },
];

/* ==================================================
   KPI CARD – tái sử dụng
================================================== */
function StatCard({ title, value, icon, color }) {
  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 2,
              backgroundColor: `${color}.main`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

/* ==================================================
   DASHBOARD REPORT PAGE
================================================== */
export default function Dashboard() {
  const totalRequestCount = requestStatusStats.reduce(
    (sum, i) => sum + i.value,
    0
  );

  return (
    <Box p={3}>
      {/* ================= HEADER ================= */}
      <Stack mb={3}>
        <Typography variant="h5" fontWeight={700}>
          Báo cáo & Thống kê hệ thống
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tổng quan hoạt động hôm nay của nền tảng
        </Typography>
      </Stack>

      {/* ================= KPI ================= */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Khách hàng"
            value={dashboardStats.totalCustomers}
            icon={<PeopleAltIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Thợ kỹ thuật"
            value={dashboardStats.totalTechnicians}
            icon={<EngineeringIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Yêu cầu đang xử lý"
            value={dashboardStats.activeRequests}
            icon={<AssignmentIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Hoàn thành hôm nay"
            value={dashboardStats.completedToday}
            icon={<CheckCircleIcon />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* ================= REVENUE + RATING ================= */}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Doanh thu hôm nay"
            value={`${dashboardStats.revenueToday.toLocaleString()} ₫`}
            icon={<MonetizationOnIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Đánh giá trung bình"
            value={dashboardStats.avgRating}
            icon={<StarIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* ================= REQUEST STATUS ================= */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Phân bố trạng thái yêu cầu
        </Typography>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              {requestStatusStats.map((item) => (
                <Box key={item.label}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {item.value}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(item.value / totalRequestCount) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      mt: 0.5,
                    }}
                    color={item.color}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* ================= TOP TECHNICIANS ================= */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Top thợ hiệu suất cao
        </Typography>

        <Grid container spacing={2}>
          {topTechnicians.map((tech, index) => (
            <Grid item xs={12} md={4} key={tech.name}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={700}>{tech.name}</Typography>
                      <Typography color="text.secondary">
                        #{index + 1}
                      </Typography>
                    </Stack>

                    <Divider />

                    <Typography variant="body2">
                      Công việc hoàn thành: <b>{tech.jobs}</b>
                    </Typography>
                    <Typography variant="body2">
                      Đánh giá: ⭐ <b>{tech.rating}</b>
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
