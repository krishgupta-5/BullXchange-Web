"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Menu } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`pointer-events-auto w-full max-w-6xl rounded-2xl flex items-center justify-between px-5 md:px-8 py-3.5 transition-all duration-300 bg-black border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2 group cursor-pointer">
            {/* App Icon */}
            <img src="/app_icon.png" alt="BullXchange" className="w-10 h-10 group-hover:scale-105 transition-transform invert brightness-0" />
            <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>BullXchange</span>
          </a>
        </div>

        {/* Navigation Links (FastAPI Cloud Style) */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/about" className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            About
          </a>
          <a href="/features" className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Features
          </a>
          <div className="flex items-center gap-2">
            <a href="/features#upcoming-features" className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Upcoming Features
            </a>
            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse"></div>
          </div>
          <a href="/contact" className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Contact
          </a>
        </div>

        {/* Download App Button */}
        <div className="hidden md:flex">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <Download size={16} />
            Download App
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-zinc-400 hover:text-white p-2 transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;