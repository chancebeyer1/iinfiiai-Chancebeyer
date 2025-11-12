import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('📝 Submitting form data:', formData);
      
      // Save to database
      await base44.entities.ContactSubmission.create(formData);

      // Send email notifications to both users
      const emailBody = `
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <h2 style="color: #00D48A;">New Contact Form Submission</h2>
  
  <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
  
  <h3 style="color: #1C1C1C;">📋 Contact Details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
      <td style="padding: 8px 0;">${formData.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Email:</td>
      <td style="padding: 8px 0;"><a href="mailto:${formData.email}" style="color: #00D48A;">${formData.email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Company:</td>
      <td style="padding: 8px 0;">${formData.company}</td>
    </tr>
  </table>
  
  <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
  
  <h3 style="color: #1C1C1C;">💬 Message</h3>
  <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #00D48A;">
    <p style="margin: 0; white-space: pre-wrap;">${formData.message || 'No message provided'}</p>
  </div>
  
  <hr style="border: none; border-top: 2px solid #e0e0e0; margin: 20px 0;">
  
  <p style="font-size: 12px; color: #6B7280;">
    This submission has been saved to the database.
  </p>
</body>
</html>
      `.trim();

      await Promise.all([
        base44.integrations.Core.SendEmail({
          from_name: "iinfii.ai Contact Form",
          to: "chanceb323@gmail.com",
          subject: `New Contact: ${formData.name} from ${formData.company}`,
          body: emailBody
        }),
        base44.integrations.Core.SendEmail({
          from_name: "iinfii.ai Contact Form",
          to: "billy@vasttrack.ai",
          subject: `New Contact: ${formData.name} from ${formData.company}`,
          body: emailBody
        })
      ]);

      console.log('✅ Form submitted successfully');
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", company: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      setError(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
      <div id="demo" className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-gray-200">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-[#1C1C1C]">
              Contact sales
            </CardTitle>
            <p className="text-[#6B7280] mt-2">
              Let's discuss how iinfii.ai can help your business
            </p>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            
            {isSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#00D48A] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#1C1C1C] mb-2">
                  Thank you!
                </h3>
                <p className="text-[#6B7280]">
                  We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Work Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@company.com"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    placeholder="Your Company Inc."
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">What can we help with?</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your needs..."
                    className="min-h-32 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 gradient-button text-white font-semibold text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Request Demo"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}