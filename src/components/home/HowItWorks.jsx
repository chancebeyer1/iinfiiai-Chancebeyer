import React from "react";
import LiveCallDemo from "./LiveCallDemo";

const steps = [
  { title: "Answer", text: "Your AI picks up instantly, verifies intent, and qualifies." },
  { title: "Assist", text: "Looks up availability, answers FAQs, and updates CRM." },
  { title: "Book", text: "Schedules jobs or meetings and sends confirmations." },
  { title: "Handoff", text: "Transfers to a human when nuance matters." }
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C1C1C] mb-4">
            How it works
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Designed like a top-tier contact center — automated.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 relative mb-16">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D48A] to-[#51A7FF]" style={{ top: '3rem' }} />

          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step number */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-[#00D48A] to-[#51A7FF] flex items-center justify-center mb-6 mx-auto md:mx-0">
                <span className="text-white font-bold text-lg">{index + 1}</span>
              </div>

              {/* Step content */}
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Demo */}
        <LiveCallDemo />
      </div>
    </section>
  );
}