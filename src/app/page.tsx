"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { 
  Play, TrendingUp, Activity, Target, Shield, Check, Minus, Star, Download, ChevronDown, ArrowRight, Cpu, Terminal
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

// Added image URLs to testimonials
const testimonials = [
  { text: "BullXchange helped me understand options trading without losing my savings. The interface is incredibly professional.", author: "Rohan D.", role: "Beginner Trader", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { text: "The execution speed and live market data make it feel exactly like a real institutional broker terminal. Flawless.", author: "Anjali M.", role: "Day Trader", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { text: "Finally, a paper trading app that doesn't look like a mobile game. Pure, clean, and built for serious practice.", author: "Vikram S.", role: "Financial Analyst", image: "https://randomuser.me/api/portraits/men/68.jpg" },
  { text: "The ₹10L virtual cash reset feature is perfect for forward-testing different monthly strategies before going live.", author: "Priya K.", role: "Swing Trader", image: "https://randomuser.me/api/portraits/women/65.jpg" },
  { text: "As an instructor, I mandate that all my students use BullXchange before they are allowed to touch real capital.", author: "Amit R.", role: "Trading Mentor", image: "https://randomuser.me/api/portraits/men/46.jpg" },
];

// Dummy profile images for the Hero trust badge
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
    // Global DM Sans application on the root container
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black overflow-hidden antialiased" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />

      {/* TECH GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* 1. HERO SECTION */}
      <section className="pt-40 pb-20 px-6 min-h-[85vh] flex flex-col justify-center border-b border-[#222] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 w-full">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:w-1/2 text-center lg:text-left z-20">
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
              <button className="bg-white text-black hover:bg-zinc-200 font-semibold py-3.5 px-8 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5">
                 <Download className="w-4 h-4"/> Download App
              </button>
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

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:w-1/2 w-full flex justify-center relative">
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
                  <div className="h-48 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
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
      <div className="w-full border-b border-[#222] bg-[#050505] overflow-hidden flex whitespace-nowrap relative z-10">
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
      <section className="py-12 border-b border-[#222] bg-black relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center">
          <p className="text-zinc-500 text-[10px] font-medium uppercase tracking-widest mb-6 text-center">Special thanks for the real-time data API</p>
          <a 
            href="https://smartapi.angelbroking.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white/95 px-8 py-4 rounded-xl border border-[#333] shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300 group cursor-pointer block"
          >
            <img 
              src="/smart-api-logo.png" 
              alt="Angel One Smart API" 
              className="h-8 md:h-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
            />
          </a>
        </div>
      </section>

      {/* TERMINAL METRICS SECTION */}
      <section className="border-b border-[#222] bg-[#050505] relative z-10">
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
      <section className="py-32 px-6 border-b border-[#222] relative z-10 bg-black">
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

      {/* 3. HOW IT WORKS (SIMPLE VIDEO SECTION) */}
      <section className="py-32 px-6 border-b border-[#222] relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-[#111] border border-[#333] text-zinc-400 text-xs font-semibold uppercase tracking-widest rounded-full">
              Getting Started
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">How it works.</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Go from absolute beginner to confident trader in four simple steps.</p>
          </div>

          {/* SIMPLE ALWAYS-PLAYING VIDEO CONTAINER */}
          <div className="relative w-full aspect-video md:aspect-[21/9] bg-[#0a0a0a] rounded-[2rem] border border-[#333] overflow-hidden mb-20 shadow-2xl">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-70 mix-blend-lighten grayscale contrast-125"
              // src="/your-demo-video.mp4" <-- REPLACE WITH YOUR ACTUAL VIDEO
            >
              {/* Fallback placeholder video for UI demonstration */}
              <source src="https://cdn.pixabay.com/video/2020/05/24/40061-424855217_large.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-10"></div>
            
            {/* Simple Live Badge */}
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10B981]"></div>
               <span className="text-white font-semibold text-xs tracking-wide">Live App Preview</span>
            </div>
          </div>

          {/* TRADING STEPS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Create your account", desc: "Sign up in seconds with secure mobile OTP verification." },
              { step: "02", title: "Claim virtual cash", desc: "Receive ₹10,00,000 in your virtual wallet immediately." },
              { step: "03", title: "Trade live markets", desc: "Buy and sell real stocks and options using live data." },
              { step: "04", title: "Track & improve", desc: "Analyze your performance, learn from mistakes, and refine your strategy." }
            ].map((s, i) => (
              <div key={i} className="relative p-8 bg-[#0a0a0a] border border-[#222] rounded-2xl hover:bg-[#111] hover:border-[#333] transition-colors group overflow-hidden">
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
      <section className="py-32 px-6 border-b border-[#222] bg-black relative z-10">
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
      <section className="py-24 overflow-hidden bg-[#050505] border-b border-[#222] relative z-10">
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
      <section className="py-32 px-6 border-b border-[#222] bg-black relative z-10">
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

      {/* 7. CTA SECTION */}
      <section className="py-32 px-6 bg-[#050505] relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-zinc-500 text-[10px] font-semibold uppercase tracking-widest mb-6">Trade Risk-Free</div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tighter">Ready to start trading?</h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto">Start practicing today with ₹10,00,000 virtual capital. <br className="hidden sm:block"/> No risk. Just real learning.</p>
          <button className="bg-white text-black font-semibold py-4 px-10 rounded-lg text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-0.5">
            <Download className="w-4 h-4" /> Download for Android
          </button>
        </div>
      </section>

      {/* 8. FOOTER (NO LOGO, ONLY NAME) */}
      <Footer />
    </div>
  );
}