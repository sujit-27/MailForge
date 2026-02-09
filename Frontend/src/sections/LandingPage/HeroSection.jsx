import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroAnimation from '../../components/LandingPage/HeroAnimation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDispatch, useSelector } from 'react-redux';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { setCredentials } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  const [alertMinimized, setAlertMinimized] = useState(false);
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <>
      {/* ===== Sticky Demo Environment Alert ===== */}
      {!alertMinimized ? (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-16 left-0 right-0 z-[999] bg-amber-500/10 backdrop-blur-xl border-b border-amber-500/30"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-amber-300">
              ⚠️ This is a development demo environment. Services may be temporarily unavailable during off-hours to conserve cloud credits. For a live walkthrough or access request, please use the Contact page.
            </p>


            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/contact")}
                className="text-xs px-3 py-1 rounded-md bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/30 text-amber-200 transition"
              >
                Contact
              </button>

              <button
                onClick={() => setAlertMinimized(true)}
                className="text-amber-300 hover:text-white text-lg leading-none"
              >
                —
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setAlertMinimized(false)}
          className="fixed top-20 right-4 z-[999] w-12 h-12 rounded-full bg-amber-500/20 backdrop-blur-xl border border-amber-400/40 flex items-center justify-center text-amber-300 hover:bg-amber-500/30 transition"
        >
          ⚠️
        </motion.button>
      )}

      {/* ===== Original Hero Section ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Send reliable emails at scale —{' '}
                <span className="bg-gradient-mailforge bg-clip-text text-transparent">
                  instantly
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                MailForge lets you send, track, and manage transactional emails with a developer-first API.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.location.href = "/dashboard"}
                      className="
                        relative group overflow-hidden
                        flex items-center gap-3 px-8 py-4 
                        bg-zinc-900/40 backdrop-blur-xl
                        border border-purple-500/30 rounded-2xl
                        text-lg font-semibold text-white
                        transition-all duration-500
                        hover:border-purple-400 
                        hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.6)]
                        active:scale-95
                      "
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>

                      <span className="relative z-10 flex items-center gap-2">
                        Go to Dashboard
                        <div className="w-5 h-5 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1.5">
                          <div className="relative w-3 h-3 border-t-2 border-r-2 border-purple-400 rotate-45"></div>
                          <div className="absolute w-4 h-[2px] bg-purple-400 -translate-x-1"></div>
                        </div>
                      </span>

                      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shine_1s_ease-in-out] opacity-0 group-hover:opacity-100"></div>
                    </button>
                  </div>
                ) : (
                  <Button 
                    size="lg" 
                    className="bg-gradient-mailforge hover:opacity-90"
                    onClick={() => navigate("/login")}
                  >
                    Get Started
                  </Button>
                )}

                <Button 
                  size="lg" 
                  variant="ghost"
                  className="
                    relative group
                    flex items-center gap-3 px-8 py-4 h-auto
                    bg-white/5 backdrop-blur-md
                    border border-white/10 rounded-2xl
                    text-lg font-medium text-zinc-400
                    transition-all duration-500
                    hover:text-cyan-400 hover:border-cyan-500/30
                    hover:bg-cyan-500/5
                    hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.3)]
                    active:scale-95
                  "
                  onClick={() => navigate("/docs")}
                >
                  <span className="absolute left-0 top-1/4 h-1/2 w-[2px] bg-cyan-500/0 group-hover:bg-cyan-500/60 transition-all duration-500"></span>

                  <span className="relative z-10 flex items-center gap-2">
                    <div className="w-4 h-5 border-2 border-current rounded-sm relative flex flex-col gap-1 p-0.5">
                      <div className="w-full h-[1px] bg-current opacity-40"></div>
                      <div className="w-2/3 h-[1px] bg-current opacity-40"></div>
                      <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-zinc-900 border-l border-b border-current"></div>
                    </div>
                    View Docs
                  </span>

                  <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out"></div>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <HeroAnimation />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
