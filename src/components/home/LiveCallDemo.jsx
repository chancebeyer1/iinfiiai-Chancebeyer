import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const scenarios = [
  {
    id: 1,
    title: "HVAC Repair Booking",
    icon: "🔧",
    conversation: [
      { speaker: "ai", text: "Thank you for calling ABC HVAC Services! This is Sarah, your AI assistant. How can I help you today?", delay: 500 },
      { speaker: "customer", text: "Hi, my air conditioner stopped working and it's really hot.", delay: 2000 },
      { speaker: "ai", text: "I'm sorry to hear that! I can definitely help you schedule a repair. Can I get your name and address?", delay: 1500 },
      { speaker: "customer", text: "Sure, it's John Smith at 123 Main Street.", delay: 2000 },
      { speaker: "ai", text: "Perfect, John. I have an opening tomorrow at 2 PM or Thursday at 10 AM. Which works better for you?", delay: 1500 },
      { speaker: "customer", text: "Tomorrow at 2 PM works great.", delay: 1500 },
      { speaker: "ai", text: "Excellent! I've booked your appointment for tomorrow at 2 PM. You'll receive a confirmation text shortly. Is there anything else I can help with?", delay: 2000 },
      { speaker: "customer", text: "No, that's all. Thank you!", delay: 1500 },
      { speaker: "ai", text: "You're welcome, John! Our technician will see you tomorrow. Have a great day!", delay: 1500 }
    ]
  },
  {
    id: 2,
    title: "Medical Appointment",
    icon: "🏥",
    conversation: [
      { speaker: "ai", text: "Good morning! You've reached Riverside Medical Center. I'm Alex, how may I assist you?", delay: 500 },
      { speaker: "customer", text: "I need to schedule a check-up with Dr. Martinez.", delay: 2000 },
      { speaker: "ai", text: "I'd be happy to help! May I have your name and date of birth?", delay: 1500 },
      { speaker: "customer", text: "Maria Garcia, March 15th, 1985.", delay: 2000 },
      { speaker: "ai", text: "Thank you, Maria. I see you in our system. Dr. Martinez has availability next Monday at 9 AM or Wednesday at 3 PM.", delay: 2000 },
      { speaker: "customer", text: "Monday at 9 AM works perfectly.", delay: 1500 },
      { speaker: "ai", text: "Perfect! I've scheduled your appointment with Dr. Martinez for Monday, 9 AM. You'll receive a reminder 24 hours before. See you then!", delay: 2000 }
    ]
  },
  {
    id: 3,
    title: "Plumbing Emergency",
    icon: "🚰",
    conversation: [
      { speaker: "ai", text: "Swift Plumbing, this is Jamie speaking. What's your emergency?", delay: 500 },
      { speaker: "customer", text: "I have a burst pipe in my kitchen! Water everywhere!", delay: 2000 },
      { speaker: "ai", text: "I understand this is urgent. First, have you turned off the main water valve?", delay: 1500 },
      { speaker: "customer", text: "Yes, I just did that.", delay: 1500 },
      { speaker: "ai", text: "Good thinking! I'm dispatching a plumber to your location immediately. Can I get your address?", delay: 1500 },
      { speaker: "customer", text: "456 Oak Avenue, apartment 3B.", delay: 2000 },
      { speaker: "ai", text: "Perfect. A technician will be there within 30 minutes. I'm sending you their contact info now. Stay safe!", delay: 2000 }
    ]
  },
  {
    id: 4,
    title: "Restaurant Reservation",
    icon: "🍽️",
    conversation: [
      { speaker: "ai", text: "Thank you for calling Bella Vista Restaurant. This is Emma, how can I help you?", delay: 500 },
      { speaker: "customer", text: "I'd like to make a reservation for dinner this Saturday.", delay: 2000 },
      { speaker: "ai", text: "Wonderful! For how many guests and what time were you thinking?", delay: 1500 },
      { speaker: "customer", text: "Four people, around 7 PM if possible.", delay: 1800 },
      { speaker: "ai", text: "Let me check... I have a lovely table for four available at 7:15 PM. Would that work?", delay: 1500 },
      { speaker: "customer", text: "That's perfect!", delay: 1200 },
      { speaker: "ai", text: "Great! May I have a name for the reservation?", delay: 1200 },
      { speaker: "customer", text: "David Chen.", delay: 1500 },
      { speaker: "ai", text: "All set, David! Your table for four is reserved for Saturday at 7:15 PM. We look forward to seeing you!", delay: 2000 }
    ]
  }
];

export default function LiveCallDemo() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (isCallActive && selectedScenario) {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      if (currentStep < scenario.conversation.length) {
        const currentMessage = scenario.conversation[currentStep];
        const timer = setTimeout(() => {
          setConversation(prev => [...prev, currentMessage]);
          setCurrentStep(prev => prev + 1);
        }, currentMessage.delay);
        return () => clearTimeout(timer);
      } else {
        // Call finished
        setTimeout(() => {
          setIsCallActive(false);
        }, 1500);
      }
    }
  }, [isCallActive, currentStep, selectedScenario]);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const startCall = (scenarioId) => {
    setSelectedScenario(scenarioId);
    setIsCallActive(true);
    setConversation([]);
    setCurrentStep(0);
    setCallDuration(0);
  };

  const endCall = () => {
    setIsCallActive(false);
    setConversation([]);
    setCurrentStep(0);
    setCallDuration(0);
    setSelectedScenario(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <Badge className="bg-gradient-to-r from-[#00D48A]/10 to-[#51A7FF]/10 text-[#00D48A] border-[#00D48A]/20 px-4 py-2 text-sm">
          ⚡ Live Demo
        </Badge>
        <h3 className="text-2xl font-bold text-[#1C1C1C] mt-4 mb-2">
          Try Our AI Agent Right Now
        </h3>
        <p className="text-[#6B7280]">
          Select a scenario and experience how our AI handles real customer interactions
        </p>
      </div>

      {!isCallActive ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#00D48A] group"
              onClick={() => startCall(scenario.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {scenario.icon}
                </div>
                <h4 className="font-semibold text-[#1C1C1C] mb-2">
                  {scenario.title}
                </h4>
                <Button
                  className="w-full gradient-button text-white mt-3"
                  size="sm"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Start Call
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="max-w-4xl mx-auto border-2 border-[#00D48A] shadow-2xl">
          <CardContent className="p-0">
            {/* Call Header */}
            <div className="bg-gradient-to-r from-[#00D48A] to-[#51A7FF] text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                    {scenarios.find(s => s.id === selectedScenario)?.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {scenarios.find(s => s.id === selectedScenario)?.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>Live Call - {formatTime(callDuration)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={endCall}
                  className="rounded-full bg-red-500 hover:bg-red-600"
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>

              {/* Audio indicators */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Mic className="w-4 h-4" />
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-white rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 16 + 8}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">AI Speaking</span>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="p-6 bg-gray-50 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.speaker === 'ai' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-4`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.speaker === 'ai'
                          ? 'bg-white border border-gray-200 text-[#1C1C1C]'
                          : 'bg-gradient-to-r from-[#00D48A] to-[#51A7FF] text-white'
                      }`}
                    >
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {message.speaker === 'ai' ? '🤖 AI Agent' : '👤 Customer'}
                      </div>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}
                {conversation.length > 0 && currentStep < scenarios.find(s => s.id === selectedScenario)?.conversation.length && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-4 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#00D48A] rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-[#00D48A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-[#00D48A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Call Footer */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-[#6B7280]">
                ✨ This is a simulated demo of our AI agent in action
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={endCall}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                End Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}