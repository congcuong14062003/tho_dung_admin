// Định dạng số thành dạng xxx.xxx.xxx
export const formatPrice = (value) => {
  if (value == null || value === "") return "0";
  const numberString = value.toString().replace(/\D/g, "");
  if (!numberString) return "0";
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Bỏ định dạng (trả về chuỗi số thô để gửi về BE)
export const unformatPrice = (formattedValue) => {
  if (!formattedValue) return "0";
  return formattedValue.toString().replace(/\./g, "");
};
/**
 * Format input tiền tệ:
 * - Chỉ giữ 0–9
 * - Hiển thị dạng xxx.xxx.xxx
 * - Trả về cả string hiển thị & number sạch
 */
export const formatCurrencyInput = (inputValue = "") => {
  // Chỉ giữ số
  const raw = String(inputValue).replace(/\D/g, "");

  // Format xxx.xxx.xxx
  const formatted = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Number sạch
  const numberValue = Number(raw || 0);

  return {
    raw,
    formatted,
    numberValue,
  };
};
