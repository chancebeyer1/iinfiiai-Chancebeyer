import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, Volume2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const scenarios = [
  {
    id: 1,
    title: "Restaurant",
    description: "Make a dinner reservation",
    vapiAssistantId: "9a89b82b-ba64-4a8a-8a20-50a869a4852e",
  },
  {
    id: 2,
    title: "Hair Salon",
    description: "Book a haircut appointment",
    vapiAssistantId: "62001a29-6981-47da-873d-33cd0516f9c3",
  },
  {
    id: 3,
    title: "Photographer",
    description: "Schedule a photo session",
    vapiAssistantId: "d4dd1fe0-d6f9-4019-bdac-ebd08af12829",
  },
  {
    id: 4,
    title: "Coffee Shop",
    description: "Place a pickup order",
    vapiAssistantId: "93027f68-3557-418e-92c3-5cd24833af22",
  }
];

export default function LiveCallDemo() {
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [vapiLoaded, setVapiLoaded] = useState(false);
  const vapiInstance = useRef(null);

  // Initialize Vapi
  useEffect(() => {
    // Check if Vapi is loaded (the SDK exports as window.Vapi, not window.vapiSDK)
    if (window.Vapi) {
      const vapi = new window.Vapi("85b43e2b-a309-4004-a0e6-f2f08ac32c9e");
      vapiInstance.current = vapi;
      setVapiLoaded(true);

      // Listen to call events
      vapi.on("call-start", () => {
        setIsCallActive(true);
        setCallDuration(0);
      });

      vapi.on("call-end", () => {
        setIsCallActive(false);
        setCallDuration(0);
      });

      vapi.on("speech-start", () => {
        console.log("AI started speaking");
      });

      vapi.on("speech-end", () => {
        console.log("AI stopped speaking");
      });

      vapi.on("error", (error) => {
        console.error("Vapi error:", error);
        setIsCallActive(false);
      });
    } else {
      console.warn("Vapi SDK not loaded yet, will retry...");
      // Retry after a short delay
      const timer = setTimeout(() => {
        if (window.Vapi) {
          const vapi = new window.Vapi("85b43e2b-a309-4004-a0e6-f2f08ac32c9e");
          vapiInstance.current = vapi;
          setVapiLoaded(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      if (vapiInstance.current) {
        vapiInstance.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const startCall = async () => {
    if (!selectedScenario || !vapiInstance.current) return;

    const scenario = scenarios.find(s => s.id === selectedScenario);
    
    try {
      // Start the Vapi call with the selected assistant
      await vapiInstance.current.start(scenario.vapiAssistantId);
    } catch (error) {
      console.error("Failed to start call:", error);
      alert("Failed to start call. Please check your Vapi configuration.");
    }
  };

  const endCall = () => {
    if (vapiInstance.current) {
      vapiInstance.current.stop();
    }
    setIsCallActive(false);
    setCallDuration(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">
          Try Our AI Agent Right Now
        </h3>
        <p className="text-[#6B7280] mb-8">
          Select a scenario and experience how our AI handles real customer interactions
        </p>

        {/* Scenario Selector */}
        <div className="max-w-md mx-auto mb-8">
          <Select
            value={selectedScenario?.toString()}
            onValueChange={(value) => setSelectedScenario(parseInt(value))}
            disabled={isCallActive}
          >
            <SelectTrigger className="w-full h-14 text-lg border-2 border-gray-300 hover:border-[#00D48A] transition-colors">
              <SelectValue placeholder="Select a scenario..." />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((scenario) => (
                <SelectItem key={scenario.id} value={scenario.id.toString()} className="text-lg py-3">
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">{scenario.title}</span>
                    <span className="text-sm text-[#6B7280]">{scenario.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!vapiLoaded && (
          <div className="text-sm text-amber-600 mb-4">
            Vapi SDK not detected. Add the Vapi script to enable live calls.
          </div>
        )}
      </div>

      {/* AI Orb Interface */}
      <div className="relative max-w-2xl mx-auto">
        <div 
          className="relative aspect-square max-w-lg mx-auto rounded-full overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
          }}
        >
          {/* Animated Orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className={`relative w-80 h-80 rounded-full transition-all duration-700 ${
                isCallActive ? 'scale-110' : isHovering ? 'scale-105' : 'scale-100'
              }`}
              style={{
                background: 'conic-gradient(from 0deg, #00D48A, #51A7FF, #00D48A, #51A7FF, #00D48A)',
                filter: 'blur(40px)',
                opacity: isCallActive ? 1 : 0.7,
                animation: isCallActive ? 'spin 8s linear infinite' : 'spin 20s linear infinite'
              }}
            />
            
            {/* Center Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isCallActive ? (
                <Button
                  onClick={startCall}
                  disabled={!selectedScenario || !vapiLoaded}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  className="relative z-10 px-8 py-6 rounded-full text-white font-semibold text-lg shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(40,40,40,0.9) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(0,212,138,0.3)'
                  }}
                >
                  <Phone className="w-6 h-6 mr-3 inline" />
                  Call AI Agent
                </Button>
              ) : (
                <div className="relative z-10 flex flex-col items-center gap-6">
                  {/* Call Status */}
                  <div 
                    className="px-8 py-4 rounded-2xl text-white backdrop-blur-xl"
                    style={{
                      background: 'rgba(0,0,0,0.7)',
                      border: '2px solid rgba(0,212,138,0.4)'
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full bg-[#00D48A] animate-pulse" />
                      <span className="font-semibold text-lg">
                        {scenarios.find(s => s.id === selectedScenario)?.title}
                      </span>
                    </div>
                    <div className="text-center text-2xl font-bold gradient-text">
                      {formatTime(callDuration)}
                    </div>
                  </div>

                  {/* Audio Visualizer */}
                  <div className="flex gap-2">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 40 + 20}px`,
                          background: i % 2 === 0 ? '#00D48A' : '#51A7FF',
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '0.6s'
                        }}
                      />
                    ))}
                  </div>

                  {/* End Call Button */}
                  <Button
                    onClick={endCall}
                    className="px-8 py-4 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow-2xl transition-all"
                  >
                    <PhoneOff className="w-5 h-5 mr-2" />
                    End Call
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call Info Below */}
        {isCallActive && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 shadow-lg">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#00D48A]" />
                <span className="text-sm font-medium text-[#1C1C1C]">Microphone Active</span>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#51A7FF]" />
                <span className="text-sm font-medium text-[#1C1C1C]">AI Speaking</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}