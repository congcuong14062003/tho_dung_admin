import { useEffect } from "react";
import AppRoutes from "./routes/AppRouter";
import DefaultLayout from "./layout/DefaultLayout";
import { LoadingProvider } from "./context/LoadingContext";
import Loading from "./components/Loading/Loading";
import { ToastContainer, toast } from "react-toastify";

import { NotificationProvider } from "./context/NotificationContext";
import FCMListener from "./components/FCMListener";

function App() {
  return (
    <LoadingProvider>
      <NotificationProvider>
        <FCMListener />
        <AppRoutes defaultLayout={DefaultLayout} />
        <ToastContainer position="top-right" theme="colored" />
        <Loading />
      </NotificationProvider>
    </LoadingProvider>
  );
}

export default App;
