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
import routes from "../config/routes";
import ChangePassword from "../pages/ChangePass/ChangePassword";
import Notifications from "../pages/Notification";

export default function AppRoutes({ defaultLayout: DefaultLayout }) {
  const routesConfig = [
    {
      path: routes.login,
      element: <Login />,
      layout: NoLayout,
      public: true,
    },
    { path: routes.dashboard, element: <Dashboard />, protected: true },
    { path: routes.categories, element: <Categories />, protected: true },
    { path: routes.services, element: <Services />, protected: true },
    { path: routes.technicians, element: <Technician />, protected: true },
    { path: routes.changePassword, element: <ChangePassword />, protected: true },
    { path: routes.notifications, element: <Notifications />, protected: true },
    {
      path: routes.technicianRequestDetail(),
      element: <PendingDetail />,
      protected: true,
    },
    { path: routes.customers, element: <Customer />, protected: true },
    { path: routes.requests, element: <Requests />, protected: true },
    {
      path: routes.requestDetail(),
      element: <RequestDetailPage />,
      protected: true,
    },
    {
      path: routes.notFound,
      element: <NotFound />,
      layout: NoLayout,
    },
  ];

  return (
    <Routes>
      {routesConfig.map((route, index) => {
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
