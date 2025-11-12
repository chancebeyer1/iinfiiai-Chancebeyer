import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const scenarios = [
  {
    id: 1,
    title: "Hair Salon",
    icon: "💇",
    description: "Book a haircut appointment",
    vapiAssistantId: "YOUR_HAIR_SALON_ASSISTANT_ID",
    conversation: [
      { speaker: "ai", text: "Thank you for calling Luxe Hair Salon! This is Mia, your AI assistant. How can I help you today?", delay: 500 },
      { speaker: "customer", text: "Hi, I'd like to book a haircut appointment.", delay: 2000 },
      { speaker: "ai", text: "I'd be happy to help! Are you looking for just a cut, or would you like color or styling as well?", delay: 1500 },
      { speaker: "customer", text: "Just a cut and blow-dry, please.", delay: 1800 },
      { speaker: "ai", text: "Perfect! We have availability tomorrow at 11 AM or Friday at 2 PM. Which works better for you?", delay: 1500 },
      { speaker: "customer", text: "Friday at 2 PM sounds great.", delay: 1500 },
      { speaker: "ai", text: "Wonderful! May I have your name and phone number?", delay: 1200 },
      { speaker: "customer", text: "It's Sarah Johnson, 555-0123.", delay: 2000 },
      { speaker: "ai", text: "Perfect, Sarah! I've booked your haircut and blow-dry for Friday at 2 PM. You'll receive a confirmation text. See you then!", delay: 2000 }
    ]
  },
  {
    id: 2,
    title: "Restaurant",
    icon: "🍽️",
    description: "Make a dinner reservation",
    vapiAssistantId: "YOUR_RESTAURANT_ASSISTANT_ID",
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
  },
  {
    id: 3,
    title: "Photographer",
    icon: "📸",
    description: "Schedule a photo session",
    vapiAssistantId: "YOUR_PHOTOGRAPHER_ASSISTANT_ID",
    conversation: [
      { speaker: "ai", text: "Hi! You've reached Capture Moments Photography. I'm Alex, how may I assist you?", delay: 500 },
      { speaker: "customer", text: "I'm interested in booking a family photo session.", delay: 2000 },
      { speaker: "ai", text: "That's wonderful! We offer indoor studio sessions or outdoor location shoots. Which would you prefer?", delay: 1500 },
      { speaker: "customer", text: "Outdoor would be great, maybe at a park?", delay: 1800 },
      { speaker: "ai", text: "Perfect choice! How many people will be in the photos?", delay: 1200 },
      { speaker: "customer", text: "Five people - two adults and three kids.", delay: 1500 },
      { speaker: "ai", text: "Lovely! Our outdoor sessions are 90 minutes. We have availability next Sunday at 10 AM or 4 PM for the best natural lighting.", delay: 2000 },
      { speaker: "customer", text: "10 AM works better for us.", delay: 1500 },
      { speaker: "ai", text: "Excellent! Can I get your name and email to send you the session details and location?", delay: 1500 },
      { speaker: "customer", text: "Lisa Martinez, lisa.m@email.com", delay: 2000 },
      { speaker: "ai", text: "Perfect, Lisa! Your family session is booked for Sunday at 10 AM. I'll email you all the details shortly. Can't wait to capture your beautiful family!", delay: 2500 }
    ]
  },
  {
    id: 4,
    title: "Coffee Shop",
    icon: "☕",
    description: "Place a pickup order",
    vapiAssistantId: "YOUR_COFFEE_SHOP_ASSISTANT_ID",
    conversation: [
      { speaker: "ai", text: "Good morning! Thanks for calling Daily Grind Coffee. This is Jordan, what can I get started for you?", delay: 500 },
      { speaker: "customer", text: "Hi! I'd like to place an order for pickup.", delay: 1800 },
      { speaker: "ai", text: "Absolutely! What would you like to order?", delay: 1200 },
      { speaker: "customer", text: "Can I get a large caramel latte and a blueberry muffin?", delay: 2000 },
      { speaker: "ai", text: "You got it! Would you like the latte hot or iced?", delay: 1200 },
      { speaker: "customer", text: "Hot, please.", delay: 1200 },
      { speaker: "ai", text: "Perfect! That's one large hot caramel latte and a blueberry muffin. Your total is $8.50. When would you like to pick it up?", delay: 1800 },
      { speaker: "customer", text: "In about 15 minutes?", delay: 1500 },
      { speaker: "ai", text: "That works great! Can I get a name for the order?", delay: 1200 },
      { speaker: "customer", text: "Michael.", delay: 1200 },
      { speaker: "ai", text: "Awesome, Michael! Your order will be ready in 15 minutes. See you soon!", delay: 1500 }
    ]
  }
];

export default function LiveCallDemo() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [useVapi, setUseVapi] = useState(false); // Toggle for Vapi integration

  // Vapi integration hook - currently using demo mode
  useEffect(() => {
    // TODO: Initialize Vapi SDK here when ready
    // Example: 
    // import Vapi from "@vapi-ai/web";
    // const vapi = new Vapi("YOUR_PUBLIC_KEY");
    
    // For now, we'll use demo conversations
    setUseVapi(false);
  }, []);

  useEffect(() => {
    if (isCallActive && selectedScenario && !useVapi) {
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
  }, [isCallActive, currentStep, selectedScenario, useVapi]);

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

    // TODO: When Vapi is integrated, start real call here
    // const scenario = scenarios.find(s => s.id === scenarioId);
    // vapi.start(scenario.vapiAssistantId);
  };

  const endCall = () => {
    setIsCallActive(false);
    setConversation([]);
    setCurrentStep(0);
    setCallDuration(0);
    setSelectedScenario(null);

    // TODO: When Vapi is integrated, stop call here
    // vapi.stop();
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
                <p className="text-sm text-[#6B7280] mb-3">
                  {scenario.description}
                </p>
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