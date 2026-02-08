import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProjects, regenerateApiKey } from "@/redux/slices/projectsSlice";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, Copy, Eye, EyeOff, ShieldAlert, 
  Terminal, Lock, CheckCircle2, AlertTriangle, 
  Fingerprint, Activity, Globe, Cpu, ShieldCheck,
  PanelLeftClose, PanelLeftOpen, Zap, Plus, Layers, Rocket
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Assuming you use react-router

const ApiKeys = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: projects, loading } = useSelector((s) => s.projects);
  const [activeProject, setActiveProject] = useState(null);
  const [showKey, setShowKey] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hideSidebar, setHideSidebar] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projects.length && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    dispatch(regenerateApiKey(activeProject.id));
    setShowConfirm(false);
    setShowKey(true);
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-400 font-sans selection:bg-purple-500/30">
      {/* Background FX */}
      <div className="fixed inset-0 bg-[#000000] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#3b0764_0%,transparent_50%)] pointer-events-none opacity-40" />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* STICKY HUD RIBBON */}
      <div className="sticky top-0 z-[100] w-full bg-black/60 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-6 px-8 py-3 max-w-[1600px] mx-auto">
          <HUDItem icon={<Cpu size={14} />} label="Security_Vault" value="US-EAST-1" status={projects.length > 0 ? "emerald" : "amber"} />
          <div className="w-px h-6 bg-white/10" />
          <HUDItem icon={<Fingerprint size={14} />} label="Identity" value="Verified" status="emerald" />
          <div className="ml-auto flex items-center gap-4">
             <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
               {projects.length} Nodes Detected
             </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col xl:flex-row justify-between gap-8 items-start xl:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <span className={`flex h-1.5 w-1.5 rounded-full ${projects.length > 0 ? 'bg-purple-500 shadow-[0_0_12px_#a855f7]' : 'bg-amber-500'}`} />
               <h4 className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">Credential Infrastructure</h4>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase ">
              API Access
            </h1>
          </div>
        </div>

        {/* MAIN CONTENT LOGIC */}
        {!loading && projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* SIDEBAR: CLUSTER NODES */}
            <AnimatePresence>
              {!hideSidebar && (
                <motion.div 
                  initial={{ width: 0, opacity: 0, x: -20 }}
                  animate={{ width: "auto", opacity: 1, x: 0 }}
                  exit={{ width: 0, opacity: 0, x: -20 }}
                  className="xl:col-span-4 space-y-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Infrastructure Nodes</h3>
                    <button onClick={() => setHideSidebar(true)} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-600 transition-colors">
                      <PanelLeftClose size={14} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => { setActiveProject(p); setShowKey(false); }}
                        className={`w-full text-left p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden group
                          ${activeProject?.id === p.id ? "bg-purple-500/5 border-purple-500/20 shadow-2xl" : "border-white/5 bg-black/40 hover:border-white/10"}
                        `}
                      >
                        <div className="flex justify-between items-center relative z-10">
                          <div>
                            <h4 className={`text-xs font-black uppercase tracking-widest ${activeProject?.id === p.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>{p.name}</h4>
                            <p className="text-[9px] font-mono text-slate-700 mt-1 uppercase">NODE_ID: {p.id.slice(0, 14)}</p>
                          </div>
                          {activeProject?.id === p.id && <ShieldCheck className="w-4 h-4 text-purple-500" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* KEY PANEL */}
            <motion.div layout className={`${hideSidebar ? "xl:col-span-12" : "xl:col-span-8"} space-y-8`}>
              {hideSidebar && (
                <button onClick={() => setHideSidebar(false)} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition">
                  <PanelLeftOpen size={14} /> Show Nodes
                </button>
              )}

              <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                  <Fingerprint size={280} className="text-purple-500" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight uppercase">Infrastructure Access Token</h3>
                    <p className="text-xs text-slate-500 max-w-lg leading-relaxed italic">
                      Universal secret required for this node to authorize Kafka stream ingestion and Relay handshakes.
                    </p>
                  </div>
                  <button onClick={() => setShowConfirm(true)} className="px-6 py-2.5 bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all shadow-xl shadow-red-900/10">
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate Key
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] ml-2">Master Production Token</label>
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative group">
                      <div className="absolute inset-0 bg-purple-500/5 blur-2xl group-hover:bg-purple-500/10 transition-all" />
                      <div className="relative flex items-center bg-black border border-white/10 rounded-[1.25rem] px-6 py-5 font-mono text-sm text-purple-400 shadow-inner overflow-hidden">
                         <span className="tracking-[0.3em] truncate">
                           {showKey ? activeProject?.apiKey : "••••••••••••••••••••••••••••••••••••••••"}
                         </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <ActionButton onClick={() => setShowKey(!showKey)} icon={showKey ? <EyeOff size={18} /> : <Eye size={18} />} />
                      <ActionButton onClick={() => handleCopy(activeProject?.apiKey)} icon={<Copy size={18} />} />
                    </div>
                  </div>
                </div>

                {/* INTEGRATION GUIDE */}
                <div className="mt-16 space-y-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Terminal size={14} />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Environment Scaffolding</span>
                  </div>
                  <div className="bg-black p-6 border border-white/5 rounded-2xl font-mono text-[11px] text-slate-500 leading-relaxed uppercase tracking-tighter">
                    <span className="text-slate-300">MAILFORGE_API_KEY=</span>{showKey ? activeProject?.apiKey : "************************"}
                  </div>
                </div>
              </div>

              {/* IMPACT ANALYSIS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImpactCard icon={<AlertTriangle className="text-amber-500" />} title="Rotation Impact" text="Rotating this token will immediately drop active Kafka connections." />
                <ImpactCard icon={<ShieldAlert className="text-purple-500" />} title="Persistence Policy" text="Identity logs are pull-encrypted and stored for 90 days." />
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* MODAL: SECURE ROTATION */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative bg-[#050505] border border-white/10 rounded-[3rem] p-12 max-w-md w-full shadow-3xl text-center">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Confirm Rotation</h3>
              <p className="text-xs text-slate-500 leading-relaxed italic mb-10">
                You are about to purge the production token for <span className="text-white font-bold">{activeProject?.name}</span>. This is a destructive security event.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowConfirm(false)} className="py-4 border border-white/10 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition">Abort</button>
                <button onClick={handleRegenerate} className="py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition">Confirm</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ================= NEW: EMPTY STATE COMPONENT ================= */

const EmptyState = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="w-full max-w-4xl mx-auto"
  >
    <div className="bg-[#050505] border border-dashed border-white/10 rounded-[3rem] p-12 text-center relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        <div className="w-20 h-20 mx-auto bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-purple-500">
          <Layers size={40} className="animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">No Active Nodes Detected</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm italic">
            Your security infrastructure is currently dormant. To generate API credentials, you must first initialize a deployment node.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <GuideStep num="01" title="Create Project" desc="Define your infrastructure workspace." />
          <GuideStep num="02" title="Define Env" desc="Configure your Kafka or SMTP relays." />
          <GuideStep num="03" title="Gen Keys" desc="Keys will appear in this dashboard." />
        </div>

        <div className="pt-8">
          <Link to="/dashboard">
            <button className="group relative px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
              <span className="flex items-center gap-2">
                <Plus size={14} strokeWidth={3} /> Initialize First Node
              </span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

const GuideStep = ({ num, title, desc }) => (
  <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
    <span className="text-[10px] font-mono text-purple-500 font-bold block mb-2 tracking-tighter">// STEP_{num}</span>
    <h4 className="text-white text-xs font-black uppercase mb-1">{title}</h4>
    <p className="text-[10px] text-slate-600 uppercase leading-tight font-medium">{desc}</p>
  </div>
);

/* ================= EXISTING ATOMIC COMPONENTS ================= */

const HUDItem = ({ icon, label, value, status }) => (
  <div className="flex items-center gap-3">
    <div className="p-1.5 rounded-lg bg-white/5 text-slate-400">{icon}</div>
    <div>
      <p className="text-[8px] font-bold text-slate-600 uppercase leading-none mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-black text-white uppercase">{value}</span>
        <div className={`h-1 w-1 rounded-full ${status === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'} animate-pulse`} />
      </div>
    </div>
  </div>
);

const ActionButton = ({ icon, ...props }) => (
  <button {...props} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 transition-all shadow-xl hover:text-purple-400">
    {icon}
  </button>
);

const ImpactCard = ({ icon, title, text }) => (
  <div className="p-8 border bg-black/40 border-white/5 rounded-[2.5rem] space-y-4">
    <div className="flex items-center gap-3">
      {icon}
      <h4 className="text-[10px] font-black uppercase tracking-widest text-white">{title}</h4>
    </div>
    <p className="text-[11px] leading-relaxed text-slate-600 italic border-l border-white/10 pl-4">
      {text}
    </p>
  </div>
);

export default ApiKeys;