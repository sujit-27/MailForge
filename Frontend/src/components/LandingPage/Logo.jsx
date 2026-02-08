import { Mail, Zap } from 'lucide-react';

export default function Logo({ className = "", size = "default" }) {
  const sizes = {
    small: { icon: 16, text: "text-lg" },
    default: { icon: 24, text: "text-2xl" },
    large: { icon: 32, text: "text-4xl" },
  };
  
  const currentSize = sizes[size] || sizes.default;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Mail className="text-primary" size={currentSize.icon} />
        <Zap 
          className="absolute -top-1 -right-1 text-pink-500" 
          size={currentSize.icon * 0.5} 
        />
      </div>
      <span className={`font-bold ${currentSize.text} bg-gradient-mailforge bg-clip-text text-transparent`}>
        MailForge
      </span>
    </div>
  );
}
