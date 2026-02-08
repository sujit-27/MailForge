import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { logout, setCredentials } from "@/redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from "wouter/use-browser-location";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

export default function CTASection() {

  const { isAuthenticated } = useSelector((state) => state.auth);
  const {user} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", { userId: user });
    } catch (error) {
      console.error("Backend logout session invalidation failed:", error); 
    } finally { 
      localStorage.removeItem("token");  
      dispatch(logout()); 
      dispatch(clearAnalyticsLogs());
  
      navigate("/login", { replace: true });
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-black text-white font-sans select-none">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-700/10 via-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/90 to-black" />

      {/* Subtle watermark */}
      <h1 className="absolute bottom-[-10%] text-[18rem] md:text-[22rem] font-extrabold text-white/5 tracking-tight pointer-events-none ">
        MailForge
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        {/* Primary + Secondary heading */}
        <div className="mb-6">
          <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-white bg-[length:200%_100%] hover:animate-shine">
            Email. Reforged.
          </h2>
          <h3 className="text-3xl md:text-4xl font-semibold text-zinc-300">
            Built for developers. Ready for scale.
          </h3>
        </div>

        {/* Short description */}
        <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
          Send, track, and automate emails with the power and simplicity your app deserves.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {!isAuthenticated ? (
        <Button
          size="lg"
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 hover:from-purple-900 hover:to-purple-800 hover:border-purple-700 transition-all duration-300 text-lg px-8 py-6 shadow-lg shadow-purple-900/30"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      ) : (
        <div
          className="flex items-center gap-3 bg-gradient-to-r from-purple-800/80 to-zinc-900/80 border border-purple-700/50 rounded-2xl px-6 py-3 text-gray-200 cursor-pointer hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300"
          onClick={() => setOpen(!open)}
        >
          <span className="font-medium text-lg tracking-wide">
            Welcome, {"User"} 👋
          </span>
          <ArrowRight
            className={`h-5 w-5 transition-transform duration-300 ${
              open ? "rotate-90" : ""
            }`}
          />
          {open && (
            <div className="absolute top-[110%] right-0 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300">
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-200 hover:bg-purple-800/30 transition-all duration-200"
              >
                <LayoutDashboard className="h-4 w-4 text-purple-400" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-3 text-left text-gray-200 hover:bg-red-800/30 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 text-red-400" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}

          <Button
            size="lg"
            variant="outline"
            onClick={() => window.location.href = "/contact"}
            className="text-lg px-8 py-6 border-zinc-600 text-white hover:bg-zinc-900 hover:border-purple-700"
          >
            Contact Us
          </Button>
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          No credit card required • 50 emails/day free • Cancel anytime
        </p>
      </motion.div>
    </section>
  );
}
