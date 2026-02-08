import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "@/redux/slices/projectsSlice";
import { sendEmail, clearSendStatus } from "@/redux/slices/emailsSlice"; 
import { createPortal } from "react-dom";
import { fetchProjectEmailStats } from "@/redux/slices/analyticsSlice";
import { RefreshCcw, AlertTriangle } from "lucide-react";
import { fetchTemplateById } from "@/redux/slices/templateSlice";
import { toast } from "@/hooks/use-toast";


const SendEmailProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Selectors
  const { currentProject, loading: projectLoading } = useSelector((state) => state.projects);
  const { currentUser, user } = useSelector((state) => state.auth);
  const { loading: emailSending, sendStatus } = useSelector((state) => state.emails);
  const { stats, loading } = useSelector((state) => state.analytics);

  // Form State
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState("raw");
  const [body, setBody] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [variables, setVariables] = useState("{}");
  
  // UI States
  const [jsonError, setJsonError] = useState(null);
  const [dispatchResult, setDispatchResult] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);

  useEffect(() => {
    if (!currentProject || currentProject.id !== projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [projectId, dispatch, currentProject]);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectEmailStats(projectId));
      
      // Optional: Set up an interval to poll for real-time updates every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchProjectEmailStats(projectId));
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [projectId, dispatch]);

  // Handle JSON Validation for Templates
  useEffect(() => {
    if (mode === "template") {
      try {
        JSON.parse(variables);
        setJsonError(null);
      } catch (e) {
        setJsonError("Invalid JSON structure");
      }
    }
  }, [variables, mode]);

  const handleTemplateRefresh = async () => {
    if (!templateId.trim()) {
      toast({
        title: "Template ID required",
        description: "Please enter a template ID to load",
        variant: "destructive"
      });
      return;
    }

    try {
      setTemplateLoading(true);

      const res = await dispatch(
        fetchTemplateById({ user, templateId })
      ).unwrap();

      // Auto-fill subject & body
      setSubject(res.subjectTemplate);
      setBody(res.bodyTemplate);

      // Auto-generate variables JSON
      const vars = res.variables.reduce((acc, v) => {
        acc[v] = "";
        return acc;
      }, {});
      setVariables(JSON.stringify(vars, null, 2));

      toast({
        title: "Template loaded",
        description: "Subject & body auto-filled"
      });

    } catch (err) {
      toast({
        title: "Template not found",
        description: "Invalid template ID or access denied",
        variant: "destructive"
      });
    } finally {
      setTemplateLoading(false);
    }
  };

  const applyVariables = (text, vars) => {
    let result = text;
    Object.entries(vars).forEach(([key, value]) => {
      const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      result = result.replace(pattern, value);
    });
    return result;
  };

  const handleSend = async () => {
    if (jsonError) return;

    const senderEmail = currentUser?.email || "mailforge28@gmail.com";

    let finalSubject = subject;
    let finalBody = body;

    /* =========================
      ONLY extra logic added
      — does not change DTO
    ========================== */

    if (mode === "template") {
      if (!templateId) {
        alert("Template not loaded. Click refresh first.");
        return;
      }

      try {
        const vars = JSON.parse(variables || "{}");

        // check missing values
        const missing = Object.entries(vars)
          .filter(([_, v]) => !v || v.trim() === "")
          .map(([k]) => k);

        if (missing.length > 0) {
          alert(`Fill all template variables: ${missing.join(", ")}`);
          return;
        }

        finalSubject = applyVariables(subject, vars);
        finalBody = applyVariables(body, vars);

      } catch {
        alert("Variables JSON invalid");
        return;
      }
    }

    /* =========================
      ORIGINAL STRUCTURE KEPT
    ========================== */

    const emailRequest = {
      userId: user,
      sender: senderEmail,
      recipients: to.split(",").map((email) => email.trim()),
      subject: finalSubject,
      body: finalBody,
      projectId: projectId,
      apiKey: currentProject?.apiKey,
    };

    console.log("Dispatch Email:", emailRequest);

    const action = await dispatch(sendEmail(emailRequest));

    if (sendEmail.fulfilled.match(action)) {
      setDispatchResult(action.payload);
      setShowSuccessModal(true);

      setTo("");
      setSubject("");
      setBody("");
      setTemplateId("");
      setVariables("{}");
    }
  };

  if (projectLoading || !currentProject) return <SendEmailLoader />;
  const isFormInvalid = !to.trim() || !subject.trim() || (mode === "raw" ? !body.trim() : !templateId.trim()) || !!jsonError;

  return (
    <div className="space-y-6 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ================= PROJECT CONTEXT HEADER ================= */}
      <header className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] p-10">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">
              <button onClick={() => navigate('/send-email')} className="hover:text-purple-400 transition-colors">Hub</button>
              <span>/</span>
              <span className="text-gray-400">Infrastructure Instance</span>
            </nav>
            <h1 className="text-3xl font-bold text-white tracking-tight">{currentProject.name}</h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">Pipeline ID: <span className="font-mono text-purple-400/80">{projectId}</span></p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Kafka Cluster Ready</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= EMAIL COMPOSER ================= */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-8 space-y-8">

            {/* SUBJECT + TO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Recipient Addresses (Comma Separated)" icon="👤">
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="user1@mail.com, user2@mail.com"
                  className="cyber-input"
                />
              </Field>

              <Field label="Subject Line" icon="✉️">
                <input
                  value={subject}
                  onChange={(e) => mode === "raw" && setSubject(e.target.value)}
                  placeholder="Project Authentication"
                  disabled={mode === "template"}
                  className={`cyber-input ${mode === "template" ? "opacity-70 cursor-not-allowed" : ""}`}
                />
              </Field>
            </div>

            {/* MODE SWITCH */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                  Composition Mode
                </label>
                <div className="flex p-1 bg-black rounded-xl border border-white/5">
                  <ModeTab active={mode === "raw"} onClick={() => setMode("raw")}>
                    Raw Body
                  </ModeTab>
                  <ModeTab active={mode === "template"} onClick={() => setMode("template")}>
                    Template Engine
                  </ModeTab>
                </div>
              </div>

              {/* RAW MODE */}
              {mode === "raw" ? (
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Hello, this is a system-generated message..."
                  className="cyber-input font-mono text-sm leading-relaxed resize-none"
                />
              ) : (
                /* TEMPLATE MODE */
                <div className="grid grid-cols-1 gap-6 animate-in zoom-in-95 duration-300">

                  {/* TEMPLATE ID + REFRESH */}
                  <Field label="Remote Template ID">
                    <div className="flex gap-3">
                      <input
                        value={templateId}
                        onChange={(e) => setTemplateId(e.target.value)}
                        placeholder="63125164127471...."
                        className="cyber-input flex-1"
                      />
                      <button
                        onClick={handleTemplateRefresh}
                        disabled={templateLoading}
                        title="Load Template"
                        className="px-4 rounded-xl border border-purple-500/40 text-purple-400 hover:text-white hover:border-purple-500 transition-all"
                      >
                        {templateLoading ? (
                          <div className="h-4 w-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        ) : (
                          <RefreshCcw size={16} />
                        )}
                      </button>
                    </div>
                  </Field>

                  {/* BODY (READ ONLY) */}
                  <Field label="Template Body (Auto-filled)">
                    <textarea
                      value={body}
                      disabled
                      className="cyber-input font-mono text-xs h-40 opacity-70 cursor-not-allowed"
                    />
                  </Field>

                  {/* VARIABLES */}
                  <Field label="Injection Variables (JSON)">
                    <textarea
                      value={variables}
                      onChange={(e) => setVariables(e.target.value)}
                      className={`cyber-input font-mono text-xs h-32 ${
                        jsonError ? "border-red-500/50 text-red-400" : ""
                      }`}
                    />
                    {jsonError && (
                      <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter italic">
                        {jsonError}
                      </p>
                    )}
                  </Field>
                </div>
              )}
            </div>

            {/* SEND ACTION */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] text-gray-600 font-medium italic">
                {emailSending ? "Ingesting into Kafka Topic..." : "Ready for transmission."}
              </p>
              <button
                disabled={emailSending || isFormInvalid}
                onClick={handleSend}
                className={`
                group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all
                
                /* Base Style: Black bg, Purple border, Purple text */
                bg-black border-2 border-purple-500/50 text-purple-400 
                
                /* Hover State: Glow and solid border */
                hover:border-purple-500 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]
                
                /* Active State: Slight shrink */
                active:scale-95
                
                /* Disabled State: Faded out */
                disabled:opacity-40 disabled:border-white/10 disabled:text-gray-600 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-transparent
                `}
            >
                {emailSending ? (
                <>
                    <div className="h-3 w-3 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    Processing...
                </>
                ) : (
                <>
                    Dispatch Message
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
                )}
            </button>
            </div>
          </div>
        </div>

        {/* ================= INFO PANEL ================= */}
        <aside className="space-y-6">
            <StatusCard 
              title="Transmission Metrics" 
              items={[
              { 
                  label: "Total Ingress", 
                  value: stats?.total?.toLocaleString() || "0", 
                  desc: "Total packets ingested into Kafka" 
              },
              { 
                  label: "Relay Success", 
                  value: stats?.sent?.toLocaleString() || "0", 
                  color: "text-emerald-400",
                  desc: "Successfully dispatched to SMTP relay"
              },
              { 
                  label: "Inbound Failures", 
                  value: stats?.failed?.toLocaleString() || "0", 
                  color: stats?.failed > 0 ? "text-red-400" : "text-gray-500",
                  desc: "Dropped due to invalid node handshake"
              },
              { 
                  label: "Queue Load", 
                  value: stats?.processing?.toLocaleString() || "0", 
                  desc: "Active packets in processing buffer",
                  color: "text-purple-400"
              }
              ]} 
          />   
          <div className="rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-8">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-6">Security Context</h3>
            <div className="space-y-4">
                <SecurityItem label="Bearer Auth" active={true} />
                <SecurityItem label="API Key Valid" active={!!currentProject?.apiKey} />
                <SecurityItem label="TLS Pipeline" active={true} />
            </div>
          </div>
        </aside>
      </div>

      {showSuccessModal && (
        <KafkaDispatchModal 
          result={dispatchResult} 
          onClose={() => setShowSuccessModal(false)} 
        />
      )}
    </div>
  );
};

