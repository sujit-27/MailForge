import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SendEmail = () => {
  const { items: projects } = useSelector((state) => state.projects);
  const navigate = useNavigate();

  // State for Search and Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-new"); // date-new, date-old, name-asc

  // Memoized Filter and Sort Logic
  const filteredProjects = useMemo(() => {
    let result = projects.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "date-new") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "date-old") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [projects, searchTerm, sortBy]);

  return (
    <div className="mr-6 space-y-6 py-6 animate-in fade-in duration-500">
      {/* ================= TOP SEARCH & FILTER BAR ================= */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0a0a] border border-white/5 p-4 rounded-2xl shadow-xl">
        <div className="relative w-full md:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </span>
          <input
            type="text"
            placeholder="Search projects by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-300 outline-none focus:border-purple-500 transition-all cursor-pointer"
          >
            <option value="date-new">Newest Created</option>
            <option value="date-old">Oldest Created</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>
        </div>
      </header>

      {/* ================= PROJECT ROWS SECTION ================= */}
      <section className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">S.No</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Project Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date Provisioned</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => (
                  <tr 
                    key={project.id} 
                    className="group hover:bg-purple-500/[0.02] transition-colors cursor-default"
                  >
                    <td className="px-8 py-6 text-sm font-mono text-gray-600">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => navigate(`/send-email/${project.id}`)}
                        className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors"
                      >
                        {project.name}
                      </button>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter truncate max-w-[200px]">
                        {project.description || "Infrastructure Node"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xs text-gray-400 font-medium">
                        {new Date(project.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => navigate(`/send-email/${project.id}`)}
                        className="rounded-lg bg-purple-600/10 border border-purple-500/20 px-4 py-2 text-[10px] font-black text-purple-400 hover:bg-purple-600 hover:text-white transition-all active:scale-95"
                      >
                        SELECT PROJECT
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 10l4 4m0-4l-4 4m-7 1a9 9 0 1118 0 9 9 0 01-18 0z"/></svg>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">No projects match your search criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= INFO FOOTER ================= */}
      <footer className="px-4 flex items-center gap-2">
         <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
         <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            {filteredProjects.length} Infrastructure Pipelines Available
         </p>
      </footer>
    </div>
  );
};

export default SendEmail;