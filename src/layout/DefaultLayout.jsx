import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";

export default function DefaultLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar cố định */}
      <div className="fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>

      {/* Phần còn lại dịch sang phải */}
      <div className="flex flex-col flex-1 ml-64">
        <Header />

        {/* Nội dung scroll */}
        <main className="flex-1 overflow-y-auto p-6 mt-16">{children}</main>
      </div>
    </div>
  );
}
