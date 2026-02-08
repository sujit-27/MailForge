import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  ChevronDown, ChevronUp, Download, FileJson, 
  FileSpreadsheet, ArrowLeft, RefreshCw, Mail, 
  CheckCircle, AlertTriangle, Clock, Terminal
} from "lucide-react";
import { clearAnalyticsLogs, fetchProjectEmailLogs, fetchProjectEmailLogsByStatus, fetchProjectEmailStats } from "@/redux/slices/analyticsSlice";

const EmailLogsDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { stats, logs, loading } = useSelector((state) => state.analytics);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  
  // Progressive disclosure state
  const [visibleCount, setVisibleCount] = useState(5);

  // 1. Initial Load: Get Project Stats & General Logs
  useEffect(() => {
    if (projectId) {
      dispatch(clearAnalyticsLogs());
      dispatch(fetchProjectEmailStats(projectId));
      dispatch(fetchProjectEmailLogs(projectId));
      setVisibleCount(5); // Reset count on project change
    }
    
    return () => dispatch(clearAnalyticsLogs());
  }, [projectId, dispatch]);

  const handleTabChange = (status) => {
    setActiveTab(status);
    setVisibleCount(5); // Reset count on tab change
    if (status === "ALL") {
      dispatch(fetchProjectEmailLogs(projectId));
    } else {
      dispatch(fetchProjectEmailLogsByStatus({ projectId, status }));
    }
  };

  const handleRefresh = () => {
    if (activeTab === "ALL") {
      dispatch(fetchProjectEmailLogs(projectId));
    } else {
      dispatch(fetchProjectEmailLogsByStatus({ projectId, status: activeTab }));
    }
    dispatch(fetchProjectEmailStats(projectId));
  };

  const handleShowMore = () => {
    if (visibleCount === 5) {
      setVisibleCount(10);
    } else {
      setVisibleCount(logs.length);
    }
  };

  /* ===================== EXPORT LOGIC ===================== */
  const exportToJSON = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs_${projectId}_${new Date().getTime()}.json`;
    link.click();
  };

  const exportToCSV = () => {
    if (logs.length === 0) return;
    const headers = Object.keys(logs[0]).join(",");
    const rows = logs.map(log => Object.values(log).map(val => `"${val}"`).join(","));
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs_${projectId}_${new Date().getTime()}.csv`;
    link.click();
  };

  if (loading && !logs.length) {
    return (
    <div className="mr-6">
      <LoadingState />
    </div>
  );
  }

  // Slice logs for progressive view
  const visibleLogs = logs.slice(0, visibleCount);

  return (
    <div className="mr-6 space-y-8 py-6 animate-in fade-in duration-700">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 hover:text-purple-400 transition-colors">
            <ArrowLeft size={12} /> Back to Observability
          </button>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Transmission Pulse</h1>
          <p className="text-xs text-gray-500 font-medium">Node ID: <span className="font-mono text-purple-400">{projectId}</span></p>
        </div>

        <div className="flex items-center gap-3">
            <ExportButton icon={<FileJson size={14}/>} label="JSON" onClick={exportToJSON} />
            <ExportButton icon={<FileSpreadsheet size={14}/>} label="CSV" onClick={exportToCSV} />
            <button onClick={handleRefresh} className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
      </div>

      {/* ================= METRICS ROW ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Total Ingress" value={stats?.total} icon={<Terminal size={14}/>} color="text-white" />
        <MetricCard label="Sent" value={stats?.sent} icon={<CheckCircle size={14}/>} color="text-amber-400" />
        <MetricCard label="Processing" value={stats?.processing} icon={<Clock size={14}/>} color="text-emerald-400" />
        <MetricCard label="Failed" value={stats?.failed} icon={<AlertTriangle size={14}/>} color="text-red-400" />
        <MetricCard label="Retries" value={stats?.retry} icon={<RefreshCw size={14}/>} color="text-purple-400" />
      </div>

      {/* ================= LOGS TABLE ================= */}
      <div className="rounded-[2rem] border border-white/5 bg-[#0a0a0a] overflow-hidden">
        {/* Table Filters */}
        <div className="flex items-center gap-2 p-4 bg-white/[0.02] border-b border-white/5">
            {["ALL", "SENT", "FAILED", "PROCESSING", "RETRY"].map(tab => (
                <button 
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all ${activeTab === tab ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.01] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">Recipient Node</th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-600 uppercase tracking-widest">Subject Reference</th>
                <th className="px-6 py-4 text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">Timestamp</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visibleLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr 
                    onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-5">
                       <StatusBadge status={log.status} />
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-300 font-mono">
                      {log.recipients.map((email, idx) => (
                        <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-gray-300 font-mono mr-1">
                          {email}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-500 truncate max-w-[200px]">{log.subject}</td>
                    <td className="px-6 py-5 text-right text-[10px] font-mono text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-5 text-right">
                       {expandedLogId === log.id ? <ChevronUp size={14} className="text-purple-400" /> : <ChevronDown size={14} className="text-gray-700 group-hover:text-gray-400" />}
                    </td>
                  </tr>
                  {/* EXPANDED VIEW */}
                  {expandedLogId === log.id && (
                  <tr className="bg-purple-600/[0.015] border-x border-purple-500/10">
                    <td colSpan="5" className="px-8 py-10 animate-in slide-in-from-top-4 duration-500">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        
                        {/* LEFT COLUMN: SYSTEM TRACE */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <Terminal size={14} className="text-purple-400" />
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Deployment Metadata</h4>
                          </div>
                          
                          <div className="space-y-4">
                            <DataField label="Trace ID" value={log.id} mono copyable />
                            <DataField label="Project Reference" value={log.projectId} mono />
                            <DataField label="Sender Origin" value={log.sender} />
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-gray-600 font-bold uppercase tracking-tighter">Target Nodes</span>
                              <div className="flex gap-2">
                                {log.recipients.map((email, idx) => (
                                  <span key={idx} className="bg-white/5 px-2 py-0.5 rounded text-gray-300 font-mono">
                                    {email}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: TRANSMISSION LIFECYCLE */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                            <RefreshCw size={14} className="text-purple-400" />
                            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Lifecycle Trace</h4>
                          </div>

                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <DataField label="Attempt Count" value={log.attemptNumber} />
                              <DataField label="Last Activity" value={new Date(log.lastRetryAt).toLocaleTimeString()} />
                            </div>

                            <div className="relative group/msg">
                              <div className="absolute -top-2 -left-2 text-[8px] font-black text-gray-700 uppercase bg-[#0a0a0a] px-2 z-10">
                                System Response
                              </div>
                              <div className={`p-4 rounded-2xl border bg-black/50 text-[11px] font-mono leading-relaxed transition-all ${
                                log.status === 'SENT' ? 'border-emerald-500/20 text-emerald-400/80' : 'border-red-500/20 text-red-400/80'
                              }`}>
                                {log.message || "No terminal message provided by provider."}
                              </div>
                            </div>
                            
                            <p className="text-[9px] text-gray-600 italic">
                              Record initialized at: {new Date(log.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= LOAD MORE FOOTER ================= */}
        {logs.length > visibleCount && (
          <div className="p-6 flex justify-center border-t border-white/5 bg-white/[0.01]">
            <button 
              onClick={handleShowMore}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-purple-600/10 hover:text-purple-400 hover:border-purple-500/30 transition-all active:scale-95 group"
            >
              {visibleCount === 5 ? "Expand Cluster (+5)" : `View Full Registry (${logs.length} Nodes)`}
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------- COMPONENTS ------------------- */

const MetricCard = ({ label, value, icon, color }) => (
  <div className="p-6 rounded-[2rem] border border-white/5 bg-[#0a0a0a] space-y-3 group hover:border-white/10 transition-all">
    <div className="flex items-center justify-between text-gray-600">
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {icon}
    </div>
    <p className={`text-2xl font-mono font-bold ${color}`}>{value || 0}</p>
  </div>
);

const ExportButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all active:scale-95">
    {icon} {label}
  </button>
);

const DataField = ({ label, value, mono, copyable }) => (
  <div className="flex justify-between items-center text-[10px] group/field">
    <span className="text-gray-600 font-bold uppercase tracking-tighter">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`${mono ? 'font-mono text-purple-300/90' : 'text-gray-300'} select-all`}>
        {value}
      </span>
      {copyable && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(value);
          }}
          className="opacity-0 group-hover/field:opacity-100 p-1 hover:bg-white/5 rounded transition-all text-gray-500 hover:text-white"
        >
          <Download size={10} className="rotate-180" />
        </button>
      )}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-[600px] w-full space-y-8 animate-in fade-in duration-700">
    <div className="relative flex flex-col items-center justify-center z-20">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute h-20 w-20 rounded-full border-2 border-purple-500/10 border-t-purple-500 animate-spin" />
        <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <div className="h-2.5 w-2.5 bg-purple-400 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-base font-black text-white uppercase tracking-[0.8em] animate-pulse ml-[0.8em]">Mailforge</h2>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Querying Analytics Cluster</p>
      </div>
      <div className="mt-6 w-56 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-1/2 animate-shimmer" />
      </div>
    </div> 
  </div>
);

const StatusBadge = ({ status }) => {
    const styles = {
        SENT: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
        PROCESSING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        RETRY: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        ALL: "bg-white/5 text-gray-400 border-white/10"
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${styles[status] || styles.ALL}`}>
            {status}
        </span>
    );
};

export default EmailLogsDetailsPage;