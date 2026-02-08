import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Terminal, ChevronRight } from "lucide-react";

const PaymentStatusModal = ({ status, onClose, planName }) => {
  if (!status || status === "idle") return null;

  const config = {
    processing: {
      icon: <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />,
      title: "Verifying Transmission",
      desc: "Synchronizing with Razorpay edge nodes...",
      color: "border-purple-500/50",
    },
    succeeded: {
      icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
      title: "Deployment Successful",
      desc: `Tier [${planName}] has been provisioned to your cluster.`,
      color: "border-emerald-500/50",
      action: "Go to Dashboard"
    },
    failed: {
      icon: <XCircle className="w-12 h-12 text-red-500" />,
      title: "Handshake Failed",
      desc: "The payment verification timed out or was rejected.",
      color: "border-red-500/50",
      action: "Try Again"
    }
  };

  const current = config[status];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-md bg-[#0a0a0a] border ${current.color} p-8 rounded-3xl shadow-2xl overflow-hidden`}
        >
          {/* Background scanline effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.03)_50%,transparent_100%)] bg-[length:100%_4px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="p-4 bg-white/5 rounded-full">
              {current.icon}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                {current.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide leading-relaxed">
                {current.desc}
              </p>
            </div>

            {status !== "processing" && (
              <button 
                onClick={onClose}
                className="group flex items-center gap-2 px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all"
              >
                {current.action}
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <div className="flex items-center gap-2 pt-4 opacity-30">
              <Terminal size={12} />
              <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Forge.OS // Auth_Protocol_v2</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentStatusModal;