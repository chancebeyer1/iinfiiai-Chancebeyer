import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneIncoming, Handshake, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const icons = {
  PhoneIncoming,
  Handshake,
  Bot
};

const features = [
  {
    icon: "PhoneIncoming",
    title: "Book Every Lead",
    text: "Inbound calls, chats, and first-touch communication — 24/7.",
    kpi: { value: "1,244", suffix: " Booked Jobs" }
  },
  {
    icon: "Handshake",
    title: "Nurture Customers",
    text: "Follow-ups, reminders, and predictive callbacks that grow LTV."
  },
  {
    icon: "Bot",
    title: "Inbound Responder",
    text: "Multilingual AI with human transfer and custom voices.",
    bullets: ["Spanish & English", "Human Transfer", "Custom Voice"],
    footnote: "27% increase in booking rate after 6 months"
  }
];

export default function FeatureGrid() {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1 && !visibleCards.includes(index)) {
              setVisibleCards((prev) => [...prev, index]);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#F9F9F7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = icons[feature.icon];
            return (
              <Card
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 ${
                  visibleCards.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D48A]/20 to-[#51A7FF]/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#00D48A]" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#1C1C1C]">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {feature.text}
                  </p>

                  {feature.kpi && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-3xl font-bold text-[#00D48A]">
                        {feature.kpi.value}
                        <span className="text-base text-[#6B7280] font-normal">
                          {feature.kpi.suffix}
                        </span>
                      </div>
                    </div>
                  )}

                  {feature.bullets && (
                    <div className="space-y-2">
                      {feature.bullets.map((bullet, i) => (
                        <Badge key={i} variant="outline" className="mr-2">
                          {bullet}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {feature.footnote && (
                    <div className="text-xs text-[#00D48A] font-medium pt-2">
                      ✦ {feature.footnote}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}