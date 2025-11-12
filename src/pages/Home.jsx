import React from "react";
import HeroSection from "../components/home/HeroSection";
import LogoStrip from "../components/home/LogoStrip";
import FeatureGrid from "../components/home/FeatureGrid";
import HowItWorks from "../components/home/HowItWorks";
import OutboundFeature from "../components/home/OutboundFeature";
import MetricsTiles from "../components/home/MetricsTiles";
import Testimonials from "../components/home/Testimonials";
import Pricing from "../components/home/Pricing";
import CTASection from "../components/home/CTASection";
import ContactForm from "../components/home/ContactForm";

export default function Home() {
  return (
    <div className="w-full">
      <HeroSection />
      <LogoStrip />
      <FeatureGrid />
      <HowItWorks />
      <OutboundFeature />
      <MetricsTiles />
      <Testimonials />
      <Pricing />
      <CTASection />
      <ContactForm />
    </div>
  );
}