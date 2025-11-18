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
} from "lucide-react";

export const Colors = {
  status: {
    pending: "#FACC15",
    assigning: "#F59E0B",
    assigned: "#3B82F6",
    quoted: "#8B5CF6",
    inProgress: "#0EA5E9",
    customerReview: "#3B82F6",   // ⭐ Mới
    payment: "#F59E0B",          // ⭐ Mới
    completed: "#22C55E",
    cancelled: "#EF4444",
    maintenance: "#6B7280",
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
    color: Colors.status.inProgress,
    icon: Wrench,
  },

  // ⭐⭐ TRẠNG THÁI MỚI ⭐⭐
  customer_review: {
    label: "Khách đang xem xét",
    color: Colors.status.customerReview,
    icon: Eye,
  },
  payment: {
    label: "Đang thanh toán",
    color: Colors.status.payment,
    icon: CreditCard,
  },
  // ⭐⭐ END ⭐⭐

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
