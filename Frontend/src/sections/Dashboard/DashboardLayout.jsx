import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);        // mobile drawer
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse

  return (
    // Full viewport, no body scroll
    <div className="h-screen flex bg-[#060606] overflow-hidden">

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(v => !v)}
      />

      {/* Right Side */}
      <div
        className="
          flex-1 flex flex-col min-w-0
          transition-all duration-300 ease-out
        "
      >
        {/* Mobile Topbar */}
        <header className="lg:hidden h-14 flex-shrink-0 flex items-center px-4 border-b border-white/5 bg-[#050505]">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 text-white"
          >
            ☰
          </button>
          <span className="ml-3 text-sm font-semibold text-white">
            MailForge
          </span>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
