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
  Popover,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import { useEffect, useRef, useState, useMemo } from "react";
import { connectSocket } from "../../utils/socket";
import messageApi from "../../service/api/messageApi";
import { useAuth } from "../../context/AuthContext";

/**
 * Màu tin nhắn giống Facebook
 */
const MY_MESSAGE_BG = "linear-gradient(135deg, #0084FF 0%, #006AFF 100%)";
const OTHER_MESSAGE_BG = "#FFFFFF";

export default function MessageModal({ open, onClose, requestId }) {
  const refInput = useRef(null);
  const socket = connectSocket();
  const { userInfo } = useAuth();

  const [dataMessages, setDataMessages] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [typingInfo, setTypingInfo] = useState({});
  const [emojiAnchor, setEmojiAnchor] = useState(null);

  let typingTimeout = null;

  const [request, setRequest] = useState({
    room_id: requestId,
    page: 1,
    size: 100,
    keySearch: "",
  });

  const emojiOpen = Boolean(emojiAnchor);

  const handleEmojiClick = (event) => {
    setEmojiAnchor(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setEmojiAnchor(null);
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
    handleEmojiClose();
    refInput.current?.focus();
  };

  // Tính partner (người chat cùng)
  const partner = useMemo(() => {
    if (!dataMessages?.customer || !dataMessages?.technician || !userInfo) return null;
    const isCustomer = userInfo.userId === dataMessages.customer.id;
    return isCustomer ? dataMessages.technician : dataMessages.customer;
  }, [dataMessages, userInfo]);

  /**
   * Lấy danh sách tin nhắn
   */
  const fetchMessages = async () => {
    setLoading(true);
    const res = await messageApi.getMessages(request);
    if (res.status) {
      setDataMessages(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open || !requestId) return;

    fetchMessages();
    if (!socket) return;

    socket.emit("join_request", { request_id: requestId });

    const handleReceive = (msg) => {
      setDataMessages((prev) => {
        if (!prev || !prev.message) return prev;
        return {
          ...prev,
          message: [msg, ...prev.message],
          paging: {
            ...prev.paging,
            total: prev.paging.total + 1,
          },
        };
      });
    };

    socket.on("receive_message", handleReceive);

    socket.on("user_typing", (data) => {
      if (data.userId === userInfo?.userId) return;
      setTypingInfo((prev) => ({
        ...prev,
        [data.userId]: {
          username: data.username || "Người dùng",
          avatar: data.avatar,
        },
      }));
    });

    socket.on("user_stop_typing", (data) => {
      setTypingInfo((prev) => {
        const clone = { ...prev };
        delete clone[data.userId];
        return clone;
      });
    });

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("user_typing");
      socket.off("user_stop_typing");
      if (typingTimeout) clearTimeout(typingTimeout);
      socket.emit("leave_request", { request_id: requestId });
    };
  }, [open, requestId]);

  /**
   * Gửi tin nhắn
   */
  const handleSend = async () => {
    if (!text.trim() && !selectedFile) return;

    try {
      setSending(true);
      setSendStatus("sending");

      const formData = new FormData();
      formData.append("room_id", requestId);
      formData.append("message_id", crypto.randomUUID());

      if (text.trim()) {
        formData.append("content_text", text);
      }

      if (selectedFile) {
        formData.append("files", selectedFile);
        formData.append("content_type", "image");
      } else {
        formData.append("content_type", "text");
      }

      await messageApi.sendMessage(formData);

      setText("");
      setSelectedFile(null);
      setSendStatus("success");
    } catch (err) {
      setSendStatus("error");
    } finally {
      refInput.current?.focus();
      setSending(false);
      setTimeout(() => setSendStatus(null), 2000);
    }
  };

  /**
   * Chọn file ảnh
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Chỉ hỗ trợ file ảnh");
      return;
    }
    setSelectedFile(file);
  };

  /**
   * Typing indicator
   */
  const handleChangeText = (value) => {
    setText(value);

    if (value.trim()) {
      socket.emit("typing", { request_id: requestId });
      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit("stop_typing", { request_id: requestId });
      }, 1000);
    } else {
      socket.emit("stop_typing", { request_id: requestId });
    }
  };

  const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

  /**
   * Xác định người gửi
   */
  const getSenderInfo = (msg) => {
    if (msg.senderId === dataMessages?.customer?.id) {
      return {
        name: dataMessages.customer.name,
        avatar: dataMessages.customer.avatar,
        label: `${dataMessages.customer.name} (Khách hàng)`,
      };
    }

    if (msg.senderId === dataMessages?.technician?.id) {
      return {
        name: dataMessages.technician.name,
        avatar: dataMessages.technician.avatar,
        label: `${dataMessages.technician.name} (Thợ)`,
      };
    }

    return {
      name: "Admin",
      avatar: "/admin-avatar.png",
      label: "Admin (Quản trị viên)",
    };
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Header */}
      <DialogTitle sx={{ position: "relative", py: 1.5, px: 2 }}>
        {partner ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar src={partner.avatar || "/default-avatar.png"} sx={{ width: 40, height: 40 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {partner.name || "Người dùng"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userInfo.userId === dataMessages.customer?.id ? "Thợ sửa" : "Khách hàng"}
              </Typography>
            </Box>
          </Box>
        ) : (
          "💬 Tin nhắn yêu cầu"
        )}
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", height: 600, p: 0 }}>
        {/* List Message */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column-reverse",
            px: 1,
            py: 1,
            background: "#F0F2F5",
          }}
        >
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          )}

          {dataMessages?.message?.map((msg, index) => {
            const isMe = msg.senderId === userInfo?.userId;
            const sender = getSenderInfo(msg);
            const prevMsg = dataMessages.message[index + 1];
            const nextMsg = dataMessages.message[index - 1];
            const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId;
            const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;

            return (
              <Box
                key={msg.id}
                display="flex"
                justifyContent={isMe ? "flex-end" : "flex-start"}
                alignItems="flex-end"
                mb={0.5}
              >
                {/* Avatar chỉ hiện ở tin nhắn cuối cùng của nhóm (tail) */}
                {!isMe && isLastInGroup && (
                  <Avatar src={sender.avatar} sx={{ width: 40, height: 40, mr: 1 }} />
                )}
                {!isMe && !isLastInGroup && <Box sx={{ width: 40, mr: 1 }} />}

                <Box
                  sx={{
                    background: isMe ? MY_MESSAGE_BG : OTHER_MESSAGE_BG,
                    color: isMe ? "#fff" : "#000",
                    borderRadius: isMe
                      ? {
                          borderTopLeftRadius: 18,
                          borderTopRightRadius: isFirstInGroup ? 18 : 4,
                          borderBottomLeftRadius: 18,
                          borderBottomRightRadius: isLastInGroup ? 4 : 18,
                        }
                      : {
                          borderTopLeftRadius: isFirstInGroup ? 18 : 4,
                          borderTopRightRadius: 18,
                          borderBottomLeftRadius: isLastInGroup ? 4 : 18,
                          borderBottomRightRadius: 18,
                        },
                    px: 1.5,
                    py: 1,
                    maxWidth: "72%",
                    boxShadow: 1,
                  }}
                >
                  {/* Label chỉ hiện ở tin nhắn đầu nhóm */}
                  {!isMe && isFirstInGroup && (
                    <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
                      {sender.label}
                    </Typography>
                  )}

                  {msg.text && (
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {msg.text}
                    </Typography>
                  )}

                  {msg.type === "image" && msg.imageUrl && (
                    <Box
                      component="img"
                      src={msg.imageUrl}
                      sx={{ mt: 1, maxWidth: "100%", borderRadius: 1, cursor: "pointer" }}
                      onClick={() => window.open(msg.imageUrl, "_blank")}
                    />
                  )}

                  <Typography
                    variant="caption"
                    sx={{ display: "block", textAlign: "right", mt: 0.5, fontSize: 10, opacity: 0.7 }}
                  >
                    {msg.time}
                    {isMe && sendStatus === "success" && " ✓"}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Bottom area: Typing + Preview + Input */}
        <Box sx={{ background: "#fff", borderTop: "1px solid #eee" }}>
          {/* Typing indicator */}
          {Object.keys(typingInfo).length > 0 && (
            <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: "flex" }}>
                {Object.values(typingInfo).map((info, index) => (
                  <Avatar
                    key={index}
                    src={info.avatar || "/default-avatar.png"}
                    sx={{
                      width: 24,
                      height: 24,
                      border: "2px solid #fff",
                      ...(index > 0 && { ml: -1 }),
                    }}
                  />
                ))}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                {Object.values(typingInfo).length === 1
                  ? `${Object.values(typingInfo)[0].username} đang gõ...`
                  : "Đang gõ..."}
              </Typography>
            </Box>
          )}

          {/* Preview ảnh */}
          {selectedFile && (
            <Box sx={{ px: 2, pb: 1, position: "relative", display: "inline-block" }}>
              <img src={previewUrl} style={{ height: 100, borderRadius: 8 }} alt="preview" />
              <IconButton
                size="small"
                onClick={() => setSelectedFile(null)}
                sx={{ position: "absolute", top: -8, right: -8, bgcolor: "white" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {/* Input */}
          <Box sx={{ p: 1, display: "flex", alignItems: "flex-end", gap: 1 }}>
            <IconButton component="label">
              <AttachFileIcon />
              <input hidden type="file" accept="image/*" onChange={handleFileChange} />
            </IconButton>

            <IconButton onClick={handleEmojiClick}>
              <InsertEmoticonIcon />
            </IconButton>

            <TextField
              inputRef={refInput}
              fullWidth
              placeholder="Nhập tin nhắn..."
              value={text}
              onChange={(e) => handleChangeText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!sending) handleSend();
                }
              }}
              multiline
              maxRows={5}
              disabled={sending}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 20,
                  background: "#F0F2F5",
                },
              }}
            />

            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={sending || (!text.trim() && !selectedFile)}
            >
              {sending ? <CircularProgress size={20} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Emoji Picker */}
        <Popover
          open={emojiOpen}
          anchorEl={emojiAnchor}
          onClose={handleEmojiClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 1.5, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 0.5 }}>
            {[
              "😀","😃","😄","😁","😆","😂","🤣","😊","😇","🙂",
              "🙃","😉","😍","🥰","😘","😋","😛","😜","🤪","😎",
              "🤩","🥳","🤗","🤭","🤫","🤔","🤤","😴","🥺","😢",
              "😡","👍","👎","👌","🤌","❤️","💙","💯","🔥","✨","🎉"
            ].map((e) => (
              <Box
                key={e}
                onClick={() => handleEmojiSelect(e)}
                sx={{ fontSize: 28, cursor: "pointer", "&:hover": { transform: "scale(1.2)" } }}
              >
                {e}
              </Box>
            ))}
          </Box>
        </Popover>
      </DialogContent>
    </Dialog>
  );
}