import React, { useState, useEffect, useRef } from "react";
import { Phone, PhoneOff, Loader2, Volume2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Vapi from "@vapi-ai/web";

export default function VoiceWidget() {
  const [vapi, setVapi] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const transcriptEndRef = useRef(null);
  const transcriptContainerRef = useRef(null);
  const previousTranscriptRef = useRef({}); // Track previous transcript text per role

  // Get Vapi configuration from environment variables
  const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
  const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || "9a89b82b-ba64-4a8a-8a20-50a869a4852e"; // Default to restaurant demo

  useEffect(() => {
    // Initialize Vapi SDK
    if (!VAPI_PUBLIC_KEY) {
      setError("Vapi Public API Key not configured. Please add VITE_VAPI_PUBLIC_KEY to your environment variables.");
      return;
    }

    setIsInitializing(true);
    
    // Initialize Vapi SDK
    const vapiInstance = new Vapi(VAPI_PUBLIC_KEY);
    
    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('Call started');
      setIsConnected(true);
      setIsListening(true);
      setError(null);
    });

    vapiInstance.on('call-end', () => {
      console.log('Call ended');
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      // Reset previous transcript tracking
      previousTranscriptRef.current = {};
    });

    vapiInstance.on('speech-start', () => {
      console.log('Assistant started speaking');
      setIsSpeaking(true);
      setIsListening(false);
    });

    vapiInstance.on('speech-end', () => {
      console.log('Assistant stopped speaking');
      setIsSpeaking(false);
      setIsListening(true);
    });

    vapiInstance.on('user-speech-start', () => {
      console.log('User started speaking');
      setIsListening(true);
    });

    vapiInstance.on('user-speech-end', () => {
      console.log('User stopped speaking');
    });

    vapiInstance.on('message', (message) => {
      if (message.type === 'transcript') {
        setTranscript((prev) => {
          const lastMessage = prev[prev.length - 1];
          const previousText = previousTranscriptRef.current[message.role] || '';
          const currentText = message.transcript;
          
          // If last message exists and is from the same role
          if (lastMessage && lastMessage.role === message.role) {
            const lastMessageText = lastMessage.text;
            
            // Check if current text has grown
            const hasGrown = currentText.length > lastMessageText.length;
            
            // If message is getting long (>60 chars), try to split at sentence boundaries
            if (hasGrown && currentText.length > 60) {
              // Find all sentence endings (., !, ? followed by space)
              const sentencePattern = /[.!?]\s+/g;
              const sentenceEndings = [];
              
              // Reset regex and find all matches
              sentencePattern.lastIndex = 0;
              let match;
              while ((match = sentencePattern.exec(currentText)) !== null) {
                sentenceEndings.push({
                  index: match.index,
                  end: match.index + match[0].length
                });
              }
              
              if (sentenceEndings.length > 0) {
                // Use the stored previous text for comparison (what was in the last update)
                const compareText = previousText || lastMessageText;
                
                // Find the first sentence ending that's clearly after the previous text
                for (let i = 0; i < sentenceEndings.length; i++) {
                  const sentenceEnd = sentenceEndings[i].end;
                  
                  // Check if this sentence is new content (after previous text)
                  if (sentenceEnd > compareText.length + 5) {
                    const firstPart = currentText.substring(0, sentenceEnd).trim();
                    const secondPart = currentText.substring(sentenceEnd).trim();
                    
                    // Only split if both parts are meaningful
                    if (firstPart.length >= 20 && secondPart.length >= 10) {
                      // Also check that the first part is different from what we had
                      if (firstPart !== compareText.trim() || compareText.length < 20) {
                        previousTranscriptRef.current[message.role] = currentText;
                        return [
                          ...prev.slice(0, -1), // Remove the last message
                          {
                            role: message.role,
                            text: firstPart,
                            timestamp: lastMessage.timestamp,
                          },
                          {
                            role: message.role,
                            text: secondPart,
                            timestamp: new Date().toLocaleTimeString(),
                          },
                        ];
                      }
                    }
                  }
                }
              }
            }
            
            // Otherwise, just update the last message
            previousTranscriptRef.current[message.role] = currentText;
            return [
              ...prev.slice(0, -1),
              {
                role: message.role,
                text: currentText,
                timestamp: lastMessage.timestamp,
              },
            ];
          }
          
          // New message from different role or first message
          previousTranscriptRef.current[message.role] = currentText;
          return [
            ...prev,
            {
              role: message.role,
              text: currentText,
              timestamp: new Date().toLocaleTimeString(),
            },
          ];
        });
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('Vapi error:', error);
      setError(error.message || 'An error occurred with the voice assistant');
      setIsConnected(false);
    });

    setVapi(vapiInstance);
    setIsInitializing(false);

    // Cleanup on unmount
    return () => {
      if (vapi) {
        vapi.stop();
      }
    };
  }, [VAPI_PUBLIC_KEY]);

  // Auto-scroll transcript container to bottom (only scrolls the container, not the page)
  useEffect(() => {
    if (transcriptContainerRef.current && transcriptEndRef.current) {
      // Only scroll if user hasn't manually scrolled up
      const container = transcriptContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      
      if (isNearBottom) {
        transcriptEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [transcript]);

  const startCall = () => {
    if (vapi && VAPI_ASSISTANT_ID) {
      setTranscript([]);
      setError(null);
      previousTranscriptRef.current = {}; // Reset tracking
      vapi.start(VAPI_ASSISTANT_ID);
    } else {
      setError('Assistant ID not configured');
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
      setTranscript([]);
    }
  };

  if (!VAPI_PUBLIC_KEY) {
    return (
      <Card className="max-w-2xl mx-auto p-8">
        <CardContent className="text-center">
          <p className="text-red-600">
            Vapi Public API Key not configured. Please add VITE_VAPI_PUBLIC_KEY to your environment variables.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-4">
          Try Our AI Voice Assistant
        </h3>
        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
          Click the button below to start a real-time voice conversation with our AI agent
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Voice Widget Card */}
        <Card className="bg-white border-2 border-gray-200 shadow-xl rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            {/* Status Indicators */}
            <div className="flex items-center justify-center gap-4 mb-6">
              {isConnected && (
                <>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-[#00D48A] animate-pulse' : isListening ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-sm text-[#6B7280]">
                      {isSpeaking ? 'AI Speaking' : isListening ? 'Listening...' : 'Connected'}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Main Control Button */}
            <div className="flex justify-center mb-6">
              <Button
                onClick={isConnected ? endCall : startCall}
                disabled={isInitializing}
                className={`w-24 h-24 rounded-full ${
                  isConnected
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'gradient-button hover:opacity-90'
                } text-white shadow-2xl transition-all transform hover:scale-105`}
              >
                {isInitializing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isConnected ? (
                  <PhoneOff className="w-8 h-8" />
                ) : (
                  <Phone className="w-8 h-8" />
                )}
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Transcript */}
            {transcript.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-[#1C1C1C] mb-3">Conversation</h4>
                <div 
                  ref={transcriptContainerRef}
                  className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto border border-gray-200"
                >
                  {transcript.map((item, index) => (
                    <div
                      key={`${item.role}-${index}-${item.timestamp}`}
                      className={`mb-3 ${
                        item.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                          item.role === 'user'
                            ? 'bg-[#00D48A] text-white'
                            : 'bg-white border border-gray-200 text-[#1C1C1C]'
                        }`}
                      >
                        <p className="text-sm">{item.text}</p>
                        <p className="text-xs opacity-70 mt-1">{item.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={transcriptEndRef} />
                </div>
              </div>
            )}

            {/* Instructions */}
            {!isConnected && transcript.length === 0 && (
              <div className="mt-6 text-center">
                <p className="text-sm text-[#6B7280]">
                  Click the button above to start a voice conversation. Make sure your microphone is enabled.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-[#1C1C1C] mb-2">Real-Time Voice</h4>
            <p className="text-sm text-[#6B7280]">
              Natural conversation with WebSocket connection
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-[#1C1C1C] mb-2">AI Powered</h4>
            <p className="text-sm text-[#6B7280]">
              Advanced AI understands context and intent
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-[#1C1C1C] mb-2">Instant Response</h4>
            <p className="text-sm text-[#6B7280]">
              No delays, immediate AI responses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

