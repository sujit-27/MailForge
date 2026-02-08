import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById, regenerateApiKey } from "@/redux/slices/projectsSlice";
import RegenerateKeyModal from "@/sections/Modals/RegenerateKeyModal";
import { fetchDailyStats, fetchProjectEmailLogs } from "@/redux/slices/analyticsSlice";
import { Download, ShieldCheck, Zap, Lock, Info, AlertTriangle, Clock } from "lucide-react";

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentUser, user } = useSelector((state) => state.auth);
  const { currentProject, loading } = useSelector((state) => state.projects);
  const { logs, loading: logsLoading } = useSelector((state) => state.analytics);
  const {dailyStats} = useSelector((state) => state.analytics);

  const [showKey, setShowKey] = useState(false);
  const [showRegenModal, setShowRegenModal] = useState(false);

  useEffect(() => {
    if (projectId && user) {
      dispatch(fetchProjectById(projectId));
      dispatch(fetchProjectEmailLogs(projectId));
    }
  }, [projectId, dispatch]);

  // ================= DYNAMIC PLAN LOGIC =================
  const planType = currentUser?.plan?.toUpperCase() || "FREE";
  
  const planConfig = {
    FREE: { 
        limit: 50, 
        name: "Basic Node", 
        color: "amber", 
        theme: "from-amber-900/10",
        border: "border-amber-500/20"
    },
    PROFESSIONAL: { 
        limit: 1000, 
        name: "Pro Infrastructure", 
        color: "purple", 
        theme: "from-purple-900/10",
        border: "border-purple-500/20"
    },
    ULTIMATE: { 
        limit: Infinity, 
        name: "Ultimate Cluster", 
        color: "emerald", 
        theme: "from-emerald-900/10",
        border: "border-emerald-500/20"
    }
  };

  const currentPlan = planConfig[planType] || planConfig.FREE;

  // ================= CYCLE ANALYSIS (TIME CHECKING) =================
  const cycleInfo = useMemo(() => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const diffMs = endOfDay - now;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      timeLeft: `${hours}h ${minutes}m`,
      isNearEnd: hours < 4,
      percentage: Math.max(0, Math.min(100, (diffMs / (24 * 60 * 60 * 1000)) * 100))
    };
  }, []);

  if (loading || !currentProject) return <ProjectSkeleton />;

  const createdDate = new Date(currentProject.createdAt).toLocaleDateString(
    "en-US", { day: "numeric", month: "long", year: "numeric" }
  );

  // ================= EXPORT LOGIC =================
  const handleExport = (format) => {
    const dataToExport = logs || [];
    if (dataToExport.length === 0) return alert("No logs available to export.");

    let content = "";
    let mimeType = "";
    let extension = "";

    if (format === "json") {
      content = JSON.stringify(dataToExport, null, 2);
      mimeType = "application/json";
      extension = "json";
    } else {
      const headers = "Status,Recipient,Lag,Time\n";
      const rows = dataToExport.map(l => `${l.status},${l.recipient},${l.lag || '0ms'},${l.createdAt}`).join("\n");
      content = headers + rows;
      mimeType = "text/csv";
      extension = "csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentProject.name}-logs.${extension}`;
    a.click();
  };

  return (
    <div className="relative z-10 space-y-10 pb-16 animate-in fade-in duration-500">

      {/* ================= HEADER / IDENTITY ================= */}
      <section className="rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            <div className={`h-16 w-16 rounded-2xl bg-${currentPlan.color}-500/10 border border-${currentPlan.color}-500/20 flex items-center justify-center text-3xl font-black text-white`}>
              {currentProject.name?.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
                  {currentProject.name}
                </h1>
                <StatusBadge label={currentPlan.name} color={currentPlan.color} />
              </div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">
                NODE_STAMP: {createdDate}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
             <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Kafka Live</span>
             </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= LEFT: SECURITY & IDENTITY ================= */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] p-8">
            <div className="absolute -left-10 -bottom-10 text-[120px] font-black text-white/[0.02] select-none pointer-events-none uppercase">
                Key
            </div>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Security Vault</h3>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tighter">AES-256 Project Encryption</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-purple-500" />
            </div>

            <div className="space-y-6 relative z-10">
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Live API Secret</label>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-black/80 backdrop-blur-xl border border-white/5 rounded-xl px-4 py-3 font-mono text-sm text-purple-400 shadow-inner overflow-hidden">
                            {showKey ? currentProject.apiKey : "••••••••••••••••••••••••••••••••"}
                        </div>
                        <button 
                            onClick={() => setShowKey(!showKey)}
                            className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 hover:text-white transition-all uppercase"
                        >
                            {showKey ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <p className="text-[10px] text-gray-500 max-w-[200px] leading-relaxed ">
                        Cycling the secret key will invalidate all current SMTP and Kafka listener handshakes.
                    </p>
                    <button
                        onClick={() => setShowRegenModal(true)}
                        className="px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-black text-rose-500 hover:bg-rose-500/20 transition-all uppercase tracking-widest"
                    >
                        Cycle Secret
                    </button>
                </div>
            </div>
        </div>

        {/* ================= RIGHT: DYNAMIC USAGE & LIMITS ================= */}
        <div className={`relative overflow-hidden rounded-[2.5rem] border ${currentPlan.border} bg-gradient-to-br ${currentPlan.theme} via-[#0a0a0a] to-[#0a0a0a] p-8`}>
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Resource Quota</h3>
                <div className="flex items-center gap-2">
                    <Zap size={14} className={`text-${currentPlan.color}-500`} />
                    <span className={`text-[10px] font-black text-${currentPlan.color}-500 uppercase tracking-widest`}>{currentPlan.name}</span>
                </div>
            </div>

            {/* Quota Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Daily Flux Limit</p>
                    <p className="text-xl font-black text-white mt-1">
                        {currentPlan.limit === Infinity ? "∞" : currentPlan.limit.toLocaleString()} 
                        <span className="text-[10px] text-gray-600 font-bold ml-1 tracking-normal">Emails</span>
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Cycle Reset In</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className={cycleInfo.isNearEnd ? "text-rose-500" : "text-gray-500"} />
                        <p className={`text-xl font-black ${cycleInfo.isNearEnd ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                            {cycleInfo.timeLeft}
                        </p>
                    </div>
                </div>
            </div>

            {/* DYNAMIC WARNINGS / ONBOARDING */}
            <div className="space-y-4 mb-8">
                {planType === "FREE" && (
                    <>
                        <WarningItem type="warn" text="Free tier transmissions include 'via MailForge' metadata headers." />
                        <WarningItem type="lock" text="Upgrade to Pro for 1k daily limit and dedicated IP reputation." />
                    </>
                )}
                {planType === "PROFESSIONAL" && (
                    <>
                        <WarningItem type="info" text="Professional node active: Metadata branding removed." />
                        <WarningItem type="lock" text="Go Ultimate for Unlimited flux and high-priority Kafka queues." />
                    </>
                )}
                {planType === "ULTIMATE" && (
                    <>
                        <WarningItem type="info" text="Ultimate infrastructure: 99.9% Delivery SLA enabled." />
                        <WarningItem type="info" text="Dedicated Kafka partition confirmed for this node." />
                    </>
                )}
            </div>

            {/* Action Row */}
            <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/docs")} className="w-full py-4 rounded-xl bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition active:scale-95">
                    View Integration Docs
                </button>
                {planType !== "ULTIMATE" && (
                    <button 
                        onClick={() => navigate("/pricing")}
                        className={`w-full py-4 rounded-xl bg-${currentPlan.color === 'amber' ? 'purple' : 'emerald'}-600 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition active:scale-95 shadow-xl`}
                    >
                        {planType === "FREE" ? "Unlock Pro Infrastructure" : "Deploy Ultimate Cluster"}
                    </button>
                )}
            </div>
        </div>
      </section>

      {/* ================= LOGS + METRICS ================= */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* LOGS TABLE */}
        <div className="lg:col-span-3 rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">
                    Real-time Transmission Log
                </h2>
            </div>

            <div className="flex gap-3">
              <ExportButton label="CSV" onClick={() => handleExport('csv')} />
              <ExportButton label="JSON" onClick={() => handleExport('json')} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
                <thead className="bg-white/[0.02] text-gray-600 uppercase font-black tracking-widest">
                <tr>
                    <th className="p-5">Status</th>
                    <th className="p-5">Recipient Identity</th>
                    <th className="p-5">Cluster Lag</th>
                    <th className="p-5 text-right">Timestamp</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {logsLoading ? (
                    <tr><td colSpan="4" className="p-12 text-center animate-pulse text-gray-600 font-mono tracking-widest">SYNCHRONIZING_LOGS...</td></tr>
                ) : logs?.length > 0 ? (
                    logs.map((log, idx) => (
                        <LogEntry 
                            key={log.id || idx}
                            status={log.status} 
                            email={log.recipients} 
                            lag={log.lag || "14ms"} 
                            date={new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} 
                        />
                    ))
                ) : (
                    <tr><td colSpan="4" className="p-12 text-center text-gray-700 uppercase font-black tracking-widest">No Transmissions Detected</td></tr>
                )}
                </tbody>
            </table>
          </div>
        </div>

        {/* REALTIME METRICS */}
        <div className="space-y-6">
          <MetricCard 
            title="Session Flux" 
            value={logs?.length || "0"} 
            icon={<Zap size={14} className="text-purple-400" />}
          />
          <MetricCard 
            title="Internal Lag" 
            value={currentProject.metrics?.kafkaLag || "12ms"} 
            icon={<Clock size={14} className="text-emerald-400" />}
          />
          <QuotaCard 
            used={dailyStats.total || 0} 
            limit={currentPlan.limit} 
            color={currentPlan.color}
          />
        </div>
      </section>
      
      {showRegenModal && (
        <RegenerateKeyModal
          projectId={projectId}
          onClose={() => setShowRegenModal(false)}
        />
      )}
    </div>
  );
};

/* ATOMIC COMPONENTS */

const StatusBadge = ({ label, color }) => (
  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-${color}-500/10 text-${color}-500 border border-${color}-500/20`}>
    {label}
  </span>
);

const ExportButton = ({ label, onClick }) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 hover:text-white flex items-center gap-2 transition-all uppercase tracking-widest"
  >
    <Download className="w-3 h-3" />
    {label}
  </button>
);

const MetricCard = ({ title, value, icon }) => (
  <div className="rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-8 space-y-4 shadow-xl group hover:border-white/10 transition-all">
    <div className="flex items-center justify-between">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{title}</p>
        {icon}
    </div>
    <h4 className="text-3xl font-black text-white tracking-tighter">{value}</h4>
  </div>
);

const QuotaCard = ({ used, limit, color }) => {
  const percentage = limit === Infinity ? 0 : Math.min(100, (used / limit) * 100);
  
  return (
    <div className="rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] p-8 shadow-xl">
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-6">Active Utilization</p>
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <span className="text-4xl font-black text-white tracking-tighter ">{used}</span>
                <span className="text-xs font-black text-gray-600 uppercase tracking-widest mb-1">/ {limit === Infinity ? "∞" : limit}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                    className={`h-full bg-${color}-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }} 
                />
            </div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">
                {limit === Infinity ? "Infrastructure Unbound" : `${Math.round(percentage)}% of Daily Node Capacity`}
            </p>
        </div>
    </div>
  );
};

