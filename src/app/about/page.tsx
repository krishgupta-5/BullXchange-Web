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
      <section className="pt-40 pb-20 px-6 border-b border-[#222] relative z-10 flex flex-col justify-center min-h-[60vh]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[#111] border border-[#333] text-zinc-300 text-[11px] font-mono uppercase tracking-widest rounded-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Mission
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tighter leading-[1.05] whitespace-nowrap">
              Learn Trading the Right Way — Without Risk
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              BullXchange is built for one simple purpose:<br/>
              to help people learn real market trading without risking real money.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* THE STORY / APP DETAILS */}
      <section className="py-24 px-6 relative z-10 bg-black">
        <div className="max-w-6xl mx-auto bg-[#050505] rounded-3xl p-8 md:p-16 border border-[#222]">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div>
              <div className="w-12 h-12 bg-[#111] rounded-xl flex items-center justify-center mb-6 border border-[#333] text-emerald-500">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">About / Vision</h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Today, many platforms in the market do not provide a complete environment where users can practice both stock trading and F&O trading in one place — and definitely not for free.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-6">
                <strong className="text-white font-semibold">BullXchange solves this problem.</strong>
              </p>
              <p className="text-zinc-400 leading-relaxed mb-6">
                We give every user ₹10 lakh in virtual currency for free, so they can experience real market conditions without any financial risk.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Our platform is designed to simulate real trading as closely as possible, helping you understand:
              </p>
              <ul className="text-zinc-400 leading-relaxed mb-6 space-y-2">
                <li>• Market behavior</li>
                <li>• Risk management</li>
                <li>• Trade execution</li>
                <li>• Real-world decision making</li>
              </ul>
            </div>

            {/* Right Content - Features Grid */}
            <div className="grid gap-4">
              {[
                { icon: Shield, title: 'Zero Financial Risk', desc: 'Make your beginner mistakes without losing real money.' },
                { icon: Activity, title: 'Live Market Dynamics', desc: 'Experience real-time NSE/BSE data, options chains, and accurate brokerage simulation.' },
                { icon: BookOpen, title: 'AI-Powered Learning', desc: 'Our upcoming AI features will analyze your trading behavior and help you avoid overtrading and emotional decisions.' }
              ].map((val, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-xl bg-[#0a0a0a] border border-[#222] hover:border-[#333] transition-colors group">
                  <div className="text-emerald-500 mt-0.5 group-hover:scale-110 transition-transform">
                    <val.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1 tracking-tight">{val.title}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* CORE VALUE SECTION */}
      <section className="py-20 px-6 relative z-10 bg-black border-t border-[#222]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[#111] border border-[#333] text-zinc-300 text-[11px] font-mono uppercase tracking-widest rounded-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Core Value
            </motion.div>
            
            <motion.div variants={fadeInUp} className="space-y-4">
              <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
                Practice in the real market.
              </p>
              <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
                Learn from mistakes.
              </p>
              <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
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