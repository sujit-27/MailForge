import { forwardRef, useRef, useState, useEffect } from "react";
import {
  Book, Rocket, Key, Mail, Layers, Cpu, AlertTriangle,
  Shield, Activity, Copy, Check, ChevronRight,
  MessageSquare, Github, ExternalLink, Sparkles,
  Link,
  Icon,
  Twitter,
  ExternalLinkIcon,
  ThumbsUp,
  ThumbsDown,
  Edit
} from "lucide-react";
import Sidebar from "../Documentation/Sidebar";
import { useNavigate } from "react-router-dom";

/* ========================= */

export default function Docs() {
  const keys = [
    "intro","architecture","quick","auth","send",
    "templates","ai","variables","delivery",
    "errors","limits","security","best"
  ];

  const sections = keys.reduce((a,k)=>{a[k]=useRef(null);return a;},{});
  const [active,setActive] = useState("intro");
  const navigate = useNavigate();

  const scrollTo = k => sections[k].current?.scrollIntoView({behavior:"smooth"});

  useEffect(()=>{
    const obs = new IntersectionObserver(
      entries=>{
        entries.forEach(e=> e.isIntersecting && setActive(e.target.id));
      },
      {rootMargin:"-35% 0px -55% 0px"}
    );
    keys.forEach(k=>sections[k].current && obs.observe(sections[k].current));
    return ()=>obs.disconnect();
  },[]);

  return (
<div className="min-h-screen bg-[#020202] text-slate-300 selection:bg-indigo-500/30">

<div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[520px] bg-indigo-500/5 blur-[120px] pointer-events-none"/>

<div className="flex max-w-[1600px] mx-auto">

{/* ================= LEFT SIDEBAR ================= */}

<Sidebar active={active} scrollTo={scrollTo}/>

{/* ================= CENTER CONTENT ================= */}

<main className="flex-1 px-8 md:px-16 py-16">
<div className="max-w-[760px] space-y-28">

<Section id="intro" ref={sections.intro} title="Production-Grade Email Infrastructure">
<p className="text-xl text-slate-400">
MailForge provides a reliable, scalable, developer-first email delivery API.
It combines async queue delivery, template engines, AI generation,
and quota enforcement so your application can send emails safely at scale.
</p>

<p>
Instead of connecting directly to SMTP, your system talks to MailForge API.
We validate, rate-limit, template-render, queue, retry, and dispatch — giving
you predictable behavior under load.
</p>

<FeatureGrid/>
</Section>

{/* ---------- ARCHITECTURE ---------- */}

<Section id="architecture" ref={sections.architecture} title="How the System Works">

<p>
MailForge is built on a microservice + event pipeline. Requests are accepted fast,
processed safely, and delivered asynchronously.
</p>

<Code lang="flow">
Client → Gateway → Email Service → Kafka → Consumer → Provider
</Code>

<ul className="list-disc ml-6 text-sm space-y-2">
<li>Gateway validates API key & plan</li>
<li>Quota service checks remaining allowance</li>
<li>Email service stores + queues</li>
<li>Kafka guarantees durability</li>
<li>Consumers handle retries & providers</li>
</ul>

</Section>

{/* ---------- QUICK START ---------- */}

<Section id="quick" ref={sections.quick} title="Quick Start — Send First Email">

<p>Step 1 — Create a project and copy your API key.</p>
<p>Step 2 — Send a POST request:</p>

<Code lang="bash">
{`curl -X POST https://api.mailforge.io/api/emails/v1/send \\
-H "X-API-KEY: proj_xxx" \\
-H "Content-Type: application/json" \\
-d '{
 "recipients":["user@mail.com"],
 "subject":"System Ready",
 "body":"MailForge integration successful"
}'`}
</Code>

<p>
Response is returned instantly with status <b>QUEUED</b>.
Delivery happens asynchronously.
</p>

</Section>

{/* ---------- AUTH ---------- */}

<Section id="auth" ref={sections.auth} title="Authentication Model">

<p>
Public API uses project API keys. Dashboard uses JWT. They are separate.
</p>

<Code lang="http">X-API-KEY: proj_xxxxxxxxx</Code>

<p className="text-sm text-slate-500">
Keys automatically map to user, project, and plan limits.
</p>

</Section>

{/* ---------- SEND ---------- */}

<Section id="send" ref={sections.send} title="Send Email Endpoint">

<Code lang="http">POST /api/emails/v1/send</Code>

<h4 className="text-white font-semibold">Raw Mode</h4>

<Code lang="json">
{`{
 "recipients":["user@mail.com"],
 "subject":"Welcome",
 "body":"Hello there"
}`}
</Code>

<h4 className="text-white font-semibold">Success Response</h4>

<Code lang="json">
{`{
 "status":"QUEUED",
 "mode":"RAW",
 "message":"Accepted for delivery"
}`}
</Code>

<p className="text-sm text-slate-500">
Do not expect immediate delivery confirmation — queue model is intentional.
</p>

</Section>

{/* ---------- TEMPLATES ---------- */}

<Section id="templates" ref={sections.templates} title="Template Engine">

<p>
Templates allow reusable subject/body with variable injection.
Ideal for scale.
</p>

<Code lang="json">
{`{
 "templateId":"welcome_v1",
 "recipients":["user@mail.com"],
 "variables":{"name":"Alex"}
}`}
</Code>

<ul className="list-disc ml-6 text-sm">
<li>Server-side render</li>
<li>Missing variables rejected</li>
<li>Ownership enforced</li>
</ul>

</Section>

{/* ---------- AI ---------- */}

<Section id="ai" ref={sections.ai} title="AI Template Generation">

<p>
AI can generate templates from prompts. Returned output must be previewed before saving.
</p>

<Code lang="json">
{`{
 "prompt":"Professional SaaS onboarding email"
}`}
</Code>

</Section>

{/* ---------- DELIVERY ---------- */}

<Section id="delivery" ref={sections.delivery} title="Delivery & Retry Behavior">

<ul className="list-disc ml-6 text-sm space-y-2">
<li>Kafka buffered</li>
<li>Retry with backoff</li>
<li>Idempotent send</li>
<li>Provider fallback ready</li>
</ul>

</Section>

{/* ---------- ERRORS ---------- */}

<Section id="errors" ref={sections.errors} title="Errors & Recovery">

<Code lang="text">
401 → Invalid key → check header
404 → Template missing → verify id
429 → Quota exceeded → upgrade plan
500 → Internal error → retry with backoff
</Code>

</Section>

{/* ---------- SECURITY ---------- */}

<Section id="security" ref={sections.security} title="Security Guidelines">

<ul className="list-disc ml-6 text-sm space-y-2">
<li>Never expose API keys client-side</li>
<li>Call from backend only</li>
<li>Rotate keys regularly</li>
<li>Monitor usage logs</li>
</ul>

</Section>

{/* ---------- BEST ---------- */}

<Section id="best" ref={sections.best} title="Integration Best Practices">

<ul className="list-disc ml-6 text-sm space-y-2">
<li>Prefer templates</li>
<li>Validate variables</li>
<li>Handle QUEUED status</li>
<li>Log request IDs</li>
</ul>

</Section>

</div>
</main>

{/* ================= RIGHT SIDEBAR ================= */}

<aside className="w-80 sticky top-0 h-screen hidden 2xl:flex flex-col py-16 px-8 border-l border-white/[0.05] bg-[#020202]">
  
  {/* TOP: QUICK NAVIGATION */}
  <div className="space-y-8">
    <div>
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
        Resources
      </h4>
      <div className="flex flex-col gap-2">
        <NavButton label="Contact Us" icon={Activity} link="/contact" />
        <NavButton label="View Pricing" icon={Sparkles} link="/pricing" />
        <NavButton label="Community" icon={MessageSquare} link="/"/>
      </div>
    </div>

    <div className="pt-8 border-t border-white/[0.05]">
       <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
        Direct Access
      </h4>
      <button 
        onClick={() => navigate("/dashboard")}
        className="w-full py-3 bg-white text-black hover:bg-slate-200 rounded-xl text-xs font-bold transition-all">
        Go to Dashboard
      </button>
    </div>
  </div>

  {/* CENTER: SIMPLE TEXT BOX */}
  <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
    <h4 className="text-white font-bold text-sm mb-2">Build faster</h4>
    <p className="text-xs text-slate-500 leading-relaxed">
      Integrate MailForge into your existing workflow with our pre-built SDKs and 
      comprehensive API documentation.
    </p>
  </div>

  {/* BOTTOM: SOCIALS & STATUS */}
  <div className="mt-auto pt-8 border-t border-white/[0.05]">
    <div className="flex items-center justify-between">
      <div className="flex gap-4 text-slate-500">
        <Github size={18} className="hover:text-white cursor-pointer transition-colors" />
        <ExternalLink size={18} className="hover:text-white cursor-pointer transition-colors" />
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live</span>
      </div>
    </div>
  </div>

</aside>

</div>
</div>
);
}

