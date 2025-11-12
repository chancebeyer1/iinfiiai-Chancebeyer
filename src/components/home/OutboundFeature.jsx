import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bot, User, CheckCircle2 } from "lucide-react";

export default function OutboundFeature() {
  return (
    <section id="outbound" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-[#F9F9F7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <div className="space-y-6">
            <Badge className="bg-[#51A7FF]/10 text-[#51A7FF] border-[#51A7FF]/20">
              Outbound Drip Campaigns
            </Badge>
            
            <h2 className="text-3xl md:text-5xl font-bold text-[#1C1C1C]">
              Follow-ups that feel{" "}
              <span className="gradient-text">human.</span>
            </h2>
            
            <p className="text-lg text-[#6B7280]">
              Maximize pipeline with Happy Calls, maintenance scheduling, and speed-to-lead automations.
            </p>

            <ul className="space-y-3">
              {[
                "Automated appointment reminders",
                "Post-service follow-ups",
                "Reactivation campaigns",
                "Lead nurture sequences"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#00D48A] flex-shrink-0" />
                  <span className="text-[#1C1C1C]">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Flow Diagram */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            <div className="space-y-6">
              {/* AI Node */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#00D48A]/10 to-[#51A7FF]/10 rounded-xl border border-[#00D48A]/20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#1C1C1C]">AI Agent</div>
                  <div className="text-sm text-[#6B7280]">Initiates contact</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-gradient-to-b from-[#00D48A] to-[#51A7FF]" />
              </div>

              {/* Human Transfer Node */}
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#1C1C1C]">Human Transfer</div>
                  <div className="text-sm text-[#6B7280]">When needed</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-[#00D48A]" />
              </div>

              {/* Success Node */}
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 rounded-full bg-[#00D48A] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#1C1C1C]">Job Booked</div>
                  <div className="text-sm text-[#6B7280]">Confirmed & tracked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}