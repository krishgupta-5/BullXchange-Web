"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import Link from 'next/link'; // Imported Next.js Link component

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            {/* App Icon */}
            <img src="/app_icon.png" alt="BullXchange" className="w-10 h-10 group-hover:scale-105 transition-transform invert brightness-0" />
            <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>BullXchange</span>
          </Link>
        </div>

        {/* Navigation Links (FastAPI Cloud Style) */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            About
          </Link>
          <Link href="/features" className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Features
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/features#upcoming-features" className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Upcoming Features
            </Link>
            <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse"></div>
          </div>
          <Link href="/contact" className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Contact
          </Link>
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
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-zinc-400 hover:text-white p-2 transition-colors pointer-events-auto"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Full Screen Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40 md:hidden pointer-events-auto"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 z-50 md:hidden pointer-events-auto"
            >
              <div className="bg-black border-b border-white/10">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group cursor-pointer">
                    <img src="/app_icon.png" alt="BullXchange" className="w-10 h-10 group-hover:scale-105 transition-transform invert brightness-0" />
                    <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>BullXchange</span>
                  </Link>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-zinc-400 hover:text-white p-2 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="bg-black min-h-screen">
                <div className="flex flex-col px-5 py-8 space-y-6">
                  <Link 
                    href="/about" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl text-zinc-300 hover:text-white transition-colors py-3 border-b border-white/5" 
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    About
                  </Link>
                  <Link 
                    href="/features" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl text-zinc-300 hover:text-white transition-colors py-3 border-b border-white/5" 
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Features
                  </Link>
                  <Link 
                    href="/features#upcoming-features" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl text-zinc-300 hover:text-white transition-colors py-3 border-b border-white/5" 
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Upcoming Features
                  </Link>
                  <Link 
                    href="/contact" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl text-zinc-300 hover:text-white transition-colors py-3 border-b border-white/5" 
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Contact
                  </Link>
                  
                  <div className="pt-8">
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        alert('Download app functionality coming soon!');
                      }}
                      className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-lg font-semibold hover:bg-zinc-200 transition-colors w-full justify-center" 
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <Download size={20} />
                      Download App
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;