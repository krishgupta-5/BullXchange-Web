'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, X, Clock, IndianRupee, Wallet } from 'lucide-react';

// 1. Interface updated to match your EXACT Firestore document fields
interface FundRequest {
  id: string;
  uid?: string;
  email?: string;
  amount_rs?: number;
  coins_to_add?: number;
  status?: string; // 'pending', 'approved', 'rejected'
  type?: string; // e.g., 'REFERRAL_BONUS'
  utr_number?: string;
  timestamp?: string; // Stored as a string in your DB
}

export default function FundRequestsPage() {
  const [requests, setRequests] = useState<FundRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, 'fund_requests'));
        const querySnapshot = await getDocs(q);
        const fetchedRequests = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FundRequest[];
        
        // Sort by timestamp (newest first)
        fetchedRequests.sort((a, b) => {
          const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return dateB - dateA;
        });

        setRequests(fetchedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const requestRef = doc(db, 'fund_requests', requestId);
      await updateDoc(requestRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      ));
      
      // Optional: Replace alert with a toast notification in a real app
      // alert(`Request ${newStatus} successfully!`);
    } catch (error) {
      console.error(`Error updating request to ${newStatus}:`, error);
      alert("Failed to update status. Are you logged in as the Admin?");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono uppercase tracking-widest">Loading Requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative text-white" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Fund Requests</h2>
        <p className="text-sm text-zinc-500">Manage user deposits and referral bonus requests.</p>
      </div>
      
      {/* TABLE */}
      <div className="bg-[#050505] rounded-2xl border border-[#222] shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-[#111] text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-[#222]">
              <tr>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">UTR Number</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {requests.map((req) => {
                const currentStatus = (req.status || 'pending').toLowerCase();
                
                // Determine display type based on available fields
                const displayType = req.type 
                  ? req.type.replace('_', ' ') 
                  : (req.utr_number ? 'Deposit' : 'Unknown');

                // Handle string date from DB
                const requestDate = req.timestamp 
                  ? new Date(req.timestamp).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                  : 'N/A';

                return (
                  <tr key={req.id} className="hover:bg-[#0a0a0a] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-zinc-300 tracking-wide">{req.email || 'No Email'}</div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-zinc-600 w-32 truncate mt-1" title={req.uid}>
                        UID: {req.uid}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 bg-[#111] border border-[#333] px-2 py-1 rounded">
                        {displayType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {req.utr_number || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white flex items-center tracking-tight text-base">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-zinc-400" />
                        {req.amount_rs?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                      </div>
                      {req.coins_to_add && (
                        <div className="text-[10px] font-mono text-amber-500 tracking-widest mt-1">
                          +{req.coins_to_add} COINS
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded border text-[10px] font-mono uppercase tracking-widest ${
                        currentStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        currentStatus === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {currentStatus === 'pending' && <Clock className="w-3 h-3 mr-1.5" />}
                        {currentStatus !== 'pending' && (
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 shadow-[0_0_8px_currentColor] ${
                            currentStatus === 'approved' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}></span>
                        )}
                        {currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                      {requestDate}
                    </td>
                    <td className="px-6 py-4">
                      {currentStatus === 'pending' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'approved')}
                            className="p-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all shadow-sm"
                            title="Approve Request"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'rejected')}
                            className="p-1.5 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all shadow-sm"
                            title="Reject Request"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                          Processed
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-zinc-600 text-sm">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Wallet className="w-8 h-8 text-zinc-700" />
                      <p>No fund requests found.</p>
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