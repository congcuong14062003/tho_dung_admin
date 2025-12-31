import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { requestForToken, onMessageListener } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";

function FCMListener() {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const { markAsRead } = useNotification();

  useEffect(() => {
    requestForToken().then((token) => {
      if (token) localStorage.setItem("fcm_token", token);
    });

    onMessageListener().then((payload) => {
      console.log("payload: ", payload);
      if (payload?.data?.sender_id === userInfo?.userId) {
        return;
      } else {
        toast.info(
          <div
            onClick={async () => {
              const notificationId = payload?.data?.notification_id;
              const url = payload?.data?.url;

              if (notificationId) {
                await markAsRead(Number(notificationId));
              }

              if (url) navigate(url);
            }}
            style={{ cursor: "pointer" }}
          >
            <strong>{payload.notification.title}</strong>
            <div>{payload.notification.body}</div>
          </div>,
          {
            autoClose: 8000, // 10 giây cho FCM
            closeOnClick: true,
            pauseOnHover: true,
          }
        );
      }
    });
  }, [userInfo]);

  return null;
}

export default FCMListener;
