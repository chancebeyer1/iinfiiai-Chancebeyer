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

const VAPI_PUBLIC_KEY = "8bffd88e-8a7b-4c94-9f0b-4c867b72af91";

export default function LiveCallDemo() {
  const [selectedScenario, setSelectedScenario] = useState(1);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  
  const vapiRef = useRef(null);

  // Load Vapi SDK
  useEffect(() => {
    if (window.Vapi) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@vapi-ai/web@2.3.5/dist/index.umd.js';
    script.async = true;
    script.onload = () => {
      console.log('✅ Vapi SDK loaded successfully');
      setSdkLoaded(true);
    };
    script.onerror = () => {
      console.error('❌ Failed to load Vapi SDK');
      setError('Failed to load voice SDK');
    };
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize Vapi instance
  useEffect(() => {
    if (sdkLoaded && window.Vapi && !vapiRef.current) {
      try {
        vapiRef.current = new window.Vapi(VAPI_PUBLIC_KEY);
        
        // Set up event listeners
        vapiRef.current.on('call-start', () => {
          console.log('✅ Call started');
          setIsCallActive(true);
          setError(null);
        });

        vapiRef.current.on('call-end', () => {
          console.log('✅ Call ended');
          setIsCallActive(false);
          setCallDuration(0);
          setTranscript([]);
        });

        vapiRef.current.on('message', (message) => {
          console.log('📝 Message:', message);
          if (message.type === 'transcript' && message.transcript) {
            setTranscript(prev => [...prev, {
              role: message.role,
              text: message.transcript
            }]);
          }
        });

        vapiRef.current.on('error', (error) => {
          console.error('❌ Vapi error:', error);
          setError('Call error occurred');
          setIsCallActive(false);
        });

        console.log('✅ Vapi initialized');
      } catch (err) {
        console.error('❌ Error initializing Vapi:', err);
        setError('Failed to initialize voice system');
      }
    }
  }, [sdkLoaded]);

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

  const startCall = async () => {
    if (!vapiRef.current || isCallActive) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      console.log('🚀 Starting call with assistant:', scenario.assistantId);
      
      await vapiRef.current.start(scenario.assistantId);
    } catch (err) {
      console.error('❌ Error starting call:', err);
      setError('Failed to start call. Please check your microphone permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const endCall = () => {
    if (vapiRef.current && isCallActive) {
      console.log('🛑 Ending call');
      vapiRef.current.stop();
    }
  };

  const scenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="mt-16">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
      `}</style>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">
          Try Our AI Agent Right Now
        </h3>
        <p className="text-[#6B7280] mb-8">
          Select a scenario and experience how our AI handles real customer interactions
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

        {/* SDK Loading */}
        {!sdkLoaded && !error && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-700">Loading voice system...</p>
          </div>
        )}

        {/* Scenario Selector */}
        <div className="max-w-md mx-auto mb-8">
          <Select
            value={selectedScenario?.toString()}
            onValueChange={(value) => setSelectedScenario(parseInt(value))}
            disabled={isCallActive || isLoading}
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
                animation: isCallActive ? 'spin 8s linear infinite, pulse 2s ease-in-out infinite' : 'spin 20s linear infinite'
              }}
            />
            
            {/* Center Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 flex flex-col items-center">
                <div 
                  className="px-8 py-6 rounded-2xl text-white backdrop-blur-xl text-center"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: '2px solid rgba(0,212,138,0.4)'
                  }}
                >
                  {isCallActive ? (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center animate-pulse">
                        <Volume2 className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Call Active</h4>
                      <p className="text-2xl font-mono text-[#00D48A] mb-6">
                        {formatTime(callDuration)}
                      </p>
                      <Button
                        onClick={endCall}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold"
                      >
                        <PhoneOff className="w-5 h-5 mr-2" />
                        End Call
                      </Button>
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
                      <Button
                        onClick={startCall}
                        disabled={!sdkLoaded || isLoading}
                        className="gradient-button px-8 py-4 rounded-full text-white font-semibold shadow-2xl"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            <Phone className="w-5 h-5 mr-2" />
                            Start Call
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="mt-8 max-w-2xl mx-auto bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h4 className="font-semibold text-[#1C1C1C] mb-4 flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#00D48A]" />
              Live Transcript
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {transcript.map((item, index) => (
                <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    item.role === 'user' 
                      ? 'bg-gradient-to-r from-[#00D48A] to-[#51A7FF] text-white' 
                      : 'bg-gray-100 text-[#1C1C1C]'
                  }`}>
                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {item.role === 'user' ? 'You' : 'AI Agent'}
                    </p>
                    <p className="text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Text */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#00D48A]" />
              <span className="text-sm font-medium text-[#1C1C1C]">Browser-based calling</span>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#51A7FF]" />
              <span className="text-sm font-medium text-[#1C1C1C]">Natural conversation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}