import React from 'react';
import { Heart, ShieldCheck, Coffee, Code2, Users2, MessageCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Human() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#020202] text-slate-400 font-sans selection:bg-purple-500/30 overflow-x-hidden">
        
        {/* THE GRID SYSTEM - Matches your Docs/About pages */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* BLOOM EFFECT */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-500/10 blur-[120px] pointer-events-none opacity-50" />

        <main className="max-w-6xl mx-auto px-6 py-32 relative z-10">
            
            {/* HERO SECTION */}
            <header className="max-w-4xl mb-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                <Heart size={12} className="fill-purple-400/20" /> <span>Protocol: Human_Empathy</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-10 leading-[0.85]">
                Engineered with <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">
                purpose.
                </span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-500 leading-relaxed font-light">
                In an industry obsessed with abstraction, we choose connection. 
                MailForge is the intersection of <span className="text-slate-300">hardened code</span> and <span className="text-slate-300">human accountability</span>.
            </p>
            </header>

            {/* CORE VALUES GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-3xl overflow-hidden mb-40 shadow-2xl">
            <FeatureCard 
                icon={Users2}
                title="Dev-to-Dev"
                desc="You talk to the people who built the API. No scripted responses, just engineering solutions."
            />
            <FeatureCard 
                icon={ShieldCheck}
                title="Ethical Rails"
                desc="We provide the tools, but we also uphold the standards. Clean inboxes are a human right."
            />
            <FeatureCard 
                icon={Coffee}
                title="Shared Burden"
                desc="We've been in the trenches. Our uptime is your sanity. We take that responsibility personally."
            />
            <FeatureCard 
                icon={Code2}
                title="Craftsmanship"
                desc="Code is our medium. We treat every endpoint like a piece of functional art."
            />
            </div>

            {/* THE MANIFESTO BLOCK */}
            <div className="grid lg:grid-cols-5 gap-12 items-center mb-32">
            <div className="lg:col-span-3 space-y-8">
                <h3 className="text-3xl font-bold text-white tracking-tight">Machines send the mail. <br/>Humans build the trust.</h3>
                <div className="space-y-6 text-lg leading-relaxed text-slate-400 font-light italic">
                <p>
                    "We realized early on that developers don't just want a reliable delivery service; they want to know that if things go wrong, there is a human on the other side who understands the gravity of a dropped notification."
                </p>
                </div>
                <div className="flex gap-6">
                    <button onClick={() => navigate("/docs")} className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-purple-700 hover:text-white transition-all group">
                        Explore <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
            
            {/* A "Status" UI Element to make it feel technical */}
            <div className="lg:col-span-2 p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
                <div className="flex flex-col gap-6">
                    <StatusItem label="Direct Engineering Access" value="Enabled" color="text-emerald-500" />
                    <StatusItem label="Response Empathy Level" value="100%" color="text-rose-500" />
                    <StatusItem label="Average Human Response" value="< 2 Hours" color="text-indigo-500" />
                    <div className="pt-4 border-t border-white/5 mt-2">
                        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">Current Active Engineers</p>
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020202] bg-gradient-to-br from-slate-700 to-slate-900" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            </div>

        </main>

        {/* FOOTER */}
        <footer className="py-20 text-center border-t border-white/5 relative z-10">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-slate-600">
                Authenticated • Handcrafted by Humans
            </p>
        </footer>
        </div>
    );
}

/* --- COMPONENTS --- */

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-10 bg-[#050505] hover:bg-[#080808] transition-colors group">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-rose-500/10 transition-all duration-500">
      <Icon size={24} className="text-purple-400" />
    </div>
    <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const StatusItem = ({ label, value, color }) => (
    <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className={`text-xs font-bold font-mono uppercase ${color}`}>{value}</span>
    </div>
);