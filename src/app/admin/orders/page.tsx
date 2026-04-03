'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, X, Clock, ShoppingCart, Package, TrendingUp, TrendingDown } from 'lucide-react';

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
      
      alert(`Order ${newStatus} successfully!`);
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

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'COMPLETED': return <Check className="w-4 h-4" />;
      case 'CANCELLED': return <X className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'FAILED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type?.toUpperCase() === 'BUY' ? 
      <TrendingUp className="w-4 h-4 text-green-600" /> : 
      <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  if (loading) return <div className="p-8">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
        
        <div className="flex space-x-2">
          {(['ALL', 'PENDING', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-medium">
            <tr>
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">User ID</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Asset</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map((order) => {
              // Extract correct DB values with fallbacks
              const currentStatus = order.orderStatus || 'PENDING';
              const type = order.transactionType || 'BUY';
              const asset = order.symbol || order.companyName || 'Unknown';
              const qty = order.quantity || 0;
              const price = order.limitPrice || 0;
              const total = qty * price;

              return (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs text-blue-600">#{order.id.slice(-8)}</td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    <div className="truncate w-24" title={order.userId}>{order.userId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(type)}
                      <span className="font-medium">{type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">{asset}</td>
                  <td className="px-6 py-4">{qty}</td>
                  <td className="px-6 py-4">₹{price.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentStatus)}`}>
                      {getStatusIcon(currentStatus)}
                      <span className="ml-1">{currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase()}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {currentStatus.toUpperCase() === 'PENDING' && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                          className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                          title="Complete"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  No orders found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}