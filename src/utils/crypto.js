import { v4 as uuidv4 } from "uuid";
//Tạo random String với 8 ký tự
export function generateId(prefix = "") {
  return `${prefix}${uuidv4()}`;
}
