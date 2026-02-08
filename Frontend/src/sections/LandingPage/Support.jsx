import React from 'react';
import { 
  Search, LifeBuoy, MessageCircle, FileText, 
  Terminal, ShieldQuestion, ArrowRight, ExternalLink, 
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Support() {

    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#020202] text-slate-400 font-sans selection:bg-indigo-500/30">
        
        {/* GRID BACKGROUND */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

        <main className="max-w-6xl mx-auto px-6 py-24 relative z-10">
            
            {/* HERO / SEARCH */}
            <header className="text-center max-w-2xl mx-auto mb-20">
            <h1 className="text-5xl font-bold text-white tracking-tighter mb-6">
                How can we <span className="text-indigo-500 font-serif italic font-normal">help?</span>
            </h1>
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                type="text" 
                placeholder="Search documentation, error codes, or FAQs..." 
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all"
                />
            </div>
            </header>

            {/* RESOURCE TILES */}
            <section className="grid md:grid-cols-3 gap-6 mb-20">
            <ResourceCard 
                icon={FileText} 
                title="Documentation" 
                desc="Deep dives into our API, SDKs, and integration patterns." 
                link="/docs"
            />
            <ResourceCard 
                icon={Terminal} 
                title="API Reference" 
                desc="Detailed endpoint specs and interactive code examples." 
                link="/docs"
            />
            <ResourceCard 
                icon={ShieldQuestion} 
                title="FAQ" 
                desc="Quick answers to common questions about billing and delivery." 
                link="/faq"
            />
            </section>

            {/* "STILL NEED HELP" SECTION (The Contact Part) */}
            <section className="grid lg:grid-cols-2 gap-8 items-stretch">
            
            {/* COMMUNITY SUPPORT */}
            <div className="p-8 rounded-3xl bg-indigo-600/5 border border-indigo-500/10 flex flex-col justify-between">
                <div>
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                    <Users size={20} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Community Support</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    Ask questions and share knowledge with 2,000+ developers in our Discord. 
                    Perfect for architectural advice.
                </p>
                </div>
                <button className="flex items-center justify-between w-full p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all group">
                Join Discord <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* DIRECT SUPPORT */}
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                <div>
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                    <MessageCircle size={20} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Direct Support</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    Can't find what you're looking for? Our engineering team is available 
                    for direct technical inquiries and high-priority issues.
                </p>
                </div>
                <button onClick={() => navigate("/contact")} className="flex items-center justify-between w-full p-4 border border-white/10 hover:bg-white/5 text-white rounded-xl font-bold transition-all group">
                Email Support <ExternalLink size={18} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            </section>

        </main>

        {/* QUICK STATUS FOOTER */}
        <footer className="py-12 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">All systems operational</span>
            </div>
            <p className="text-[10px] text-slate-600 font-mono">MailForge v1.4.2 Support Engine</p>
            </div>
        </footer>
        </div>
    );
}

/* --- COMPONENTS --- */

const ResourceCard = ({ icon: Icon, title, desc, link }) => (
    <a href={link} className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.03] transition-all group">
        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-500">
        <Icon size={24} className="text-indigo-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{desc}</p>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
        Explore <ArrowRight size={14} />
        </div>
    </a>
);