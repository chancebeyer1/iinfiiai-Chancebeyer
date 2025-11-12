import React from "react";

export default function LogoStrip() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-[#6B7280] mb-8">
          Trusted by service, healthcare, and field teams
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-40">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-2xl font-bold text-gray-400">
              LOGO {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}