import React, { useState } from 'react';
import { 
  Plus, Minus, Search, MessageSquare, 
  Terminal, ShieldCheck, Zap, HelpCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();

  const faqData = [
    {
      category: "Integration",
      question: "How do I authenticate my API requests?",
      answer: "MailForge uses Header-based authentication. You must include your 'X-API-KEY' in the header of every request. You can find your keys in the Project Settings tab of your dashboard. Never expose these keys in client-side code."
    },
    {
      category: "Delivery",
      question: "What is the difference between 'QUEUED' and 'DELIVERED' status?",
      answer: "QUEUED means your request has been safely persisted in our Kafka cluster and is awaiting dispatch. DELIVERED confirms that our upstream provider (e.g., Brevo) has accepted the message and initiated handoff to the recipient's inbox."
    },
    {
      category: "Intelligence",
      question: "How does the AI Template generation work?",
      answer: "Our AI analysis engine takes a natural language prompt and generates a structured JSON payload containing a subject line, HTML body, and dynamic variable placeholders. This is available on Pro and Enterprise plans."
    },
    {
      category: "Billing",
      question: "What happens if I exceed my monthly send quota?",
      answer: "Once you hit your limit, the API will return a 429 (Too Many Requests) error. We offer a 5% grace buffer for production environments, but we recommend setting up auto-top-ups or upgrading to a higher tier to avoid service interruption."
    },
    {
      category: "Security",
      question: "Is MailForge GDPR compliant?",
      answer: "Yes. We offer data residency options in the EU, US, and Asia. We also provide automatic PII masking for email logs and a 30-day retention policy by default."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020202] text-slate-400 font-sans selection:bg-indigo-500/30">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1e1e,transparent)] pointer-events-none" />

      <main className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        
        {/* HEADER */}
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <HelpCircle size={12} /> <span>Knowledge Base</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-6">
            Common <span className="text-indigo-500 italic font-serif font-normal">Questions.</span>
          </h1>
          <p className="text-lg text-slate-500 font-light">
            Everything you need to know about building with MailForge.
          </p>
        </header>

        {/* FAQ ACCORDION */}
        <div className="space-y-4 mb-20">
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              {...item}
            />
          ))}
        </div>

        {/* HELP SECTION */}
        <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group">
                <MessageSquare className="text-indigo-400 mb-4" />
                <h4 className="text-white font-bold mb-2">Can't find the answer?</h4>
                <p className="text-sm text-slate-500 mb-6">Our engineering team is available for deep technical support via Discord or Email.</p>
                <button onClick={() => navigate("/contact")} className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2 group-hover:text-indigo-400 transition-colors">
                    Contact Support <Plus size={14} />
                </button>
            </div>
            
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group">
                <Terminal className="text-indigo-400 mb-4" />
                <h4 className="text-white font-bold mb-2">Check the Status</h4>
                <p className="text-sm text-slate-500 mb-6">Before troubleshooting, check if our delivery systems are operating normally.</p>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Operational</span>
                </div>
            </div>
        </div>
      </main>

      {/* SUBTLE FOOTER */}
      <footer className="py-20 text-center border-t border-white/5 opacity-40">
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase">MailForge Infrastructure Docs • 2026</p>
      </footer>
    </div>
  );
}

/* --- COMPONENTS --- */

const AccordionItem = ({ category, question, answer, isOpen, onClick }) => (
  <div 
    className={`rounded-2xl border transition-all duration-300 overflow-hidden
      ${isOpen ? "bg-white/[0.04] border-indigo-500/30 shadow-2xl" : "bg-white/[0.01] border-white/5 hover:border-white/10"}`}
  >
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 text-left outline-none"
    >
      <div className="space-y-1">
        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">{category}</span>
        <h3 className={`text-base font-bold transition-colors ${isOpen ? "text-white" : "text-slate-300"}`}>
          {question}
        </h3>
      </div>
      <div className={`shrink-0 ml-4 p-2 rounded-full transition-transform duration-300 ${isOpen ? "bg-indigo-500 text-white rotate-180" : "text-slate-600 bg-white/5"}`}>
        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
      </div>
    </button>
    
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
      <div className="px-6 pb-8 text-sm leading-relaxed text-slate-500 border-t border-white/5 pt-4">
        {answer}
      </div>
    </div>
  </div>
);