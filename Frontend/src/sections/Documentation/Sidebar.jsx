import React from 'react';
import { 
  Book, Activity, Rocket, Key, Mail, 
  Layers, Cpu, AlertTriangle, Shield, 
  ChevronRight, Zap 
} from "lucide-react";
import Logo from '@/components/LandingPage/Logo';

const Sidebar = ({ active, scrollTo }) => {
  return (
    <aside className="w-72 sticky top-0 h-screen hidden xl:flex flex-col border-r border-white/[0.06] bg-[#050505]/60 backdrop-blur-xl py-8 px-6 overflow-hidden">
      
      {/* BRAND SECTION */}
      <div className="mb-10 px-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className='flex flex-col'>
            <Logo/>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5 font-mono">
              Developer Docs
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION SECTION WITH CUSTOM SCROLLBAR */}
      <nav className="flex-1 overflow-y-auto pr-2 space-y-9 group/nav custom-scrollbar">
        <div className="pb-8"> {/* Bottom padding for scroll breathing room */}
          <NavGroup title="Getting Started">
            <Nav icon={Book} k="intro" label="Introduction" active={active} go={scrollTo}/>
            <Nav icon={Activity} k="architecture" label="Architecture" active={active} go={scrollTo}/>
            <Nav icon={Rocket} k="quick" label="Quick Start" active={active} go={scrollTo}/>
          </NavGroup>

          <NavGroup title="Core API Reference">
            <Nav icon={Key} k="auth" label="Authentication" active={active} go={scrollTo}/>
            <Nav icon={Mail} k="send" label="Send Email" active={active} go={scrollTo}/>
            <Nav icon={Layers} k="templates" label="Templates" active={active} go={scrollTo}/>
            <Nav icon={Cpu} k="ai" label="AI Templates" active={active} go={scrollTo}/>
          </NavGroup>

          <NavGroup title="Operations">
            <Nav icon={Activity} k="delivery" label="Delivery Status" active={active} go={scrollTo}/>
            <Nav icon={AlertTriangle} k="errors" label="Error Handling" active={active} go={scrollTo}/>
            <Nav icon={Shield} k="security" label="Security" active={active} go={scrollTo}/>
          </NavGroup>
        </div>
      </nav>

      {/* FOOTER CALLOUT */}
        <p className="text-[11px] text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
            Use <span className="text-slate-300">Idempotency Keys</span> in your API headers to safely retry requests without sending duplicate emails.
        </p>

      {/* INLINE CSS FOR PREMIUM SCROLLBAR */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.15); /* Indigo tint */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </aside>
  );
};

/* ================= HELPER COMPONENTS ================= */

const NavGroup = ({ title, children }) => (
  <div className="flex flex-col mb-8 last:mb-0">
    <div className="flex items-center gap-2 mb-3 px-3">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">
        {title}
      </h3>
      <div className="h-px w-full bg-white/[0.03]" />
    </div>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const Nav = ({ icon: Icon, label, k, active, go }) => {
  const isActive = active === k;
  return (
    <button
      onClick={() => go(k)}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 group
        ${isActive 
          ? "bg-indigo-600/10 text-white font-semibold shadow-[inset_0_0_12px_rgba(79,70,229,0.05)]" 
          : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]"
        }`}
    >
      {isActive && (
        <div className="absolute left-[-24px] w-1.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_20px_rgba(79,70,229,0.8)]" />
      )}
      <Icon size={16} className={isActive ? "text-indigo-400" : "group-hover:text-slate-400"} />
      <span className="text-[13px] tracking-tight">{label}</span>
      {isActive && (
        <ChevronRight size={12} className="ml-auto text-indigo-500/50 animate-in slide-in-from-left-1 duration-300" />
      )}
    </button>
  );
};

export default Sidebar;