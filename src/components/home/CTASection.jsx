import React from "react";

export default function CTASection() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="cta"
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(180deg, rgba(0,212,138,0.12) 0%, rgba(81,167,255,0.12) 100%)"
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1C1C1C] mb-6">
          Ready to automate your{" "}
          <span className="gradient-text">reception?</span>
        </h2>
        
        <p className="text-lg text-[#6B7280] mb-10">
          Deploy your AI receptionist in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection('demo')}
            className="gradient-button px-8 py-4 rounded-full text-white font-semibold text-base shadow-lg"
          >
            Get Started
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-8 py-4 rounded-full bg-white text-[#1C1C1C] font-semibold text-base border-2 border-[#BFC2C6] hover:border-[#00D48A] transition-all"
          >
            Talk to Sales
          </button>
        </div>
      </div>
    </section>
  );
}