import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import Logo from "../LandingPage/Logo";
import { toast } from "../../hooks/use-toast";
import { useLocation } from "wouter";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const [, setLocation] = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm(); 
   
  const onSubmit = async (data) => {
    try {
      console.log("📩 Message sent:", data);
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      reset();
    } catch (err) {
      toast({ title: "Failed to send message", description: "Please try again later.", variant: "destructive" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Animated Waves (exactly as your previous section) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
      >
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
          fill="none"
          stroke="url(#grad1)"
          strokeWidth="2"
          d="M0,300 C300,200 600,400 900,300 C1200,200 1440,400 1440,300 L1440,600 L0,600 Z"
        />
        <defs>
          <linearGradient id="grad1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)] blur-3xl" />

      {/* Back to Home button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Home</span>
      </motion.button>

      {/* Main split layout */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16 md:gap-32 px-6 py-16">
        
        {/* Left: Contact Form */}
        <div className="flex-1 min-w-[320px] max-w-lg">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-12 leading-none tracking-tight">
            Get in touch
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-lg font-medium text-white mb-2 block">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full h-11 px-4 bg-[#18181b] border border-[#232328] text-white placeholder-gray-500 rounded-xl transition-all"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="message" className="text-lg font-medium text-white mb-2 block">
                How can we help?
              </Label>
              <Textarea
                id="message"
                rows={5}
                placeholder="I'd like to know how MailForge can help me with..."
                className="w-full px-4 py-3 bg-[#18181b] border border-[#232328] text-white placeholder-gray-500 rounded-xl transition-all"
                {...register("message", { required: "Message is required" })}
              />
              {errors.message && <p className="text-red-400 text-sm mt-2">{errors.message.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-32 h-11 mt-4 bg-[#18181b] hover:bg-[#232328] text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>
          </form>
        </div>
        
        {/* Right: Contact Details List */}
        <div className="flex flex-col gap-10 min-w-[260px] mt-20">
          <div className="flex gap-10 mb-2">
            <a href="https://www.linkedin.com/in/sujit-kumar-shaw/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-6 h-6 text-gray-200 hover:text-blue-400 transition-colors" />
            </a>
            <a href="https://github.com/sujit-27" target="_blank" rel="noopener noreferrer">
              <FaGithub className="w-6 h-6 text-gray-200 hover:text-white transition-colors" />
            </a>
            <a href="https://instagram.com/sujit.815" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="w-6 h-6 text-gray-200 hover:text-pink-500 transition-colors" />
            </a>
          </div>
          <div>
            <p className="text-base font-medium text-gray-300 mb-1">Get help</p>
            <a href="mailto:testingbugs8080@gmail.com" className="text-lg text-white font-mono hover:underline">
              testingbugs8080@gmail.com
            </a>
          </div>
          <div>
            <p className="text-base font-medium text-gray-300 mb-1">Report security concerns</p>
            <a href="mailto:debugger5173@gmail.com" className="text-lg text-white font-mono hover:underline">
              debugger5173@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
