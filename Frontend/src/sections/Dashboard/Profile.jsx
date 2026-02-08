import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchDailyStats, fetchStatsByUser } from "@/redux/slices/analyticsSlice";
import { fetchUserProjects } from "@/redux/slices/projectsSlice";
import { fetchSubscription, fetchTransactions } from "@/redux/slices/transactionSlice";
import { 
  ShieldCheck, Layers, Mail, Crown, Activity, 
  Target, Eye, Key, Workflow, CreditCard, 
  History, Zap, Fingerprint, Database
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentUser, user } = useSelector((s) => s.auth);
  const { dailyStats, individualEmailStats, stats } = useSelector((s) => s.analytics);
  const { items: projects } = useSelector((s) => s.projects);
  const { currentSubscription, history: transactions, loading: txLoading } = useSelector((s) => s.transactions);

  // 1. DYNAMIC QUOTA LOGIC
  const quotaLimits = {
    FREE: 50,
    PROFESSIONAL: 1000,
    UNLIMITED: Infinity
  };

  const activePlan = currentSubscription?.planType?.toUpperCase() || "FREE";
  const dailyLimit = quotaLimits[activePlan] || 50;

  // 2. DATA FETCHING
  useEffect(() => {
    if (user && currentUser) {
      dispatch(fetchDailyStats(user));
      dispatch(fetchStatsByUser(user));
      dispatch(fetchUserProjects());
      dispatch(fetchSubscription(user));
      dispatch(fetchTransactions(user));
    }
  }, [dispatch, user, currentUser?.email]);
  // ================= MAX VOLUME PRIORITY LOGIC =================
  /**
   * Logic: If the sum of project-wise stats is greater than the 
   * identity-based fetchStatsByEmail, we prioritize the project sum.
   */
  const aggregatedMetrics = useMemo(() => {
    const emailTrace = individualEmailStats || { total: 0, sent: 0 };
    const projectSum = stats || { total: 0, sent: 0 };

    // Determine which source of truth has the higher volume
    const useProjectFallback = (projectSum.total || 0) > (emailTrace.total || 0);
    
    const finalTotal = useProjectFallback ? projectSum.total : emailTrace.total;
    const finalSent = useProjectFallback ? projectSum.sent : emailTrace.sent;

    return {
      total: finalTotal || 0,
      sent: finalSent || 0,
      isFallback: useProjectFallback,
      successRate: finalTotal > 0 ? ((finalSent / finalTotal) * 100).toFixed(1) : "0.0"
    };
  }, [individualEmailStats, stats]);

  const statsToday = aggregatedMetrics.total || 0;
  const usagePercent = dailyLimit === Infinity ? 0 : Math.min((statsToday / dailyLimit) * 100, 100);
  const isPremium = activePlan !== "FREE";

  if (!user) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="text-purple-500 font-mono animate-pulse uppercase tracking-widest text-[10px]">Initialising_Secure_Session...</div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black text-slate-300 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <div className="fixed inset-0 bg-[#000000] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,transparent_50%)] pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-10 space-y-10 pb-24">
        
        {/* IDENTITY HUD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-3xl border border-white/10 bg-black flex items-center justify-center text-3xl font-black text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors" />
              <span className="relative z-10">{currentUser?.firstName?.[0] || "U"}</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                  {currentUser?.firstName || "Guest"} <span className="text-slate-600">{currentUser?.lastName || ""}</span>
                </h1>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">Node_ID: {user?.slice(0, 12)}...</p>
            </div>
          </div>

          <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md items-center">
            {aggregatedMetrics.isFallback && (
               <div className="px-3 py-1 flex items-center gap-2 bg-purple-500/10 border-r border-white/10">
                 <Database size={12} className="text-purple-500" />
                 <span className="text-[8px] font-black text-purple-400 uppercase">Aggregated_Mode</span>
               </div>
            )}
            <HeaderInfo 
              label="Active Plan" 
              value={activePlan === "UNLIMITED" ? "Enterprise" : activePlan} 
              color={isPremium ? "text-amber-400" : "text-purple-400"} 
            />
            <div className="w-px h-8 bg-white/10 my-auto" />
            {!isPremium ? (
              <button 
                onClick={() => navigate("/pricing")}
                className="ml-2 flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
              >
                <Crown size={12}/> Upgrade
              </button>
            ) : (
              <HeaderInfo label="Node Status" value="Online" color="text-emerald-400" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* QUOTA PANEL (DAILY STATS) */}
            <div className="rounded-[2.5rem] border border-white/5 bg-[#050505] p-8 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Resource Quota</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Current 24h Telemetry Cycle</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-white tracking-tighter">{aggregatedMetrics.total}</span>
                  <span className="text-slate-600 font-black text-sm ml-1">/ {dailyLimit === Infinity ? "∞" : dailyLimit}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${usagePercent}%` }}
                    className="h-full bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  />
                </div>
                <div className="flex justify-between text-[9px] font-black uppercase text-slate-600 tracking-widest">
                  <span>Usage Utilization: {Math.round(usagePercent)}%</span>
                  <span>Cycle Reset: ~24h</span>
                </div>
              </div>
            </div>

            {/* KPI BENTO (LIFETIME STATS WITH MAX VOLUME LOGIC) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ProfileStatCard label="Lifetime Flux" value={aggregatedMetrics.total} icon={<Activity size={14}/>} />
              <ProfileStatCard label="System Integrity" value={`${aggregatedMetrics.successRate}%`} icon={<Target size={14}/>} color="text-emerald-400" />
              <ProfileStatCard label="Dispatched" value={aggregatedMetrics.sent} icon={<Mail size={14}/>} color="text-purple-400" />
              <ProfileStatCard label="Cluster Nodes" value={projects?.length || 0} icon={<Layers size={14}/>} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
               <FeaturePlaceholder icon={<Eye size={16}/>} title="Real-time Forensics" desc="Deep packet inspection for every transmission." />
               <FeaturePlaceholder icon={<Workflow size={16}/>} title="Automated Webhooks" desc="Trigger system actions based on mail delivery success." />
            </div>
          </div>

          {/* RIGHT: TRANSACTION ARCHITECTURE */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 border border-white/5 bg-[#050505] rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden flex flex-col h-full">
              <Fingerprint className="absolute -bottom-8 -right-8 w-32 h-32 text-white/[0.02]" />
              <div className="space-y-6 relative z-10 flex-grow">
                <div className="flex items-center justify-between text-slate-500">
                  <div className="flex items-center gap-3">
                    <History size={14}/>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transaction Log</span>
                  </div>
                  <button onClick={() => navigate("/billing")} className="text-[9px] font-black text-purple-400 uppercase tracking-widest hover:text-white transition-colors">View All</button>
                </div>

                {/* PURPLE SCROLLBAR CONTAINER */}
                <div className="space-y-3 overflow-y-auto pr-2 max-h-[350px] 
                  scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-purple-600/50 hover:scrollbar-thumb-purple-500 transition-all">
                  {txLoading ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-2xl" />)}
                    </div>
                  ) : transactions?.length > 0 ? (
                    transactions.slice(0, 10).map((tx) => <TransactionRow key={tx.id || tx.paymentId} tx={tx} />)
                  ) : (
                    <div className="py-10 text-center border border-dashed border-white/5 rounded-3xl">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">No Logs Detected</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => navigate("/pricing")} 
                className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-all shadow-xl active:scale-95 relative z-10 flex items-center justify-center gap-2"
              >
                <Zap size={14}/> Expand Infrastructure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM PURPLE SCROLLBAR STYLES */}
      <style jsx="true">{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-track-white\/5::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); borderRadius: 10px; }
        .scrollbar-thumb-purple-600\/50::-webkit-scrollbar-thumb { background: rgba(147, 51, 234, 0.3); borderRadius: 10px; }
        .scrollbar-thumb-purple-600\/50::-webkit-scrollbar-thumb:hover { background: rgba(147, 51, 234, 0.6); }
      `}</style>
    </div>
  );
};

