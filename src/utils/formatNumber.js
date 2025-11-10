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
