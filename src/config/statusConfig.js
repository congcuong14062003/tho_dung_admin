import {
  Clock,
  UserCheck,
  DollarSign,
  Wrench,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Eye,
  CreditCard,
  Hourglass,        // ← Icon mới cho "đang chờ duyệt"
} from "lucide-react";

export const Colors = {
  status: {
    pending: "#FACC15",          // Vàng nhạt
    assigning: "#F59E0B",        // Cam
    assigned: "#3B82F6",         // Xanh dương
    quoted: "#8B5CF6",           // Tím
    in_progress: "#0EA5E9",      // Xanh ngọc
    customer_review: "#3B82F6",  // Xanh dương (giữ nguyên)
    payment: "#F59E0B",          // Cam (chờ thanh toán)
    payment_review: "#FFB020",   // Vàng cam đậm – nổi bật "đang chờ duyệt"
    completed: "#22C55E",        // Xanh lá
    cancelled: "#EF4444",        // Đỏ
    maintenance: "#6B7280",      // Xám
  },
};

export const STATUS_CONFIG = {
  pending: {
    label: "Đang chờ xử lý",
    color: Colors.status.pending,
    icon: Clock,
  },
  assigning: {
    label: "Đang gán thợ",
    color: Colors.status.assigning,
    icon: UserCheck,
  },
  assigned: {
    label: "Đã giao thợ",
    color: Colors.status.assigned,
    icon: UserCheck,
  },
  quoted: {
    label: "Đã báo giá",
    color: Colors.status.quoted,
    icon: DollarSign,
  },
  in_progress: {
    label: "Đang thực hiện",
    color: Colors.status.in_progress,
    icon: Wrench,
  },

  // ⭐ Khách kiểm tra công việc thợ làm
  customer_review: {
    label: "Khách kiểm tra",
    color: Colors.status.customer_review,
    icon: Eye,
  },

  // ⭐ Chờ khách thanh toán
  payment: {
    label: "Chờ thanh toán",
    color: Colors.status.payment,
    icon: CreditCard,
  },

  // 🔥 TRẠNG THÁI MỚI: CHỜ ADMIN DUYỆT BILL 🔥
  payment_review: {
    label: "Chờ duyệt thanh toán",
    color: Colors.status.payment_review,
    icon: Hourglass,                    // Đồng hồ cát → đang chờ xử lý
    badge: true,                        // (Tùy chọn) để thêm badge "Mới" ở frontend
    description: "Admin đang kiểm tra bill thanh toán",
  },

  // ⭐ Hoàn tất
  completed: {
    label: "Hoàn thành",
    color: Colors.status.completed,
    icon: CheckCircle,
  },
  cancelled: {
    label: "Đã hủy",
    color: Colors.status.cancelled,
    icon: XCircle,
  },
  maintenance: {
    label: "Bảo trì định kỳ",
    color: Colors.status.maintenance,
    icon: ShieldAlert,
  },
};

export const STATUS_CONFIG_PAYMENT = {
  pending: {
    label: "Đang chờ duyệt",
    color: Colors.status.pending,
    icon: Clock,
  },
  // ⭐ Hoàn tất
  paid: {
    label: "Đã thanh toán thành công",
    color: Colors.status.completed,
    icon: CheckCircle,
  },
};