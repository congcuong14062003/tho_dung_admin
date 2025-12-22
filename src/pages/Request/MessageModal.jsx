import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import { connectSocket } from "../../utils/socket";
import messageApi from "../../service/api/messageApi";
import { useAuth } from "../../context/AuthContext";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";

export default function MessageModal({ open, onClose, requestId }) {
  const [dataMessages, setDataMessages] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // sendStatus: "sending" | "success" | "error" | null
  const { userInfo } = useAuth();
  useEffect(() => {
    if (!open || !requestId) return;

    fetchMessages();

    const socket = connectSocket();
    if (!socket) return;

    socket.emit("join_request", { request_id: requestId });

    const handleReceive = (msg) => {
      console.log("userInfo?.id: ", userInfo?.userId);
      console.log("msg.senderId: ", msg.senderId);

      const normalizedMsg = {
        ...msg,
        fromMe: msg.senderId === userInfo?.id,
      };

      setDataMessages((prev) => {
        if (!prev || !prev.message) return prev;

        const newMessages = [normalizedMsg, ...prev.message]; // ← Thêm vào đầu

        return {
          ...prev,
          message: newMessages,
          paging: {
            ...prev.paging,
            total: prev.paging.total + 1,
          },
        };
      });
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.emit("leave_request", { request_id: requestId }); // nếu cần
    };
  }, [open, requestId]);

  const fetchMessages = async () => {
    setLoading(true);
    const res = await messageApi.getMessages({
      room_id: requestId,
      page: 1,
      size: 50,
      keySearch: "",
    });
    if (res.status) {
      setDataMessages(res.data);
    }
    setLoading(false);
  };

  const handleSend = async () => {
    if (!text.trim() && !selectedFile) return;

    console.log("Vào");

    try {
      setSending(true);
      setSendStatus("sending");

      const formData = new FormData();
      formData.append("room_id", requestId);
      formData.append("message_id", crypto.randomUUID());

      if (text.trim()) {
        formData.append("content_type", "text");
        formData.append("content_text", text);
      }

      console.log("selectedFile: ", selectedFile);

      if (selectedFile) {
        formData.append("content_type", "image");
        formData.append("files", selectedFile);
      }

      await messageApi.sendMessage(formData);

      setText("");
      setSelectedFile(null);
      setSendStatus("success");
    } catch (err) {
      console.error("Send message error:", err);
      setSendStatus("error");
    } finally {
      setSending(false);

      // reset status sau 2s cho gọn UI
      setTimeout(() => setSendStatus(null), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // chỉ cho phép ảnh
    if (!file.type.startsWith("image/")) {
      alert("Chỉ hỗ trợ file ảnh");
      return;
    }

    setSelectedFile(file);
  };

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  const getSenderInfo = (msg) => {
    if (msg.senderId === dataMessages?.customer?.id) {
      return {
        name: dataMessages.customer.name,
        avatar: dataMessages.customer.avatar,
        role: "customer",
        label: `${dataMessages.customer.name} (Khách hàng)`,
      };
    }

    if (msg.senderId === dataMessages?.technician?.id) {
      return {
        name: dataMessages.technician.name,
        avatar: dataMessages.technician.avatar,
        role: "technician",
        label: `${dataMessages.technician.name} (Thợ)`,
      };
    }

    return {
      name: "Admin",
      avatar: "/admin-avatar.png",
      role: "admin",
      label: "Admin (Quản trị viên)",
    };
  };

  console.log("messages: ", dataMessages.message);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>💬 Tin nhắn yêu cầu</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            height: 400,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column-reverse",
            mb: 2,
          }}
        >
          {loading && <CircularProgress />}

          {dataMessages?.message?.map((msg) => {
            const isMe = msg.fromMe;
            const sender = getSenderInfo(msg);

            return (
              <>
                <Box
                  key={msg.id}
                  display="flex"
                  justifyContent={isMe ? "flex-end" : "flex-start"}
                  alignItems="flex-end"
                  mb={1.5}
                >
                  {/* Avatar bên trái (người khác) */}
                  {!isMe && (
                    <Avatar
                      src={sender.avatar}
                      alt={sender.name}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    />
                  )}

                  {/* Bubble */}
                  <Box
                    sx={{
                      backgroundColor: isMe ? "#DCF8C6" : "#FFFFFF",
                      borderRadius: 2,
                      px: 1.5,
                      py: 1,
                      maxWidth: "70%",
                      boxShadow: 1,
                    }}
                  >
                    {/* Tên người gửi (ẩn với mình) */}
                    {!isMe && (
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, display: "block" }}
                      >
                        {sender.label}
                      </Typography>
                    )}

                    {/* Nội dung */}
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                    >
                      {msg.text}
                    </Typography>

                    {/* Thời gian */}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        fontSize: 11,
                      }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>

                  {/* Avatar bên phải (mình) – thường không cần, nhưng nếu muốn thì mở */}
                  {/* {isMe && (
                  <Avatar
                    src="/my-avatar.png"
                    sx={{ width: 28, height: 28, ml: 1, opacity: 0.8 }}
                  />
                )} */}
                </Box>
              </>
            );
          })}
        </Box>

        {selectedFile && (
          <Box
            sx={{
              mb: 1,
              p: 1,
              borderRadius: 2,
              border: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              gap: 1,
              position: "relative",
              maxWidth: 200,
            }}
          >
            <img
              src={previewUrl}
              alt="preview"
              style={{
                width: "100%",
                borderRadius: 8,
                objectFit: "cover",
              }}
            />

            {/* nút xoá ảnh */}
            <IconButton
              size="small"
              onClick={() => setSelectedFile(null)}
              sx={{
                position: "absolute",
                top: -8,
                right: -8,
                background: "#fff",
                boxShadow: 1,
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box display="flex" gap={1} alignItems="center">
          {/* icon chọn file */}
          <IconButton component="label">
            <AttachFileIcon />
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </IconButton>

          <TextField
            fullWidth
            size="small"
            placeholder="Nhập tin nhắn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !sending && handleSend()}
            disabled={sending}
          />

          <IconButton color="primary" onClick={handleSend} disabled={sending}>
            {sending ? <CircularProgress size={20} /> : <SendIcon />}
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
