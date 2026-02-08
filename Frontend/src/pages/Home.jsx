import Navbar from "@/components/LandingPage/Navbar";
import CodeSection from "@/sections/LandingPage/CodeSection";
import CTASection from "@/sections/LandingPage/CTASection";
import FeaturesSection from "@/sections/LandingPage/FeaturesSection";
import Footer from "@/sections/LandingPage/Footer";
import HeroSection from "@/sections/LandingPage/HeroSection";
import TestimonialsSection from "@/sections/LandingPage/TestimonialsSection";
import TrustedBySection from "@/sections/LandingPage/TrustedBySection";


export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <CodeSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
