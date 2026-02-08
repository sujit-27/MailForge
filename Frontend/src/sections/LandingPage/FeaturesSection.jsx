import { ShieldCheck, Clock, Globe2, SlidersHorizontal, UserCheck, Server, AlertTriangle, Rss, GitBranch } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Smart Bounce Handling",
    description: "Automatically identifies soft and hard bounces, keeping your sender reputation healthy and your contact list clean.",
  },
  {
    icon: Clock,
    title: "Automated Domain Warm-up",
    description: "Mailer traffic is scaled up intelligently, so you never get blacklisted and achieve top inbox placement fast.",
  },
  {
    icon: Globe2,
    title: "Real-time Webhook Support",
    description: "Receive instant notifications for opens, clicks, bounces, unsubscribes, and spam complaints directly in your backend.",
  },
  {
    icon: SlidersHorizontal,
    title: "Role-based Access Control",
    description: "Granular permissions for each team member so developers, marketers, and admins can securely collaborate.",
  },
  {
    icon: UserCheck,
    title: "User Verification Flows",
    description: "Out-of-the-box flows for sign-up, password reset, and double opt-in campaigns. Easy to customize and integrate.",
  },
  {
    icon: Server,
    title: "SPF/DKIM/DMARC Monitoring",
    description: "Ensure your domain authentication is always correct and receive alerts if anything’s misconfigured.",
  },
  {
    icon: AlertTriangle,
    title: "Delivery Failure Alerts",
    description: "Get real-time notifications if emails can’t be delivered due to DNS, policy, or server errors.",
  },
  {
    icon: Rss,
    title: "Live Activity Feed",
    description: "A real-time dashboard of all emails sent, opened, bounced or flagged allowing deep analytics.",
  },
  {
    icon: GitBranch,
    title: "SDKs & API Integrations",
    description: "Official SDKs for Node, Python, Java, and Go. Fast onboarding with ready-to-use code and CLI scaffolding.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 bg-black/10 transition-colors duration-500 before:absolute before:inset-0 before:rounded-xl before:bg-radial before:from-purple-900/10 before:via-pink-900/10 before:to-indigo-700/0 before:pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-20 text-center">
          <h1
            className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight 
                      bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 
                      text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]"
          >
            Reach inboxes, not spam folders
          </h1>
          <p className="text-2xl text-gray-400 mt-6 mb-2">
            Advanced delivery, seamless APIs, complete analytics. Everything <span className="whitespace-nowrap">developers need.</span>
          </p>
        </div>
        <div className="grid gap-x-12 gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col ">
              <div className="mb-5">
                <feature.icon className="w-8 h-8 text-white opacity-75" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-base text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
