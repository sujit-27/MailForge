import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Changed from wouter
import { toast } from "../../hooks/use-toast";
import { useDispatch } from "react-redux";
import { getUserDetails, setCredentials } from "@/redux/slices/authSlice";
import Logo from "../LandingPage/Logo";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import api from "@/lib/axios"; // Your axios instance
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Changed from wouter
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();

  // 🔹 Handle manual login through your Gateway/Auth Service
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      console.log("Login Response:", response.data);

      // Update Redux state with the user and token
      dispatch(setCredentials({
        user: response.data.userId,
        token: response.data.accessToken
      }));

      toast({ title: "Login Successful", description: "Welcome back to MailForge!" });
      navigate("/"); // Move to home/dashboard after login
    } catch (error) {
      toast({ 
        title: "Login Failed",   
        description: error.response?.data?.message || "Invalid email or password",
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    flow: "implicit",            // or "auth-code"
    ux_mode: "redirect",         // 👈 THIS FIXES COOP
    redirect_uri: "https://mail-forge-plum.vercel.app/",
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        // 1. Get the user's profile info using the token Google just gave us
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });

        const googleUser = res.data; // contains email, given_name, family_name

        // 2. Send the data to your backend
        const backendRes = await api.post("/auth/google", {
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name
        });

        console.log("Backend Google Auth Response:", backendRes.data);

        // 3. Log them in
        dispatch(setCredentials({ 
          user: backendRes.data.userId, 
          token: backendRes.data.accessToken 
        }));

        navigate("/");
        toast({ title: "Success", description: "Logged in with Google!" });
      } catch (err) {
        toast({ title: "Error", description: "Google Sync Failed", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      
      {/* Background gradients unchanged */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

      {/* ✅ Fixed Home Button for react-router-dom */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate("/")} // Corrected navigation
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Home</span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[520px] px-6"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-white/90 flex items-center justify-center mb-6">
            <Logo size="large" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Log in to MailForge</h1>
          <p className="text-gray-400 text-base">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")} // Corrected navigation
              className="text-white hover:text-gray-300 cursor-pointer font-medium transition-colors"
            >
              Sign up
            </span>
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <Button
            type="button"
            onClick={() => loginWithGoogle()}
            className="flex-1 h-12 bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] text-white rounded-xl font-medium transition-all flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <FcGoogle className="w-5 h-5" />
                Login with Google
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span className="px-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-gray-400 text-sm font-normal mb-2 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="alan.turing@example.com"
              className="h-12 bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl transition-all"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-red-400 mt-2 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password" className="text-gray-400 text-sm font-normal">
                Password
              </Label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-white text-sm hover:text-gray-300 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="h-12 bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl pr-12 transition-all"
                {...register("password", { 
                  required: "Password is required", 
                  minLength: { value: 6, message: "Minimum 6 characters" } 
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 mt-2 text-sm">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-6 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        {/* Terms footer unchanged */}
        <p className="text-center text-gray-500 text-sm mt-8">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-gray-400 hover:text-white underline transition-colors">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="text-gray-400 hover:text-white underline transition-colors">Privacy Policy</a>.
        </p>
      </motion.div>
    </section>
  );
}
