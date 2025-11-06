import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NoLayout from "../layout/NoLayout"; // Layout trống cho các trang như login

export default function AppRoutes({ defaultLayout: DefaultLayout }) {
  const routes = [
    {
      path: "/login",
      element: <Login />,
      layout: NoLayout, // layout riêng, không có sidebar + header
    },
    {
      path: "/",
      element: <Dashboard />,
      // không khai báo layout → sẽ dùng layout mặc định
    },
  ];

  return (
    <Routes>
      {routes.map((route, index) => {
        const Layout = route.layout || DefaultLayout;
        return (
          <Route
            key={index}
            path={route.path}
            element={<Layout>{route.element}</Layout>}
          />
        );
      })}
    </Routes>
  );
}
