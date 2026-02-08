import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "@/components/LandingPage/Logo";
import { SidebarIcon } from "./SidebarIcon";

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "grid" },
    { name: "Send Email", path: "/send-email", icon: "send" },
    { name: "Email Logs", path: "/email-logs", icon: "logs" },
    { name: "Templates", path: "/templates", icon: "layout" },
    { name: "Analytics", path: "/analytics", icon: "chart" },
    { name: "API Keys", path: "/api-keys", icon: "key" },
    { name: "Profile", path: "/profile", icon: "user" },
  ];

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        h-screen flex flex-col
        bg-[#050505] border-r border-white/5
        transition-all duration-300 ease-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        w-64
      `}
    >
      {/* ================= Brand ================= */}
      <div className={`pt-8 pb-6 flex cursor-pointer justify-center ${isCollapsed ? "" : "px-10"}`} onClick={() => navigate("/")} >
        {isCollapsed ? (
            <div
            className="
                w-12 h-12
                flex items-center justify-center
                rounded-xl
                bg-[#050505]
                border border-purple-500/40
                shadow-[0_0_20px_-5px_rgba(168,85,247,0.6)]
                text-purple-400
                font-extrabold
                text-lg
                select-none
            "
            >
            M
            </div>
        ) : (
            <Logo />
        )}
        </div>

      <div className="mx-5 mb-4 h-px bg-white/10" />

      {/* ================= Navigation ================= */}
      <nav className="flex-1 px-2 space-y-1.5 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `
              group relative flex items-center
              ${isCollapsed ? "justify-center" : "gap-3"}
              px-4 py-3 rounded-xl
              transition-all duration-500 overflow-hidden
              ${
                isActive
                  ? "text-white border border-purple-500/30 bg-purple-500/[0.08] shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03] border border-transparent"
              }
            `
            }
          >
            {({ isActive }) => (
              <>
                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent" />
                )}

                {/* Left neon indicator */}
                {isActive && !isCollapsed && (
                  <span className="absolute left-0 h-6 w-[2px] rounded-r-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.9)] z-20" />
                )}

                {/* Hover shine */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

                {/* Icon + Tooltip */}
                <div className="relative z-20">
                  <span
                    className={`transition-all duration-300 ${
                      isActive
                        ? "text-purple-400 scale-110 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]"
                        : "group-hover:text-purple-300"
                    }`}
                  >
                    <SidebarIcon type={item.icon} />
                  </span>

                  {/* Tooltip (collapsed only) */}
                  {isCollapsed && (
                    <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2
                      whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white
                      opacity-0 group-hover:opacity-100 transition z-50">
                      {item.name}
                    </span>
                  )}
                </div>

                {/* Text */}
                {!isCollapsed && (
                  <span
                    className={`relative z-20 text-[13px] font-medium tracking-wide transition-all duration-300 ${
                      isActive ? "translate-x-1" : "group-hover:translate-x-0.5"
                    }`}
                  >
                    {item.name}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ================= Footer + Collapse ================= */}
        <div className="relative p-4 border-t border-white/5 bg-white/[0.01]">

        {/* Collapse Button */}
        <button
            onClick={toggleCollapse}
            className="
            hidden lg:flex
            absolute -top-3 right-1/2 translate-x-1/2
            w-6 h-6 items-center justify-center
            rounded-full
            bg-[#050505]
            border border-purple-500/40
            text-purple-400 text-xs font-bold
            shadow-[0_0_12px_rgba(168,85,247,0.6)]
            hover:shadow-[0_0_18px_rgba(168,85,247,0.9)]
            hover:text-purple-300
            transition-all duration-300
            group
            "
        >
            {isCollapsed ? ">" : "<"}

            {/* Tooltip */}
            <span
            className="
                pointer-events-none
                absolute bottom-8 left-1/2 -translate-x-1/2
                whitespace-nowrap
                rounded-md bg-black px-2 py-1
                text-[10px] font-medium text-white
                opacity-0 group-hover:opacity-100
                transition
                shadow-lg
            "
            >
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
        </button>

        {/* User Info */}
        <div
            className={`flex items-center gap-3 p-2 rounded-2xl
            transition-colors hover:bg-white/[0.03] cursor-pointer
            ${isCollapsed ? "justify-center" : ""}
            `}
        >
            <div className="relative">
            <div
                className="
                    w-10 h-10
                    flex items-center justify-center
                    rounded-xl
                    bg-[#050505]
                    border border-white/15
                    text-gray-200 text-sm font-semibold
                    shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_14px_-6px_rgba(168,85,247,0.6)]
                    select-none
                "
            >
                {currentUser?.firstName?.charAt(0) || "U"}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#050505] rounded-full"></div>
            </div>

            {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-white truncate">
                {currentUser?.email || "Pro User"}
                </span>
                <span className="text-[9px] tracking-[0.15em] uppercase text-gray-500 font-bold">
                {currentUser?.plan || "Free Plan"}
                </span>
            </div>
            )}
        </div>
        </div>

    </aside>
  );
};

export default Sidebar;
