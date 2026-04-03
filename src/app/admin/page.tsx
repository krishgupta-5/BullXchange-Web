'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrendingUp, Users, Activity, IndianRupee, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Interfaces based on your DB schema
interface Order {
  id: string;
  userId?: string;
  symbol?: string;
  companyName?: string;
  transactionType?: string;
  quantity?: number;
  limitPrice?: number;
  orderStatus?: string;
  createdAt?: any;
}

interface ChartData {
  date: string;
  volume: number;
}

// BULLETPROOF DATE PARSER: Handles Firestore Timestamps, Strings, and Numbers
const getSafeDate = (dateVal?: any) => {
  if (!dateVal) return new Date(0);

  // 1. If it's a Firestore Timestamp object
  if (typeof dateVal.toDate === 'function') {
    return dateVal.toDate();
  }

  // 2. If it's already a JS Date object
  if (dateVal instanceof Date) {
    return dateVal;
  }

  // 3. If it's a String (e.g., "November 22, 2025 at 1:28:30 AM UTC+5:30")
  if (typeof dateVal === 'string') {
    try {
      if (dateVal.includes(' at ')) {
        const datePart = dateVal.split(' at ')[0];
        const parsed = new Date(datePart);
        if (!isNaN(parsed.getTime())) return parsed;
      }
      const parsedStr = new Date(dateVal);
      if (!isNaN(parsedStr.getTime())) return parsedStr;
    } catch (e) {}
  }

  // 4. If it's a Number (milliseconds)
  if (typeof dateVal === 'number') {
    return new Date(dateVal);
  }

  return new Date(0); // Safe fallback
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKyc: 0,
    totalVolume: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Users
        const usersSnap = await getDocs(collection(db, 'users'));
        let kycCount = 0;
        usersSnap.forEach(doc => {
          if ((doc.data().kycStatus || 'pending') === 'pending') {
            kycCount++;
          }
        });

        // 2. Fetch Orders
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const allOrders = ordersSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];

        // Sort orders by date
        allOrders.sort((a, b) => {
          return getSafeDate(b.createdAt).getTime() - getSafeDate(a.createdAt).getTime();
        });

        // 3. Calculate Stats & Chart Data
        let totalVol = 0;
        
        // We use a Map that stores both the display date AND the raw timestamp for flawless sorting
        const volumeMap: Record<string, { timestamp: number; volume: number }> = {};

        // 🌟 THE FIX: Pre-fill the last 7 days (ending on Today) with ₹0
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setHours(0, 0, 0, 0); // Normalize to midnight
          d.setDate(d.getDate() - i);
          const dateStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
          volumeMap[dateStr] = { timestamp: d.getTime(), volume: 0 };
        }

        // Process all orders
        allOrders.forEach(order => {
          const status = (order.orderStatus || 'PENDING').toUpperCase();
          if (status === 'COMPLETED') {
            const vol = (order.quantity || 0) * (order.limitPrice || 0);
            totalVol += vol;

            const safeDate = getSafeDate(order.createdAt);
            if (!isNaN(safeDate.getTime()) && safeDate.getTime() !== 0) {
              safeDate.setHours(0, 0, 0, 0); // Normalize to midnight to match our pre-filled dates
              const dateStr = safeDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
              
              // If this is an older date not in our 7-day pre-fill, add it
              if (!volumeMap[dateStr]) {
                volumeMap[dateStr] = { timestamp: safeDate.getTime(), volume: 0 };
              }
              
              volumeMap[dateStr].volume += vol;
            }
          }
        });

        // Format chart data: Sort using the raw timestamp, then strip it out for Recharts
        const formattedChartData = Object.values(volumeMap)
          .sort((a, b) => a.timestamp - b.timestamp) // Guarantees chronological order
          .map(item => {
            const d = new Date(item.timestamp);
            return {
              date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
              volume: item.volume
            };
          });

        // Update State
        setStats({
          totalUsers: usersSnap.size,
          pendingKyc: kycCount,
          totalVolume: totalVol,
        });
        setChartData(formattedChartData);
        setRecentOrders(allOrders.slice(0, 5)); // Take top 5 recent orders

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono uppercase tracking-widest">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Command Center</h1>
        <p className="text-sm text-zinc-500">System overview and core metric monitoring.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Trade Volume" 
          value={`₹${stats.totalVolume.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} 
          icon={<IndianRupee className="w-5 h-5" />} 
          trend="All Time" 
          positive={true} 
        />
        <StatCard 
          title="Registered Users" 
          value={stats.totalUsers.toString()} 
          icon={<Users className="w-5 h-5" />} 
          trend="Active" 
          positive={true} 
        />
        <StatCard 
          title="Pending KYC" 
          value={stats.pendingKyc.toString()} 
          icon={<Activity className="w-5 h-5" />} 
          trend="Requires Action" 
          positive={false} 
        />
        <StatCard 
          title="System Status" 
          value="Optimal" 
          icon={<TrendingUp className="w-5 h-5" />} 
          trend="99.9% Uptime" 
          positive={true} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Real Chart */}
        <div className="lg:col-span-2 bg-[#050505] p-6 rounded-2xl border border-[#222] shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          
          <h3 className="text-lg font-bold mb-6 text-white tracking-tight">Trading Volume History</h3>
          <div className="w-full h-80 min-h-[320px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320} minWidth={0} aspect={undefined}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                  <Tooltip 
                    formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, 'Volume']}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#10B981' }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-zinc-600 border border-[#222] border-dashed rounded-xl bg-[#0a0a0a]">
                <p className="text-sm font-mono uppercase tracking-widest">Awaiting Data</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#050505] p-6 rounded-2xl border border-[#222] shadow-xl">
          <h3 className="text-lg font-bold mb-6 text-white tracking-tight">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/users" className="block group">
              <button className="w-full py-3.5 px-4 bg-[#0a0a0a] border border-[#222] text-zinc-300 rounded-xl hover:bg-[#111] hover:border-[#333] font-medium transition-all flex justify-between items-center text-sm">
                <span>Review KYC Requests</span>
                {stats.pendingKyc > 0 ? (
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded uppercase tracking-widest font-mono">{stats.pendingKyc} Pending</span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                )}
              </button>
            </Link>
            <Link href="/admin/fund-requests" className="block group">
              <button className="w-full py-3.5 px-4 bg-[#0a0a0a] border border-[#222] text-zinc-300 rounded-xl hover:bg-[#111] hover:border-[#333] font-medium transition-all flex justify-between items-center text-sm">
                <span>Manage Fund Requests</span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </button>
            </Link>
            <Link href="/admin/orders" className="block group">
              <button className="w-full py-3.5 px-4 bg-[#0a0a0a] border border-[#222] text-zinc-300 rounded-xl hover:bg-[#111] hover:border-[#333] font-medium transition-all flex justify-between items-center text-sm">
                <span>View All System Orders</span>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#050505] rounded-2xl border border-[#222] shadow-xl overflow-hidden mt-6">
        <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a]">
          <h3 className="text-lg font-bold text-white tracking-tight">Recent Trading Activity</h3>
          <Link href="/admin/orders" className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1">
            View All Logs <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-[#111] text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-[#222]">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">User ID</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Asset</th>
                <th className="px-6 py-4 font-semibold">Total Value</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {recentOrders.map((order) => {
                const type = (order.transactionType || 'BUY').toUpperCase();
                const status = (order.orderStatus || 'PENDING').toUpperCase();
                const total = (order.quantity || 0) * (order.limitPrice || 0);

                return (
                  <tr key={order.id} className="hover:bg-[#0a0a0a] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500 w-32 truncate block" title={order.userId}>
                      {order.userId || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest border ${
                        type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-white tracking-wide">{order.symbol || order.companyName || '-'}</td>
                    <td className="px-6 py-4 font-medium text-zinc-300">₹{total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center text-xs font-medium ${
                        status === 'COMPLETED' ? 'text-emerald-500' : 
                        status === 'CANCELLED' ? 'text-red-500' : 
                        'text-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_8px_currentColor] ${
                          status === 'COMPLETED' ? 'bg-emerald-500' : 
                          status === 'CANCELLED' ? 'bg-red-500' : 
                          'bg-amber-500'
                        }`}></span>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 text-sm">
                    No recent activity logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, icon, trend, positive }: { title: string, value: string, icon: React.ReactNode, trend: string, positive: boolean }) {
  return (
    <div className="bg-[#050505] p-6 rounded-2xl border border-[#222] shadow-xl flex flex-col group hover:border-[#333] transition-colors relative overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div className="p-2.5 bg-[#111] text-emerald-500 rounded-xl border border-[#333] group-hover:border-emerald-500/30 transition-colors">
          {icon}
        </div>
        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${positive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {trend}
        </span>
      </div>
      <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}