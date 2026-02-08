import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, onEdit, onDelete }) => {

    const navigate = useNavigate();

    return (
        <div className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-purple-500/30 hover:bg-[#0c0c0c] h-44">
        
        {/* Action Overlay (Top Right) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
            onClick={() => onEdit(project)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
            title="Edit Project"
            >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button 
            onClick={() => onDelete(project)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete Project"
            >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
        </div>

        {/* Identity Area */}
        <div className="flex flex-col gap-3">
            {/* Identity Area */}
            <div className="flex flex-col gap-3">
            {/* Dynamic Project Avatar */}
                <div className={`
                    flex h-10 w-10 items-center justify-center rounded-xl 
                    bg-gradient-to-br from-purple-500/20 to-blue-500/10 
                    text-purple-400 border border-purple-500/20 
                    font-bold text-lg shadow-[0_0_15px_rgba(168,85,247,0.1)]
                    group-hover:border-purple-500/40 group-hover:text-white transition-all duration-300
                `}>
                    {project.name?.charAt(0).toUpperCase() || "P"}
                </div>
            </div>
            <div>
            <h3 className="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                {project.name}
            </h3>
            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                {project.description || "Production email pipeline"}
            </p>
            </div>
        </div>

        {/* Bottom Meta */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">v.{project.id?.slice(-4)}</span>
            </div>
            <button 
                onClick={() => navigate("/projects/{}".replace("{}", project.id))}
                className="text-[10px] font-bold text-purple-400 hover:underline"
            >FORGE →</button>
        </div>
        </div>
    );
};

export default ProjectCard;