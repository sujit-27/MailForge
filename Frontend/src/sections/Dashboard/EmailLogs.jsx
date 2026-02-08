import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, Info, Search, Loader2, Folder } from "lucide-react";

const EmailLogs = () => {
  const { items: projects, loading } = useSelector((state) => state.projects);
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleProjectClick = (id) => {
    navigate(`/email-logs/${id}`); 
  };

  return (
    <div className="mr-6 space-y-8 py-6 animate-in fade-in duration-700">
      
      {/* ================= HEADER & CONTROLS ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Project Observability</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Audit trail for all dispatched nodes</p>
        </div>

        <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-2 rounded-2xl backdrop-blur-md">
          <div className="relative flex items-center group">
            <Search className="absolute left-3 w-4 h-4 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Cluster..." 
              className="bg-transparent border-none text-xs text-gray-300 placeholder:text-gray-700 focus:ring-0 focus:outline-none pl-10 pr-4 py-2 w-48 transition-all"
            />
          </div>
          <div className="h-5 w-[1px] bg-white/10" />
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-purple-600/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-purple-600/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'text-gray-600 hover:text-gray-300 hover:bg-white/5'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      {loading ? (
        <LoadingState viewMode={viewMode} />
      ) : filteredProjects.length === 0 ? (
        <EmptyState hasSearch={search.length > 0} />
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-3"}>
          {filteredProjects.map((project) => (
            viewMode === "grid" 
              ? <ProjectGridCard key={project.id} project={project} onClick={() => handleProjectClick(project.id)} />
              : <ProjectListRow key={project.id} project={project} onClick={() => handleProjectClick(project.id)} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ------------------- LOADING STATE ------------------- */
const LoadingState = ({ viewMode }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] w-full space-y-6">
    {/* Rotating Brand Icon */}
    <div className="relative flex items-center justify-center">
      {/* Outer Orbiting Ring */}
      <div className="absolute h-16 w-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
      
      {/* Inner Glowing Core */}
      <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
        <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse" />
      </div>
    </div>

    {/* Brand Text with Shimmer Effect */}
    <div className="text-center space-y-2">
      <h2 className="text-sm font-black text-white uppercase tracking-[0.6em] animate-pulse ml-[0.6em]">
        Mailforge
      </h2>
      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
        Synchronizing Cluster Nodes
      </p>
    </div>

    {/* Subtle Progress Track */}
    <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden rounded-full">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-1/2 animate-shimmer" />
    </div>

    {/* Skeleton Overlay (Optional: keep these ghosted in background for layout stability) */}
    <div className={`absolute inset-0 opacity-10 pointer-events-none ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-3"}`}>
      {[1, 2, 3].map((i) => (
        <div key={i} className={`border border-white/5 bg-white/[0.02] rounded-[2rem] ${viewMode === "grid" ? "h-64" : "h-20"}`} />
      ))}
    </div>
  </div>
);

/* ------------------- EMPTY STATE ------------------- */
const EmptyState = ({ hasSearch }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-[3rem]">
    <div className="h-20 w-20 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-500/50 mb-6">
      {hasSearch ? <Search size={40} /> : <Folder size={40} />}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">
      {hasSearch ? "No matching nodes found" : "No projects initialized"}
    </h3>
    <p className="text-sm text-gray-500 max-w-xs">
      {hasSearch 
        ? "Adjust your search parameters to find the specific pipeline you're looking for." 
        : "Initialize your first infrastructure project to start monitoring transmission logs."}
    </p>
  </div>
);

/* ------------------- GRID & LIST COMPONENTS (Existing Logic) ------------------- */
const ProjectGridCard = ({ project, onClick }) => (
  <div onClick={onClick} className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-8 transition-all cursor-pointer hover:border-purple-500/30 hover:shadow-[0_20px_50px_-20px_rgba(168,85,247,0.15)] active:scale-[0.98]">
    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity"><Info size={80} /></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className="h-10 w-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
           <span className="text-xs font-black">{project.name.charAt(0)}</span>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Pipeline Health</p>
          <p className="text-[10px] text-emerald-400 font-bold uppercase">Nominal</p>
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{project.name}</h3>
      <div className="relative mb-6">
        <p className="text-xs text-gray-500 line-clamp-1">{project.description || "Production relay node"}</p>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="bg-purple-600 text-[10px] font-black text-white px-3 py-1 rounded-full shadow-lg">OPEN TRANSMISSION LOGS</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
        <div><p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Ingressed</p><p className="text-sm font-mono font-bold text-gray-300">1.2k</p></div>
        <div><p className="text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">Failure Rate</p><p className="text-sm font-mono font-bold text-red-400 text-right">0.02%</p></div>
      </div>
    </div>
  </div>
);

const ProjectListRow = ({ project, onClick }) => (
  <div onClick={onClick} className="group flex items-center justify-between rounded-2xl border border-white/5 bg-[#0a0a0a] px-8 py-5 hover:border-purple-500/20 transition-all cursor-pointer active:scale-[0.99]">
    <div className="flex items-center gap-6">
      <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
      <div>
        <h4 className="text-sm font-bold text-gray-200 group-hover:text-purple-400 transition-colors">{project.name}</h4>
        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-tighter">ID: {project.id.slice(0, 12)}...</p>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-12">
        <div className="text-right min-w-[100px]"><p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Latency</p><p className="text-xs font-mono text-gray-400">24ms</p></div>
        <div className="text-right min-w-[120px]"><p className="text-[9px] font-black text-gray-600 uppercase tracking-widest text-right">Action</p><p className="text-[10px] font-bold text-purple-400 uppercase group-hover:underline">View History</p></div>
    </div>
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button className="p-2 text-gray-600 hover:text-white transition-colors"><Info size={16} /></button>
    </div>
  </div>
);

export default EmailLogs;