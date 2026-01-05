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
import ReplyIcon from "@mui/icons-material/Reply";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // Icon lỗi
import { useEffect, useRef, useState, useMemo } from "react";
import { connectSocket } from "../../utils/socket";
import messageApi from "../../service/api/messageApi";
import { useAuth } from "../../context/AuthContext";
import { generateId } from "../../utils/crypto";

const MY_MESSAGE_BG = "linear-gradient(135deg, #0084FF 0%, #006AFF 100%)";
const OTHER_MESSAGE_BG = "#FFFFFF";

export default function MessageModal({ open, onClose, requestId }) {
  const refInput = useRef(null);
  const socket = connectSocket();
  const { userInfo } = useAuth();

  const messageRefs = useRef({});
  const messageListRef = useRef(null);

  const [dataMessages, setDataMessages] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [typingInfo, setTypingInfo] = useState({});
  const [emojiAnchor, setEmojiAnchor] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [highlightMessageId, setHighlightMessageId] = useState(null);

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

  const partner = useMemo(() => {
    if (!dataMessages?.customer || !dataMessages?.technician || !userInfo)
      return null;
    const isCustomer = userInfo.userId === dataMessages.customer.id;
    return isCustomer ? dataMessages.technician : dataMessages.customer;
  }, [dataMessages, userInfo]);

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

        // Nếu là confirm từ server cho tin nhắn tạm → update và xóa status
        const index = prev.message.findIndex((m) => m.id === msg.id);
        if (index !== -1) {
          const newMessages = [...prev.message];
          newMessages[index] = {
            ...newMessages[index],
            ...msg,
            status: null, // Xóa status (đã gửi thành công)
          };
          return { ...prev, message: newMessages };
        }

        // Tin nhắn mới từ người khác
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

  const handleSend = async () => {
    if (!text.trim() && !selectedFile) return;

    const tempId = generateId("MSG_");
    const currentTime = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const previewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

    const tempReplyTo = replyTo
      ? {
          id: replyTo.id,
          type: replyTo.imageUrl ? "image" : "text",
          text: replyTo.content || "[Hình ảnh]",
        }
      : null;

    const tempMsg = {
      id: tempId,
      senderId: userInfo?.userId,
      text: text.trim() || null,
      type: selectedFile ? "image" : "text",
      imageUrl: previewUrl,
      time: currentTime,
      status: "pending", // Đang gửi
      replyTo: tempReplyTo,
    };

    // Optimistic: Thêm tin nhắn tạm ngay lập tức
    setDataMessages((prev) => ({
      ...prev,
      message: [tempMsg, ...(prev.message || [])],
    }));

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("room_id", requestId);
      formData.append("message_id", tempId);

      if (text.trim()) {
        formData.append("content_text", text);
      }

      if (selectedFile) {
        formData.append("files", selectedFile);
        formData.append("content_type", "image");
      } else {
        formData.append("content_type", "text");
      }

      if (replyTo) {
        formData.append("reply_id", replyTo.id);
      }

      await messageApi.sendMessage(formData);

      // Thành công → cập nhật status (hiển thị ✓ tạm thời)
      setDataMessages((prev) => ({
        ...prev,
        message: prev.message.map((m) =>
          m.id === tempId ? { ...m, status: "sent" } : m
        ),
      }));
    } catch (err) {
      // Lỗi → đánh dấu error
      setDataMessages((prev) => ({
        ...prev,
        message: prev.message.map((m) =>
          m.id === tempId ? { ...m, status: "error" } : m
        ),
      }));
    } finally {
      setText("");
      setSelectedFile(null);
      setReplyTo(null);
      setSending(false);
      refInput.current?.focus();
      scrollToBottom();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Chỉ hỗ trợ file ảnh");
      return;
    }
    setSelectedFile(file);
  };

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

  const scrollToMessage = (messageId) => {
    const el = messageRefs.current[messageId];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setHighlightMessageId(messageId);
    setTimeout(() => {
      setHighlightMessageId(null);
    }, 2000);
  };

  const scrollToBottom = () => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ position: "relative", py: 1.5, px: 2 }}>
        {partner ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              src={partner.avatar || "/default-avatar.png"}
              sx={{ width: 40, height: 40 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {partner.name || "Người dùng"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {userInfo.userId === dataMessages.customer?.id
                  ? "Thợ sửa"
                  : "Khách hàng"}
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

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", height: 600, p: 0 }}
      >
        <Box
          ref={messageListRef}
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
            const isFirstInGroup =
              !prevMsg || prevMsg.senderId !== msg.senderId;
            const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
            const isHovered = hoveredMessageId === msg.id;

            return (
              <Box
                key={msg.id}
                ref={(el) => {
                  if (el) messageRefs.current[msg.id] = el;
                }}
                sx={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  mb: 0.5,
                }}
              >
                {!isMe && isLastInGroup && (
                  <Avatar
                    src={sender.avatar}
                    sx={{ width: 40, height: 40, mr: 1 }}
                  />
                )}
                {!isMe && !isLastInGroup && <Box sx={{ width: 40, mr: 1 }} />}

                <Box
                  sx={{
                    position: "relative",
                    pl: isMe ? 6 : 0,
                    pr: !isMe ? 6 : 0,
                    maxWidth: "72%",
                  }}
                  onMouseEnter={() => setHoveredMessageId(msg.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setReplyTo({
                        id: msg.id,
                        content:
                          msg.text ||
                          (msg.type === "image" ? "[Hình ảnh]" : ""),
                        imageUrl: msg.type === "image" ? msg.imageUrl : null,
                        senderName: sender.name,
                      });
                      refInput.current?.focus();
                    }}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                      left: isMe ? 1 : "auto",
                      right: !isMe ? 1 : "auto",
                      bgcolor: "background.paper",
                      boxShadow: 3,
                      opacity: isHovered ? 1 : 0,
                      pointerEvents: isHovered ? "auto" : "none",
                      transition: "opacity 0.3s ease",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ReplyIcon fontSize="small" />
                  </IconButton>

                  <Box
                    sx={{
                      background:
                        highlightMessageId === msg.id
                          ? "#FFF3CD"
                          : isMe
                          ? MY_MESSAGE_BG
                          : OTHER_MESSAGE_BG,
                      color:
                        highlightMessageId === msg.id
                          ? "#000"
                          : isMe
                          ? "#fff"
                          : "#000",
                      transition: "background-color 0.3s ease",
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
                      boxShadow:
                        highlightMessageId === msg.id ? "0 0 0 2px #ffec99" : 1,
                    }}
                  >
                    {!isMe && isFirstInGroup && (
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
                      >
                        {sender.label}
                      </Typography>
                    )}

                    {msg.replyTo && (
                      <Box
                        onClick={() => scrollToMessage(msg.replyTo.id)}
                        sx={{
                          mb: 0.5,
                          p: 1,
                          borderLeft: "3px solid #0084ff",
                          background: isMe
                            ? "rgba(255,255,255,0.15)"
                            : "#f0f2f5",
                          borderRadius: 1,
                          maxWidth: "100%",
                          cursor: "pointer",
                        }}
                      >
                        {msg.replyTo.type === "text" && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: 12,
                              opacity: 0.85,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {msg.replyTo.text}
                          </Typography>
                        )}

                        {msg.replyTo.type === "image" && (
                          <Typography
                            variant="body2"
                            sx={{ fontSize: 12, opacity: 0.7 }}
                          >
                            [Hình ảnh]
                          </Typography>
                        )}
                      </Box>
                    )}

                    {msg.text && (
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {msg.text}
                      </Typography>
                    )}

                    {msg.type === "image" && msg.imageUrl && (
                      <Box
                        component="img"
                        src={msg.imageUrl}
                        sx={{
                          mt: 1,
                          maxWidth: "100%",
                          borderRadius: 1,
                          cursor: "pointer",
                          backgroundColor: "#fff",
                        }}
                        onClick={() => window.open(msg.imageUrl, "_blank")}
                      />
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      {/* Đang gửi */}
                      {msg.status === "pending" && (
                        <>
                          <CircularProgress size={12} color="inherit" />
                          <Typography
                            variant="caption"
                            sx={{ fontSize: 10, opacity: 0.7 }}
                          >
                            Đang gửi...
                          </Typography>
                        </>
                      )}

                      {/* Gửi lỗi */}
                      {msg.status === "error" && (
                        <>
                          <ErrorOutlineIcon
                            sx={{ fontSize: 16, color: "#f44336" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontSize: 10, color: "#f44336" }}
                          >
                            Gửi lỗi
                          </Typography>
                        </>
                      )}

                      {/* Bình thường hoặc đã gửi thành công tạm thời */}
                      {msg.status !== "pending" && msg.status !== "error" && (
                        <>
                          <Typography
                            variant="caption"
                            sx={{ fontSize: 10, opacity: 0.7 }}
                          >
                            {msg.time}
                          </Typography>
                          {msg.status === "sent" && (
                            <Typography variant="caption" sx={{ fontSize: 12 }}>
                              ✓
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ background: "#fff", borderTop: "1px solid #eee" }}>
          {Object.keys(typingInfo).length > 0 && (
            <Box
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
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
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                {Object.values(typingInfo).length === 1
                  ? `${Object.values(typingInfo)[0].username} đang gõ...`
                  : "Đang gõ..."}
              </Typography>
            </Box>
          )}

          {selectedFile && (
            <Box
              sx={{
                px: 2,
                pb: 1,
                position: "relative",
                display: "inline-block",
              }}
            >
              <img
                src={URL.createObjectURL(selectedFile)}
                style={{ height: 100, borderRadius: 8 }}
                alt="preview"
              />
              <IconButton
                size="small"
                onClick={() => setSelectedFile(null)}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  bgcolor: "white",
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          {replyTo && (
            <Box sx={{ px: 2, py: 1, position: "relative" }}>
              <Box
                sx={{
                  background: "#f0f2f5",
                  borderRadius: 2,
                  p: 1.5,
                  pl: 2,
                  borderLeft: "4px solid #0084ff",
                  maxWidth: "80%",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: "#0084ff" }}
                >
                  Trả lời {replyTo.senderName}
                </Typography>
                {replyTo.content && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {replyTo.content}
                  </Typography>
                )}
                {replyTo.imageUrl && (
                  <Box
                    component="img"
                    src={replyTo.imageUrl}
                    sx={{ mt: 1, maxHeight: 100, borderRadius: 1 }}
                  />
                )}
              </Box>
              <IconButton
                size="small"
                onClick={() => setReplyTo(null)}
                sx={{ position: "absolute", top: 8, right: 24 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}

          <Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton component="label">
              <AttachFileIcon />
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
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
              disabled={false}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 20,
                  background: "#F0F2F5",
                  padding: "10px 12px", // 🔥 giảm chiều cao
                },
                "& textarea": {
                  lineHeight: "1.4",
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

        <Popover
          open={emojiOpen}
          anchorEl={emojiAnchor}
          onClose={handleEmojiClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box
            sx={{
              p: 1.5,
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: 0.5,
            }}
          >
            {[
              "😀",
              "😃",
              "😄",
              "😁",
              "😆",
              "😂",
              "🤣",
              "😊",
              "😇",
              "🙂",
              "🙃",
              "😉",
              "😍",
              "🥰",
              "😘",
              "😋",
              "😛",
              "😜",
              "🤪",
              "😎",
              "🤩",
              "🥳",
              "🤗",
              "🤭",
              "🤫",
              "🤔",
              "🤤",
              "😴",
              "🥺",
              "😢",
              "😡",
              "👍",
              "👎",
              "👌",
              "🤌",
              "❤️",
              "💙",
              "💯",
              "🔥",
              "✨",
              "🎉",
            ].map((e) => (
              <Box
                key={e}
                onClick={() => handleEmojiSelect(e)}
                sx={{
                  fontSize: 28,
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.2)" },
                }}
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
