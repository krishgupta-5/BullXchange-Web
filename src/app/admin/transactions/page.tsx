'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';

// 1. Transaction Interface
interface Transaction {
  id: string;
  charges?: number;
  companyName?: string;
  exchange?: string;
  executedAt?: string;
  expiryDate?: string;
  lotSize?: number;
  optionType?: string;
  orderStatus?: string;
  orderType?: string;
  price?: number;
  productType?: string;
  quantity?: number;
  userId?: string; 
}

// User map interface to link emails/names
interface UserMap {
  [key: string]: {
    name?: string;
    emailId?: string;
  };
}

// 2. Safe Date Parser
const getSafeDate = (dateVal?: any) => {
  if (!dateVal) return new Date(0);
  if (typeof dateVal.toDate === 'function') return dateVal.toDate();
  if (dateVal instanceof Date) return dateVal;
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
  return new Date(0);
};

// 3. Highlight Utility: Wraps matching search text in a yellow <mark>
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 px-0.5 rounded-sm font-semibold">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [usersMap, setUsersMap] = useState<UserMap>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch BOTH transactions and users simultaneously for maximum speed
        const [txSnapshot, usersSnapshot] = await Promise.all([
          getDocs(collection(db, 'transactions')),
          getDocs(collection(db, 'users'))
        ]);

        // Build a dictionary of Users: { "userId": { name: "...", emailId: "..." } }
        const uMap: UserMap = {};
        usersSnapshot.docs.forEach(doc => {
          uMap[doc.id] = doc.data();
        });
        setUsersMap(uMap);

        // Map transactions
        const fetchedTransactions = txSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        
        // Sort newest to oldest
        fetchedTransactions.sort((a, b) => {
          return getSafeDate(b.executedAt).getTime() - getSafeDate(a.executedAt).getTime();
        });

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic including the joined User Data
  const filteredTransactions = transactions.filter(tx => {
    const searchLower = searchTerm.toLowerCase();
    
    // Grab user details from our map
    const user = usersMap[tx.userId || ''];
    const userName = user?.name || '';
    const userEmail = user?.emailId || '';

    // Check matches
    const idMatch = tx.id.toLowerCase().includes(searchLower);
    const companyMatch = tx.companyName?.toLowerCase().includes(searchLower) || false;
    const nameMatch = userName.toLowerCase().includes(searchLower);
    const emailMatch = userEmail.toLowerCase().includes(searchLower);
    
    const matchesSearch = searchTerm === '' || idMatch || companyMatch || nameMatch || emailMatch;
    
    const currentStatus = (tx.orderStatus || 'PENDING').toUpperCase();
    const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusDisplay = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'EXECUTED') return { color: 'bg-green-100 text-green-800', icon: <CheckCircle2 className="w-3 h-3 mr-1" /> };
    if (s === 'CANCELLED' || s === 'REJECTED') return { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3 mr-1" /> };
    return { color: 'bg-amber-100 text-amber-800', icon: <Clock className="w-3 h-3 mr-1" /> };
  };

  if (loading) return <div className="p-8">Loading transactions & user data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Trade Transactions</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ID, Company, Name, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Status Filters */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['ALL', 'EXECUTED', 'PENDING', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  statusFilter === status 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Transaction Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Contract Details</th>
                <th className="px-6 py-4">Order Type</th>
                <th className="px-6 py-4">Qty / Lot Size</th>
                <th className="px-6 py-4">Total Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Executed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const statusInfo = getStatusDisplay(tx.orderStatus || 'PENDING');
                const safeDate = getSafeDate(tx.executedAt);
                const dateDisplay = isNaN(safeDate.getTime()) || safeDate.getTime() === 0 
                  ? 'Pending / Unknown' 
                  : safeDate.toLocaleString('en-IN', { 
                      month: 'short', day: 'numeric', year: 'numeric', 
                      hour: '2-digit', minute: '2-digit' 
                    });

                const totalValue = (tx.price || 0) * (tx.quantity || 0);
                
                // Lookup User Data
                const user = usersMap[tx.userId || ''];
                const displayName = user?.name || 'Unknown User';
                const displayEmail = user?.emailId || tx.userId || 'No Email';

                return (
                  <tr 
                    key={tx.id} 
                    onClick={() => setHighlightedRowId(tx.id)}
                    className={`cursor-pointer transition-all ${
                      highlightedRowId === tx.id 
                        ? 'bg-blue-50 border-l-4 border-blue-600 shadow-inner' 
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-blue-600">
                      <HighlightText text={`#${tx.id.slice(0, 8)}`} highlight={searchTerm} />
                    </td>
                    
                    {/* NEW: User Details Column */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        <HighlightText text={displayName} highlight={searchTerm} />
                      </div>
                      <div className="text-xs text-gray-500">
                        <HighlightText text={displayEmail} highlight={searchTerm} />
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-gray-900">
                            <HighlightText text={tx.companyName || '-'} highlight={searchTerm} /> 
                            {tx.optionType ? <span className="text-blue-600 ml-1">{tx.optionType}</span> : ''}
                          </div>
                          <div className="text-xs text-gray-500 flex gap-2 mt-0.5">
                            <span>{tx.exchange || '-'}</span>
                            {tx.expiryDate && <span>• Exp: {tx.expiryDate}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{tx.orderType || '-'}</div>
                      <div className="text-xs text-gray-500">{tx.productType || '-'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium">{tx.quantity || 0}</div>
                      <div className="text-xs text-gray-500">Lot: {tx.lotSize || '-'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">₹{totalValue.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-red-600 font-medium mt-0.5">Charges: ₹{tx.charges?.toFixed(2) || '0.00'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {(tx.orderStatus || 'PENDING').charAt(0) + (tx.orderStatus || 'PENDING').slice(1).toLowerCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500">
                      {dateDisplay}
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No transactions found matching "{searchTerm}"
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