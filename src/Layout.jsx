import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navigation = [
    { label: "How it Works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "Results", href: "#results" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <div className="min-h-screen bg-[#F9F9F7]">
      <style>{`
        :root {
          --primary: #00D48A;
          --secondary: #51A7FF;
          --text: #1C1C1C;
          --muted: #6B7280;
          --neutral: #BFC2C6;
          --surface: #FFFFFF;
        }
        
        * {
          scroll-behavior: smooth;
        }
        
        .gradient-text {
          background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .gradient-button {
          background: linear-gradient(90deg, #00D48A 0%, #51A7FF 100%);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .gradient-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 212, 138, 0.3);
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-lg shadow-sm" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <path d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M32 20C32 26.627 26.627 32 20 32C13.373 32 8 26.627 8 20C8 13.373 13.373 8 20 8" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1C1C1C]">iinfii.ai</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium text-[#6B7280] hover:text-[#00D48A] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button
                onClick={() => scrollToSection('#demo')}
                className="gradient-button px-6 py-2.5 rounded-full text-white font-semibold text-sm"
              >
                Book a Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#1C1C1C]" />
              ) : (
                <Menu className="w-6 h-6 text-[#1C1C1C]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              {navigation.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#00D48A] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('#demo')}
                className="gradient-button w-full px-6 py-2.5 rounded-full text-white font-semibold text-sm"
              >
                Book a Demo
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Company */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00D48A] to-[#51A7FF] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                    <path d="M8 20C8 13.373 13.373 8 20 8C26.627 8 32 13.373 32 20C32 26.627 26.627 32 20 32" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    <path d="M32 20C32 26.627 26.627 32 20 32C13.373 32 8 26.627 8 20C8 13.373 13.373 8 20 8" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-lg font-bold">iinfii.ai</span>
              </div>
              <p className="text-sm text-gray-400">
                Infinite Reception. Instant Response.
              </p>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-sm text-gray-400 hover:text-[#00D48A] transition-colors">About</a></li>
                <li><a href="#careers" className="text-sm text-gray-400 hover:text-[#00D48A] transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#integrations" className="text-sm text-gray-400 hover:text-[#00D48A] transition-colors">Integrations</a></li>
                <li><a href="#security" className="text-sm text-gray-400 hover:text-[#00D48A] transition-colors">Security</a></li>
              </ul>
            </div>

            {/* Contact Links */}
            <div>
              <h3 className="font-semibold mb-4">Get in touch</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('#contact')} className="text-sm text-gray-400 hover:text-[#00D48A] transition-colors">Contact</button></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-[#00D48A] transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} iinfii.ai. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}