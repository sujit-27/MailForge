import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CreateProjectModal from "@/sections/Modals/CreateProjectModal";
import { clearCurrentProject, fetchUserProjects, setCurrentProject } from "@/redux/slices/projectsSlice";
import ProjectCard from "@/sections/Cards/ProjectCard";
import EditProjectModal from "@/sections/Modals/EditProjectModal";
import { useNavigate } from "react-router-dom";
import DeleteProjectModal from "@/sections/Modals/DeleteProjectModal";
import { Activity, Terminal } from "lucide-react";
import { useForgeChat } from "@/context/ForgeChatContext";

const Dashboard = () => {

    const dispatch = useDispatch();
    const {currentUser } = useSelector((state) => state.auth);
    const { items: projects, loading } = useSelector((state) => state.projects);
    const { individualEmailStats } = useSelector((state) => state.analytics);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const { currentProject } = useSelector(state => state.projects);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();
    const { openChat } = useForgeChat();

    useEffect(() => {
        dispatch(fetchUserProjects());
    }, [dispatch]);

    // Inside Dashboard component
    const handleEditClick = (project) => {
        dispatch(setCurrentProject(project)); // Set the data in Redux
        setShowEditModal(true);                // Open the modal
    };

    const handleDeleteClick = (project) => {
        dispatch(setCurrentProject(project)); // Set the data so modal knows WHICH project to delete
        setShowDeleteModal(true);
    };

    // Clean up logic for closing
    const handleCloseModals = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        dispatch(clearCurrentProject()); // Reset selection to avoid "ghost data"
    };
    return (
        <div className="mr-6 space-y-10 py-6 animate-in fade-in duration-700">
        
        {/* ================= GLOBAL TOP BAR ================= */}
        <header className="flex items-center justify-between px-2">
            <div className="flex items-center gap-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">System Overview</h2>
            </div>
            
            <div className="flex items-center gap-3">
            <button onClick={() => navigate("/docs")} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold text-gray-400 hover:text-white transition-all">
                DOCS
            </button>
            <button onClick={() => navigate("/pricing")} className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-[11px] font-bold text-purple-400 hover:bg-purple-500/10 transition-all">
                UPGRADE
            </button>
            <button onClick={openChat} className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-[11px] font-bold text-gray-300 hover:bg-white/10 transition-all border border-white/5">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                FORGE
            </button>
            </div>
        </header>

        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#080808] p-12">
            {/* Layered Background Glows */}
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-600/5 blur-[80px]" />

            <div className="relative z-10 max-w-2xl">
            <span className="inline-block rounded-full bg-purple-500/10 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-purple-400 border border-purple-500/20 mb-6">
                Infrastructure v1.0
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-white leading-[1.1]">
                Deploy reliable <br /> 
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">email pipelines.</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-400 font-medium">
                Welcome back, {currentUser?.firstName || 'Engineer'}. Monitor your Kafka streams and observe delivery performance across all isolated workspaces.
            </p>

            <div className="mt-10 flex items-center gap-4">
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black hover:bg-gray-200 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]">
                Create New Project
                </button>
                <button onClick={() => navigate("/docs")} className="rounded-2xl border border-white/10 px-8 py-4 text-sm font-bold text-gray-300 hover:bg-white/5 transition-all">
                API Reference
                </button>
            </div>
            </div>
        </section>

        {/* ================= WORKSPACE GRID ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* -------- LEFT: PROJECTS -------- */}
            <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Workspace Environments</h3>
                <div className="h-px flex-1 mx-4 bg-white/5" />
            </div>

            {projects.length === 0 ? (
                <div className="group relative rounded-[2rem] border border-dashed border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-20 text-center transition-all hover:border-purple-500/30">
                
                {/* CUSTOM FORGE SVG ILLUSTRATION */}
                <div className="mx-auto mb-8 w-28 h-28 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full group-hover:bg-purple-500/30 transition-all" />
                    <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-gray-400 group-hover:text-purple-400 transition-colors duration-500">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"/>
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">No active projects detected</h3>
                <p className="mt-3 max-w-sm mx-auto text-sm leading-relaxed text-gray-500 font-medium">
                    Initialize a project to generate a dedicated Kafka topic and begin routing traffic.
                </p>

                <button onClick={() => setShowCreateModal(true)} className="mt-10 rounded-2xl bg-purple-600 px-10 py-4 text-sm font-bold text-white hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] active:scale-95 transition-all">
                    Create First Project
                </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {projects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick} 
                        />
                    ))}
                </div>
            )}
            </div>

            {/* -------- RIGHT: INFRASTRUCTURE INSIGHTS -------- */}
            <div className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Protocol Status</h3>

            <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 space-y-6">
                <InfrastructureItem icon="⚡" label="Ingestion Engine" status="Standby" />
                <InfrastructureItem icon="📡" label="Kafka Cluster" status="Optimal" />
                <InfrastructureItem icon="🛡️" label="Identity Gateway" status="Active" />
                <InfrastructureItem icon="📦" label="Storage Layers" status="Synchronized" />
            </div>
            
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 p-8">
                <h3 className="text-sm font-bold text-purple-200">System Throughput</h3>
                <p className="mt-2 text-xs text-purple-300/70 leading-relaxed font-medium">
                Scale your clusters horizontally to handle millions of concurrent delivery events with zero lag.
                </p>
                <button onClick={() => navigate("/pricing")} className="mt-6 w-full rounded-2xl bg-white py-3 text-xs font-bold text-black hover:bg-gray-200 transition-all">
                Scale Infrastructure
                </button>
            </div>
            </div>
        </section>

        {/* ================= BOTTOM METRICS FOOTER ================= */}
        <section className="rounded-[2.5rem] border border-white/5 bg-[#050505] p-10 flex flex-col md:flex-row gap-12 shadow-2xl relative overflow-hidden">
            {/* Visual background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[80px] pointer-events-none" />

            <div className="flex-1">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 flex items-center gap-2">
                    <Activity size={12} className="text-purple-500" />
                    Delivery Architecture
                </h4>
                <div className="grid grid-cols-2 gap-10">
                    <Metric 
                        title="Network Identities" 
                        // Dynamic Project Count
                        value={projects?.length || "0"} 
                        subtitle="Active platform nodes" 
                    />
                    <Metric 
                        title="Transmission Volume" 
                        // Dynamic Lifetime Total
                        value={individualEmailStats?.total || "0"} 
                        subtitle="Ingested email payloads" 
                    />
                </div>
            </div>
            
            <div className="flex-1 border-t md:border-t-0 md:border-l border-white/5 pt-12 md:pt-0 md:pl-12">
                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-600 mb-8 flex items-center gap-2">
                    <Terminal size={12} className="text-purple-500" />
                    System Runtime
                </h4>
                <div className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                    {/* Real-time Loading Status */}
                    <div className="flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span className={loading ? 'text-amber-500/80' : 'text-slate-400'}>
                            {loading ? "Synchronizing Cluster..." : "System Integrity: Optimal"}
                        </span>
                    </div>

                    {/* Real-time Auth Status */}
                    <div className="flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                        <span className="text-slate-400">Vault Protocol Active (v2.4.1)</span>
                    </div>

                    {/* Success/Error Feedback */}
                    {individualEmailStats?.failed > 0 && (
                        <div className="flex items-center gap-3 text-red-500/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>{individualEmailStats.failed} Drop incidents detected</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
            {/* ✅ CREATE PROJECT MODAL */}
            {showCreateModal && (
                <CreateProjectModal onClose={() => setShowCreateModal(false)} />
            )}
            {/* ✅ EDIT PROJECT MODAL */}
            {showEditModal && currentProject && (
                <EditProjectModal
                    project={currentProject}
                    onClose={() => setShowEditModal(false)}
                />
            )}
            {/* ✅ DELETE PROJECT MODAL */}
            {showDeleteModal && currentProject && (
                <DeleteProjectModal
                    project={currentProject}
                    onClose={() => setShowDeleteModal(false)}
                    onDeleted={() => navigate("/dashboard")}
                />
            )}
        </div>
        
    );
    };

    // --- Helper Components ---
    const InfrastructureItem = ({ icon, label, status }) => (
    <div className="flex items-center justify-between group cursor-default">
        <div className="flex items-center gap-3">
        <span className="grayscale group-hover:grayscale-0 transition-all">{icon}</span>
        <span className="text-xs font-bold text-gray-400 group-hover:text-gray-200 transition-all">{label}</span>
        </div>
        <span className="text-[10px] font-black text-gray-600 uppercase">{status}</span>
    </div>
    );

    const Metric = ({ title, value }) => (
    <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
    );



export default Dashboard;