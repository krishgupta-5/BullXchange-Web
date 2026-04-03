"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, Target, BookOpen, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black overflow-hidden antialiased" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* 1. MINIMALIST FLOATING NAVIGATION */}
      <Navbar />

      {/* TECH GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* HERO SECTION */}
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-4 md:px-6 border-b border-[#222] relative z-10 flex flex-col justify-center min-h-[50vh] md:min-h-[60vh]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[#111] border border-[#333] text-zinc-300 text-[11px] font-mono uppercase tracking-widest rounded-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Mission
            </motion.div>
            
            {/* Removed whitespace-nowrap and adjusted line height for mobile */}
            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white tracking-tighter leading-tight md:leading-[1.05]">
              Learn Trading the Right Way — Without Risk
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed px-2 md:px-0">
              BullXchange is built for one simple purpose:<br className="hidden sm:block"/>
              to help people learn real market trading without risking real money.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* THE STORY / APP DETAILS */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative z-10 bg-black">
        {/* Adjusted padding and border radius for mobile */}
        <div className="max-w-6xl mx-auto bg-[#050505] rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-16 border border-[#222]">
          {/* Adjusted gap for mobile */}
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            
            {/* Left Content */}
            <div>
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#111] rounded-xl flex items-center justify-center mb-6 border border-[#333] text-emerald-500">
                <Target className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">About / Vision</h2>
              <div className="space-y-4 md:space-y-6">
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  Today, many platforms in the market do not provide a complete environment where users can practice both stock trading and F&O trading in one place — and definitely not for free.
                </p>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  <strong className="text-white font-semibold">BullXchange solves this problem.</strong>
                </p>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  We give every user ₹10 lakh in virtual currency for free, so they can experience real market conditions without any financial risk.
                </p>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  Our platform is designed to simulate real trading as closely as possible, helping you understand:
                </p>
                <ul className="text-zinc-400 leading-relaxed space-y-2 text-sm md:text-base pl-2">
                  <li>• Market behavior</li>
                  <li>• Risk management</li>
                  <li>• Trade execution</li>
                  <li>• Real-world decision making</li>
                </ul>
              </div>
            </div>

            {/* Right Content - Features Grid */}
            <div className="grid gap-4 mt-6 lg:mt-0">
              {[
                { icon: Shield, title: 'Zero Financial Risk', desc: 'Make your beginner mistakes without losing real money.' },
                { icon: Activity, title: 'Live Market Dynamics', desc: 'Experience real-time NSE/BSE data, options chains, and accurate brokerage simulation.' },
                { icon: BookOpen, title: 'AI-Powered Learning', desc: 'Our upcoming AI features will analyze your trading behavior and help you avoid overtrading and emotional decisions.' }
              ].map((val, i) => (
                <div key={i} className="flex gap-4 md:gap-5 p-5 md:p-6 rounded-xl bg-[#0a0a0a] border border-[#222] hover:border-[#333] transition-colors group">
                  <div className="text-emerald-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <val.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 md:mb-1.5 tracking-tight text-base md:text-lg">{val.title}</h4>
                    <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* CORE VALUE SECTION */}
      <section className="py-16 md:py-20 px-4 md:px-6 relative z-10 bg-black border-t border-[#222]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6 md:mb-8 px-3 py-1.5 bg-[#111] border border-[#333] text-zinc-300 text-[11px] font-mono uppercase tracking-widest rounded-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Core Value
            </motion.div>
            
            <motion.div variants={fadeInUp} className="space-y-3 md:space-y-4 px-2">
              <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 leading-relaxed font-medium">
                Practice in the real market.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 leading-relaxed font-medium">
                Learn from mistakes.
              </p>
              <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 leading-relaxed font-medium">
                Trade with confidence — without losing money.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer showBackToHome={true} />

    </div>
  );
}