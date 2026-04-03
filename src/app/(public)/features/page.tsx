"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Target, Shield, DollarSign, Star, PieChart, 
  Cpu, AlertCircle, Zap, LineChart, MessageSquare, Crosshair, ArrowRight, Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function FeaturesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Handle scroll to upcoming features section if hash is present
  useEffect(() => {
    const handleScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'upcoming-features') {
        // Wait for page to fully render
        setTimeout(() => {
          const element = document.getElementById('upcoming-features');
          if (element) {
            const offset = 80; // Account for fixed navbar height
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 500);
      }
    };

    // Check on initial load
    if (mounted) {
      handleScroll();
    }
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleScroll);
    };
  }, [mounted]);

  return (
    // Global DM Sans font applied here, removed from all inline elements
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black overflow-hidden antialiased" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      <Navbar />

      {/* TECH GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* HEADER SECTION */}
      <section className="pt-40 pb-24 px-6 border-b border-[#222] relative z-10 flex flex-col justify-center min-h-[50vh]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[#111] border border-[#333] text-zinc-300 text-[11px] font-mono uppercase tracking-widest rounded-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> System Capabilities
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tighter leading-[1.05]">
              Platform Features.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to learn and master the stock market — without risking a single rupee.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 1: CORE TRADING */}
      <section className="py-24 px-6 border-b border-[#222] bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <div className="text-emerald-500 font-mono text-sm mb-3">01</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Core Trading Engine</h2>
            <p className="text-zinc-400 text-lg">Complete trading simulation with real market conditions.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Virtual Cash Wallet', desc: 'Start with ₹10,00,000 in virtual currency for free. Practice freely, learn from mistakes, and improve without any financial risk.' },
              { icon: Activity, title: 'Buy/Sell Simulation', desc: 'Execute Intraday and Delivery trades with real market order types including Market, Limit, and Stop-loss.' },
              { icon: Target, title: 'Futures & Options Trading', desc: 'Practice F&O trading in a safe environment. Learn derivatives without the fear of losing real money.' },
              { icon: PieChart, title: 'Portfolio Tracking', desc: 'Monitor your holdings with real-time profit & loss, trade history, and performance insights.' },
              { icon: LineChart, title: 'Real-Time Market Data', desc: 'Access live NSE/BSE stock prices, indices, and market movements.' },
              { icon: Crosshair, title: 'Corporate Actions Simulation', desc: 'Experience real-world events like stock splits, bonuses, and dividends inside the simulator.' },
            ].map((f, i) => (
              <div key={i} className="bg-[#0a0a0a] p-8 rounded-2xl border border-[#222] hover:border-[#444] transition-colors group">
                <div className="w-12 h-12 rounded-xl border border-[#333] bg-[#111] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                   <f.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: DIFFERENTIATORS */}
      <section className="py-24 px-6 border-b border-[#222] bg-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <div className="text-emerald-500 font-mono text-sm mb-3">02</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">What Makes Us Different</h2>
            <p className="text-zinc-400 text-lg">Unique features that set us apart from other platforms.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: DollarSign, title: 'All-in-One Trading Practice Platform', desc: 'Unlike other platforms, BullXchange provides both stock trading and F&O trading in one place — completely free.' },
              { icon: Star, title: 'Realistic Trading Experience', desc: 'Simulates real broker conditions including order execution and market behavior.' },
              { icon: Zap, title: 'Virtual IPO Participation', desc: 'Apply and experience IPOs in a simulated environment.' },
              { icon: PieChart, title: 'Hybrid Portfolios', desc: 'Manage different strategies by creating separate portfolios for long-term investing and F&O trading.' },
              { icon: MessageSquare, title: 'News & Market Impact Understanding', desc: 'Understand how market events affect stock prices and your portfolio.' }
            ].map((f, i) => (
              <div key={i} className="bg-[#050505] p-8 rounded-2xl border border-[#222] hover:border-[#444] transition-colors flex flex-col sm:flex-row gap-6 items-start group">
                <div className="p-4 bg-[#111] rounded-xl border border-[#333] group-hover:scale-105 transition-transform flex-shrink-0">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: ADDITIONAL FEATURES */}
      <section className="py-24 px-6 border-b border-[#222] bg-[#050505] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <div className="text-emerald-500 font-mono text-sm mb-3">03</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Additional Features</h2>
            <p className="text-zinc-400 text-lg">Tools to enhance your trading decisions.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'Stock Calculator', desc: 'Quickly calculate profit, loss, brokerage, and position sizing before placing trades. Make smarter decisions with accurate numbers.' }
            ].map((f, i) => (
              <div key={i} className="bg-[#0a0a0a] p-8 rounded-2xl border border-[#222] hover:border-[#444] transition-colors group">
                <div className="w-12 h-12 rounded-xl border border-[#333] bg-[#111] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                   <f.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: UPCOMING FEATURES */}
      <section id="upcoming-features" className="py-24 px-6 border-b border-[#222] bg-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <div className="text-emerald-500 font-mono text-sm mb-3">04</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Upcoming Features (Phase 2)</h2>
            <p className="text-zinc-400 text-lg">AI-powered features to take your trading to the next level.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Cpu, title: 'AI Trading Coach (Coming Soon)', desc: 'Smart insights to help you improve your trading decisions.' },
              { icon: AlertCircle, title: 'Behavior Analysis (Coming Soon)', desc: 'Track your mistakes like overtrading or emotional decisions.' },
              { icon: Activity, title: 'Strategy Backtesting (Coming Soon)', desc: 'Test your trading strategies on historical data.' },
              { icon: Target, title: 'Portfolio Insights (Coming Soon)', desc: 'Get suggestions to improve your risk management and returns.' },
            ].map((f, i) => (
              <div key={i} className="bg-[#050505] p-8 rounded-2xl border border-[#222] hover:border-[#444] transition-colors group">
                <div className="w-12 h-12 rounded-xl border border-[#333] bg-[#111] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                   <f.icon className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer 
        showBackToHome={true}
        backToHomeText="Return to Home"
        className="pt-20 pb-12"
      />
    </div>
  );
}