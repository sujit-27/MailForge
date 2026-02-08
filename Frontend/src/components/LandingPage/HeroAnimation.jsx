import { motion } from "framer-motion";
import { Mail, Zap } from "lucide-react";

export default function HeroAnimation() {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] mx-auto">
      {/* Rotating glow background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute w-56 h-56 md:w-72 md:h-72 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse-glow" />
      </motion.div>

      {/* Floating mail icon */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-mailforge rounded-3xl blur-2xl opacity-50" />
          <div className="relative bg-card/50 backdrop-blur-md border border-primary/20 rounded-3xl p-8 md:p-10 lg:p-14">
            <Mail className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 text-primary" />
            <Zap className="absolute -top-2 -right-2 md:-top-3 md:-right-3 lg:-top-4 lg:-right-4 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-pink-500" />
          </div>
        </div>
      </motion.div>

      {/* Orbiting dots */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 bg-primary rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 120}deg) translateX(150px)`,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
