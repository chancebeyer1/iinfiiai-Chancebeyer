import React from "react";

const metrics = [
  { value: "27%", label: "booking rate lift after 6 months" },
  { value: "90s", label: "median time-to-first-response" },
  { value: "24/7", label: "coverage, bilingual" }
];

export default function MetricsTiles() {
  return (
    <section id="results" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D48A] to-[#51A7FF] rounded-t-2xl" />
              
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold gradient-text mb-4 group-hover:scale-110 transition-transform duration-300">
                  {metric.value}
                </div>
                <p className="text-sm text-[#6B7280] uppercase tracking-wide">
                  {metric.label}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute -z-10 inset-0 bg-gradient-to-br from-[#00D48A]/5 to-[#51A7FF]/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}