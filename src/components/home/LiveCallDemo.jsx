import React, { useState, useEffect, useRef } from "react";
import { Phone, Volume2, AlertCircle, Loader2 } from "lucide-react";
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
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [error, setError] = useState(null);
  const vapiContainerRef = useRef(null);
  const vapiInstanceRef = useRef(null);

  // Load and initialize Vapi SDK
  useEffect(() => {
    if (window.vapiSDK) {
      setSdkLoaded(true);
      initializeVapi();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js';
    script.defer = true;
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Vapi SDK loaded successfully');
      setSdkLoaded(true);
      initializeVapi();
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
      if (vapiInstanceRef.current) {
        // Cleanup Vapi instance if needed
        vapiInstanceRef.current = null;
      }
    };
  }, []);

  const initializeVapi = () => {
    if (!window.vapiSDK) return;

    try {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      
      // Custom button config with your branding
      const buttonConfig = {
        position: "bottom-right",
        offset: "40px",
        width: "60px",
        height: "60px",
        idle: {
          color: `linear-gradient(90deg, #00D48A 0%, #51A7FF 100%)`,
          type: "pill",
          title: "Talk to our AI",
          subtitle: "Have a question?",
          icon: `https://cdn-icons-png.flaticon.com/512/3616/3616215.png`,
        },
        loading: {
          color: `linear-gradient(90deg, #00D48A 0%, #51A7FF 100%)`,
          type: "pill",
          title: "Connecting...",
          subtitle: "Please wait",
          icon: `https://cdn-icons-png.flaticon.com/512/3616/3616215.png`,
        },
        active: {
          color: `linear-gradient(90deg, #00D48A 0%, #51A7FF 100%)`,
          type: "pill",
          title: "Call in progress...",
          subtitle: "End the call.",
          icon: `https://cdn-icons-png.flaticon.com/512/3616/3616215.png`,
        },
      };

      vapiInstanceRef.current = window.vapiSDK.run({
        apiKey: VAPI_PUBLIC_KEY,
        assistant: scenario.assistantId,
        config: buttonConfig,
      });

      console.log('✅ Vapi initialized with assistant:', scenario.assistantId);
    } catch (err) {
      console.error('❌ Error initializing Vapi:', err);
      setError('Failed to initialize voice system');
    }
  };

  // Reinitialize when scenario changes
  useEffect(() => {
    if (sdkLoaded) {
      initializeVapi();
    }
  }, [selectedScenario, sdkLoaded]);

  const scenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <div className="mt-16">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Custom Vapi button styles */
        #vapi-btn {
          background: linear-gradient(90deg, #00D48A 0%, #51A7FF 100%) !important;
          border: none !important;
          box-shadow: 0 8px 24px rgba(0, 212, 138, 0.4) !important;
          transition: all 0.3s ease !important;
        }
        
        #vapi-btn:hover {
          transform: scale(1.05) !important;
          box-shadow: 0 12px 32px rgba(0, 212, 138, 0.5) !important;
        }
        
        /* Custom panel styles */
        .vapi-panel {
          background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,26,26,0.95) 100%) !important;
          backdrop-filter: blur(20px) !important;
          border: 2px solid rgba(0, 212, 138, 0.3) !important;
          border-radius: 24px !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
        }
        
        .vapi-panel-title {
          color: #00D48A !important;
          font-weight: 700 !important;
        }
        
        .vapi-panel-subtitle {
          color: rgba(255, 255, 255, 0.7) !important;
        }
      `}</style>

      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-[#1C1C1C] mb-4">
          Try Our AI Agent Right Now
        </h3>
        <p className="text-[#6B7280] mb-8">
          Select a scenario and click the button in the bottom right to start talking
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
                isHovering ? 'scale-105' : 'scale-100'
              }`}
              style={{
                background: 'conic-gradient(from 0deg, #00D48A, #51A7FF, #00D48A, #51A7FF, #00D48A)',
                filter: 'blur(40px)',
                opacity: 0.8,
                animation: 'spin 15s linear infinite'
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
                  <Phone className="w-12 h-12 mx-auto mb-4 text-[#00D48A]" />
                  <h4 className="text-xl font-bold mb-2">
                    {scenario?.title}
                  </h4>
                  <p className="text-sm text-gray-300 mb-4">
                    {scenario?.description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#00D48A]/20 to-[#51A7FF]/20 border border-[#00D48A]/40">
                    <div className="w-2 h-2 rounded-full bg-[#00D48A] animate-pulse" />
                    <span className="text-sm font-semibold">Look for button ↘️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#00D48A]" />
              <span className="text-sm font-medium text-[#1C1C1C]">Click the button to call</span>
            </div>
            <div className="w-px h-8 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#51A7FF]" />
              <span className="text-sm font-medium text-[#1C1C1C]">Natural conversation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden container for Vapi button */}
      <div ref={vapiContainerRef} id="vapi-container" />
    </div>
  );
}