import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "iinfii.ai booked 300+ calls we used to miss. Instant ROI.",
    author: "COO, National Service Brand"
  },
  {
    quote: "Response rate doubled in two weeks. Hand-off to our reps is seamless.",
    author: "VP Sales, Healthcare Network"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#F9F9F7]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-[#1C1C1C] text-center mb-16">
          What customers say
        </h2>

        <div className="relative">
          <Card className="bg-white border-gray-200 shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <Quote className="w-12 h-12 text-[#00D48A] mb-6 opacity-50" />
              
              <blockquote className="text-2xl md:text-3xl font-medium text-[#1C1C1C] mb-6 leading-relaxed">
                "{testimonials[currentIndex].quote}"
              </blockquote>
              
              <div className="flex items-center justify-between">
                <cite className="text-sm text-[#6B7280] not-italic">
                  — {testimonials[currentIndex].author}
                </cite>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prev}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={next}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decorative elements */}
          <div className="absolute -z-10 top-0 left-0 w-32 h-32 bg-[#00D48A] rounded-full blur-3xl opacity-10" />
          <div className="absolute -z-10 bottom-0 right-0 w-32 h-32 bg-[#51A7FF] rounded-full blur-3xl opacity-10" />
        </div>
      </div>
    </section>
  );
}