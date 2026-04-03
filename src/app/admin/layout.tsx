'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LayoutDashboard, Users, ArrowRightLeft, Settings, LogOut, Wallet, FileText, Shield } from 'lucide-react';
import { auth } from '@/lib/firebase';

// Define your navigation items in an array for cleaner rendering
const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/orders', label: 'Orders', icon: FileText },
  { href: '/admin/fund-requests', label: 'Fund Requests', icon: Wallet },
  { href: '/admin/transactions', label: 'Transactions', icon: ArrowRightLeft },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL path
  const [isAuthorized, setIsAuthorized] = useState(false);
  const ADMIN_UID = "AG8E1dHEuHeYVMIeXufoDEOPI332";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === ADMIN_UID) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        if (typeof window !== 'undefined') {
          // Redirect to the actual admin login page
          router.push('/login');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to the admin login page after logout
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center" style={{ fontFamily: '"DM Sans", sans-serif' }}>
        <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono uppercase tracking-widest">Verifying Authorization...</p>
        </div>
      </div>
    );
  }

  // Helper to determine the page title based on the URL
  const currentNav = navItems.find(item => item.href === pathname) || { label: 'System Overview' };

  return (
    // Global DM Sans and strict dark mode background
    <div className="flex h-screen bg-black text-white selection:bg-emerald-500 selection:text-black overflow-hidden antialiased" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#050505] border-r border-[#222] flex flex-col hidden md:flex z-20">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg border border-[#333] bg-[#111] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">BullXchange</h2>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 ml-11">Admin Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match for dashboard, or partial match for sub-pages
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-[#111] text-emerald-500 border-[#333] shadow-[0_0_15px_rgba(16,185,129,0.05)]' // Active style
                    : 'text-zinc-400 border-transparent hover:bg-[#0a0a0a] hover:text-zinc-200 hover:border-[#222]' // Inactive style
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-emerald-500' : 'text-zinc-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#222] bg-[#050505]">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-3 text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-colors group"
          >
            <LogOut className="w-4 h-4 mr-3 text-zinc-500 group-hover:text-red-400 transition-colors" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* GLOBAL TECH GRID BACKGROUND FOR ALL ADMIN PAGES */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

        {/* Header */}
        <header className="h-16 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222] flex items-center justify-between px-8 z-20 sticky top-0">
          {/* Dynamically update the header title based on active route */}
          <div className="flex items-center gap-3">
             <div className="md:hidden w-8 h-8 rounded-lg border border-[#333] bg-[#111] flex items-center justify-center flex-shrink-0">
               <Shield className="w-4 h-4 text-emerald-500" />
             </div>
             <h1 className="text-lg font-bold text-white tracking-tight">{currentNav.label}</h1>
          </div>
          
          <div className="flex items-center space-x-5">
            <div className="w-9 h-9 bg-[#111] border border-[#333] rounded-full flex items-center justify-center text-emerald-500 font-mono text-sm font-bold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 relative">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}