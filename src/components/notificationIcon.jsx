import {
  Bell,
  UserCheck,
  UserX,
  Users,
  ClipboardList,
  ClipboardCheck,
  ClipboardX,
  FileEdit,
  CheckCircle,
  XCircle,
  FileWarning,
  Receipt,
  BadgeCheck
} from "lucide-react";

export const getNotificationIcon = (type) => {
  switch (type) {
    case "request_cancel":
      return <XCircle size={18} className="text-red-600" />;

    case "request_technician_approved":
      return <UserCheck size={18} className="text-green-600" />;

    case "request_technician_rejected":
      return <UserX size={18} className="text-red-600" />;

    case "request_technician":
      return <Users size={18} className="text-blue-600" />;

    case "new_request":
      return <ClipboardList size={18} className="text-indigo-600" />;

    case "assign_job":
      return <FileEdit size={18} className="text-purple-600" />;

    case "quote_from_worker":
      return <FileWarning size={18} className="text-amber-600" />;

    case "quote_approved":
      return <CheckCircle size={18} className="text-green-600" />;

    case "quote_rejected":
      return <XCircle size={18} className="text-red-600" />;

    case "report_job":
      return <ClipboardCheck size={18} className="text-teal-600" />;

    case "accept_inspection":
      return <BadgeCheck size={18} className="text-green-600" />;

    case "reject_inspection":
      return <ClipboardX size={18} className="text-red-600" />;

    case "payment":
      return <Receipt size={18} className="text-yellow-600" />;

    case "payment_approved":
      return <CheckCircle size={18} className="text-green-700" />;

    case "technician_accept_assign":
      return <UserCheck size={18} className="text-green-600" />;

    case "technician_reject_assign":
      return <UserX size={18} className="text-red-600" />;

    default:
      return <Bell size={18} className="text-blue-600" />;
  }
};
