import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Growth",
    price: "$1,500/mo",
    features: [
      "Inbound & outbound agents",
      "2 numbers, 10k minutes",
      "CRM & calendar integration",
      "Email/SMS follow-ups"
    ],
    cta: "Start Trial"
  },
  {
    name: "Scale",
    price: "$5,000/mo",
    highlight: true,
    features: [
      "Everything in Growth",
      "Unlimited queues & minutes fair-use",
      "Custom voices & languages",
      "Dedicated success manager"
    ],
    cta: "Book a Demo"
  }
];

export default function Pricing() {
  const scrollToSection = (href) => {
    const element = document.getElementById('demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1C1C1C] mb-4">
            Simple, scalable pricing
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.highlight
                  ? "border-2 border-[#00D48A] shadow-2xl scale-105"
                  : "border-gray-200 shadow-lg"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="gradient-button px-4 py-1 rounded-full text-white text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-[#1C1C1C] mb-2">
                  {plan.name}
                </CardTitle>
                <div className="text-4xl font-bold gradient-text">
                  {plan.price}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#00D48A] flex-shrink-0 mt-0.5" />
                      <span className="text-[#1C1C1C]">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={scrollToSection}
                  className={`w-full py-3 rounded-full font-semibold transition-all ${
                    plan.highlight
                      ? "gradient-button text-white shadow-lg"
                      : "bg-white text-[#1C1C1C] border-2 border-[#BFC2C6] hover:border-[#00D48A]"
                  }`}
                >
                  {plan.cta}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-[#6B7280] mt-8">
          Custom enterprise plans available.
        </p>
      </div>
    </section>
  );
}