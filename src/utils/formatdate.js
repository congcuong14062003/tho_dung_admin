// utils/formatDate.js

/**
 * Định dạng ngày giờ theo kiểu Việt Nam: hh:mm dd/MM/yyyy
 * Ví dụ: 14:30 20/11/2025
 * @param {string} dateString - Chuỗi ngày từ backend (ISO string hoặc bất kỳ định dạng Date có thể parse)
 * @returns {string}
 */
export const formatDateTimeVN = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Kiểm tra xem Date có hợp lệ không
  if (isNaN(date)) return "-";

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const formatDateToDDMMYYYY = (value) => {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
};
