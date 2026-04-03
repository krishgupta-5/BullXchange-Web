'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, X, Clock, ShoppingCart, Package, TrendingUp, TrendingDown, FileText } from 'lucide-react';

// 1. Interface updated to match your exact Firestore fields
interface Order {
  id: string;
  userId: string;
  transactionType?: string; // 'BUY' or 'SELL'
  symbol?: string;
  companyName?: string;
  quantity?: number;
  limitPrice?: number;
  orderStatus?: string; // 'PENDING', 'COMPLETED', 'CANCELLED'
  createdAt?: string; // Stored as string in your DB
  updatedAt?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'));
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        
        // Safely sort string-based dates
        setOrders(fetchedOrders.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
        }));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        orderStatus: newStatus, // Updated field name
        updatedAt: new Date().toISOString()
      });

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, orderStatus: newStatus, updatedAt: new Date().toISOString() } : order
      ));
      
      // Optional: Replace alert with a toast notification in a real app
      // alert(`Order ${newStatus} successfully!`);
    } catch (error) {
      console.error(`Error updating order to ${newStatus}:`, error);
      alert("Failed to update status. Are you logged in as the Admin?");
    }
  };

  // Filter against the DB's uppercase 'orderStatus'
  const filteredOrders = orders.filter(order => {
    const currentStatus = (order.orderStatus || 'PENDING').toUpperCase();
    return filter === 'ALL' || currentStatus === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono uppercase tracking-widest">Loading Order Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative text-white" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Orders Management</h2>
          <p className="text-sm text-zinc-500">Monitor and execute system-wide trade requests.</p>
        </div>
        
        <div className="flex p-1 bg-[#0a0a0a] rounded-xl border border-[#222] w-full md:w-auto overflow-x-auto">
          {(['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-[#111] text-emerald-400 border border-[#333] shadow-[0_2px_10px_rgba(0,0,0,0.5)]'
                  : 'text-zinc-500 border border-transparent hover:text-zinc-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {/* TABLE */}
      <div className="bg-[#050505] rounded-2xl border border-[#222] shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-[#111] text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-[#222]">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">User ID</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Asset</th>
                <th className="px-6 py-4 font-semibold">Qty</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Total Value</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filteredOrders.map((order) => {
                // Extract correct DB values with fallbacks
                const currentStatus = (order.orderStatus || 'PENDING').toUpperCase();
                const type = (order.transactionType || 'BUY').toUpperCase();
                const asset = order.symbol || order.companyName || 'Unknown';
                const qty = order.quantity || 0;
                const price = order.limitPrice || 0;
                const total = qty * price;

                return (
                  <tr key={order.id} className="hover:bg-[#0a0a0a] transition-colors group">
                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">#{order.id.slice(-8)}</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-zinc-600">
                      <div className="truncate w-20" title={order.userId}>{order.userId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] font-mono uppercase tracking-widest ${
                        type === 'BUY' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {type === 'BUY' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white tracking-wide">{asset}</td>
                    <td className="px-6 py-4 text-zinc-300">{qty}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-400">₹{price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-white tracking-tight">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center text-xs font-medium ${
                        currentStatus === 'COMPLETED' ? 'text-emerald-500' : 
                        currentStatus === 'CANCELLED' ? 'text-red-500' : 
                        'text-amber-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 shadow-[0_0_8px_currentColor] ${
                          currentStatus === 'COMPLETED' ? 'bg-emerald-500' : 
                          currentStatus === 'CANCELLED' ? 'bg-red-500' : 
                          'bg-amber-500'
                        }`}></span>
                        {currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {currentStatus === 'PENDING' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                            className="p-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all shadow-sm"
                            title="Mark Completed"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                            className="p-1.5 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all shadow-sm"
                            title="Cancel Order"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end text-zinc-600">
                          <Minus className="w-4 h-4" />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-zinc-600 text-sm">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <FileText className="w-8 h-8 text-zinc-700" />
                      <p>No orders found matching the current filter.</p>
                    </div>
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

// Temporary icon fallback if lucide-react minus is missing from imports
function Minus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}