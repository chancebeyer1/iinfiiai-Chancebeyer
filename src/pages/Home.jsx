import React from "react";
import HeroSection from "../components/home/HeroSection";
import VoiceWidget from "../components/home/VoiceWidget";
import FeatureGrid from "../components/home/FeatureGrid";
import HowItWorks from "../components/home/HowItWorks";
import OutboundFeature from "../components/home/OutboundFeature";
import MetricsTiles from "../components/home/MetricsTiles";
import CTASection from "../components/home/CTASection";
import ContactForm from "../components/home/ContactForm";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <section 
        className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
        style={{
          background: "radial-gradient(1200px 600px at 10% 10%, rgba(0,212,138,0.08), transparent), radial-gradient(1000px 500px at 90% 90%, rgba(81,167,255,0.08), transparent), white"
        }}
      >
        <div className="max-w-7xl mx-auto">
          <VoiceWidget />
        </div>
      </section>
      <FeatureGrid />
      <HowItWorks />
      <OutboundFeature />
      <MetricsTiles />
      <CTASection />
      <ContactForm />
    </div>
  );
}