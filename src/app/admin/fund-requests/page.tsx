'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Check, X, Clock, IndianRupee } from 'lucide-react';

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
      
      alert(`Request ${newStatus} successfully!`);
    } catch (error) {
      console.error(`Error updating request to ${newStatus}:`, error);
      alert("Failed to update status. Are you logged in as the Admin?");
    }
  };

  if (loading) return <div className="p-8">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Fund Requests Management</h2>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">UTR Number</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{req.email || 'No Email'}</div>
                      <div className="font-mono text-xs text-gray-500 w-32 truncate" title={req.uid}>
                        {req.uid}
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-gray-700">
                      {displayType.toLowerCase()}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">
                      {req.utr_number || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 flex items-center">
                        <IndianRupee className="w-3 h-3 mr-0.5" />
                        {req.amount_rs?.toFixed(2) || '0.00'}
                      </div>
                      {req.coins_to_add && (
                        <div className="text-xs text-amber-600 font-medium mt-0.5">
                          +{req.coins_to_add} coins
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        currentStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        currentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {currentStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {requestDate}
                    </td>
                    <td className="px-6 py-4">
                      {currentStatus === 'pending' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'approved')}
                            className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(req.id, 'rejected')}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {currentStatus !== 'pending' && (
                        <span className="text-xs text-gray-400 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No fund requests found.
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