import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSystemTemplates, fetchUserTemplates } from "@/redux/slices/templateSlice";
import { Eye, Copy, Lock, Sparkles, Crown, Fingerprint, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { use } from "react";

const Templates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { systemTemplates, userTemplates } = useSelector((s) => s.templates);
  const { user,currentUser } = useSelector((s) => s.auth);

  const isPaid = currentUser?.plan && currentUser?.plan !== "FREE";

  useEffect(() => {
    dispatch(fetchSystemTemplates());
    if (isPaid && user) {
      dispatch(fetchUserTemplates(user));
    }
  }, [dispatch, isPaid, user]);

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    toast({ title: "LOG_COPIED", description: "SYSTEM_ID successfully moved to clipboard." });
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-400 font-sans selection:bg-purple-500/30">
      {/* HUD OVERLAY GRADIENTS */}
      <div className="fixed inset-0 bg-[#000000] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,transparent_50%)] pointer-events-none opacity-30" />

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-10 space-y-12 pb-24">
        
        {/* TOP HUD NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 w-2 h-8 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
              <h1 className="text-5xl font-black tracking-tight text-white uppercase">
                Template <span className="text-slate-700">Vault</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500">
              <Terminal size={12} className="text-purple-500"/>
              Index_Status: {systemTemplates?.length + (userTemplates?.length || 0)} Units_Found
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 p-2 rounded-2xl backdrop-blur-xl">
             <div className="px-4 hidden md:block">
                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Server_Node</p>
                <p className="text-[10px] font-black text-emerald-500 uppercase">Us-East-Primary</p>
             </div>
             <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => isPaid ? navigate("/templates/create") : navigate("/pricing")}
              className="flex items-center gap-3 px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-2xl"
            >
              <Sparkles size={14}/> {isPaid ? "Generate_AI" : "Upgrade_To_Unlock"}
            </motion.button>
          </div>
        </div>

        {/* SECTIONS */}
        <div className="space-y-20">
          <Section 
            title="System_Registry" 
            desc="Default communication nodes available for all system users."
            templates={systemTemplates} 
            locked={false} 
            copyId={copyId} 
            navigate={navigate} 
          />

          <Section 
            title="User_Defined_Clusters" 
            desc="Encrypted custom templates created by the authorized node."
            templates={userTemplates} 
            locked={!isPaid} 
            copyId={copyId} 
            upgrade={!isPaid} 
            navigate={navigate} 
          />
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, desc, templates, locked, copyId, upgrade, navigate }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-end border-b border-white/5 pb-4">
      <div className="space-y-2">
        <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
          {title} {locked && <Lock size={14} className="text-purple-600" />}
        </h2>
        <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{desc}</p>
      </div>
      {upgrade && (
        <button 
          onClick={() => navigate("/pricing")} 
          className="px-4 py-2 border border-purple-500/30 rounded-lg text-[9px] font-black text-purple-400 hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest"
        >
          Elevate_Privileges
        </button>
      )}
    </div>

    {locked ? (
      <div className="relative group p-16 border border-white/5 rounded-[3rem] bg-[#030303] flex flex-col items-center justify-center text-center overflow-hidden">
        <Fingerprint className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 text-white/[0.02] pointer-events-none" />
        <div className="space-y-6 relative z-10">
          <div className="inline-flex p-4 rounded-3xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black text-white uppercase tracking-[0.2em]">Encrypted_Sector</h3>
            <p className="text-[10px] text-slate-500 uppercase font-bold max-w-sm tracking-widest leading-loose">
              Access to custom template storage and AI synthesis requires a Professional or Enterprise clearance level.
            </p>
          </div>
          <button 
            onClick={() => navigate("/pricing")}
            className="px-10 py-4 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-purple-500 transition-all"
          >
            Request_Access
          </button>
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {templates?.map((tpl, idx) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="group p-8 rounded-[2.5rem] bg-[#050505] border border-white/5 hover:border-white/20 transition-all"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-purple-500 transition-colors">
                    <Fingerprint size={18} />
                  </div>
                  <span className="font-mono text-[9px] text-slate-600 tracking-tighter uppercase">V_{tpl.version}.0.0</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-md font-black text-white uppercase tracking-tight truncate">{tpl.name}</h3>
                  <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-purple-500" />
                     <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{tpl.tag || "Generic_Node"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => navigate(`/preview/${tpl.templateId}`)}
                    className="py-4 bg-white/5 rounded-2xl flex justify-center items-center hover:bg-white hover:text-black transition-all"
                  >
                    <Eye size={16} />
                  </button>
                  <button 
                    onClick={() => copyId(tpl.templateId)}
                    className="py-4 bg-white/5 rounded-2xl flex justify-center items-center hover:bg-white hover:text-black transition-all"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )}
  </div>
);

export default Templates;