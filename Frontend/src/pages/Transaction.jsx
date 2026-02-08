import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTransactions, fetchTransactionDetails } from "@/redux/slices/transactionSlice";
import { 
  ArrowLeft, CreditCard, ChevronDown, Receipt, LayoutGrid, List, 
  Fingerprint, ArrowDown, Search, Download, ShieldCheck,
  Cpu, History, Globe, Zap, Layers, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, user } = useSelector((s) => s.auth);
  const { history: transactions, selectedTransaction, loading } = useSelector((s) => s.transactions);

  const [viewMode, setViewMode] = useState("list");
  const [expandedId, setExpandedId] = useState(null);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) dispatch(fetchTransactions(user));
  }, [dispatch, user]);

  const filteredData = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(tx =>
      tx.planType.toLowerCase().includes(search.toLowerCase()) ||
      tx.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [transactions, search]);

  const displayedData = filteredData.slice(0, limit);
  console.log("Displayed Data:", displayedData);

  const toggleRow = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      dispatch(fetchTransactionDetails(id));
      setExpandedId(id);
    }
  };

  if (loading && !transactions?.length) return <LoadingState />;

  return (
    /* BREAKOUT FIX: 
       -ml-10 md:-ml-12 removed the space between sidebar.
       w-screen or w-full with overflow-x-hidden ensures right gap is gone.
    */
    <div className="relative min-h-screen bg-black text-slate-400 font-sans selection:bg-purple-500/30 overflow-x-hidden -ml-6 md:-ml-10 -mt-6 md:-mt-10 w-[calc(100%+3rem)] md:w-[calc(100%+5rem)]">
      
      {/* Background FX - Match API Keys Page */}
      <div className="fixed inset-0 bg-[#000000] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_0%_0%,#3b0764_0%,transparent_50%)] pointer-events-none opacity-40" />
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 p-6 md:p-12 space-y-12">
        
        {/* HEADER SECTION - No Italics, Ultra Black */}
        <div className="flex flex-col xl:flex-row justify-between gap-8 items-start xl:items-end">
          <div className="space-y-4 px-2">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition group">
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> System_Return
            </button>
            <h1 className="text-6xl font-black tracking-tighter text-white uppercase leading-none">
              Billing Ledger
            </h1>
          </div>

          {/* VIEW CONTROLS */}
          <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5 backdrop-blur-md">
             <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[11px] font-bold tracking-widest text-white focus:outline-none focus:border-purple-500/50 w-48 md:w-64 transition-all"
                  placeholder="SEARCH_LOGS"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white text-black' : 'text-slate-500'}`}><List size={16} /></button>
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-black' : 'text-slate-500'}`}><LayoutGrid size={16} /></button>
              </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="w-full">
          {!transactions?.length ? (
            <EmptyState />
          ) : viewMode === "list" ? (
            <div className="rounded-[2.5rem] border border-white/5 bg-[#050505]/60 backdrop-blur-sm shadow-2xl overflow-hidden overflow-x-auto scrollbar-hide">
               <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                    <th className="p-8">Node_Service</th>
                    <th className="p-8">Sync_Date</th>
                    <th className="p-8">Amount_Settled</th>
                    <th className="p-8 text-right pr-12">System_Verdict</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {displayedData.map((tx) => (
                    <ListRow 
                      key={tx.transactionId} 
                      tx={tx} 
                      isExpanded={expandedId === tx.transactionId} 
                      onToggle={() => toggleRow(tx.transactionId)}
                      details={selectedTransaction}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {displayedData.map((tx) => (
                <GridCard key={tx.transactionId} tx={tx} />
              ))}
            </div>
          )}

          {filteredData.length > limit && (
            <button 
              onClick={() => setLimit(l => l + 5)}
              className="mt-12 w-full py-8 border border-dashed border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 hover:text-purple-400 hover:border-purple-500/20 transition-all flex items-center justify-center gap-3"
            >
              Load Legacy Data <ArrowDown size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= SUB-COMPONENTS ================= */

const ListRow = ({ tx, isExpanded, onToggle, details }) => (
  <>
    <tr onClick={onToggle} className={`group cursor-pointer transition-all ${isExpanded ? 'bg-purple-500/5' : 'hover:bg-white/[0.01]'}`}>
      <td className="p-8">
        <div className="flex items-center gap-6">
          <div className={`p-4 rounded-2xl bg-white/5 transition-colors ${isExpanded ? 'text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'text-slate-500'}`}>
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-white uppercase tracking-tighter">{tx.planType}</p>
            <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest leading-none mt-1">ENTRY_ID: {tx.transactionId.slice(0, 12)}</p>
          </div>
        </div>
      </td>
      <td className="p-8 text-[11px] font-bold font-mono text-slate-500 uppercase tracking-widest">
        {new Date(tx.createdAt).toLocaleDateString()}
      </td>
      <td className="p-8">
        <p className="text-xl font-black text-white tracking-tighter leading-none mb-1">₹{tx.amount}</p>
        <p className="text-[9px] font-mono text-emerald-500/50 uppercase">Secured_Vault</p>
      </td>
      <td className="p-8 text-right pr-12">
        <div className="flex items-center justify-end gap-6">
          <StatusBadge status={tx.status} />
          <ChevronDown className={`text-slate-700 transition-transform duration-500 ${isExpanded ? 'rotate-180 text-purple-500' : ''}`} size={20} />
        </div>
      </td>
    </tr>
    <AnimatePresence>
      {isExpanded && (
        <tr>
          <td colSpan="4" className="p-0 border-none bg-black/40">
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-24 py-16 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-white/5 relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Fingerprint size={160} className="text-purple-500" /></div>
                <DetailItem label="Internal_Node_ID" value={tx.paymentId} />
                <DetailItem label="Auth_Credential" value={tx.orderId} />
                <div className="flex flex-col items-center justify-center p-8 bg-purple-600/10 rounded-[2.5rem] border border-purple-500/20 shadow-2xl">
                   <Receipt size={32} className="text-purple-500 mb-4" />
                   <p className="text-[10px] font-black text-white uppercase mb-1 tracking-widest">Grand Total</p>
                   <p className="text-4xl font-black text-white tracking-tighter leading-none">₹{tx.amount}</p>
                </div>
              </div>
            </motion.div>
          </td>
        </tr>
      )}
    </AnimatePresence>
  </>
);

const GridCard = ({ tx }) => (
  <motion.div whileHover={{ y: -8 }} className="bg-[#080808] border border-white/5 p-8 rounded-[3rem] space-y-8 group transition-all hover:border-purple-500/20 shadow-2xl relative overflow-hidden">
    <div className="absolute -top-10 -right-10 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
        <Fingerprint size={180} className="text-purple-500" />
    </div>
    <div className="flex justify-between items-start">
      <div className="p-4 bg-white/5 rounded-2xl text-slate-500 group-hover:text-purple-400 transition-colors"><CreditCard size={24} /></div>
      <StatusBadge status={tx.status} />
    </div>
    <div>
      <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{tx.planType}</h3>
      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{new Date(tx.createdAt).toLocaleString()}</p>
    </div>
    <div className="pt-8 border-t border-white/5 flex items-end justify-between">
      <div>
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Settled_Credit</p>
        <p className="text-4xl font-black text-white tracking-tighter leading-none">₹{tx.amount}</p>
      </div>
      <button className="p-4 bg-purple-600 rounded-2xl text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:scale-110 active:scale-95 transition-all">
        <Download size={18} />
      </button>
    </div>
  </motion.div>
);

const DetailItem = ({ label, value }) => (
  <div className="space-y-3">
    <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">{label}</p>
    <div className="bg-white/5 p-4 rounded-xl border border-white/5 font-mono text-[11px] text-zinc-300 break-all tracking-tight leading-relaxed">
      {value || "AUTH_PROTOCOL_PENDING"}
    </div>
  </div>
);

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

const StatusBadge = ({ status }) => {
  const isSuccess = status === "SUCCESS";
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
      isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
      {status}
    </div>
  );
};

const LoadingState = () => (
  <div className="h-screen bg-black flex flex-col items-center justify-center space-y-6">
    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full shadow-[0_0_30px_rgba(147,51,234,0.4)]" />
    <p className="text-[9px] font-mono text-purple-500 uppercase tracking-[0.5em] animate-pulse">Syncing_Financial_Ledger</p>
  </div>
);

const EmptyState = () => (
  <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 bg-[#050505] border border-dashed border-white/10 rounded-[3rem] relative overflow-hidden">
    <div className="absolute inset-0 bg-purple-500/5 blur-[120px] pointer-events-none" />
    <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-purple-500">
      <Fingerprint size={40} className="animate-pulse" />
    </div>
    <div className="space-y-2 relative z-10">
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">No Logs Detected</h2>
      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Ledger is empty // await first node authorization</p>
    </div>
    <button className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95">Initialize Node</button>
  </div>
);

export default Transaction;