/* ATOMIC COMPONENTS */
const HeaderInfo = ({ label, value, color }) => (
  <div className="px-6 py-2 flex flex-col items-center">
    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{label}</span>
    <span className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{value}</span>
  </div>
);

const ProfileStatCard = ({ label, value, icon, color = "text-white" }) => (
  <div className="p-6 border border-white/5 bg-[#050505] rounded-[2rem] space-y-4 hover:border-white/10 transition-colors group">
    <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-purple-400 transition-colors">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">{label}</p>
      <h4 className={`text-2xl font-black tracking-tighter ${color}`}>{value?.toLocaleString() || "0"}</h4>
    </div>
  </div>
);

const FeaturePlaceholder = ({ icon, title, desc }) => (
  <div className="p-6 border border-white/5 bg-[#050505] rounded-[2rem] relative overflow-hidden group border-dashed">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white/5 rounded-xl text-slate-500 group-hover:text-purple-400 transition-colors">{icon}</div>
      <span className="text-[8px] font-black text-purple-500 uppercase tracking-[0.2em] bg-purple-500/10 px-2 py-0.5 rounded">Coming Soon</span>
    </div>
    <h4 className="text-[11px] font-black text-white uppercase tracking-widest mb-2">{title}</h4>
    <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{desc}</p>
  </div>
);

const TransactionRow = ({ tx }) => (
  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all group mb-2 last:mb-0">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl bg-white/5 text-slate-500 group-hover:text-purple-400 transition-colors`}>
        <CreditCard size={12}/>
      </div>
      <div>
        <p className="text-[10px] font-black text-white uppercase tracking-widest">{tx.planType || "Provisioning"}</p>
        <p className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">
          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Active'}
        </p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-[10px] font-black text-white block font-mono">₹{tx.amount}</span>
      <span className={`text-[7px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 rounded border ${tx.status === 'SUCCESS' ? 'text-emerald-500 border-emerald-500/20' : 'text-slate-500 border-white/5'}`}>
        {tx.status}
      </span>
    </div>
  </div>
);

export default Profile;
