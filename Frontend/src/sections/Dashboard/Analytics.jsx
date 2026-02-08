import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, Cell
} from "recharts";
import { 
  Zap, Activity, ShieldAlert, Clock, ChevronRight, 
  BarChart3, AreaChart as AreaIcon, X, Terminal, 
  Fingerprint, Search, Cpu, Globe, ArrowUpRight, Database
} from "lucide-react";

import {
  fetchStatsByUser,
  fetchProjectEmailStats
} from "@/redux/slices/analyticsSlice";

const Analytics = () => {
  const dispatch = useDispatch();
  const { currentUser, user } = useSelector((s) => s.auth);
  const { stats, individualEmailStats, loading } = useSelector((s) => s.analytics);
  const projects = useSelector((s) => s.projects.items) || [];

  const [mode, setMode] = useState("USER");
  const [chartType, setChartType] = useState("BAR");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ================= DATA PRIORITIZATION LOGIC =================
  /**
   * Comparison Logic: 
   * If individual identity stats (fetchStatsByEmail) are lower than 
   * project-wide stats, we fallback to the project summation to ensure 
   * data completeness in the UI.
   */
  const activeStats = useMemo(() => {
    const individual = individualEmailStats || { total: 0, sent: 0, failed: 0, processing: 0, retry: 0 };
    const globalProject = stats || { total: 0, sent: 0, failed: 0, processing: 0, retry: 0 };

    if (mode === "USER") {
      // Logic: If global node data is "richer" than identity trace, prioritize global
      const useGlobalFallback = (globalProject.total || 0) > (individual.total || 0);
      return useGlobalFallback ? globalProject : individual;
    }
    return globalProject;
  }, [mode, individualEmailStats, stats]);

  useEffect(() => {
    if (currentUser?.email) {
      dispatch(fetchStatsByUser(user));
    }
    // Baseline project fetch for comparison
    if (projects.length > 0 && !activeProject) {
      dispatch(fetchProjectEmailStats(projects[0].id));
    }
  }, [dispatch, currentUser?.email, projects]);

  const selectProject = (project) => {
    setActiveProject(project);
    setShowProjectModal(false);
    dispatch(fetchProjectEmailStats(project.id));
  };

  const handleIdentityTrace = (e) => {
    e.preventDefault();
    if (searchQuery) dispatch(fetchStatsByUser(searchQuery));
  };

  const chartData = useMemo(() => {
    if (!activeStats) return [];
    return [
      { name: "INGRESS", value: activeStats.processing, color: "#3b82f6", label: "Queued" },
      { name: "SUCCESS", value: activeStats.sent, color: "#a855f7", label: "Dispatched" },
      { name: "FAILURE", value: activeStats.failed, color: "#ef4444", label: "Dropped" },
      { name: "RETRY", value: activeStats.retry, color: "#f59e0b", label: "In-Retry" }
    ];
  }, [activeStats]);

  return (
    <div className="relative min-h-screen bg-black text-slate-300 selection:bg-purple-500/30 font-sans overflow-x-hidden">
      <div className="fixed inset-0 bg-[#000000] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#3b0764_0%,transparent_50%)] pointer-events-none opacity-40" />

      {/* ================= STICKY HUD RIBBON ================= */}
      <div className="sticky top-0 z-[100] w-full bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6 px-8 py-3 max-w-[1600px] mx-auto">
          <HUDItem icon={<Cpu size={14} />} label="Cluster" value="US-EAST-1" status="emerald" />
          <div className="w-px h-6 bg-white/10" />
          <HUDItem icon={<Database size={14} />} label="Source" value={activeStats === stats ? "Project_Sum" : "Identity_Trace"} status="purple" />
          <div className="w-px h-6 bg-white/10" />
          <HUDItem icon={<Activity size={14} />} label="Kafka Lag" value="14ms" status="emerald" />
          
          <div className="ml-auto hidden md:flex items-center gap-4">
             <div className="px-2 py-0.5 rounded border border-purple-500/20 bg-purple-500/5 text-[8px] font-bold text-purple-400 uppercase tracking-tighter">
                Logic: Max_Volume_Priority
             </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col xl:flex-row justify-between gap-8 items-start xl:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className="flex h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_12px_#a855f7]" />
               <h4 className="text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase">Neural Intelligence</h4>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase">
              System Stats
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <form onSubmit={handleIdentityTrace} className="relative group w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-purple-400 transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Identity Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-xl text-xs outline-none focus:border-purple-500/50 transition-all shadow-2xl"
              />
            </form>

            <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl w-full sm:w-auto">
              <ContextTab active={mode === "USER"} onClick={() => setMode("USER")} label="Global" />
              <ContextTab 
                active={mode === "PROJECT"} 
                onClick={() => { setMode("PROJECT"); setShowProjectModal(true); }} 
                label="Node" 
              />
            </div>
          </div>
        </div>

        {/* ================= ANALYTICS GRID ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* LEFT: KPI STACK */}
          <div className="xl:col-span-3 space-y-4">
             <KPICard title="Input Flux" value={activeStats?.total} detail="Total Telemetry Data" icon={<Activity />} />
             <KPICard title="Buffer Depth" value={activeStats?.processing} detail="Active Kafka Ingress" icon={<Clock />} color="blue" />
             <KPICard title="Egress Success" value={activeStats?.sent} detail="Verified Handshakes" icon={<Zap />} color="purple" />
             <KPICard title="System Drops" value={activeStats?.failed} detail="DLQ Redirections" icon={<ShieldAlert />} color="red" />
          </div>

          {/* MID: MAIN GRAPH */}
          <div className="xl:col-span-6">
            <div className="h-full border bg-black/40 border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
              <div className="flex justify-between items-start mb-12">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight uppercase">Transmission Dynamics</h3>
                  <p className="text-xs text-slate-500 font-medium">Real-time status metrics across cluster nodes.</p>
                </div>
                <div className="flex gap-2">
                  <IconButton active={chartType === "BAR"} onClick={() => setChartType("BAR")} icon={<BarChart3 size={16} />} />
                  <IconButton active={chartType === "AREA"} onClick={() => setChartType("AREA")} icon={<AreaIcon size={16} />} />
                </div>
              </div>

              <div className="h-[480px] w-full">
                {loading ? <GraphLoader /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === "BAR" ? (
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 10, fontWeight: 700}} dy={10} />
                        <Tooltip cursor={{fill: '#ffffff03'}} content={<AdvancedTooltip />} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={55}>
                          {chartData.map((entry, index) => <Cell key={index} fill={entry.color} fillOpacity={0.9} />)}
                        </Bar>
                      </BarChart>
                    ) : (
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<AdvancedTooltip />} />
                        <Area type="monotone" dataKey="value" stroke="#a855f7" fill="url(#areaG)" strokeWidth={3} />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: SYSTEM LOGS */}
          <div className="xl:col-span-3 space-y-6">
            <div className="p-8 border bg-black/40 border-white/5 rounded-[2.5rem] space-y-6 h-full shadow-2xl">
               <div className="flex items-center gap-2 text-purple-400">
                  <Terminal size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Console.Stream</span>
               </div>
               <div className="space-y-5 font-mono text-[10px]">
                  <LogLine type="INF" text="Kafka cluster synchronized" />
                  <LogLine 
                    type="SYS" 
                    text={activeStats === stats ? "Priority: Project_Summation" : "Priority: Identity_Trace"} 
                    color="text-emerald-500/60" 
                  />
                  <LogLine type="WAR" text="Buffer depth exceeding 10ms" color="text-amber-500/60" />
                  <LogLine type="ERR" text="Null pointer bypass in relay 4" color="text-red-500/60" />
                  <LogLine type="INF" text={`Session: ${activeStats?.total} Units processed`} />
               </div>
               
               <div className="pt-6 mt-6 border-t border-white/5">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Infrastructure Health</h4>
                  <div className="space-y-3">
                    <HealthBar label="Uptime" pct={99.9} />
                    <HealthBar label="System Load" pct={42} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showProjectModal && (
          <NodePickerModal
            projects={projects}
            onSelect={selectProject}
            onClose={() => setShowProjectModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ================= ATOMIC UI COMPONENTS ================= */

const HUDItem = ({ icon, label, value, status }) => (
  <div className="flex items-center gap-3">
    <div className="p-1.5 rounded-lg bg-white/5 text-slate-400">{icon}</div>
    <div>
      <p className="text-[8px] font-bold text-slate-600 uppercase leading-none mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-black text-white uppercase">{value}</span>
        <div className={`h-1 w-1 rounded-full bg-${status}-500 animate-pulse`} />
      </div>
    </div>
  </div>
);

const ContextTab = ({ active, label, ...props }) => (
  <button
    {...props}
    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
      ${active ? "bg-white/10 text-white shadow-xl" : "text-slate-600 hover:text-slate-300"}
    `}
  >
    {label}
  </button>
);

const IconButton = ({ active, icon, ...props }) => (
  <button
    {...props}
    className={`p-2.5 rounded-xl border transition-all ${active ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/40" : "bg-black border-white/5 text-slate-600 hover:text-slate-300"}`}
  >
    {icon}
  </button>
);

const KPICard = ({ title, value, detail, icon, color = "purple" }) => {
  const themes = {
    purple: "text-purple-400 border-purple-500/10 shadow-[0_0_15px_-5px_#a855f7]",
    blue: "text-blue-400 border-blue-500/10",
    emerald: "text-emerald-400 border-emerald-500/10",
    red: "text-red-400 border-red-500/10"
  };
  return (
    <motion.div whileHover={{ x: 4 }} className="p-6 border bg-black/40 border-white/5 rounded-[2rem] space-y-4 hover:border-white/10 transition-colors">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 ${themes[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{title}</p>
        <h3 className="text-3xl font-black text-white tracking-tighter mt-1">{value?.toLocaleString() || "0"}</h3>
        <p className="text-[9px] font-medium text-slate-700 uppercase mt-1">{detail}</p>
      </div>
    </motion.div>
  );
};

const LogLine = ({ type, text, color = "text-slate-500" }) => (
  <div className={`flex gap-3 ${color}`}>
    <span className="opacity-40">{type}</span>
    <p className="uppercase tracking-tight">{text}</p>
  </div>
);

const HealthBar = ({ label, pct }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[9px] font-bold text-slate-600 uppercase">
      <span>{label}</span>
      <span>{pct}%</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-purple-500/50" />
    </div>
  </div>
);

const AdvancedTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/90 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{payload[0].payload.label}</p>
        <p className="text-3xl font-black text-white">{payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const GraphLoader = () => (
  <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
    <div className="w-8 h-8 border-2 border-white/10 border-t-purple-500 rounded-full animate-spin" />
    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Aggregating Stream...</span>
  </div>
);

const NodePickerModal = ({ projects, onSelect, onClose }) => (
  <motion.div
    className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="bg-black border border-white/10 rounded-[3rem] p-12 max-w-2xl w-full shadow-3xl relative overflow-hidden"
      initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent" />
      <button onClick={onClose} className="absolute top-8 right-8 text-slate-600 hover:text-white transition-colors"><X size={20}/></button>
      <div className="mb-10 space-y-2 text-center">
        <h2 className="text-4xl font-black text-white tracking-tight uppercase">Infrastructure Nodes</h2>
        <p className="text-xs text-slate-600 font-medium italic">Redirect telemetry focus to a specific cluster node.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {projects.map((p) => (
          <div
            key={p.id} onClick={() => onSelect(p)}
            className="group cursor-pointer rounded-2xl p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all flex justify-between items-center"
          >
            <div>
              <h3 className="text-sm font-black text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{p.name}</h3>
              <p className="text-[9px] text-slate-700 font-mono mt-2 tracking-tighter">NODE_REF: {p.id.slice(0,18)}</p>
            </div>
            <ArrowUpRight size={16} className="text-slate-800 group-hover:text-purple-400 transition-all" />
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

export default Analytics;