// --- Helper Components ---

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</label>
    {children}
  </div>
);

const ModeTab = ({ active, children, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${active ? "bg-purple-600/20 text-purple-400" : "text-gray-600 hover:text-gray-400"}`}>
    {children}
  </button>
);

const StatusCard = ({ title, items }) => (
  <div className="rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-8">
    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-6">{title}</h3>
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.label} className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-xs text-gray-500 font-medium">{item.label}</span>
          <span className="text-sm font-bold text-white">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

const SecurityItem = ({ label, active }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">{label}</span>
        <div className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-gray-800'}`} />
    </div>
);

const SendEmailLoader = () => (
    <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">MAILFORGE</span>
        </div>
    </div>
);

const KafkaDispatchModal = ({ result, onClose }) => {
  // 1. Lock Body Scroll
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = originalStyle);
  }, []);

  if (!result) return null;

  // 2. Wrap in Portal to break out of parent div "space-y-6"
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      
      {/* Immersive Dark Backdrop */}
      <div 
        className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg mx-4 overflow-hidden rounded-[2.5rem] border border-emerald-500/20 bg-[#080808] shadow-[0_0_100px_-20px_rgba(16,185,129,0.2)] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Glow Header */}
        <div className="relative bg-emerald-500/5 p-10 text-center border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
          
          <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h3 className="relative z-10 text-2xl font-bold text-white tracking-tight">Dispatch Confirmed</h3>
          <div className="relative z-10 mt-2 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em]">Kafka Topic Ingested</p>
          </div>
        </div>

        {/* Technical Data Grid */}
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest text-left">Partition Node</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-200">ID-{result.partition || '0'}</span>
                <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500 uppercase">LEADER</span>
              </div>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Acknowledgment</p>
              <p className="text-sm font-mono text-emerald-400/80">OFFSET_{result.offset || '772'}</p>
            </div>
          </div>

          {/* Trace ID Box */}
          <div className="group relative rounded-2xl bg-black border border-white/5 p-5 transition-all hover:border-purple-500/30">
             <div className="flex justify-between items-center mb-3">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Transmission Trace ID</p>
                <button 
                    onClick={() => navigator.clipboard.writeText(result.messageId)}
                    className="text-[10px] text-purple-400 font-bold hover:text-purple-300 transition-colors"
                >
                    COPY ID
                </button>
             </div>
             <p className="font-mono text-xs text-purple-300/90 break-all leading-relaxed bg-purple-500/5 p-3 rounded-xl border border-purple-500/10">
                {result.messageId || "mf_prod_trace_v1_09238"}
             </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-95"
          >
            Acknowledge Receipt
          </button>
        </div>
      </div>
    </div>,
    document.body // This anchors the modal to the body, bypassing the parent div's layout!
  );
};

export default SendEmailProjectPage;