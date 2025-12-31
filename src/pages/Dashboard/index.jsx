import React from "react";

// MUI Core
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

// MUI Icons
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";

/* =========================
   Fake Data (theo schema DB)
========================= */
const dashboardStats = {
  totalCustomers: 1240,          // users role=customer
  totalTechnicians: 320,         // users role=technician
  activeRequests: 87,            // requests status != completed/cancelled
  completedToday: 19,            // requests completed_at = today
  revenueToday: 12500000,        // payments paid today
  avgRating: 4.6,                // reviews avg
};

const requestStatusStats = [
  { label: "Chờ xử lý", value: 18 },
  { label: "Đang phân thợ", value: 12 },
  { label: "Đang làm", value: 25 },
  { label: "Chờ thanh toán", value: 9 },
  { label: "Hoàn thành", value: 210 },
  { label: "Đã huỷ", value: 14 },
];

const topTechnicians = [
  { name: "Nguyễn Văn A", jobs: 120, rating: 4.9 },
  { name: "Trần Văn B", jobs: 98, rating: 4.8 },
  { name: "Lê Văn C", jobs: 87, rating: 4.7 },
];

/* =========================
   Reusable KPI Card
========================= */
function StatCard({ title, value, icon, color = "primary.main" }) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: color,
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
            <Typography variant="h5" fontWeight={600}>
              {value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

/* =========================
   Dashboard Page
========================= */
function Dashboard() {
  return (
    <Box p={3}>
      {/* Title */}
      <Typography variant="h5" fontWeight={600} mb={3}>
        Trang chủ quản trị
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Khách hàng"
            value={dashboardStats.totalCustomers}
            icon={<PeopleAltIcon />}
            color="primary.main"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Thợ"
            value={dashboardStats.totalTechnicians}
            icon={<EngineeringIcon />}
            color="success.main"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Yêu cầu đang xử lý"
            value={dashboardStats.activeRequests}
            icon={<AssignmentIcon />}
            color="warning.main"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <StatCard
            title="Hoàn thành hôm nay"
            value={dashboardStats.completedToday}
            icon={<CheckCircleIcon />}
            color="info.main"
          />
        </Grid>
      </Grid>

      {/* Revenue + Rating */}
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Doanh thu hôm nay"
            value={`${dashboardStats.revenueToday.toLocaleString()} ₫`}
            icon={<MonetizationOnIcon />}
            color="success.dark"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <StatCard
            title="Đánh giá trung bình"
            value={dashboardStats.avgRating}
            icon={<StarIcon />}
            color="warning.dark"
          />
        </Grid>
      </Grid>

      {/* Request Status */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Trạng thái yêu cầu
        </Typography>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              {requestStatusStats.map((item) => (
                <Grid item xs={6} md={4} key={item.label}>
                  <Stack>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {item.value}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Top Technicians */}
      <Box mt={4}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Thợ hoạt động tốt
        </Typography>

        <Grid container spacing={2}>
          {topTechnicians.map((tech) => (
            <Grid item xs={12} md={4} key={tech.name}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography fontWeight={600}>
                    {tech.name}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" spacing={2}>
                    <Typography variant="body2">
                      Job hoàn thành: <b>{tech.jobs}</b>
                    </Typography>
                    <Typography variant="body2">
                      ⭐ {tech.rating}
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

export default Dashboard;
