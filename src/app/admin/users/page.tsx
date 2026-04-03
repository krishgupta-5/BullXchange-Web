'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, Ban, Check, Eye, WalletCards, X, IndianRupee, Users, Activity } from 'lucide-react';

// 1. Updated Interface matching your DB, including holdings
interface Holding {
  contractSymbol?: string;
  averagePrice?: number;
  currentLtp?: number;
  daysToExpiry?: number;
  quantity?: number;
}

interface User {
  id: string;
  emailId?: string;
  name?: string;
  mobileNo?: string;
  accountCreationTime?: string;
  availableFunds?: number;
  myReferralCode?: string;
  status?: 'active' | 'suspended';
  optionHoldings?: Holding[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal States
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [balanceModal, setBalanceModal] = useState<{ isOpen: boolean; user: User | null; amount: string; type: 'add' | 'deduct' }>({
    isOpen: false,
    user: null,
    amount: '',
    type: 'add'
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'));
        const querySnapshot = await getDocs(q);
        
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const emailMatch = user.emailId?.toLowerCase().includes(searchLower) || false;
    const nameMatch = user.name?.toLowerCase().includes(searchLower) || false;
    const matchesSearch = searchTerm === '' || emailMatch || nameMatch;
    
    const currentStatus = user.status || 'active'; 
    const matchesFilter = filterStatus === 'all' || currentStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleStatusUpdate = async (userId: string, newStatus: 'active' | 'suspended') => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const handleBalanceAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!balanceModal.user || !balanceModal.amount) return;

    const adjustAmt = parseFloat(balanceModal.amount);
    if (isNaN(adjustAmt) || adjustAmt <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    try {
      const currentBalance = balanceModal.user.availableFunds || 0;
      const newBalance = balanceModal.type === 'add' 
        ? currentBalance + adjustAmt 
        : Math.max(0, currentBalance - adjustAmt); // Prevent negative balance

      const userRef = doc(db, 'users', balanceModal.user.id);
      await updateDoc(userRef, {
        availableFunds: newBalance,
        updatedAt: new Date().toISOString()
      });

      // Update UI state
      setUsers(users.map(u => 
        u.id === balanceModal.user!.id ? { ...u, availableFunds: newBalance } : u
      ));
      
      // Close modal
      setBalanceModal({ isOpen: false, user: null, amount: '', type: 'add' });
      alert(`Successfully ${balanceModal.type === 'add' ? 'added' : 'deducted'} ₹${adjustAmt}`);

    } catch (error) {
      console.error("Error adjusting balance:", error);
      alert("Failed to adjust balance.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono uppercase tracking-widest">Loading User Data...</p>
        </div>
      </div>
    );
  }

  // Calculate total platform funds
  const totalPlatformFunds = users.reduce((sum, user) => sum + (user.availableFunds || 0), 0);

  return (
    <div className="space-y-6 relative text-white" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">User Management</h2>
          <p className="text-sm text-zinc-500">Monitor and manage all platform accounts.</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-[#333] bg-[#0a0a0a] rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all text-sm text-white placeholder-zinc-600"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-[#333] bg-[#0a0a0a] rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all text-sm text-white appearance-none min-w-[120px] cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2371717a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1rem'
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#050505] p-6 rounded-2xl border border-[#222] shadow-xl flex flex-col group hover:border-[#333] transition-colors relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 bg-[#111] text-emerald-500 rounded-xl border border-[#333] group-hover:border-emerald-500/30 transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-1">Total Users</h4>
          <p className="text-3xl font-bold text-white tracking-tight">{users.length}</p>
        </div>
        
        <div className="bg-[#050505] p-6 rounded-2xl border border-[#222] shadow-xl flex flex-col group hover:border-[#333] transition-colors relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 bg-[#111] text-emerald-500 rounded-xl border border-[#333] group-hover:border-emerald-500/30 transition-colors">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Active Status
            </span>
          </div>
          <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-1">Active Users</h4>
          <p className="text-3xl font-bold text-emerald-500 tracking-tight">
            {users.filter(u => (u.status || 'active') === 'active').length}
          </p>
        </div>
        
        <div className="bg-[#050505] p-6 rounded-2xl border border-[#222] shadow-xl flex flex-col group hover:border-[#333] transition-colors relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="p-2.5 bg-[#111] text-emerald-500 rounded-xl border border-[#333] group-hover:border-emerald-500/30 transition-colors">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <h4 className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mb-1">Platform Liquidity</h4>
          <p className="text-3xl font-bold text-white tracking-tight">
            ₹{totalPlatformFunds.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#050505] rounded-2xl border border-[#222] shadow-xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#111] text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-[#222]">
              <tr>
                <th className="px-6 py-4 font-semibold">User Identity</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Wallet Balance</th>
                <th className="px-6 py-4 font-semibold">Joined</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filteredUsers.map((user) => {
                const currentStatus = user.status || 'active';
                const joinDate = user.accountCreationTime 
                  ? new Date(user.accountCreationTime).toLocaleDateString('en-IN') 
                  : 'N/A';

                return (
                  <tr key={user.id} className="hover:bg-[#0a0a0a] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-white tracking-wide">
                          {user.name || 'Unknown User'}
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">{user.emailId || 'No Email'}</div>
                        <div className="text-[10px] font-mono text-zinc-600 mt-1 uppercase tracking-wider">UID: {user.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded border text-[10px] font-mono uppercase tracking-widest ${
                        currentStatus === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${currentStatus === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                        {currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-300">
                      ₹{user.availableFunds?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {joinDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => setViewUser(user)}
                          className="p-2 border border-[#333] bg-[#111] text-zinc-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg transition-all shadow-sm"
                          title="View Profile & Holdings"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Adjust Balance Button */}
                        <button
                          onClick={() => setBalanceModal({ isOpen: true, user, amount: '', type: 'add' })}
                          className="p-2 border border-[#333] bg-[#111] text-zinc-400 hover:bg-[#1a1a1a] hover:text-white rounded-lg transition-all shadow-sm"
                          title="Adjust Funds"
                        >
                          <WalletCards className="w-4 h-4" />
                        </button>

                        {/* Suspend/Activate Button */}
                        {currentStatus === 'active' ? (
                          <button
                            onClick={() => handleStatusUpdate(user.id, 'suspended')}
                            className="p-2 border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all shadow-sm"
                            title="Suspend User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusUpdate(user.id, 'active')}
                            className="p-2 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-all shadow-sm"
                            title="Activate User"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-600 text-sm">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL: View User Details --- */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-[#050505] rounded-2xl shadow-2xl border border-[#333] w-full max-w-2xl max-h-[90vh] flex flex-col relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a]">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">User Dossier</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">UID: {viewUser.id}</p>
              </div>
              <button onClick={() => setViewUser(null)} className="p-2 rounded-lg text-zinc-500 hover:bg-[#111] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222]">
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Full Name</p>
                  <p className="font-semibold text-white tracking-wide">{viewUser.name || '-'}</p>
                </div>
                <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222]">
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Email Address</p>
                  <p className="font-semibold text-white tracking-wide">{viewUser.emailId || '-'}</p>
                </div>
                <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222]">
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Mobile No.</p>
                  <p className="font-semibold text-white tracking-wide">{viewUser.mobileNo || '-'}</p>
                </div>
                <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222]">
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Referral Code</p>
                  <p className="font-semibold text-emerald-400 font-mono tracking-wide">{viewUser.myReferralCode || '-'}</p>
                </div>
                <div className="col-span-2 bg-[#111] p-5 rounded-xl border border-[#333] flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Available Funds</p>
                    <p className="font-bold text-white text-3xl tracking-tight">₹{viewUser.availableFunds?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}</p>
                  </div>
                  <WalletCards className="w-8 h-8 text-emerald-500 opacity-50" />
                </div>
              </div>

              {/* Holdings Section */}
              <h4 className="font-bold text-white mb-4 tracking-tight border-b border-[#222] pb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Active Holdings
              </h4>
              
              {(!viewUser.optionHoldings || viewUser.optionHoldings.length === 0) ? (
                <div className="p-8 border border-dashed border-[#333] rounded-xl text-center">
                  <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest">No active positions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {viewUser.optionHoldings.map((holding, idx) => {
                    const pl = (holding.currentLtp || 0) - (holding.averagePrice || 0);
                    const isPositive = pl >= 0;

                    return (
                      <div key={idx} className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222] flex justify-between items-center hover:border-[#333] transition-colors">
                        <div>
                          <p className="font-bold text-white tracking-wide">{holding.contractSymbol || 'Unknown Contract'}</p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-1">Days to Expiry: {holding.daysToExpiry || '-'}</p>
                        </div>
                        <div className="text-right flex items-center gap-6">
                          <div>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Avg Price</p>
                            <p className="text-sm font-medium text-zinc-300">₹{holding.averagePrice || 0}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Current LTP</p>
                            <p className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                              ₹{holding.currentLtp || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[#222] bg-[#0a0a0a] flex justify-end">
              <button 
                onClick={() => setViewUser(null)} 
                className="px-6 py-2.5 bg-[#111] border border-[#333] text-white rounded-lg hover:bg-[#222] transition-colors font-medium text-sm"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Adjust Balance --- */}
      {balanceModal.isOpen && balanceModal.user && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-[#050505] rounded-2xl shadow-2xl border border-[#333] w-full max-w-md relative overflow-hidden">
            {/* Glow effect */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-20 ${balanceModal.type === 'add' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

            <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#0a0a0a] relative z-10">
              <h3 className="text-xl font-bold text-white tracking-tight">Adjust Balance</h3>
              <button onClick={() => setBalanceModal({ isOpen: false, user: null, amount: '', type: 'add' })} className="p-2 rounded-lg text-zinc-500 hover:bg-[#111] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleBalanceAdjust} className="p-6 space-y-6 relative z-10">
              <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222]">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">Target Account</p>
                <p className="font-semibold text-white tracking-wide">{balanceModal.user.name || balanceModal.user.emailId}</p>
                <div className="mt-3 pt-3 border-t border-[#222] flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Current Balance</span>
                  <span className="font-mono text-emerald-400 font-semibold">₹{balanceModal.user.availableFunds?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3">Action Directive</label>
                <div className="flex space-x-3">
                  <label className={`flex-1 relative flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    balanceModal.type === 'add' 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                      : 'bg-[#0a0a0a] border-[#333] text-zinc-500 hover:bg-[#111]'
                  }`}>
                    <input 
                      type="radio" 
                      className="sr-only"
                      checked={balanceModal.type === 'add'} 
                      onChange={() => setBalanceModal(prev => ({ ...prev, type: 'add' }))}
                    />
                    <span className="text-sm font-semibold">Inject Funds</span>
                  </label>

                  <label className={`flex-1 relative flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                    balanceModal.type === 'deduct' 
                      ? 'bg-red-500/10 border-red-500 text-red-400' 
                      : 'bg-[#0a0a0a] border-[#333] text-zinc-500 hover:bg-[#111]'
                  }`}>
                    <input 
                      type="radio" 
                      className="sr-only"
                      checked={balanceModal.type === 'deduct'} 
                      onChange={() => setBalanceModal(prev => ({ ...prev, type: 'deduct' }))}
                    />
                    <span className="text-sm font-semibold">Deduct Funds</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Transaction Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500" />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={balanceModal.amount}
                    onChange={(e) => setBalanceModal(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#0a0a0a] border border-[#333] rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-[#111] transition-all text-white font-mono placeholder-zinc-700"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5 ${
                  balanceModal.type === 'add' 
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                    : 'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                }`}
              >
                Execute Transaction
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}