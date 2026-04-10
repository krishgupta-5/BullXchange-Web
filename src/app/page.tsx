"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { 
  Play, TrendingUp, Activity, Target, Shield, Check, Minus, Star, Download, ChevronDown, ArrowRight, Cpu, Terminal, AlertCircle, Info
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const mockStockData = [
  { time: '9:30', price: 150.2 }, { time: '10:00', price: 152.5 },
  { time: '10:30', price: 151.8 }, { time: '11:00', price: 154.2 },
  { time: '11:30', price: 155.9 }, { time: '12:00', price: 154.5 },
  { time: '12:30', price: 157.2 }, { time: '13:00', price: 159.8 },
  { time: '13:30', price: 158.4 }, { time: '14:00', price: 161.2 },
  { time: '14:30', price: 163.5 }, { time: '15:00', price: 162.8 },
  { time: '15:30', price: 165.4 }, { time: '16:00', price: 168.1 }
];

const tickerItems = [
  { sym: "NIFTY 50", price: "22,145.20", change: "+0.45%", up: true },
  { sym: "BANKNIFTY", price: "46,230.10", change: "-0.12%", up: false },
  { sym: "RELIANCE", price: "2,950.00", change: "+1.20%", up: true },
  { sym: "HDFCBANK", price: "1,450.75", change: "-0.50%", up: false },
  { sym: "INFY", price: "1,680.25", change: "+0.80%", up: true },
  { sym: "TCS", price: "3,985.60", change: "+0.30%", up: true },
  { sym: "ITC", price: "3,810.00", change: "-0.25%", up: false },
];

