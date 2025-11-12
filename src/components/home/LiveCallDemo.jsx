import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, Volume2, Loader2, AlertCircle } from "lucide-react";
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
    assistantId: "9a89b82b-ba64-4a8a-8a20-50a869a4852e",
  },
  {
    id: 2,
    title: "Hair Salon",
    description: "Book a haircut appointment",
    assistantId: "62001a29-6981-47da-873d-33cd0516f9c3",
  },
  {
    id: 3,
    title: "Photographer",
    description: "Schedule a photo session",
    assistantId: "d4dd1fe0-d6f9-4019-bdac-ebd08af12829",
  },
  {
    id: 4,
    title: "Coffee Shop",
    description: "Place a pickup order",
    assistantId: "93027f68-3557-418e-92c3-5cd24833af22",
  }
];

export default function LiveCallDemo() {
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [micPermission, setMicPermission] = useState(null);

  // Request microphone permission on mount
  useEffect(() => {
    const requestMicPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately, we just needed to trigger permission
        stream.getTracks().forEach(track => track.stop());
        setMicPermission('granted');
        console.log('✅ Microphone permission granted');
      } catch (error) {
        console.error('❌ Microphone permission denied:', error);
        setMicPermission('denied');
      }
    };

    requestMicPermission();
  }, []);

  // Call duration timer
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="mt-16">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">
          Try Our AI Agent Right Now
        </h3>
        <p className="text-[#6B7280] mb-8">
          Select a scenario and experience how our AI handles real customer interactions
        </p>

        {/* Microphone Permission Warning */}
        {micPermission === 'denied' && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-left">
              <p className="font-semibold text-amber-900 mb-1">Microphone Access Required</p>
              <p className="text-amber-700">
                Please allow microphone access in your browser settings to use the voice demo.
              </p>
            </div>
          </div>
        )}

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
            
            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 flex flex-col items-center">
                {/* Call to Action */}
                <div 
                  className="px-8 py-6 rounded-2xl text-white backdrop-blur-xl text-center"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '2px solid rgba(0,212,138,0.4)'
                  }}
                >
                  <Phone className="w-12 h-12 mx-auto mb-4 text-[#00D48A]" />
                  <h4 className="text-xl font-bold mb-2">
                    {scenario?.title}
                  </h4>
                  <p className="text-sm text-gray-300 mb-6">
                    {scenario?.description}
                  </p>
                  
                  <a
                    href={`tel:+18444664634`}
                    className="inline-block gradient-button px-8 py-4 rounded-full text-white font-semibold shadow-2xl transition-all hover:scale-105"
                  >
                    <Phone className="w-5 h-5 mr-2 inline" />
                    Call Now: (844) 466-4634
                  </a>
                  
                  <p className="text-xs text-gray-400 mt-4">
                    Or click to use browser calling
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#00D48A]" />
              <span className="text-sm font-medium text-[#1C1C1C]">24/7 Available</span>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#51A7FF]" />
              <span className="text-sm font-medium text-[#1C1C1C]">Natural Conversation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}