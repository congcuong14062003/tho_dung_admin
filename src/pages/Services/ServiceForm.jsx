import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";
import categoryApi from "../../service/api/categoryApi";
import serviceApi from "../../service/api/serviceApi";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

export default function ServiceForm({ open, onClose, service }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    category_id: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi.getList({ page: 1, size: 50, keySearch: "" }).then((res) => {
      if (res.status && res?.data?.data) {
        setCategories(res.data.data);
      }
    });

    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        base_price: service.base_price,
        category_id: service.category_id,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        base_price: "",
        category_id: "",
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Xử lý submit trực tiếp tại form
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.warning("Vui lòng nhập tên dịch vụ");
      return;
    }
    if (!formData.category_id) {
      toast.warning("Vui lòng chọn danh mục");
      return;
    }

    try {
      if (service) {
        await serviceApi.update(service.id, formData);
        toast.success("Cập nhật dịch vụ thành công!");
      } else {
        await serviceApi.create(formData);
        toast.success("Thêm dịch vụ thành công!");
      }
      onClose(); // Đóng modal
    } catch (error) {
      console.error(error);
      toast.error("Lưu dịch vụ thất bại!");
    } finally {
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {service ? "Sửa dịch vụ" : "Thêm dịch vụ mới"}
        </Typography>

        <TextField
          label="Tên dịch vụ"
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Mô tả"
          name="description"
          fullWidth
          value={formData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Giá"
          name="base_price"
          fullWidth
          value={formData.base_price}
          onChange={(e) => {
            const value = e.target.value;

            // Chỉ cho nhập số nguyên dương > 0
            if (/^\d*$/.test(value)) {
              // Cho phép rỗng (để xoá input) hoặc số > 0
              if (value === "" || parseInt(value, 10) > 0) {
                setFormData((prev) => ({ ...prev, base_price: value }));
              }
            }
          }}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          label="Danh mục"
          name="category_id"
          fullWidth
          value={formData.category_id}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <Box
          mt={3}
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Lưu
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