const testimonials = [
  { text: "BullXchange helped me understand options trading without losing my savings. The interface is incredibly professional.", author: "Rohan D.", role: "Beginner Trader", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { text: "The execution speed and live market data make it feel exactly like a real institutional broker terminal. Flawless.", author: "Anjali M.", role: "Day Trader", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { text: "Finally, a paper trading app that doesn't look like a mobile game. Pure, clean, and built for serious practice.", author: "Vikram S.", role: "Financial Analyst", image: "https://randomuser.me/api/portraits/men/68.jpg" },
  { text: "The ₹10L virtual cash reset feature is perfect for forward-testing different monthly strategies before going live.", author: "Priya K.", role: "Swing Trader", image: "https://randomuser.me/api/portraits/women/65.jpg" },
  { text: "As an instructor, I mandate that all my students use BullXchange before they are allowed to touch real capital.", author: "Amit R.", role: "Trading Mentor", image: "https://randomuser.me/api/portraits/men/46.jpg" },
];

const dummyAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/68.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg"
];

const duplicatedTestimonials = [...testimonials, ...testimonials];
const duplicatedTicker = [...tickerItems, ...tickerItems, ...tickerItems];

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function BullXchangeLanding() {
  const [mounted, setMounted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  const faqs = [
    { q: "Is this real money trading?", a: "No, BullXchange is a paper trading simulator. We provide you with ₹10,00,000 in virtual cash to practice trading without any financial risk." },
    { q: "Is it free to use?", a: "Yes. The core platform and real-time market data are completely free to use for practicing your strategies." },
    { q: "Can beginners use it?", a: "Yes. The platform is designed to help beginners learn the mechanics of the market before risking real capital." },
    { q: "Does it support options trading?", a: "Yes. You can trade both Equities and F&O (Call/Put options) with real-time options chain data." }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black overflow-hidden antialiased" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* GLOBAL CSS OVERRIDE TO FIX NAVBAR OVERLAP */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Pushes the Navbar down by the exact height of the Top Note Banner (40px) */
        nav, header[class*="fixed"], div[class*="fixed"] > nav {
          top: 40px !important;
        }
        /* Extra padding for main content so hero isn't cut off */
        .hero-padding {
          padding-top: 12rem !important;
        }
      `}} />

      {/* 1. TOP NOTE BANNER (MOVING LEFT TO RIGHT) */}
      <div className="fixed top-0 left-0 w-full h-[40px] bg-[#111] border-b border-[#333] z-[100] flex items-center overflow-hidden whitespace-nowrap">
        <motion.div
          className="flex items-center w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-8 text-[10px] sm:text-xs">
              <span className="bg-zinc-800 text-white font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-widest shadow-sm">Note</span>
              <span className="text-zinc-300 font-medium tracking-wide">
                THIS APP IS CREATED ONLY FOR PAPER TRADING PURPOSE. IT HAS NO CONNECTIONS WITH REAL TRADING. IT USES REAL DATA BUT NO REAL CURRENCY IS USED. ALL TRADES USE VIRTUAL CURRENCY.
              </span>
              <span className="text-[#444] font-black">|</span>
              <span className="text-zinc-400 font-medium tracking-wide flex items-center gap-1">
                FOR SUGGESTIONS DROP THE MAIL: <a href="mailto:openforgein@gmail.com" className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">openforgein@gmail.com</a>
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <Navbar />

      {/* TECH GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* 1. HERO SECTION */}
      <section className="hero-padding pb-20 px-6 min-h-[85vh] flex flex-col justify-center border-b border-[#222] relative z-10" data-aos="fade-up">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 w-full">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:w-1/2 text-center lg:text-left z-20" data-aos="fade-right">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[#111] border border-[#333] text-zinc-300 text-xs font-medium uppercase tracking-widest rounded-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Simulation
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tighter leading-[1.05]">
              You practice. <br/><span className="text-zinc-600">We simulate.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg mb-10 leading-relaxed text-zinc-400 max-w-xl mx-auto lg:mx-0">
              Practice real market trading without risking real money. Start with ₹10,00,000 in virtual capital and learn stocks + F&O in a real-time simulation environment.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="https://mega.nz/file/9r91FSjJ#VNAMug3oWtpEyrWsMZ91Qw5qAvMe_T4LUe-D5Kai1PQ"
                target="_blank"
                className="bg-white text-black hover:bg-zinc-200 font-semibold py-3.5 px-8 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
              >
                 <Download className="w-4 h-4"/> Download App
              </a>
              <button className="bg-[#0a0a0a] hover:bg-[#111] border border-[#333] text-white font-semibold py-3.5 px-8 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 hover:-translate-y-0.5">
                 <Play className="w-4 h-4 fill-white" /> Watch Demo
              </button>
            </motion.div>

            {/* TRUSTED BY SECTION */}
            <motion.div variants={fadeUp} className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-3">
                {dummyAvatars.map((src, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-zinc-800">
                    <img 
                      src={src} 
                      alt={`User ${i+1}`} 
                      className="w-full h-full object-cover grayscale opacity-80" 
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-xs text-zinc-500 font-medium">
                  Trusted by <span className="text-zinc-300 font-semibold">100+</span> users
                </p>
              </div>
            </motion.div>

          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:w-1/2 w-full flex justify-center relative" data-aos="fade-left">
            {/* Subtle glow behind the phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="w-[320px] h-[650px] bg-[#050505] rounded-[2.5rem] border border-[#333] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col group z-10">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#111] rounded-full z-40 border border-[#222]"></div>
              <div className="px-6 pt-16 pb-6 border-b border-[#222] bg-[#0a0a0a]">
                <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest mb-1">Portfolio Value</p>
                <h2 className="text-4xl font-bold text-white tracking-tight">₹10,24,532</h2>
                <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-xs font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> + ₹24,532.00 (2.4%)
                </div>
              </div>
              <div className="flex-1 p-4 relative flex flex-col bg-[#050505]">
                {mounted && (
                  <div className="w-full mt-4" style={{ height: '192px' }}>
                    <ResponsiveContainer width="100%" height={192}>
                      <AreaChart data={mockStockData}>
                        <defs>
                          <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#10B981' }} />
                        <Area type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorMain)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="mt-auto pb-2 flex gap-3">
                  <button className="flex-1 bg-[#111] border border-[#333] text-white font-medium py-3 rounded-xl hover:bg-[#222] transition-colors text-sm">Sell</button>
                  <button className="flex-1 bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition-colors text-sm">Buy</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LIVE MARKET TICKER */}
      <div className="w-full border-b border-[#222] bg-[#050505] overflow-hidden flex whitespace-nowrap relative z-10 py-3" data-aos="slide-up">
        <motion.div 
          className="flex items-center"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {duplicatedTicker.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-8 py-3 border-r border-[#222]">
              <span className="text-zinc-300 font-semibold text-xs tracking-wider">{item.sym}</span>
              <span className="text-white font-medium text-sm">{item.price}</span>
              <span className={`font-medium text-xs ${item.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {item.change}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* SPECIAL THANKS / ANGEL ONE API SECTION */}
      <section className="py-16 border-b border-[#222] bg-[#050505] relative z-10" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-6 text-center">
            Special thanks for the real-time data API
          </p>
          <a 
            href="https://smartapi.angelbroking.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white px-10 py-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer block transform hover:-translate-y-1"
          >
            <img 
              src="/smart-api-logo.png" 
              alt="Angel One Smart API" 
              className="h-8 md:h-12 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
              style={{ backgroundColor: 'white' }}
            />
          </a>
        </div>
      </section>

      {/* TERMINAL METRICS SECTION */}
      <section className="border-b border-[#222] bg-[#050505] relative z-10" data-aos="fade-up">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-[#222] border-l border-r border-[#222]">
          {[
            { label: "Active Traders", value: "10,000+" },
            { label: "Virtual Capital", value: "₹5B+" },
            { label: "Orders Executed", value: "2.5M+" },
            { label: "Platform Uptime", value: "99.99%" }
          ].map((metric, i) => (
            <div key={i} className="p-8 text-center hover:bg-[#111] transition-colors border-b md:border-b-0 border-[#222]">
              <h3 className="text-3xl font-bold text-white mb-2 tracking-tighter">{metric.value}</h3>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. FEATURES GLIMPSE */}
      <section className="py-32 px-6 border-b border-[#222] relative z-10 bg-black" data-aos="fade-up">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/3">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Platform <br/>capabilities.</h2>
            <p className="text-zinc-400 text-lg mb-8 leading-relaxed">Experience a terminal-grade platform designed to simulate the mechanics of the real market, without the financial ruin.</p>
            <a href="/features" className="inline-flex items-center gap-2 text-white font-medium text-sm hover:text-zinc-400 transition-colors border-b border-white/20 pb-1">
              Explore All Features <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4">
            {[
              { icon: Terminal, title: 'Live Execution', desc: 'Tick-by-tick NSE/BSE stock quotes for precise simulated pricing.' },
              { icon: Target, title: 'Derivatives Engine', desc: 'Practice both stocks and F&O trading in one platform.' },
              { icon: Shield, title: 'Capital Protection', desc: 'Start with ₹10,00,000 virtual cash. Learn without financial risk.' },
              { icon: Cpu, title: 'Advanced Insights (Coming Soon)', desc: 'Performance tracking and smart insights to improve your trading decisions.' }
            ].map((f, i) => (
              <div key={i} className="bg-[#0a0a0a] p-8 rounded-2xl border border-[#222] hover:border-[#333] hover:bg-[#111] transition-colors">
                <div className="w-12 h-12 rounded-xl border border-[#333] bg-[#1a1a1a] flex items-center justify-center mb-6">
                   <f.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. COMING SOON VIDEO SECTION */}
      <section className="py-32 px-6 border-b border-[#222] bg-[#0a0a0a]" id="video-demo" data-aos="zoom-in">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-3 block">App Walkthrough</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">See BullXchange in Action</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-16">
            Watch how BullXchange simplifies your trading practice with our comprehensive demo video.
          </p>

          <div className="relative aspect-video bg-[#111] rounded-[2rem] border border-[#333] overflow-hidden shadow-2xl group cursor-pointer">
            {/* Glassmorphism Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-300 z-20">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-black pl-1.5 shadow-lg">
                  <Play className="w-6 h-6 md:w-8 md:h-8 fill-black" />
                </div>
              </div>
            </div>
            
            <img
              src="https://placehold.co/1280x720/111111/333333?text=BullXchange+App+Demo"
              alt="Demo Video Thumbnail"
              className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <p className="mt-8 text-sm text-zinc-500 font-bold flex items-center justify-center gap-2">
            <Info className="w-4 h-4 text-emerald-500" /> Full product tour coming soon.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-32 px-6 border-b border-[#222] relative z-10 bg-[#050505]" data-aos="fade-up">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-[#111] border border-[#333] text-zinc-400 text-xs font-semibold uppercase tracking-widest rounded-full">
            Getting Started
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-16 tracking-tighter">How it works.</h2>
          
          {/* TRADING STEPS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Create your account", desc: "Sign up in seconds with secure mobile OTP verification." },
              { step: "02", title: "Claim virtual cash", desc: "Receive ₹10,00,000 in your virtual wallet immediately." },
              { step: "03", title: "Trade live markets", desc: "Buy and sell real stocks and options using live data." },
              { step: "04", title: "Track & improve", desc: "Analyze your performance, learn from mistakes, and refine your strategy." }
            ].map((s, i) => (
              <div key={i} className="relative p-8 bg-[#0a0a0a] border border-[#222] rounded-2xl hover:bg-[#111] hover:border-[#333] transition-colors group overflow-hidden text-left">
                <div className="text-5xl font-bold text-[#222] mb-6 tracking-tighter group-hover:text-zinc-800 transition-colors">{s.step}</div>
                <h4 className="text-lg font-bold text-white mb-2 tracking-tight">{s.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">{s.desc}</p>
                <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-0 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPARISON TABLE */}
      <section className="py-32 px-6 border-b border-[#222] bg-black relative z-10" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">Why BullXchange?</h2>
            <p className="text-zinc-400 text-lg">A safer, smarter way to learn trading before risking real money.</p>
          </div>
          
          <div className="border border-[#333] rounded-2xl overflow-hidden bg-[#050505]">
            <div className="grid grid-cols-3 gap-4 bg-[#111] p-6 border-b border-[#333] text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              <div className="text-left">Parameter</div>
              <div className="text-white">BullXchange</div>
              <div>Live Brokers</div>
            </div>
            
            {[
              { label: "Cost to Start", us: "₹0 (Free ₹10L virtual capital)", usIcon: Check, them: "Requires real money investment", themIcon: Minus },
              { label: "Financial Risk", us: "Zero risk", usIcon: Check, them: "High risk of losing capital", themIcon: Minus },
              { label: "Learning Environment", us: "Built for learning & practice", usIcon: Check, them: "Built for real execution only", themIcon: Minus },
              { label: "Stocks + F&O Practice", us: "Available in one platform (Free)", usIcon: Check, them: "Not available for free in one place", themIcon: Minus },
              { label: "Beginner Friendly", us: "Safe for beginners", usIcon: Check, them: "Risky for beginners", themIcon: Minus },
              { label: "Mistake Handling", us: "Learn from mistakes without loss", usIcon: Check, them: "Mistakes cost real money", themIcon: Minus },
              { label: "Market Data", us: "Real-time market simulation", usIcon: Check, them: "Real-time market data", themIcon: Check }
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 gap-4 p-6 border-b border-[#222] text-sm font-medium items-center hover:bg-[#0a0a0a] transition-colors">
                <div className="text-left text-zinc-400 text-xs tracking-wide">{row.label}</div>
                <div className="text-white flex items-start sm:items-center gap-2">
                  <row.usIcon className="w-4 h-4 text-emerald-500 mt-0.5 sm:mt-0 flex-shrink-0" /> 
                  <span className="leading-snug">{row.us}</span>
                </div>
                <div className="text-zinc-600 flex items-start sm:items-center gap-2">
                  <row.themIcon className="w-4 h-4 mt-0.5 sm:mt-0 flex-shrink-0" /> 
                  <span className="leading-snug">{row.them}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MOVING TESTIMONIALS (Marquee) */}
      <section className="py-24 overflow-hidden bg-[#050505] border-b border-[#222] relative z-10" data-aos="fade-up">
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>
        
        <div className="text-center mb-16 max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">Trusted by learners and traders.</h2>
        </div>

        <div className="flex w-full overflow-hidden">
          <motion.div
            className="flex gap-6 w-max px-3"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {duplicatedTestimonials.map((testimonial, idx) => (
              <div key={idx} className="w-[320px] md:w-[400px] flex-shrink-0 bg-[#0a0a0a] border border-[#222] rounded-2xl p-8 flex flex-col justify-between">
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">"{testimonial.text}"</p>
                </div>
                
                {/* Updated Testimonial Author Block with Image */}
                <div className="flex items-center gap-3 mt-4">
                  <div className="w-10 h-10 rounded-full border border-[#333] overflow-hidden bg-zinc-800 flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author} 
                      className="w-full h-full object-cover grayscale opacity-80" 
                    />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm tracking-tight">{testimonial.author}</h4>
                    <p className="text-zinc-500 text-xs mt-0.5 uppercase tracking-widest font-medium">{testimonial.role}</p>
                  </div>
                </div>

              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-32 px-6 border-b border-[#222] bg-black relative z-10" data-aos="fade-up">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tighter">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="border border-[#222] bg-[#0a0a0a] rounded-xl p-6 cursor-pointer hover:border-[#333] transition-colors">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-base text-white tracking-tight">{faq.q}</h4>
                  <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="mt-4 text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SCAN TO DOWNLOAD CTA */}
      <section className="py-24 px-6 bg-[#050505] relative z-10" data-aos="fade-up">
        <div className="max-w-5xl mx-auto relative">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative shadow-2xl">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500 opacity-5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

            <div className="flex-1 text-center md:text-left relative z-10">
              <div className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-4">Trade Risk-Free</div>
              <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">Ready to start trading?</h2>
              <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
                Start practicing today with ₹10,00,000 virtual capital. No risk. Just real learning and simulated execution.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <a
                  href="https://mega.nz/file/9r91FSjJ#VNAMug3oWtpEyrWsMZ91Qw5qAvMe_T4LUe-D5Kai1PQ"
                  target="_blank"
                  className="bg-white text-black font-bold py-4 px-8 rounded-xl text-sm hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" /> Download for Android
                </a>
              </div>
            </div>

            <div className="flex-shrink-0 bg-white p-5 rounded-2xl transform hover:scale-105 transition-transform duration-500 relative z-10">
              <img 
                src="/QR IMAGE.png" 
                alt="Scan to Download App" 
                className="w-40 h-40 md:w-48 md:h-48 rounded-xl object-contain border border-zinc-200"
              />
              <p className="text-black text-[10px] font-bold text-center mt-4 uppercase tracking-widest">Scan to Download</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (NO LOGO, ONLY NAME) */}
      <Footer />
    </div>
  );
}