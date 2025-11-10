import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NoLayout from "../layout/NoLayout"; // Layout trống cho các trang như login
import Categories from "../pages/Categories";
import Services from "../pages/Services";
import Requests from "../pages/Request";

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
    {
      path: "/categories",
      element: <Categories />,
      // không khai báo layout → sẽ dùng layout mặc định
    },
    {
      path: "/services",
      element: <Services />,
      // không khai báo layout → sẽ dùng layout mặc định
    },
    {
      path: "/requests",
      element: <Requests />,
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
