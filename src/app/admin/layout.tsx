'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LayoutDashboard, Users, ArrowRightLeft, Settings, LogOut, Bell, Wallet, FileText } from 'lucide-react';
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
          router.push('/admin/login');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to the admin login page after logout
      router.push('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!isAuthorized) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Helper to determine the page title based on the URL
  const currentNav = navItems.find(item => item.href === pathname) || { label: 'Overview' };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-blue-400">BullXchange</h2>
          <p className="text-xs text-slate-400 mt-1">Admin Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match for dashboard, or partial match for sub-pages
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' // Active style
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white' // Inactive style
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-slate-400 hover:text-white w-full transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 z-10">
          {/* Dynamically update the header title based on active route */}
          <h1 className="text-xl font-semibold text-gray-800">{currentNav.label}</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}