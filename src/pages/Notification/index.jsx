import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import notificationApi from "../../service/api/notificationApi";
import { useLoading } from "../../context/LoadingContext";
import { useNotification } from "../../context/NotificationContext";
import images from "../../assets/images/Image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  TextField,
} from "@mui/material";

import PaginationContainer from "../../components/PaginationContainer";
import { debounce } from "../../utils/functions";
import { getNotificationIcon } from "../../components/notificationIcon";

function Notifications() {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { markAsRead } = useNotification();

  const [notifications, setNotifications] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);

  const [request, setRequest] = useState({
    page: 1,
    size: 10,
    keySearch: "",
  });

  const [searchInput, setSearchInput] = useState("");

  /** ===================== FETCH ===================== */
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationApi.getListPaginated(request);
      if (res.status && res?.data?.data) {
        setNotifications(
          res.data.data.map((n) => ({
            ...n,
            is_read: Boolean(n.is_read),
          }))
        );
        setTotalRecord(res?.data?.paging?.total || 0);
      }
    } catch (err) {
      console.error("Lỗi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ===================== SEARCH ===================== */
  const handleOnChangeSearch = useCallback(
    debounce((value) => {
      setRequest((prev) => ({
        ...prev,
        keySearch: value,
        page: 1,
      }));
    }, 400),
    []
  );

  /** ===================== ACTIONS ===================== */
  const handleRefresh = () => {
    setSearchInput("");
    setRequest({
      page: 1,
      size: 10,
      keySearch: "",
    });
  };

  const handleClickNotification = async (item) => {
    try {
      if (!item.is_read) {
        await markAsRead(item.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
        );
      }

      console.log("item: ", item);

      if (item?.data?.url) {
        navigate(item?.data?.url);
      }
    } catch (err) {
      console.error("Handle notification click error:", err);
    }
  };

  /** ===================== EFFECT ===================== */
  useEffect(() => {
    fetchNotifications();
  }, [request]);

  /** ===================== RENDER ===================== */
  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Danh sách thông báo</h2>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mb-4">
        <TextField
          label="Tìm kiếm theo tiêu đề hoặc nội dung..."
          size="small"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            handleOnChangeSearch(e.target.value);
          }}
          sx={{ width: 400 }}
        />

        <Button variant="contained" color="primary" onClick={handleRefresh}>
          Làm mới
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead sx={{ bgcolor: "#8ed1fc" }}>
            <TableRow>
              <TableCell width={60} align="center">
                Loại
              </TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="center">Thời gian</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => handleClickNotification(item)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: item.is_read ? "#fff" : "#eef6ff",
                  }}
                >
                  <TableCell align="center">
                    {getNotificationIcon(item.type)}
                  </TableCell>

                  <TableCell sx={{ fontWeight: item.is_read ? 400 : 600 }}>
                    {item.title}
                  </TableCell>

                  <TableCell>{item.body}</TableCell>

                  <TableCell align="center">
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        fontWeight: 600,
                        color: item.is_read ? "#555" : "#0d6efd",
                        background: item.is_read ? "#eee" : "#dbeafe",
                      }}
                    >
                      {item.is_read ? "Đã đọc" : "Chưa đọc"}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    {new Date(item.created_at).toLocaleString("vi-VN")}
                  </TableCell>

                  <TableCell align="center">
                    {!item.is_read && (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          handleClickNotification(item);
                        }}
                      >
                        Xem
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={100}>
                  <div className="py-6 flex flex-col items-center justify-center">
                    <img src={images.emptyBox} width={120} />
                    <p className="text-gray-600 mt-2">Không có thông báo</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <PaginationContainer
        display={notifications.length > 0}
        totalRecord={totalRecord}
        setDataFilter={setRequest}
        dataFilter={request}
      />
    </div>
  );
}

export default Notifications;
