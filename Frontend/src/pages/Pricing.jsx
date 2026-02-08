import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  Terminal, ChevronRight, Loader2, CheckCircle2, XCircle 
} from "lucide-react";

// Import your slice actions
import { 
  createPaymentOrder, 
  verifyPaymentSignature, 
  resetPayment 
} from "../redux/slices/paymentSlice";

const Pricing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("");

  // Get state from your Redux store
  const { loading, status, error } = useSelector((state) => state.payment);
  const { user, currentUser } = useSelector((state) => state.auth); 
  const steps = [
    {
      title: "Standard",
      feature: "Lightweight Transmission",
      detail: "Optimized for development environments and low-velocity data streams.",
      specs: ["50 Daily Transmissions", "3 Cluster Nodes", "TLS 1.3 Encryption"],
      price: { monthly: 0, yearly: 0 }
    },
    {
      title: "Professional",
      feature: "High-Throughput Relay",
      detail: "Industrial-grade bandwidth for production platforms requiring 99.9% uptime.",
      specs: ["5k Daily Transmissions", "15 Cluster Nodes", "Dedicated Relay IP"],
      price: { monthly: 499, yearly: 399 }
    },
    {
      title: "Enterprise",
      feature: "Elastic Infrastructure",
      detail: "Custom handshake protocols and unlimited horizontal scaling for global ops.",
      specs: ["Unlimited Throughput", "Infinite Nodes", "L7 Load Balancing"],
      price: { monthly: 999, yearly: 899 }
    }
  ];

  const handleInitialize = async (tier) => {
    // 1. Check if the Razorpay script is actually on the window object
    if (!window.Razorpay) {
      alert("Razorpay SDK is still loading. Please wait a second and try again.");
      return;
    }

    const plan = steps.find(s => s.title === tier);
    const amount = billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
    setSelectedPlan(tier);

    if (amount === 0) {
      navigate("/dashboard");
      return;
    }
    
    const orderAction = await dispatch(createPaymentOrder({
      userId: user ,
      planType: tier.toUpperCase(), 
      amount: amount, 
    }));

    if (createPaymentOrder.fulfilled.match(orderAction)) {
      const orderData = orderAction.payload;
      console.log("Order Data Received:", orderData);

      const options = {
        // Use your Public Key ID here
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "MailForge",
        description: `Provisioning ${tier} Tier`,
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          const verifyData = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            planType: tier.toUpperCase()
          };
          console.log("Payment successful, dispatching verification:", verifyData);
          dispatch(verifyPaymentSignature({ userId: user, paymentData: verifyData }));
        },
        prefill: {
          email: currentUser?.email,
          name: currentUser?.name
        },
        theme: { color: "#9333ea" },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.open();
      
      // Failure listener if the modal crashes
      rzp.on('payment.failed', function (response){
          console.error("Payment failed reason:", response.error.description);
      });
    } else {
      console.log(createPaymentOrder.status)
    }
  };

  const handleModalClose = () => {
    if (status === "succeeded") navigate("/dashboard");
    dispatch(resetPayment());
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b_0%,transparent_50%)] pointer-events-none opacity-50" />

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-[100] w-full bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-8 py-4 max-w-[1600px] mx-auto">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
            <div className="p-2 bg-white/5 rounded border border-white/10 group-hover:border-purple-500/50 transition-all">
              <Terminal size={18} className="text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-white">MailForge.OS</span>
          </button>
          <button onClick={() => navigate("/dashboard")} className="px-5 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all">
            Dashboard
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-20 space-y-24">
        {/* HEADER */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full border border-white/5 bg-white/5">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">System Status: Ready</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase leading-none">
            Infrastructure<br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Control.</span>
          </h1>
          
          <div className="flex items-center justify-center pt-8">
            <div className="bg-white/5 border border-white/10 p-1 rounded-full flex items-center">
              <button onClick={() => setBillingCycle("monthly")} className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === "monthly" ? 'bg-white text-black' : 'text-slate-500'}`}> Monthly </button>
              <button onClick={() => setBillingCycle("yearly")} className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === "yearly" ? 'bg-white text-black' : 'text-slate-500'}`}> Yearly </button>
            </div>
          </div>
        </div>

        {/* CAPABILITY MATRIX */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Technical Capability Matrix</h2>
            </div>
            <div className="flex gap-4">
               {steps.map((_, i) => (
                 <button key={i} onClick={() => setActiveStep(i)} className={`h-1 transition-all duration-500 ${activeStep === i ? 'w-16 bg-purple-500' : 'w-8 bg-white/10'}`} />
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div key={i} animate={{ opacity: activeStep === i ? 1 : 0.3, scale: activeStep === i ? 1 : 0.95 }} className="space-y-6 cursor-pointer" onClick={() => setActiveStep(i)}>
                <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.3em]">0{i+1} — {step.title}</span>
                <h3 className="text-xl font-bold text-white uppercase">{step.feature}</h3>
                <p className="text-sm text-slate-400 uppercase tracking-tight leading-relaxed">{step.detail}</p>
                <ul className="space-y-2">
                  {step.specs.map((s, j) => (
                    <li key={j} className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <ChevronRight size={12} className="text-purple-500" /> {s}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PRICING CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <CompactPriceCard 
              key={i}
              title={step.title}
              price={billingCycle === "monthly" ? step.price.monthly : step.price.yearly}
              highlight={step.title === "Professional"}
              active={activeStep === i}
              loading={loading && selectedPlan === step.title}
              onDeploy={() => handleInitialize(step.title)}
            />
          ))}
        </div>
      </div>

      {/* STATUS MODAL */}
      <StatusModal 
        status={loading ? "processing" : status} 
        error={error} 
        onClose={handleModalClose} 
        planName={selectedPlan}
      />
    </div>
  );
};

/* ATOMIC COMPONENTS */

const CompactPriceCard = ({ title, price, highlight, active, onDeploy, loading }) => (
  <div className={`p-8 border transition-all duration-500 ${highlight ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/5 bg-white/[0.02]'} ${active ? 'ring-1 ring-white/20' : 'opacity-80'}`}>
    <div className="flex justify-between items-start mb-12">
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white">{title}</h3>
      {highlight && <span className="text-[8px] font-black bg-purple-500 text-white px-2 py-1 uppercase">Recommended</span>}
    </div>
    <div className="mb-12">
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black text-white tracking-tighter">₹{price}</span>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">/ month</span>
      </div>
    </div>
    <button 
      disabled={loading}
      onClick={onDeploy}
      className={`w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex justify-center items-center gap-2 ${highlight ? 'bg-purple-600 text-white hover:bg-purple-400' : 'bg-white text-black hover:bg-slate-300'} disabled:opacity-50`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : "Initialize Node"}
    </button>
  </div>
);

const StatusModal = ({ status, onClose, planName, error }) => {
  if (status === "idle" || !status) return null;

  const content = {
    processing: { icon: <Loader2 className="text-purple-500 animate-spin" />, title: "Verifying Sync", color: "border-purple-500/50" },
    succeeded: { icon: <CheckCircle2 className="text-emerald-500" />, title: "Deployment Active", color: "border-emerald-500/50" },
    failed: { icon: <XCircle className="text-red-500" />, title: "Handshake Failed", color: "border-red-500/50" }
  }[status];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`bg-[#0a0a0a] border ${content.color} p-10 rounded-3xl max-w-sm w-full text-center space-y-6 shadow-2xl`}>
        <div className="flex justify-center text-5xl">{content.icon}</div>
        <h3 className="text-xl font-black text-white uppercase tracking-tighter">{content.title}</h3>
        <p className="text-xs text-slate-500 uppercase tracking-wide">
          {status === "failed" ? (error || "Transaction Aborted") : `Infrastructure tier ${planName} provisioning in progress.`}
        </p>
        {status !== "processing" && (
          <button onClick={onClose} className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em]">
            Continue to Console
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Pricing;