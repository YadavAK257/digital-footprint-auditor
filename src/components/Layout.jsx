import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fbff_0%,_#eef5ff_32%,_#f8fafc_100%)] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 bg-slate-50/80">
          <Navbar />

          <main className="min-h-[calc(100vh-80px)] bg-[linear-gradient(180deg,_rgba(248,250,252,0.85),_rgba(226,232,240,0.55))] p-2 sm:p-3">
            <div className="h-full rounded-[26px] border border-slate-200/80 bg-white/55 shadow-[0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur-sm">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;