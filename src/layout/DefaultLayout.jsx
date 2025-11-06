import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";

export default function DefaultLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 mt-16">{children}</main>
      </div>
    </div>
  );
}
