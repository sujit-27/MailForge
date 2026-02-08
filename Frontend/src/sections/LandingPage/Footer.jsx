import { useState } from "react";
import Logo from "../../components/LandingPage/Logo";
import { Github, Twitter, Linkedin, Youtube, Instagram, ExternalLink, Globe } from "lucide-react";

export default function Footer() {
  const [devMsg, setDevMsg] = useState("");

  // Simple trigger function
  const triggerDev = (msg = "Under Development") => {
    setDevMsg(msg);
    setTimeout(() => setDevMsg(""), 2000);
  };

  return (
    <footer className="relative bg-[#0b0b0b] text-gray-400 overflow-hidden border border-white/10 shadow-[0_0_40px_-10px_rgba(139,92,241,0.2)]">
      {/* STATUS TEXT TRIGGER */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-500 z-[100]
        ${devMsg ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,1)]" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-400">
            {devMsg}
          </span>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0b0b0b]/90 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Logo size="small" />
            <p className="text-sm text-gray-500 leading-relaxed">
              The developer-first email engine for modern high-growth applications.
            </p>
            <p className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">
              San Francisco • India
            </p>

            <div className="flex gap-3 pt-4">
              <SocialIcon href="https://github.com/sujit-27" icon={Github} />
              <SocialIcon href="https://www.linkedin.com/in/sujit-kumar-shaw" icon={Linkedin} />
              <SocialIcon onClick={() => triggerDev("Social coming soon")} icon={Instagram} />
              <SocialIcon href="https://dev-with-me-eight.vercel.app/" icon={Globe} />
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm tracking-tight">Documentation</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/docs" label="Getting Started" />
              <FooterLink href="/docs" label="API Reference" />
              <FooterLink onClick={() => triggerDev()} label="Interactive Examples" />
              <FooterLink onClick={() => triggerDev()} label="Official SDKs" />
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm tracking-tight">Company</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/about" label="About" />
              <FooterLink href="/blog" label="Blog" />
              <FooterLink href="humans" label="Humans" />
              <FooterLink href="/contact" label="Contact" />
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm tracking-tight">Legal</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink onClick={() => triggerDev("Reviewing Policy")} label="Privacy Policy" />
              <FooterLink onClick={() => triggerDev("Updating Terms")} label="Terms of Service" />
              <FooterLink onClick={() => triggerDev()} label="Cookie Policy" />
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 font-medium">
            © 2026 MailForge. Built by <span className="text-gray-400">Sujit Kumar Shaw</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">All Systems Live</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-t from-purple-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
    </footer>
  );
}

/* --- REUSABLE SUB-COMPONENTS --- */

const FooterLink = ({ label, href, onClick }) => (
  <li>
    {onClick ? (
      <button 
        onClick={onClick} 
        className="text-gray-500 hover:text-indigo-400 transition-colors duration-200"
      >
        {label}
      </button>
    ) : (
      <a 
        href={href} 
        className="text-gray-500 hover:text-white transition-colors duration-200"
      >
        {label}
      </a>
    )}
  </li>
);

const SocialIcon = ({ icon: Icon, href, onClick }) => (
  <button
    onClick={onClick ? onClick : () => window.open(href, "_blank")}
    className="bg-white/5 hover:bg-white/10 p-2 rounded-lg border border-white/10 transition-all hover:border-indigo-500/30 group"
  >
    <Icon className="h-4 w-4 text-gray-500 group-hover:text-indigo-400 transition-colors" />
  </button>
);