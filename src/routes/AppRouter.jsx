import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NoLayout from "../layout/NoLayout";
import Categories from "../pages/Categories";
import Services from "../pages/Services";
import Requests from "../pages/Request";
import Technician from "../pages/Technician";
import Customer from "../pages/Customer";
import RequestDetailPage from "../pages/Request/RequestDetailPage";
import NotFound from "../pages/NotFound/NotFound";
import PendingDetail from "../pages/Technician/PendingDetail";

export default function AppRoutes({ defaultLayout: DefaultLayout }) {
  const routes = [
    {
      path: "/login",
      element: <Login />,
      layout: NoLayout,
      public: true,
    },
    { path: "/", element: <Dashboard />, protected: true },
    { path: "/categories", element: <Categories />, protected: true },
    { path: "/services", element: <Services />, protected: true },
    { path: "/technicians", element: <Technician />, protected: true },
    { path: "/technicians/requests/:id", element: <PendingDetail  />, protected: true },
    { path: "/customers", element: <Customer />, protected: true },
    { path: "/requests", element: <Requests />, protected: true },
    { path: "/requests/:id", element: <RequestDetailPage />, protected: true },

    // ⭐ 404 — không public, không protected
    {
      path: "*",
      element: <NotFound />,
      layout: NoLayout,
    },
  ];

  return (
    <Routes>
      {routes.map((route, index) => {
        const Layout = route.layout || DefaultLayout;

        let PageComponent = route.element;

        if (route.protected) {
          PageComponent = <PrivateRoute>{route.element}</PrivateRoute>;
        }

        if (route.public) {
          PageComponent = <PublicRoute>{route.element}</PublicRoute>;
        }

        // ⚠️ Nếu route BOTH không protected và không public → Đây là 404
        // → Không bọc gì thêm

        return (
          <Route
            key={index}
            path={route.path}
            element={<Layout>{PageComponent}</Layout>}
          />
        );
      })}
    </Routes>
  );
}
