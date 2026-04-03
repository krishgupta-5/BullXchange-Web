"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  showBackToHome?: boolean;
  backToHomeText?: string;
  className?: string;
}

export default function Footer({ 
  showBackToHome = false, 
  backToHomeText = "Back to Home",
  className = ""
}: FooterProps) {
  return (
    <footer className={`pt-12 pb-8 px-6 border-t border-[#222] bg-black relative z-10 ${className}`}>
      
      {/* Optional Back to Home CTA for subpages */}
      {showBackToHome && (
        <div className="text-center mb-12">
          <p className="text-sm text-zinc-500 mb-6">Ready to test our platform?</p>
          <a href="/" className="inline-flex items-center gap-2 text-white font-semibold hover:text-zinc-300 transition-colors border-b border-white/20 pb-1">
            {backToHomeText} <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}
      
      {/* Main Page Footer Layout (No Logo, Only Name) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-bold text-white tracking-tight">
          BullXchange
        </div>
        <div className="text-xs text-zinc-500 font-medium">
          © {new Date().getFullYear()} BullXchange. All rights reserved.
        </div>
      </div>
    </footer>
  );
}