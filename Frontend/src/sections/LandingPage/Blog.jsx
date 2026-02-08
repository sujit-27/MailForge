import React from 'react';
import { Calendar, Clock, ArrowRight, Tag, Search, Filter } from 'lucide-react';

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#020202] text-slate-400 font-sans selection:bg-indigo-500/30">
      {/* MESH BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#1d1d1d,transparent)] pointer-events-none" />

      <main className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        
        {/* HEADER & FILTER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-bold text-white tracking-tighter mb-6 leading-none">
              Engineering <span className="text-indigo-500">Updates.</span>
            </h1>
            <p className="text-xl text-slate-500 font-light">
              Deep dives into email infrastructure, Kafka scaling, and AI delivery patterns.
            </p>
          </div>
          
          {/* SEARCH BAR */}
          <div className="relative group w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>
        </header>

        {/* FEATURED POST */}
        <section className="mb-24">
          <div className="group relative grid lg:grid-cols-2 gap-12 p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all overflow-hidden cursor-pointer">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <LogoBackground />
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-indigo-400">
                <span className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">Case Study</span>
                <span className="flex items-center gap-1.5"><Calendar size={12}/> Feb 03, 2026</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                Scaling to 10M Emails/Day: Lessons from our Kafka Cluster Migration.
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                How we re-architected our delivery pipeline to handle massive bursts while maintaining sub-second latency for transactional receipts.
              </p>
              <div className="flex items-center gap-6 pt-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                    <span className="text-white">Sujit Kumar Shaw</span>
                </div>
                <span className="flex items-center gap-1.5 text-slate-600"><Clock size={14}/> 12 min read</span>
              </div>
            </div>

            <div className="relative rounded-3xl bg-black border border-white/10 p-6 font-mono text-xs overflow-hidden hidden lg:block">
                <div className="absolute inset-0 bg-indigo-500/5 blur-3xl" />
                <code className="relative z-10 text-indigo-200">
                    {`// Optimized Kafka Producer Logic
public void dispatch(EmailEvent event) {
  ProducerRecord<String, String> record = 
    new ProducerRecord<>("mailforge.outbound", event.getId(), event.toJson());
    
  kafkaTemplate.send(record).addCallback(
    result -> log.info("Message persisted at: " + result.getRecordMetadata().offset()),
    ex -> handleFailure(ex, event)
  );
}`}
                </code>
            </div>
          </div>
        </section>

        {/* POST GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PostCard 
            tag="Engineering"
            title="Introduction to AI Template Generation"
            desc="Leveraging Large Language Models to craft emails that convert better and look great."
            date="Jan 28"
            read="5 min"
          />
          <PostCard 
            tag="Security"
            title="Securing Your API Keys in Production"
            desc="Best practices for environment variable management and rotating production secrets."
            date="Jan 22"
            read="4 min"
          />
          <PostCard 
            tag="Product"
            title="Announcing MailForge Pro Plans"
            desc="Scaling your infrastructure? Here is what's included in our latest tier for growth teams."
            date="Jan 15"
            read="3 min"
          />
        </div>

      </main>

      {/* NEWSLETTER */}
      <footer className="bg-indigo-600/10 border-t border-white/5 py-24 px-6 text-center">
         <div className="max-w-xl mx-auto space-y-8">
            <h3 className="text-3xl font-bold text-white tracking-tight">Stay ahead of the curve.</h3>
            <p className="text-slate-400">Join 5,000+ developers receiving monthly engineering updates on email infrastructure.</p>
            <form className="flex gap-2">
                <input type="email" placeholder="email@company.com" className="flex-1 bg-black border border-white/10 rounded-xl px-4 text-sm focus:border-indigo-500 outline-none transition-all" />
                <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-indigo-500 hover:text-white transition-all">Subscribe</button>
            </form>
         </div>
      </footer>
    </div>
  );
}

/* --- COMPONENTS --- */

const PostCard = ({ tag, title, desc, date, read }) => (
  <article className="group p-8 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all cursor-pointer flex flex-col">
    <div className="flex justify-between items-start mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 px-2 py-1 rounded bg-indigo-500/5 border border-indigo-500/10">{tag}</span>
        <span className="text-[10px] text-slate-600 font-bold uppercase">{date}</span>
    </div>
    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-400 transition-colors leading-tight">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed mb-8 flex-1">{desc}</p>
    <div className="flex items-center justify-between pt-6 border-t border-white/5">
        <span className="text-xs text-slate-600 flex items-center gap-1.5"><Clock size={12}/> {read}</span>
        <ArrowRight size={16} className="text-slate-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </div>
  </article>
);

const LogoBackground = () => (
    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-500">
        <path d="m22 7-10 5L2 7l10-5 10 5Z" />
        <path d="m2 17 10 5 10-5" />
        <path d="m2 12 10 5 10-5" />
    </svg>
);