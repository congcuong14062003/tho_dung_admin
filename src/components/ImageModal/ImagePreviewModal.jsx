// src/components/ImagePreviewModal.jsx
import { Modal, Box } from "@mui/material";

export default function ImagePreviewModal({ open, image, onClose }) {
  if (!image) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#000",
          p: 1,
          borderRadius: 2,
          width: "70vh",
          height: "70vh",
        }}
      >
        <img
          src={image}
          alt="preview"
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </Box>
    </Modal>
  );
}
