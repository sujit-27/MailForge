import React from "react";
import avatar1 from "../../../attached_assets/stock_images/professional_develop_ea541a0c.jpg";
import avatar2 from "../../../attached_assets/stock_images/professional_develop_17f4340f.jpg";
import avatar3 from "../../../attached_assets/stock_images/professional_develop_588e1e67.jpg";

const testimonials = [
  {
    name: 'David Kim',
    role: 'Full Stack Developer, InnovateX',
    avatar: avatar1,
    quote: 'MailForge made integrating email features into our platform effortless. The API docs are top-notch.',
  },
  {
    name: 'Lisa Park',
    role: 'Product Manager, SkyNet Solutions',
    avatar: avatar2,
    quote: 'Our team can now send transactional emails reliably and track performance in real-time. Game-changer!',
  },
  {
    name: 'James Lee',
    role: 'Backend Engineer, CloudHub',
    avatar: avatar3,
    quote: 'I love how fast and stable MailForge is. It handles bulk email delivery without a hiccup.',
  },
  {
    name: 'Sophia Martinez',
    role: 'CTO, AppSphere',
    avatar: avatar1,
    quote: 'MailForge’s analytics helped us improve our email campaigns drastically. Highly recommend it.',
  },
  {
    name: 'Robert Wilson',
    role: 'Lead Developer, TechNova',
    avatar: avatar2,
    quote: 'The API is clean, fast, and reliable. Setting up automated emails has never been easier.',
  },
  {
    name: 'Emily Johnson',
    role: 'Engineering Lead, NextGen Apps',
    avatar: avatar3,
    quote: 'Our customer engagement improved significantly thanks to MailForge’s delivery insights.',
  },
  {
    name: 'Daniel Brown',
    role: 'DevOps Engineer, CodeCloud',
    avatar: avatar1,
    quote: 'MailForge scales effortlessly with our infrastructure. We never worry about email delivery now.',
  },
  {
    name: 'Olivia Davis',
    role: 'Frontend Developer, BrightTech',
    avatar: avatar2,
    quote: 'Simple integration, fast sending, and beautiful analytics dashboards. Exactly what we needed.',
  },
];

const TestimonialCard = ({ avatar, name, role, quote }) => (
  <div className="group relative">
    <div className="rounded-2xl border border-white p-8 mb-8 flex flex-col justify-between min-h-[280px] w-[400px]
      bg-gray-900/10 backdrop-blur-3xl text-white transition-all duration-300 opacity-60 hover:opacity-80
      hover:scale-105 hover:border-white/30 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-yellow-400/20 rounded-2xl"></div>
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="text-base leading-relaxed text-gray-300 group-hover:text-white mb-6 flex-grow">
          {quote}
        </div>
        <div className="flex items-center gap-4 mt-auto">
          <img 
            src={avatar} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300" 
          />
          <div>
            <div className="font-semibold text-white text-base">{name}</div>
            <div className="text-sm text-gray-400 group-hover:text-gray-300">{role}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const repeatedTestimonials = [];
  for (let i = 0; i < 6; i++) repeatedTestimonials.push(...testimonials);

  return (
    <>
      <style>{`
        @keyframes scrollUp1 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        @keyframes scrollUp2 {
          0% { transform: translateY(-15%); }
          100% { transform: translateY(-115%); }
        }
        @keyframes scrollUp3 {
          0% { transform: translateY(-30%); }
          100% { transform: translateY(-130%); }
        }
        @keyframes scrollUp4 {
          0% { transform: translateY(-45%); }
          100% { transform: translateY(-145%); }
        }
        @keyframes scrollUp5 {
          0% { transform: translateY(-60%); }
          100% { transform: translateY(-160%); }
        }
        .scroll-mask {
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 100%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 100%, transparent);
        }
        .horizontal-mask {
          mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%);
        }
        .scroll-column-1 { animation: scrollUp1 100s linear infinite; }
        .scroll-column-2 { animation: scrollUp2 105s linear infinite; }
        .scroll-column-3 { animation: scrollUp3 95s linear infinite; }
        .scroll-column-4 { animation: scrollUp4 103s linear infinite; }
        .scroll-column-5 { animation: scrollUp5 97s linear infinite; }
        .scroll-column:hover { animation-play-state: paused; }
        .triangle-blur-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          width: 100%;
          height: 100%;
          clip-path: polygon(0 0, 100% 0, 82% 100%, 0% 89%);
          background: rgba(15,15,15, 0.8);
          filter: blur(54px);
        }
        @media (max-width: 767px) {
          .triangle-blur-bg {
            clip-path: none;
            background: rgba(15,17,23, 1);
            filter: blur(50px);
          }
        }
      `}</style>
      <div className="min-h-screen relative overflow-hidden bg-black border-b border-gray-700 backdrop-blur-xl">
        {/* Black blurry triangle background */}
        <div className="triangle-blur-bg"></div>
        {/* Section content above the blur, z-10 */}
        <div className="relative z-10 pt-20 pb-10 px-4">
          {/* Section header */}
          <div className="text-center mb-10 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-200/90 mb-4 tracking-tight drop-shadow-lg">
              Trusted by developers worldwide
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto drop-shadow-sm">
              MailForge makes sending emails effortless and reliable for developers everywhere.
            </p>
          </div>
          {/* Scrolling testimonial columns */}
          <div className="scroll-mask horizontal-mask h-[900px] overflow-hidden relative rounded-3xl border border-white/5">
            <div className="flex gap-8 justify-center items-start w-[2400px] mx-auto -translate-x-[200px] select-none">
              <div className="scroll-column scroll-column-1 flex flex-col">
                {repeatedTestimonials.map((testimonial, idx) => (
                  <TestimonialCard key={`col1-${idx}`} {...testimonial} />
                ))}
              </div>
              <div className="scroll-column scroll-column-2 flex flex-col">
                {repeatedTestimonials.slice(2).map((testimonial, idx) => (
                  <TestimonialCard key={`col2-${idx}`} {...testimonial} />
                ))}
              </div>
              <div className="scroll-column scroll-column-3 flex flex-col">
                {repeatedTestimonials.slice(4).map((testimonial, idx) => (
                  <TestimonialCard key={`col3-${idx}`} {...testimonial} />
                ))}
              </div>
              <div className="scroll-column scroll-column-4 flex flex-col">
                {repeatedTestimonials.slice(6).map((testimonial, idx) => (
                  <TestimonialCard key={`col4-${idx}`} {...testimonial} />
                ))}
              </div>
              <div className="scroll-column scroll-column-5 flex flex-col">
                {repeatedTestimonials.slice(8).map((testimonial, idx) => (
                  <TestimonialCard key={`col5-${idx}`} {...testimonial} />
                ))}
              </div>
            </div>
          </div>
          {/* Bottom message */}
          <div className="w-full flex justify-center items-center pt-10">
            <div className="px-8 text-center max-w-7xl">
              <p className="text-lg text-gray-400">
                Join the MailForge community for fast, reliable emails trusted by developers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialsSection;