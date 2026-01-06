import { toast } from "react-toastify";

// Chheck ngày
function checkDateRange(startDate, endDate, xDate) {
    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const startParts = startDate.split('/');
    const endParts = endDate.split('/');

    const start = new Date(
        parseInt(startParts[2]),
        parseInt(startParts[1]) - 1,
        parseInt(startParts[0])
    );

    const end = new Date(
        parseInt(endParts[2]),
        parseInt(endParts[1]) - 1,
        parseInt(endParts[0])
    );

    // Tính toán số ngày giữa hai ngày
    const timeDiff = Math.abs(end - start);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Kiểm tra số ngày
    if (daysDiff <= xDate) {
        return true; // Khoảng thời gian hợp lệ
    } else {
        toast.error("Chỉ được chọn khoảng tối đa 60 ngày");
        return false;
    }
}

export default checkDateRange