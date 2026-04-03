"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Link, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Check if environment variable is available
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) {
        console.error('Web3Forms access key is missing');
        setSubmitStatus('error');
        return;
      }

      console.log('Submitting form with data:', {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      // Sending data silently in the background using Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New BullXchange Contact from ${formData.name}`,
          from_name: "BullXchange System"
        }),
      });

      const result = await response.json();
      console.log('Web3Forms response:', result);

      if (result.success) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error('Web3Forms submission failed:', result);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black overflow-hidden antialiased" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <div className="animate-pulse">
          <div className="h-20 bg-[#111] border-b border-[#222]"></div>
          <div className="h-96 bg-[#050505] mx-6 mt-40 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    // Global DM Sans and strict dark mode background
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black overflow-hidden antialiased" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      <Navbar />

      {/* TECH GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      <section className="relative pt-40 pb-24 px-6 border-b border-[#222] z-10">
        <div className="max-w-7xl mx-auto">
          
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center mb-20">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-[#111] border border-[#333] text-zinc-300 text-[11px] font-mono uppercase tracking-widest rounded-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Support & Dev
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tighter leading-[1.05]">
              Let's Connect.
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Have questions about the platform, feedback on the beta, or want to collaborate? <br className="hidden md:block"/> Reach out to us — we’d love to hear from you.
            </motion.p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* LEFT: CONTACT FORM */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full lg:w-3/5 bg-[#050505] rounded-3xl p-8 md:p-12 border border-[#222] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
              
              <h3 className="text-2xl font-bold mb-2 text-white tracking-tight">Contact Us</h3>
              <p className="text-sm text-zinc-500 mb-8">We typically respond within 24 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe" 
                      required
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com" 
                      required
                      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-zinc-500">Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5} 
                    placeholder="How can we help you?" 
                    required
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all resize-none"
                  ></textarea>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                    ✓ Message sent successfully. We’ll get back to you soon!
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    ✗ Something went wrong. Please try again or contact us directly via email.
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-white text-black font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 pt-8 border-t border-[#222] flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
                 <span className="font-mono text-xs">OR CONTACT US DIRECTLY:</span>
                 <a href="mailto:openforgein@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors">
                   <Mail className="w-4 h-4"/> openforgein@gmail.com
                 </a>
              </div>
            </motion.div>

            {/* RIGHT: MEET THE CREATORS */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="w-full lg:w-2/5 space-y-6">
              
              {/* Creator 1: Krish Gupta */}
              <div className="bg-[#050505] rounded-3xl p-8 border border-[#222] hover:border-[#333] transition-colors relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#333] group-hover:border-emerald-500/50 transition-colors">
                    <img src="/Coding Profile Krish.jpg" alt="Krish Gupta" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Krish Gupta</h3>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Co-Creator / Dev</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  Passionate about fintech and app development, focused on building systems that help users learn trading in a safe and practical way.
                </p>
                <div className="flex gap-3">
                  <a href="https://www.linkedin.com/in/krishgupta5/" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#111] hover:bg-[#222] border border-[#333] transition-colors text-xs font-semibold text-white">
                    <Link className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href="https://krishgupta.dev" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#111] hover:bg-[#222] border border-[#333] transition-colors text-xs font-semibold text-white">
                    <Globe className="w-3.5 h-3.5" /> Portfolio
                  </a>
                </div>
              </div>

              {/* Creator 2: Sahil Mishra */}
              <div className="bg-[#050505] rounded-3xl p-8 border border-[#222] hover:border-[#333] transition-colors relative overflow-hidden group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#333] group-hover:border-emerald-500/50 transition-colors">
                    <img src="/Coding Profile Sahil.jpg" alt="Sahil Mishra" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Sahil Mishra</h3>
                    <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">Co-Creator / Dev</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                  Focused on building seamless user experiences and scalable backend systems for the BullXchange trading simulator.
                </p>
                <div className="flex gap-3">
                  <a href="https://www.linkedin.com/in/sahilmishra03/" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#111] hover:bg-[#222] border border-[#333] transition-colors text-xs font-semibold text-white">
                    <Link className="w-3.5 h-3.5" /> LinkedIn
                  </a>
                  <a href="https://sahilmishra.dev" target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#111] hover:bg-[#222] border border-[#333] transition-colors text-xs font-semibold text-white">
                    <Globe className="w-3.5 h-3.5" /> Portfolio
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer showBackToHome={true} />

    </div>
  );
}