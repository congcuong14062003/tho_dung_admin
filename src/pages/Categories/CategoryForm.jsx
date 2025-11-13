import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import categoryApi from "../../service/api/categoryApi";
import { toast } from "react-toastify";
import { useLoading } from "../../context/LoadingContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

export default function CategoryForm({ open, onClose, category }) {
  const { setLoading } = useLoading();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: null,
    color: "#ffffff", // ✅ thêm mặc định
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        icon: null,
        color: category.color || "#ffffff", // ✅ load lại màu khi sửa
      });
      setPreview(category.icon || null);
    } else {
      setFormData({
        name: "",
        description: "",
        icon: null,
        color: "#ffffff",
      });
      setPreview(null);
    }
  }, [category]);

  // 📝 Xử lý thay đổi input text / color
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Xử lý chọn ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, icon: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit form
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.warn("Tên danh mục không được để trống!");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("color", formData.color); // ✅ gửi thêm color
    if (formData.icon) data.append("icon", formData.icon);

    try {
      let result;
      if (category) {
        result = await categoryApi.update(category.id, data);
        if (result.status) toast.success("Cập nhật danh mục thành công!");
        else toast.error(result.message || "Cập nhật danh mục thất bại!");
        onClose();
      } else {
        result = await categoryApi.create(data);
        if (result.status) {
          toast.success("Thêm mới danh mục thành công!");
          setFormData({ name: "", description: "", icon: null, color: "#ffffff" });
          setPreview(null);
          onClose();
        } else {
          toast.error(result.message || "Thêm mới danh mục thất bại!");
        }
      }
    } catch (error) {
      console.error("Lỗi lưu danh mục:", error);
      toast.error("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {category ? "Sửa danh mục" : "Thêm danh mục mới"}
        </Typography>

        <TextField
          label="Tên danh mục"
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
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {/* 🎨 Thêm chọn màu */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" mb={1}>
            Màu hiển thị:
          </Typography>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            style={{
              width: 60,
              height: 40,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          />
          <span style={{ marginLeft: 8 }}>{formData.color}</span>
        </Box>

        {/* 🖼️ Icon */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" mb={1}>
            Ảnh đại diện (icon):
          </Typography>
          <Button variant="outlined" component="label">
            Chọn ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {preview && (
            <Box mt={2}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />
            </Box>
          )}
        </Box>

        <Box mt={3} sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Lưu
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}