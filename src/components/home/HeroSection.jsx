import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToSection = (href) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: "radial-gradient(1200px 600px at 10% -10%, rgba(0,212,138,0.15), transparent), radial-gradient(1000px 500px at 90% 110%, rgba(81,167,255,0.15), transparent)"
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 ${isVisible ? 'fade-in' : 'opacity-0'}`}>
            <Badge className="bg-gradient-to-r from-[#00D48A]/10 to-[#51A7FF]/10 text-[#00D48A] border-[#00D48A]/20 px-4 py-1.5">
              AI Call Agents
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C1C1C] leading-tight">
              AI receptionists that{" "}
              <span className="gradient-text">never miss a call.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-xl">
              Convert more leads, book more jobs, and deliver instant responses — with human handoff when it matters.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://calendly.com/billy-vasttrack/iinfii-demo-call"
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-button px-8 py-4 rounded-full text-white font-semibold text-base shadow-lg text-center"
              >
                Book a Demo
              </a>
              <button
                onClick={() => scrollToSection('#how')}
                className="px-8 py-4 rounded-full bg-white text-[#1C1C1C] font-semibold text-base border border-[#BFC2C6] hover:border-[#00D48A] transition-all"
              >
                See How It Works
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              {["24/7 coverage", "Human handoff", "Spanish & English"].map((text, i) => (
                <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                  <Check className="w-4 h-4 text-[#00D48A]" />
                  <span className="text-sm font-medium text-[#1C1C1C]">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Dashboard Mock */}
          <div className={`relative ${isVisible ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
                alt="Agent dashboard showing call analytics"
                className="w-full h-auto"
              />
              {/* Floating metric card */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="text-xs text-[#6B7280] mb-1">Active Calls</div>
                <div className="text-2xl font-bold text-[#00D48A]">27</div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -z-10 -top-12 -right-12 w-64 h-64 bg-[#51A7FF] rounded-full blur-3xl opacity-20" />
            <div className="absolute -z-10 -bottom-12 -left-12 w-64 h-64 bg-[#00D48A] rounded-full blur-3xl opacity-20" />
          </div>
        </div>
      </div>
    </section>
  );
}