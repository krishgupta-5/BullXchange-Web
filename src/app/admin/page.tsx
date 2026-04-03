'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TrendingUp, Users, Activity, IndianRupee } from 'lucide-react';
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
  createdAt?: any; // Changed to 'any' to accept Firestore Timestamps or Strings
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
    return <div className="p-8 flex items-center justify-center h-full text-gray-500">Loading Dashboard Data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Trade Volume" 
          value={`₹${stats.totalVolume.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} 
          icon={<IndianRupee className="w-6 h-6" />} 
          trend="All Time" 
          positive={true} 
        />
        <StatCard 
          title="Registered Users" 
          value={stats.totalUsers.toString()} 
          icon={<Users className="w-6 h-6" />} 
          trend="Active" 
          positive={true} 
        />
        <StatCard 
          title="Pending KYC" 
          value={stats.pendingKyc.toString()} 
          icon={<Activity className="w-6 h-6" />} 
          trend="Requires Action" 
          positive={false} 
        />
        <StatCard 
          title="System Status" 
          value="Optimal" 
          icon={<TrendingUp className="w-6 h-6" />} 
          trend="99.9% Uptime" 
          positive={true} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Real Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Trading Volume History</h3>
          <div className="w-full h-80 min-h-[320px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320} minWidth={0} aspect={undefined}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                    formatter={(value: any) => [`₹${Number(value || 0).toLocaleString()}`, 'Volume']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-400 border border-dashed rounded-lg bg-gray-50">
                Not enough completed trades for chart data.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/users" className="block">
              <button className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors flex justify-between items-center">
                Review KYC Requests
                {stats.pendingKyc > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{stats.pendingKyc}</span>
                )}
              </button>
            </Link>
            <Link href="/admin/fund-requests" className="block">
              <button className="w-full py-2.5 px-4 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 font-medium transition-colors text-left">
                Manage Fund Requests
              </button>
            </Link>
            <Link href="/admin/orders" className="block">
              <button className="w-full py-2.5 px-4 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 font-medium transition-colors text-left">
                View All Orders
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Recent Trading Activity</h3>
          <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Asset</th>
                <th className="px-6 py-3">Total Value</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => {
                const type = (order.transactionType || 'BUY').toUpperCase();
                const status = (order.orderStatus || 'PENDING').toUpperCase();
                const total = (order.quantity || 0) * (order.limitPrice || 0);

                return (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-xs text-blue-600">#{order.id.slice(0, 8)}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 w-32 truncate block" title={order.userId}>
                      {order.userId || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{order.symbol || order.companyName || '-'}</td>
                    <td className="px-6 py-4 font-medium">₹{total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center text-xs font-medium ${
                        status === 'COMPLETED' ? 'text-green-600' : 
                        status === 'CANCELLED' ? 'text-red-500' : 
                        'text-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          status === 'COMPLETED' ? 'bg-green-500' : 
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No recent orders found.
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
    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trend}
        </span>
      </div>
      <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}