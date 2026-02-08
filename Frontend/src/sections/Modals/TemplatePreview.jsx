import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTemplateById } from "@/redux/slices/templateSlice";
import { Copy, Braces, ArrowLeft, Terminal, Layout, Code2, Cpu, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const TemplatePreview = () => {
    const { templateId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { activeTemplate, loading } = useSelector((s) => s.templates);
    const { user } = useSelector((s) => s.auth);

    useEffect(() => {
        if (user && templateId) {
            dispatch(fetchTemplateById({ userId: user, templateId }));
        }
    }, [dispatch, user, templateId]);

    const variablesJson = (activeTemplate?.variables || []).reduce((acc, v) => {
        acc[v] = `DATA_${v.toUpperCase()}`;
        return acc;
    }, {});

    const copyToClipboard = (text, title) => {
        navigator.clipboard.writeText(text);
        toast({ title: `SYNC_${title}`, description: "Data buffered to clipboard." });
    };

    if (loading || !activeTemplate) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent animate-spin rounded-full mb-4" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Decrypting_Template...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-black text-slate-400 font-sans selection:bg-purple-500/30">
            {/* HUD BACKGROUND */}
            <div className="fixed inset-0 bg-[#000000] pointer-events-none" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#1e1b4b_0%,transparent_50%)] pointer-events-none opacity-30" />

            <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-10 space-y-8 pb-24">
                
                {/* TOP CONTROL BAR */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-6">
                        <motion.button 
                            whileHover={{ x: -5 }}
                            onClick={() => navigate(-1)}
                            className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
                        >
                            <ArrowLeft size={20} />
                        </motion.button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none">
                                    {activeTemplate.name}
                                </h1>
                                <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black rounded uppercase">
                                    Node_V{activeTemplate.version}.0
                                </span>
                            </div>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                <Cpu size={12} className="text-purple-900" /> UUID: {activeTemplate.templateId}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => copyToClipboard(activeTemplate.id, "ID")}
                            className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                            Copy_Template_ID
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* LEFT: VISUAL TERMINAL (Email Preview) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-3 text-slate-500">
                            <Layout size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Visual_Buffer</span>
                        </div>

                        <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <div className="px-8 py-6 bg-white/[0.02] border-b border-white/5 space-y-1">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Metadata: Subject</span>
                                <p className="text-white font-bold text-lg">{activeTemplate.subjectTemplate}</p>
                            </div>
                            <div className="p-10 min-h-[400px]">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest block mb-6">Buffer: Email_Body</span>
                                <div className="p-8 bg-black/40 border border-white/5 rounded-3xl text-slate-300 font-mono leading-relaxed text-sm whitespace-pre-wrap">
                                    {activeTemplate.bodyTemplate}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: DATA TERMINAL (JSON & API) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* VARIABLES BOX */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Braces size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Variable_Mapping</span>
                            </div>
                            <div className="bg-[#050505] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6">
                                    <button 
                                        onClick={() => copyToClipboard(JSON.stringify(variablesJson, null, 2), "VARS")}
                                        className="p-3 bg-white/5 rounded-xl hover:bg-purple-600 hover:text-white transition-all"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Schema_JSON</p>
                                    <pre className="text-emerald-500 font-mono text-xs bg-black/50 p-6 rounded-2xl border border-white/5 overflow-auto max-h-[250px]">
                                        {JSON.stringify(variablesJson, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* API INTEGRATION BOX */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Terminal size={14} />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Endpoint_Integration</span>
                            </div>
                            <div className="bg-[#050505] border border-dashed border-white/10 rounded-[2.5rem] p-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Globe size={12} className="text-purple-500" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">POST_REQUEST</span>
                                    </div>
                                    <div className="p-5 bg-black rounded-2xl font-mono text-[11px] text-slate-400 space-y-3 border border-white/5">
                                        <p className="text-purple-400">/api/v1/dispatch/send</p>
                                        <div className="h-[1px] bg-white/5 w-full" />
                                        <p className="opacity-60">{`{`}</p>
                                        <p className="pl-4">"id": "{activeTemplate.id}",</p>
                                        <p className="pl-4">"vars": {`{ ... }`}</p>
                                        <p className="opacity-60">{`}`}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;