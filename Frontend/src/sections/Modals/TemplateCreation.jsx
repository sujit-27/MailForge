import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Loader2, Sparkles, Save, Trash2, Send, 
  AlertCircle, BookOpen, ShieldAlert, Zap, HelpCircle, Variable 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  clearAiPreview, createTemplate, generateAiTemplate, clearTemplateError 
} from '@/redux/slices/templateSlice';

const TemplateCreation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { aiPreview, aiLoading, loading, error } = useSelector((state) => state.templates);

  const [prompt, setPrompt] = useState("");
  const [tag, setTag] = useState("");
  
  const [draft, setDraft] = useState({
    name: "",
    subject: "",
    body: "",
    tags: []
  });

  // Mapping res.data keys: bodyTemplate, subjectTemplate, suggestedName
  useEffect(() => {
    if (aiPreview) {
      setDraft({
        name: aiPreview.suggestedName || "New AI Template",
        subject: aiPreview.subjectTemplate || "",
        body: aiPreview.bodyTemplate || "",
        tags: tag ? [tag] : []
      });
    }
  }, [aiPreview]);

  useEffect(() => {
    if (error) {
      alert(`System Error: ${error}`); 
      dispatch(clearTemplateError());
    }
  }, [error, dispatch]);

  const handleGenerate = () => {
    if (!prompt) return;
    // Ensure you pass user.id if user is an object
    dispatch(generateAiTemplate({ userId: user, prompt, tag }));
  };

  const handleSave = () => {
    // 1. Ensure variables is at least an empty array if AI didn't return any
    // (Though your DTO says @NotEmpty, so ensure the AI actually found some!)
    const detectedVariables = aiPreview?.variables || [];

    const payload = {
      name: draft.name,             // Maps to @NotBlank name
      tag: tag || "Professional",   // Maps to @NotBlank tag (singular)
      subjectTemplate: draft.subject,// Maps to @NotBlank subjectTemplate
      bodyTemplate: draft.body,      // Maps to @NotBlank bodyTemplate
      variables: detectedVariables,  // Maps to @NotEmpty variables List
      aiPrompt: prompt               // Optional field
    };
    dispatch(createTemplate({ 
      userId: user, 
      payload: payload 
    }));

    setPrompt("");
    setTag("");
  };

  return (
    <div className="max-w-[1400px] mx-auto p-6 flex flex-col lg:flex-row gap-8 bg-[#050505] min-h-screen text-slate-300">
      
      {/* LEFT COLUMN: MAIN INTERFACE */}
      <div className="flex-1 space-y-10">
        
        {/* 1. INPUT SECTION */}
        <section className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} />
          </div>

          <div className="flex items-center gap-2 text-purple-500 mb-4">
            <Zap size={16} fill="currentColor" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Core_Processor // AI_GEN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="md:col-span-2 space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Generation Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What should this email achieve?"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all text-white min-h-[100px] resize-none"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Metadata Tag</label>
              <input 
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. Onboarding"
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-purple-500 outline-none transition-all text-white"
              />
              <button 
                onClick={handleGenerate}
                disabled={aiLoading || !prompt || !tag}
                className="w-full h-[100px] mt-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-20 rounded-2xl flex flex-col justify-center items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20"
              >
                {aiLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {aiLoading ? "Processing" : "Initialize"}
              </button>
            </div>
          </div>
        </section>

        {/* 2. PREVIEW SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xs font-black text-white uppercase tracking-[0.6em] flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
              Live_Output_Stream
            </h2>
            {aiPreview && (
              <div className="flex gap-4">
                <button onClick={() => dispatch(clearAiPreview())} className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all border border-red-500/20">
                  <Trash2 size={12} className="inline mr-2" /> Discard
                </button>
                <button onClick={handleSave} disabled={loading} className="bg-white text-black px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all">
                  {loading ? <Loader2 className="animate-spin" size={12} /> : <Save size={12} className="inline mr-2" />}
                  Save_Entry
                </button>
              </div>
            )}
          </div>

          {aiPreview ? (
            <div className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl space-y-8 animate-in fade-in duration-700">
               <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-600 uppercase">Template_Name</label>
                <input 
                  value={draft.name}
                  onChange={(e) => setDraft({...draft, name: e.target.value})}
                  className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-slate-400 focus:border-purple-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-600 uppercase">Subject_Header</label>
                <input 
                  value={draft.subject}
                  onChange={(e) => setDraft({...draft, subject: e.target.value})}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-xl font-bold text-white focus:border-purple-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-600 uppercase">Body_Payload</label>
                <textarea 
                  value={draft.body}
                  rows={10}
                  onChange={(e) => setDraft({...draft, body: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-slate-300 font-mono leading-relaxed focus:border-purple-500 outline-none scrollbar-hide"
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-white/5 rounded-3xl h-[400px] flex flex-col items-center justify-center text-slate-700 space-y-4">
              <AlertCircle size={40} strokeWidth={1} />
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Waiting_for_input...</p>
                <p className="text-[9px] font-medium mt-1">Initialize the generator to start drafting.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* RIGHT COLUMN: SYSTEM INFO / SIDEBAR */}
      <aside className="w-full lg:w-[320px] space-y-6">
        
        {/* 1. DETECTED VARIABLES BOX */}
        {aiPreview?.variables?.length > 0 && (
          <div className="bg-white/[0.02] border border-emerald-500/20 p-6 rounded-3xl space-y-4 animate-in slide-in-from-right-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Variable size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Detected_Vars</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiPreview.variables.map((v, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] rounded">
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 2. LIMITS BOX */}
        <div className="bg-purple-500/5 border border-purple-500/20 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-purple-400">
            <ShieldAlert size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Usage_Quota</span>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold uppercase text-slate-500">Professional Plan</span>
              <span className="text-white font-mono text-xs">10 / Pack</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-[30%]" />
            </div>
            <p className="text-[9px] leading-relaxed text-slate-500 italic">
              * Professional tier users are limited to 10 generations per subscription.
            </p>
          </div>
        </div>

        {/* 3. MINI TUTORIAL */}
        <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-slate-400">
            <HelpCircle size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Quick_Start</span>
          </div>
          <ul className="space-y-4">
            {[
              { id: '01', text: 'Generate draft using natural language prompt.' },
              { id: '02', text: 'Refine Subject and Body in the editor stream.' },
              { id: '03', text: 'Apply Metadata tags for easy organization.' },
              { id: '04', text: 'Commit to Cloud to persist the template.' }
            ].map((item) => (
              <li key={item.id} className="flex gap-3 items-start">
                <span className="text-[9px] font-mono text-purple-500 mt-0.5">{item.id}</span>
                <p className="text-[10px] font-medium text-slate-400 leading-tight uppercase tracking-tight">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* 4. DOCUMENTATION LINK */}
        <button 
          onClick={() => navigate('/docs')}
          className="w-full group bg-white/[0.02] border border-white/5 hover:border-purple-500/50 p-6 rounded-3xl transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3 text-slate-300 group-hover:text-purple-400">
            <BookOpen size={18} />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest">Documentation</p>
              <p className="text-[8px] uppercase text-slate-500">Syntax & Variables Guide</p>
            </div>
          </div>
          <Send size={12} className="rotate-45 opacity-30 group-hover:opacity-100 transition-opacity" />
        </button>

      </aside>
    </div>
  );
};

export default TemplateCreation;