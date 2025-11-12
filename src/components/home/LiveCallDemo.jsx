import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Volume2, Mic, MicOff, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [isHovering, setIsHovering] = useState(false);
  const [callState, setCallState] = useState('idle'); // idle, connecting, active
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  
  const vapiRef = useRef(null);

  // Load Vapi SDK
  useEffect(() => {
    if (window.vapiSDK) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    script.defer = true;
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Vapi SDK loaded');
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
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
        } catch (e) {
          console.log('Cleanup error:', e);
        }
      }
    };
  }, []);

  // Initialize Vapi instance
  useEffect(() => {
    if (!sdkLoaded || !window.vapiSDK) return;

    try {
      // Create Vapi instance
      vapiRef.current = new window.vapiSDK.Vapi(VAPI_PUBLIC_KEY);

      // Event listeners
      vapiRef.current.on('call-start', () => {
        console.log('📞 Call started');
        setCallState('active');
        setError(null);
        setTranscript([]);
      });

      vapiRef.current.on('call-end', () => {
        console.log('📴 Call ended');
        setCallState('idle');
        setIsMuted(false);
      });

      vapiRef.current.on('speech-start', () => {
        console.log('🎤 User started speaking');
      });

      vapiRef.current.on('speech-end', () => {
        console.log('🎤 User stopped speaking');
      });

      vapiRef.current.on('message', (message) => {
        console.log('💬 Message:', message);
        
        if (message.type === 'transcript') {
          setTranscript(prev => [...prev, {
            role: message.role,
            text: message.transcript,
            timestamp: Date.now()
          }]);
        }
      });

      vapiRef.current.on('error', (error) => {
        console.error('❌ Vapi error:', error);
        setError(error.message || 'An error occurred');
        setCallState('idle');
      });

      console.log('✅ Vapi initialized');
    } catch (err) {
      console.error('❌ Error initializing Vapi:', err);
      setError('Failed to initialize voice system');
    }
  }, [sdkLoaded]);

  const startCall = async () => {
    if (!vapiRef.current) {
      setError('Voice system not ready');
      return;
    }

    try {
      setCallState('connecting');
      setError(null);

      const scenario = scenarios.find(s => s.id === selectedScenario);
      
      await vapiRef.current.start(scenario.assistantId);
      
    } catch (err) {
      console.error('❌ Error starting call:', err);
      setError('Failed to start call. Please check microphone permissions.');
      setCallState('idle');
    }
  };

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
  };

  const toggleMute = () => {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(!isMuted);
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
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">
          Try Our AI Agent Right Now
        </h3>
        <p className="text-[#6B7280] mb-8">
          Select a scenario and click to start talking directly in your browser
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
            disabled={callState !== 'idle'}
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
                callState === 'active' ? 'scale-110' : isHovering ? 'scale-105' : 'scale-100'
              }`}
              style={{
                background: 'conic-gradient(from 0deg, #00D48A, #51A7FF, #00D48A, #51A7FF, #00D48A)',
                filter: 'blur(40px)',
                opacity: callState === 'active' ? 1 : 0.7,
                animation: callState === 'active' ? 'spin 8s linear infinite' : 'spin 20s linear infinite'
              }}
            />
            
            {/* Pulse rings when call is active */}
            {callState === 'active' && (
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
                    background: 'rgba(0,0,0,0.85)',
                    border: '2px solid rgba(0,212,138,0.4)'
                  }}
                >
                  {callState === 'idle' && (
                    <>
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
                        <Phone className="w-10 h-10 text-white" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">
                        {scenario?.title}
                      </h4>
                      <p className="text-sm text-gray-300 mb-6">
                        {scenario?.description}
                      </p>

                      <Button
                        onClick={startCall}
                        disabled={!sdkLoaded}
                        className="w-full gradient-button px-8 py-4 rounded-full text-white font-semibold shadow-2xl text-base"
                      >
                        <Mic className="w-5 h-5 mr-2" />
                        Start Talking
                      </Button>

                      <p className="text-xs text-gray-400 mt-4">
                        Uses your microphone & speakers
                      </p>
                    </>
                  )}

                  {callState === 'connecting' && (
                    <>
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                      </div>
                      <h4 className="text-xl font-bold mb-2">Connecting...</h4>
                      <p className="text-sm text-gray-300">
                        Setting up audio connection
                      </p>
                    </>
                  )}

                  {callState === 'active' && (
                    <>
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center relative">
                        {isMuted ? (
                          <MicOff className="w-10 h-10 text-white" />
                        ) : (
                          <>
                            <Mic className="w-10 h-10 text-white" />
                            {/* Animated sound waves */}
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex gap-1">
                              <div className="w-1 h-8 bg-white rounded-full" style={{ animation: 'wave 1s ease-in-out infinite' }} />
                              <div className="w-1 h-10 bg-white rounded-full" style={{ animation: 'wave 1s ease-in-out infinite 0.2s' }} />
                              <div className="w-1 h-6 bg-white rounded-full" style={{ animation: 'wave 1s ease-in-out infinite 0.4s' }} />
                            </div>
                          </>
                        )}
                      </div>
                      <h4 className="text-xl font-bold mb-2 text-[#00D48A]">
                        Call Active
                      </h4>
                      <p className="text-sm text-gray-300 mb-6">
                        Start speaking...
                      </p>

                      <div className="flex gap-3">
                        <Button
                          onClick={toggleMute}
                          variant="outline"
                          className="flex-1 border-white/20 bg-white/10 text-white hover:bg-white/20"
                        >
                          {isMuted ? (
                            <>
                              <MicOff className="w-4 h-4 mr-2" />
                              Unmute
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4 mr-2" />
                              Mute
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={endCall}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        >
                          <PhoneOff className="w-4 h-4 mr-2" />
                          End Call
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Display */}
        {transcript.length > 0 && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
              <h4 className="text-lg font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#00D48A]" />
                Conversation
              </h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {transcript.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      item.role === 'user'
                        ? 'bg-blue-50 border border-blue-200 ml-8'
                        : 'bg-green-50 border border-green-200 mr-8'
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-600 mb-1">
                      {item.role === 'user' ? 'You' : 'AI Agent'}
                    </div>
                    <div className="text-sm text-gray-800">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Text */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#00D48A]" />
              <span className="text-sm font-medium text-[#1C1C1C]">Browser-based</span>
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