import React, { useState } from "react";
import { Phone, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const scenario = scenarios.find(s => s.id === selectedScenario);
      
      // Call backend function to initiate outbound call
      const response = await fetch('/api/functions/initiateVapiCall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: phoneNumber.replace(/[\s\-\(\)]/g, ''),
          assistantId: scenario.assistantId,
          scenarioName: scenario.title
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      setIsSuccess(true);
      setPhoneNumber("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('❌ Error initiating call:', err);
      setError('Failed to initiate call. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          Get a Demo Call From Our AI
        </h3>
        <p className="text-[#6B7280] mb-8">
          Enter your phone number and we'll call you instantly to demonstrate our AI agent
        </p>

        {/* Success Message */}
        {isSuccess && (
          <div className="max-w-md mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-left">
              <p className="font-semibold text-green-900 mb-1">Call Initiated!</p>
              <p className="text-green-700">You should receive a call shortly.</p>
            </div>
          </div>
        )}

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          {/* Scenario Selector */}
          <div className="space-y-2">
            <Label htmlFor="scenario" className="text-left block text-sm font-medium text-[#1C1C1C]">
              Choose Demo Scenario
            </Label>
            <Select
              value={selectedScenario?.toString()}
              onValueChange={(value) => setSelectedScenario(parseInt(value))}
              disabled={isSubmitting}
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

          {/* Phone Number Input */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-left block text-sm font-medium text-[#1C1C1C]">
              Your Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
              className="h-14 text-lg border-2 border-gray-300 hover:border-[#00D48A] transition-colors"
              required
            />
            <p className="text-xs text-[#6B7280] text-left">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !phoneNumber}
            className="w-full gradient-button px-8 py-4 rounded-full text-white font-semibold shadow-2xl text-base h-14"
          >
            {isSubmitting ? (
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
        </form>
      </div>

      {/* Info Section */}
      <div className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-[#1C1C1C] mb-2">Instant Call</h4>
            <p className="text-sm text-[#6B7280]">
              Receive a call within seconds
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-bold text-[#1C1C1C] mb-2">Real Interaction</h4>
            <p className="text-sm text-[#6B7280]">
              Talk with our AI agent
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-[#1C1C1C] mb-2">No Cost</h4>
            <p className="text-sm text-[#6B7280]">
              Free demo, no commitment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}