const LogEntry = ({ status, email, lag, date }) => {
  const isSuccess = status.toLowerCase() === "sent";
  
  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
      <td className="p-5">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            <div className={`h-1.5 w-1.5 rounded-full ${isSuccess ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
            {status}
        </div>
      </td>
      <td className="p-5 text-gray-400 font-medium">{email}</td>
      <td className="p-5 text-gray-500 font-mono tracking-tighter">{lag}</td>
      <td className="p-5 text-right text-gray-600 font-bold">{date}</td>
    </tr>
  );
};

const WarningItem = ({ type, text }) => {
  const Icons = {
    info: <Info size={14} className="text-purple-400" />,
    warn: <AlertTriangle size={14} className="text-amber-400" />,
    lock: <Lock size={14} className="text-gray-500" />
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="mt-0.5">{Icons[type]}</div>
      <span className="text-[11px] text-gray-400 leading-relaxed font-medium">{text}</span>
    </div>
  );
};

const ProjectSkeleton = () => (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 blur-3xl opacity-20 bg-purple-600 animate-pulse" />
        <h1 className="relative text-6xl font-black tracking-tighter text-white  animate-pulse">
            MAILFORGE
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 animate-loading-bar" />
        </div>
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em]">Initializing_Node_Telemetry</p>
      </div>
    </div>
);

export default ProjectDetailsPage;