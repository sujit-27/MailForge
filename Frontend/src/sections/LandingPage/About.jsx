import React from 'react';
import { Terminal, Cpu, Zap, Globe, Github, Linkedin, Mail } from 'lucide-react';
import Logo from '@/components/LandingPage/Logo';
import Admin from '../../assets/Founder.jpeg'

export default function About() {
  return (
    <div className="min-h-screen bg-[#020202] text-slate-400 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        
        {/* HERO SECTION */}
        <header className="max-w-3xl mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-8">
            <Terminal size={12} /> <span>The Mission</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
            We build the <span className="text-indigo-500">pipes</span> for the internet's most critical messages.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-light">
            MailForge was born out of a simple frustration: email infrastructure shouldn't be a black box. 
            We've built a delivery engine that developers actually trust, combining low-level control 
            with high-level intelligence.
          </p>
        </header>

        {/* THE CORE PHILOSOPHY - GRID */}
        <section className="grid md:grid-cols-3 gap-1 shadow-[0_0_1px_rgba(255,255,255,0.1)] bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden mb-40">
          <PhilosophyCard 
            icon={Zap} 
            title="Performance-First" 
            desc="Every millisecond matters. Our Kafka-backed pipeline ensures your API calls return in under 200ms, regardless of load."
          />
          <PhilosophyCard 
            icon={Cpu} 
            title="Intelligent Routing" 
            desc="We don't just send; we optimize. Our AI agents monitor deliverability scores in real-time to pick the cleanest path."
          />
          <PhilosophyCard 
            icon={Globe} 
            title="Radical Privacy" 
            desc="Your data is your own. We implement strict zero-trust protocols and multi-region data residency by default."
          />
        </section>

        {/* THE FOUNDER SECTION - RELATABLE */}
        <section className="grid md:grid-cols-2 gap-20 items-center mb-40">
          <div className="relative group">
             {/* Founder Image Mockup */}
             <div className="aspect-square rounded-2xl bg-gradient-to-br from-slate-800 to-black border border-white/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Replace with actual image */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-slate-900">
                    {/* Professional Overlay Gradient to blend the bottom of the photo into the card */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020202] via-transparent to-transparent opacity-60" />
                    
                    <img 
                        src={Admin} 
                        alt="Sujit Kumar Shaw - Founder" 
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    
                    {/* Subtle Grain/Noise Overlay to give it a high-end textured look */}
                    <div className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                </div>
             </div>
             {/* Floating Badge */}
             <div className="absolute -bottom-6 -right-6 bg-[#0A0A0A] border border-white/10 p-6 rounded-2xl shadow-2xl">
                <p className="text-white font-bold text-lg leading-tight">Sujit Kumar Shaw</p>
                <p className="text-indigo-400 text-xs font-mono uppercase tracking-widest mt-1">Founder & Lead Architect</p>
             </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white tracking-tight">Built by a developer, for developers.</h3>
            <p className="leading-relaxed">
              As a B.Tech IT student at KGEC, I spent countless nights debugging SMTP timeouts and broken templates. 
              I realized that while the web had evolved, email infrastructure was still stuck in the early 2000s.
            </p>
            <p className="leading-relaxed text-slate-500">
              MailForge is my solution to that problem. It's a platform where your code dictates the delivery, 
              not the other way around. We're building this in the open, with a focus on raw power and 
              elegant simplicity.
            </p>
            <div className="flex gap-4 pt-4">
               <SocialLink Icon={Github} href="https://github.com/sujit-27" />
               <SocialLink Icon={Linkedin} href="https://www.linkedin.com/in/sujit-kumar-shaw" />
               <SocialLink Icon={Mail} href="mailto:sujitshaw029@gmail.com" />
            </div>
          </div>
        </section>

        {/* TECH STACK VISUAL - RELATABLE TO ENGINEERS */}
        <section className="pt-20 border-t border-white/5">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] text-center mb-12">Engineered with precision</p>
           <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <StackItem name="Spring Boot" />
              <StackItem name="Apache Kafka" />
              <StackItem name="React" />
              <StackItem name="TailwindCSS" />
              <StackItem name="PostgreSQL" />
           </div>
        </section>

      </main>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

const PhilosophyCard = ({ icon: Icon, title, desc }) => (
  <div className="p-10 border-r border-b border-white/5 last:border-r-0 hover:bg-white/[0.01] transition-colors group">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-500">
      <Icon size={24} className="text-indigo-400" />
    </div>
    <h4 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h4>
    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const SocialLink = ({ Icon, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 text-slate-400 hover:text-indigo-400 transition-all"
  >
    <Icon size={18} />
  </a>
);

const StackItem = ({ name }) => (
  <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
    {name}
  </span>
);