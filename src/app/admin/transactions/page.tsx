'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, CheckCircle2, Clock, XCircle, FileText, ArrowRightLeft } from 'lucide-react';

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

// 3. Highlight Utility: Wraps matching search text in an emerald glow
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-emerald-500/20 text-emerald-400 px-0.5 rounded-sm font-bold shadow-[0_0_8px_rgba(16,185,129,0.2)]">
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
    if (s === 'EXECUTED' || s === 'COMPLETED') return { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle2 className="w-3 h-3 mr-1.5" /> };
    if (s === 'CANCELLED' || s === 'REJECTED') return { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: <XCircle className="w-3 h-3 mr-1.5" /> };
    return { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: <Clock className="w-3 h-3 mr-1.5" /> };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono uppercase tracking-widest">Compiling Trade Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative text-white" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Trade Transactions</h2>
          <p className="text-sm text-zinc-500">Comprehensive ledger of all system executions.</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search ID, Entity, Name, Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#333] bg-[#0a0a0a] rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all text-sm text-white placeholder-zinc-600"
            />
          </div>

          {/* Status Filters */}
          <div className="flex p-1 bg-[#0a0a0a] rounded-xl border border-[#222] w-full md:w-auto overflow-x-auto">
            {['ALL', 'EXECUTED', 'PENDING', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-[#111] text-emerald-400 border border-[#333] shadow-[0_2px_10px_rgba(0,0,0,0.5)]' 
                    : 'text-zinc-500 border border-transparent hover:text-zinc-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Transaction Table */}
      <div className="bg-[#050505] rounded-2xl border border-[#222] shadow-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-[#111] text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-[#222]">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Contract Details</th>
                <th className="px-6 py-4 font-semibold">Order Type</th>
                <th className="px-6 py-4 font-semibold">Qty / Lot Size</th>
                <th className="px-6 py-4 font-semibold">Total Value</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Executed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
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
                    onClick={() => setHighlightedRowId(tx.id === highlightedRowId ? null : tx.id)}
                    className={`cursor-pointer transition-all group ${
                      highlightedRowId === tx.id 
                        ? 'bg-[#111] border-l-2 border-emerald-500' 
                        : 'hover:bg-[#0a0a0a] border-l-2 border-transparent'
                    }`}
                  >
                    <td className="px-6 py-4 font-mono text-[11px] text-zinc-500">
                      <HighlightText text={`#${tx.id.slice(0, 8)}`} highlight={searchTerm} />
                    </td>
                    
                    {/* User Details Column */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white tracking-wide">
                        <HighlightText text={displayName} highlight={searchTerm} />
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">
                        <HighlightText text={displayEmail} highlight={searchTerm} />
                      </div>
                    </td>
                    
                    {/* Contract Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        <FileText className="w-4 h-4 text-zinc-600 mr-2.5 mt-0.5 flex-shrink-0 group-hover:text-emerald-500 transition-colors" />
                        <div>
                          <div className="font-bold text-white tracking-wide">
                            <HighlightText text={tx.companyName || '-'} highlight={searchTerm} /> 
                            {tx.optionType ? <span className="text-emerald-400 ml-1 font-mono tracking-widest text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">{tx.optionType}</span> : ''}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 flex gap-2 mt-1.5 uppercase tracking-wider">
                            <span>{tx.exchange || '-'}</span>
                            {tx.expiryDate && <span>• EXP: {tx.expiryDate}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-300">{tx.orderType || '-'}</div>
                      <div className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">{tx.productType || '-'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{tx.quantity || 0}</div>
                      <div className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">LOT: {tx.lotSize || '-'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-white tracking-tight">₹{totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      <div className="text-[10px] text-red-400 font-mono mt-1 uppercase tracking-wider">CHARGES: ₹{tx.charges?.toFixed(2) || '0.00'}</div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded border text-[10px] font-mono uppercase tracking-widest ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {(tx.orderStatus || 'PENDING')}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-[11px] font-mono text-zinc-500 tracking-wide">
                      {dateDisplay}
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center text-zinc-600 text-sm">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <ArrowRightLeft className="w-8 h-8 text-zinc-700" />
                      <p>No transactions found matching the parameters.</p>
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