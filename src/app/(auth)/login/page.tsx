'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Shield, Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@bullxchange.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Global DM Sans and strict dark mode background
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black overflow-hidden antialiased flex items-center justify-center px-6 relative" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* TECH GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#050505] rounded-3xl p-8 md:p-10 border border-[#222] shadow-2xl relative overflow-hidden group z-10"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="mx-auto w-12 h-12 rounded-xl border border-[#333] bg-[#1a1a1a] flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">System Access</h1>
          <p className="text-sm text-zinc-500">Authenticate to enter the control panel.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {error}
            </motion.div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-1">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bullxchange.com"
                required
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-1">Security Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-white text-black font-semibold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Initialize Session <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-[#222] text-center">
          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">BullXchange Admin Portal</p>
        </div>

      </motion.div>
    </div>
  );
}