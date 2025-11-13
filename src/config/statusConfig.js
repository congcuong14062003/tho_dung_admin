// 💡 Cập nhật STATUS_CONFIG với icon, sử dụng các icon phù hợp từ lucide-react
import {
  Clock,
  UserCheck,
  DollarSign,
  Wrench,
  CheckCircle,
  XCircle,
  ShieldAlert,
} from "lucide-react"; // Thêm import icons từ lucide-react

export const Colors = {
  status: {
    pending: "#FACC15", // vàng - chờ xử lý
    assigning: "#F59E0B", // cam - đang gán thợ
    assigned: "#3B82F6", // xanh dương - đã giao thợ
    quoted: "#8B5CF6", // tím - đã báo giá
    inProgress: "#0EA5E9", // xanh da trời - đang làm
    completed: "#22C55E", // xanh lá - hoàn thành
    cancelled: "#EF4444", // đỏ - đã hủy
    maintenance: "#6B7280", // xám - bảo trì
  },
};

export const STATUS_CONFIG = {
  pending: {
    label: "Đang chờ xử lý",
    color: Colors.status.pending,
    icon: Clock, // Icon chờ
  },
  assigning: {
    label: "Đang gán thợ",
    color: Colors.status.assigning,
    icon: UserCheck, // Icon gán user
  },
  assigned: {
    label: "Đã giao thợ",
    color: Colors.status.assigned,
    icon: UserCheck, // Hoặc icon khác nếu cần
  },
  quoted: {
    label: "Đã báo giá",
    color: Colors.status.quoted,
    icon: DollarSign, // Icon tiền/báo giá
  },
  in_progress: {
    label: "Đang thực hiện",
    color: Colors.status.inProgress,
    icon: Wrench, // Icon công cụ
  },
  completed: {
    label: "Hoàn thành",
    color: Colors.status.completed,
    icon: CheckCircle, // Icon check
  },
  cancelled: {
    label: "Đã hủy",
    color: Colors.status.cancelled,
    icon: XCircle, // Icon X
  },
  maintenance: {
    label: "Bảo trì định kỳ",
    color: Colors.status.maintenance,
    icon: ShieldAlert, // Icon bảo trì/cảnh báo
  },
};
