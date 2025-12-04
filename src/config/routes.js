const routes = {
  login: "/login",

  // Dashboard
  dashboard: "/",

  // Categories
  categories: "/categories",

  // Services
  services: "/services",

  // Technician
  technicians: "/technicians",
  technicianRequestDetail: (id = ":id") => `/technicians/requests/${id}`,

  // Customers
  customers: "/customers",

  // Requests
  requests: "/requests",
  requestDetail: (id = ":id") => `/requests/${id}`,

  // 404
  notFound: "*",
};

export default routes;
