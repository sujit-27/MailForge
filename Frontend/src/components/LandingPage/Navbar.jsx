import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Use react-router-dom
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Cpu,
  HelpCircle,
  Contact,
  Menu,
  X,
  Key,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../LandingPage/ThemeToggle";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice"; // Use your slice action
import api from "@/lib/axios";
import { useForgeChat } from "@/context/ForgeChatContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // ✅ Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openChat } = useForgeChat();

  const handleLogout = async () => {
    await api.post("/auth/logout", {userId: user});
    // ✅ Clear Redux + localStorage via your logoutUser action
    dispatch(logout());
    navigate("/login");
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const dropVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none bg-black/30 backdrop-blur-xl" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Logo size="small" />

              <div className="hidden md:flex items-center ml-16 gap-8">
                {/* Company Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("company")}
                    className="flex items-center gap-1 text-sm font-medium text-gray-200 hover:text-white transition-colors group"
                  >
                    Company <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === "company" && (
                      <motion.div
                        variants={dropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.18 }}
                        className="absolute top-9 left-0 mt-2 w-52 rounded-xl border border-white/8 bg-white/6 backdrop-blur-3xl shadow-[0_8px_30px_rgba(2,6,23,0.6)] p-3"
                      >
                        <Link to="/about" className="block text-gray-100 hover:text-white px-3 py-2 rounded-md hover:bg-gradient-to-r from-purple-600/20 to-pink-500/10 transition">About</Link>
                        <Link to="/blog" className="block text-gray-100 hover:text-white px-3 py-2 rounded-md hover:bg-gradient-to-r from-purple-600/20 to-pink-500/10 transition">Blog</Link>
                        <Link to="/humans" className="block text-gray-100 hover:text-white px-3 py-2 rounded-md hover:bg-gradient-to-r from-purple-600/20 to-pink-500/10 transition">Humans</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Solutions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("solutions")}
                    className="flex items-center gap-1 text-sm font-medium text-gray-200 hover:text-white transition-colors group"
                  >
                    Solutions <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === "solutions" && (
                      <motion.div
                        variants={dropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.18 }}
                        className="absolute top-9 left-0 mt-2 w-[520px] rounded-2xl border border-white/8 bg-white/5 backdrop-blur-3xl shadow-[0_12px_50px_rgba(2,6,23,0.6)] p-5 grid grid-cols-2 gap-6"
                      >
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                            Skill Level
                          </h4>
                          {["Beginner", "Intermediate", "Advanced"].map((s) => (
                            <Link
                              key={s}
                              to={`#`}
                              className="block px-3 py-2 rounded-md text-white hover:text-gray-200 hover:bg-white/6 transition"
                            >
                              <div className="text-sm font-medium">{s}</div>
                              <div className="text-xs text-gray-400">Short descriptor about {s.toLowerCase()}</div>
                            </Link>
                          ))}
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                            Who it’s for
                          </h4>
                          {[
                            { label: "Developers", href: "#" },
                            { label: "Startups", href: "#" },
                            { label: "Enterprises", href: "#" },
                          ].map((t) => (
                            <Link
                              key={t.label}
                              to={t.href}
                              className="block px-3 py-2 rounded-md text-white hover:text-gray-200 hover:bg-white/6 transition"
                            >
                              <div className="text-sm font-medium">{t.label}</div>
                              <div className="text-xs text-gray-400">Why {t.label.toLowerCase()} choose MailForge</div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <Link to="/pricing" className="relative text-sm items-center font-medium text-gray-200 hover:text-white transition-colors group px-3 py-2 flex">
                    Pricing
                    <span className="block h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" />
                  </Link>
                </div>

                {/* Help Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown("help")}
                    className="flex items-center gap-1 text-sm font-medium text-gray-200 hover:text-white transition-colors group"
                  >
                    Help <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === "help" && (
                      <motion.div
                        variants={dropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.18 }}
                        className="absolute top-9 left-0 mt-2 w-64 rounded-2xl border border-white/8 bg-white/5 backdrop-blur-3xl shadow-[0_12px_40px_rgba(2,6,23,0.55)] p-4 space-y-2"
                      >
                        {/* ✅ Fixed Contact Button */}
                        <Link
                          to="/contact"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-100 hover:text-white hover:bg-gradient-to-r from-purple-600/20 to-pink-500/10 transition"
                        >
                          <Contact className="w-4 h-4 text-gray-200" /> Contact
                        </Link>
                        <Link
                          to="/support"
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-100 hover:text-white hover:bg-gradient-to-r from-purple-600/20 to-pink-500/10 transition"
                        >
                          <HelpCircle className="w-4 h-4 text-gray-200" /> Support
                        </Link>
                        <div
                          role="button"
                          onClick={() => {
                            // custom AI action or route
                            setActiveDropdown(null);
                            window.location.href = "/ask-forge";
                          }}
                          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-100 hover:text-white hover:bg-gradient-to-r from-purple-600/20 to-pink-500/10 transition cursor-pointer"
                        >
                          <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
                          <div>
                            <button onClick={openChat} className="text-sm font-medium">Ask Forge AI</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />

              {/* ✅ Conditional Rendering based on Redux isAuthenticated */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                 <Link
                    to="/dashboard"
                    className="
                      flex-1 px-6 py-2.5 text-gray-100 font-semibold text-center
                      bg-zinc-900/50 backdrop-blur-md 
                      border border-white/10 rounded-xl
                      relative overflow-hidden
                      transition-all duration-500 group
                      hover:border-purple-500/50 
                      hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]
                      active:scale-95
                    "
                  >
                    {/* The Glow Effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    
                    {/* The Inner Text Wrapper to keep it above the glow */}
                    <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide uppercase text-sm">
                      Dashboard
                      <LayoutDashboard className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </span>

                    {/* Animated Border Beam (Alternative to Pulse) */}
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent group-hover:w-full transition-all duration-700"></span>
                  </Link>

                  <div className="relative group">
                    <button
                      onClick={handleLogout}
                      className="
                        relative p-3 rounded-xl border border-white/10 
                        bg-zinc-900/50 backdrop-blur-md
                        text-red-400/80 transition-all duration-500
                        hover:text-red-400 hover:border-red-500/40 
                        hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.4)]
                        active:scale-90 group
                      "
                    >
                      {/* Inner Glow Effect */}
                      <span className="absolute inset-0 rounded-xl bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>

                      {/* Pure CSS Logout/Power Icon */}
                      <div className="relative z-10 w-4 h-4 flex items-center justify-center">
                        {/* The "U" shape */}
                        <div className="absolute inset-0 border-2 border-current border-t-transparent rounded-full"></div>
                        {/* The vertical power line */}
                        <div className="absolute top-0 w-0.5 h-2 bg-current rounded-full -translate-y-1"></div>
                      </div>
                    </button>

                    {/* Tooltip */}
                    <span className="
                      absolute -bottom-10 left-1/2 -translate-x-1/2 
                      text-[10px] uppercase tracking-widest font-bold
                      bg-zinc-900/90 border border-red-500/20 text-red-400 
                      px-3 py-1 rounded-lg opacity-0 
                      group-hover:opacity-100 group-hover:-bottom-12
                      transition-all duration-300 pointer-events-none
                      backdrop-blur-xl shadow-xl
                    ">
                      Terminal_Exit
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="border-white/20 text-gray-200 hover:border-white/40 hover:text-white transition-all"
                    onClick={() => navigate("/login")} 
                  >
                    Log In
                  </Button>

                  <Button
                    className="bg-purple-400/20 backdrop-blur-md border border-purple-300/30 text-white font-semibold shadow-lg hover:bg-purple-600/30 hover:border-purple-300/50 transition-all duration-300 ease-in-out"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                className="text-gray-200 hover:text-white"
                onClick={() => setMobileMenuOpen((s) => !s)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pb-4 space-y-2 border-t border-white/8">
              {/* ... mobile links ... */}
              <div className="flex items-center gap-2 pt-3">
                <ThemeToggle />
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="flex-1 px-5 py-2 text-white font-semibold text-center bg-white/10 backdrop-blur-lg border border-white/20 transition-all"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Button onClick={() => navigate("/login")} variant="outline" className="flex-1 border-white/20 text-gray-200">
                      Login
                    </Button>
                    <Button onClick={() => navigate("/signup")} className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}