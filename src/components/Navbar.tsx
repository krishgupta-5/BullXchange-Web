"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import Link from 'next/link';

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
    /* FIXED PARENT CONTAINER - Holds both the Note and the Navbar so they never overlap */
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none">
      
      {/* 1. TOP NOTE BANNER (MOVING LEFT TO RIGHT) */}
      <div className="pointer-events-auto w-full bg-[#111] border-b border-[#222] py-2.5 overflow-hidden flex whitespace-nowrap shadow-md">
        <motion.div
          className="flex items-center w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-8 text-[10px] sm:text-xs">
              <span className="bg-zinc-800 text-white font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-widest shadow-sm">Note</span>
              <span className="text-zinc-300 font-medium tracking-wide">
                THIS APP IS CREATED ONLY FOR PAPER TRADING PURPOSE. IT HAS NO CONNECTIONS WITH REAL TRADING. IT USES REAL DATA BUT NO REAL CURRENCY IS USED. ALL TRADES USE VIRTUAL CURRENCY.
              </span>
              <span className="text-[#333] font-black">|</span>
              <span className="text-zinc-400 font-medium tracking-wide flex items-center gap-1">
                FOR SUGGESTIONS DROP THE MAIL: <a href="mailto:openforgein@gmail.com" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">openforgein@gmail.com</a>
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. FLOATING NAVBAR (USER'S EXACT UI) */}
      <div className="w-full px-4 md:px-6 pt-4 flex justify-center pointer-events-none">
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`pointer-events-auto w-full max-w-6xl rounded-2xl flex items-center justify-between px-5 md:px-8 py-3.5 transition-all duration-300 bg-black border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)]`}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              {/* IMAGE FIX: Uses Next Image. 'invert mix-blend-screen' magically drops the white background! */}
              <Image 
                src="/app_icon.png" 
                alt="BullXchange" 
                width={40} 
                height={40} 
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform brightness-0 invert" 
              />
              <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>BullXchange</span>
            </Link>
          </div>

          {/* Navigation Links */}
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
            <a
              href="https://mega.nz/file/9r91FSjJ#VNAMug3oWtpEyrWsMZ91Qw5qAvMe_T4LUe-D5Kai1PQ"
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors" 
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              <Download size={16} />
              Download App
            </a>
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
      </div>

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
                {/* Added margin-top to clear the note banner on mobile */}
                <div className="flex items-center justify-between px-5 py-3.5 mt-10">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group cursor-pointer">
                    <Image 
                      src="/app_icon.png" 
                      alt="BullXchange" 
                      width={40} 
                      height={40} 
                      className="w-10 h-10 object-contain group-hover:scale-105 transition-transform brightness-0 invert" 
                    />
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
                    <a
                      href="https://mega.nz/file/9r91FSjJ#VNAMug3oWtpEyrWsMZ91Qw5qAvMe_T4LUe-D5Kai1PQ"
                      target="_blank"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-lg font-semibold hover:bg-zinc-200 transition-colors w-full justify-center" 
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      <Download size={20} />
                      Download App
                    </a>
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