/* ================= COMPONENTS ================= */

const NavGroup=({title,children})=>(
<div className="mb-8">
<h3 className="text-xs text-slate-500 uppercase mb-3">{title}</h3>
{children}
</div>
);

const Nav=({icon:Icon,k,label,active,go})=>(
<button onClick={()=>go(k)}
className={`flex gap-3 px-3 py-2 rounded text-sm w-full text-left
${active===k?"bg-white/5 text-white":"text-slate-500 hover:text-slate-300"}`}>
<Icon size={16}/>{label}
</button>
);

const Section=forwardRef(({title,children,id},ref)=>(
<section ref={ref} id={id} className="scroll-mt-24">
<h2 className="text-3xl font-bold text-white mb-6">{title}</h2>
<div className="space-y-6 text-slate-400">{children}</div>
</section>
));

const FeatureGrid=()=>(
<div className="grid grid-cols-2 gap-4">
<div className="p-4 border border-white/10 rounded-xl">Async Delivery</div>
<div className="p-4 border border-white/10 rounded-xl">AI Templates</div>
<div className="p-4 border border-white/10 rounded-xl">Quota Control</div>
<div className="p-4 border border-white/10 rounded-xl">Retry Engine</div>
</div>
);

const Code=({children,lang})=>{
const [c,setC]=useState(false);
return(
<div className="border border-white/10 rounded-xl bg-black">
<div className="flex justify-between px-3 py-2 text-xs bg-white/5">
{lang}
<button onClick={()=>{navigator.clipboard.writeText(children);setC(true);setTimeout(()=>setC(false),1200);}}>
{c?<Check size={14}/>:<Copy size={14}/>}
</button>
</div>
<pre className="p-4 text-xs font-mono text-indigo-200 whitespace-pre-wrap">{children}</pre>
</div>
);
};

const QuickLink = ({ label, active }) => (
  <button className="flex items-center gap-2 text-[11px] text-slate-500 hover:text-white transition-colors group w-full">
    <ChevronRight size={10} className="text-slate-700 group-hover:text-indigo-500 transition-colors" />
    {label}
  </button>
);

const SocialIcon = ({ Icon }) => (
  <button className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/[0.03] rounded-lg border border-transparent hover:border-white/[0.05]">
    <Icon size={16} />
  </button>
);

 const NavButton = ({ label, icon: Icon, link }) => {
  const navigate = useNavigate(); // Initialize the hook here

  return (
    <button 
      onClick={() => navigate(link)} // Use parentheses for function call
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.03] transition-all text-sm w-full text-left group"
    >
      <Icon 
        size={16} 
        className="text-slate-600 group-hover:text-indigo-400 transition-colors" 
      />
      <span className="font-medium tracking-tight">{label}</span>
    </button>
  );
};