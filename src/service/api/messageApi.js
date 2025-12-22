import axiosClient from "./axiosClient";

const messageApi = {
  getMessages(data) {
    return axiosClient.post("/messages/get-message-by-request", data);
  },
  sendMessage(data) {
    return axiosClient.post("/messages/send-message", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default messageApi;
