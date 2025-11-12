import React, { useState } from "react";
import { Phone, PhoneOff, Volume2, Mic, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { base44 } from "@/api/base44Client";

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

const VAPI_PRIVATE_KEY = "YOUR_VAPI_PRIVATE_KEY"; // Replace with your Vapi private key

export default function LiveCallDemo() {
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callStatus, setCallStatus] = useState(null); // null, 'calling', 'success', 'error'
  const [error, setError] = useState(null);

  const initiateCall = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCallStatus(null);

    try {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      
      // Call Vapi API to create an outbound call
      const response = await fetch('https://api.vapi.ai/call/phone', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_PRIVATE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId: scenario.assistantId,
          customer: {
            number: phoneNumber.replace(/\D/g, ''), // Remove non-digits
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const data = await response.json();
      console.log('Call initiated:', data);
      
      setCallStatus('success');
      setPhoneNumber("");
      
      // Reset after 5 seconds
      setTimeout(() => {
        setCallStatus(null);
      }, 5000);

    } catch (err) {
      console.error('Error initiating call:', err);
      setError('Failed to initiate call. Please try again.');
      setCallStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const scenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="mt-16">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">
          Try Our AI Agent Right Now
        </h3>
        <p className="text-[#6B7280] mb-8">
          Select a scenario and we'll call you to demonstrate our AI agent
        </p>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-left">
              <p className="font-semibold text-red-900 mb-1">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {callStatus === 'success' && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <Phone className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-left">
              <p className="font-semibold text-green-900 mb-1">Call Initiated!</p>
              <p className="text-green-700">You should receive a call shortly. Answer to experience our AI agent.</p>
            </div>
          </div>
        )}

        {/* Scenario Selector */}
        <div className="max-w-md mx-auto mb-8">
          <Select
            value={selectedScenario?.toString()}
            onValueChange={(value) => setSelectedScenario(parseInt(value))}
            disabled={isLoading}
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
                callStatus === 'success' ? 'scale-110' : isHovering ? 'scale-105' : 'scale-100'
              }`}
              style={{
                background: 'conic-gradient(from 0deg, #00D48A, #51A7FF, #00D48A, #51A7FF, #00D48A)',
                filter: 'blur(40px)',
                opacity: callStatus === 'success' ? 1 : 0.7,
                animation: callStatus === 'success' ? 'spin 8s linear infinite' : 'spin 20s linear infinite'
              }}
            />
            
            {/* Pulse rings when call is active */}
            {callStatus === 'success' && (
              <>
                <div 
                  className="absolute w-96 h-96 rounded-full border-4 border-[#00D48A]"
                  style={{
                    animation: 'pulse-ring 2s ease-out infinite'
                  }}
                />
                <div 
                  className="absolute w-96 h-96 rounded-full border-4 border-[#51A7FF]"
                  style={{
                    animation: 'pulse-ring 2s ease-out infinite 1s'
                  }}
                />
              </>
            )}
            
            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 flex flex-col items-center">
                <div 
                  className="px-8 py-8 rounded-2xl text-white backdrop-blur-xl text-center max-w-md"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '2px solid rgba(0,212,138,0.4)'
                  }}
                >
                  {callStatus === 'success' ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
                        <PhoneOff className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Call Initiated!</h4>
                      <p className="text-sm text-gray-300">
                        Answer your phone to talk with our AI agent
                      </p>
                    </>
                  ) : (
                    <>
                      <Phone className="w-12 h-12 mx-auto mb-4 text-[#00D48A]" />
                      <h4 className="text-xl font-bold mb-2">
                        {scenario?.title}
                      </h4>
                      <p className="text-sm text-gray-300 mb-6">
                        {scenario?.description}
                      </p>

                      {/* Phone Number Input */}
                      <div className="space-y-4">
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={phoneNumber}
                          onChange={handlePhoneChange}
                          maxLength={14}
                          className="h-12 text-center text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          disabled={isLoading}
                        />
                        
                        <Button
                          onClick={initiateCall}
                          disabled={isLoading || !phoneNumber}
                          className="w-full gradient-button px-8 py-4 rounded-full text-white font-semibold shadow-2xl text-base"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Calling...
                            </>
                          ) : (
                            <>
                              <Phone className="w-5 h-5 mr-2" />
                              Call Me Now
                            </>
                          )}
                        </Button>
                      </div>

                      <p className="text-xs text-gray-400 mt-4">
                        We'll call you within seconds
                      </p>
                    </>
                  )}
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