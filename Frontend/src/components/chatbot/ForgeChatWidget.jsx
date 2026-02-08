import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Send, Sparkles, GripHorizontal } from "lucide-react";
import { useForgeChat } from "@/context/ForgeChatContext";

export default function ForgeChatWidget() {
  const { isOpen, isDestroyed, closeChat, openChat, destroyChat } = useForgeChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef(null);
  const containerRef = useRef(null); // For drag constraints

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

    const send = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", text: input };
        setMessages(m => [...m, userMsg]);
        setInput("");
        setLoading(true);

        try {
        const res = await fetch("https://mail-forge.me/api/ai/chat", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" ,
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ message: input })
        });
        const data = await res.json();
        console.log("AI Reply:", data);
        setMessages(m => [...m, { role: "bot", text: data.reply }]);
        } catch {
        setMessages(m => [...m, { role: "bot", text: "Forge is temporarily offline." }]);
        }
        setLoading(false);
    };

  if (isDestroyed) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      {/* FLOATING BUBBLE */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            drag
            dragConstraints={containerRef}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openChat}
            className="pointer-events-auto absolute right-6 bottom-6 w-16 h-16 rounded-2xl border border-purple-950 shadow-[0_0_30px_rgba(147,51,234,0.3)] flex items-center justify-center text-white border border-white/20 group cursor-grab active:cursor-grabbing"
          >
            <div className="relative pointer-events-none">
              <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform text-purple-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#050505]" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CHAT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag
            dragListener={false} // Only drag via the header handle
            dragControls={undefined} // Framer handles this via dragListener:false + child drag
            dragMomentum={false}
            dragConstraints={containerRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            // Setting default position to bottom right
            style={{ position: 'absolute', right: 24, bottom: 24 }}
            className="pointer-events-auto w-[calc(100vw-48px)] sm:w-[400px] h-[700px] max-h-[95vh] bg-[#0A0A0B]/95 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* DRAGGABLE HEADER */}
            <motion.div 
              drag
              dragControls={undefined} // This becomes the handle
              className="flex justify-between items-center p-5 border-b border-white/5 bg-white/5 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-3 pointer-events-none">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-purple-600 border border-gray-400">
                  F
                </div>
                <div>
                  <h3 className="text-purple-600 font-bold text-sm leading-none flex items-center gap-2">
                    Forge AI 
                  </h3>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={closeChat} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"><Minus size={18} /></button>
                <button onClick={destroyChat} className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-slate-400 transition-colors"><X size={18} /></button>
              </div>
            </motion.div>

            {/* MESSAGES */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                  <Sparkles size={28} className="text-purple-500 mb-2" />
                  <p className="text-sm text-slate-300">Initialized. Awaiting input...</p>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 italic px-2">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce" />
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* INPUT */}
            <div className="p-5 border-t border-white/5 bg-white/5">
              <div className="relative flex items-center gap-2 bg-black/50 border border-white/10 rounded-2xl p-1.5 focus-within:border-purple-500/50 transition-all">
                <input
                  value={input}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-white placeholder:text-slate-500"
                  placeholder="Ask Forge anything..."
                />
                <button 
                  onClick={send} 
                  disabled={!input.trim() || loading}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 p-2.5 rounded-xl text-white transition-all shadow-lg shadow-purple-900/20"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}