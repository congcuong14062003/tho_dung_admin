import axiosClient from "./axiosClient";

const workerApi = {
  getList: (data) => axiosClient.post("/technicians/get-all-woker", data),
};

export default workerApi;
