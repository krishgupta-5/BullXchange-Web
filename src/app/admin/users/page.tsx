'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, Ban, Check, Eye, WalletCards, X, IndianRupee } from 'lucide-react';

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

  if (loading) return <div className="p-8">Loading users...</div>;

  // Calculate total platform funds
  const totalPlatformFunds = users.reduce((sum, user) => sum + (user.availableFunds || 0), 0);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Updated Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Users</h3>
          <p className="text-2xl font-bold text-green-600">
            {users.filter(u => (u.status || 'active') === 'active').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Platform Funds (Users)</h3>
          <p className="text-2xl font-bold text-blue-600">
            ₹{totalPlatformFunds.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Wallet Balance</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const currentStatus = user.status || 'active';
                const joinDate = user.accountCreationTime 
                  ? new Date(user.accountCreationTime).toLocaleDateString('en-IN') 
                  : 'N/A';

                return (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.name || 'Unknown User'}
                        </div>
                        <div className="text-xs text-gray-500">{user.emailId || 'No Email'}</div>
                        <div className="text-xs text-gray-400">ID: {user.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        currentStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ₹{user.availableFunds?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {joinDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => setViewUser(user)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="View Details & Holdings"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {/* Adjust Balance Button */}
                        <button
                          onClick={() => setBalanceModal({ isOpen: true, user, amount: '', type: 'add' })}
                          className="p-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors"
                          title="Add/Remove Funds"
                        >
                          <WalletCards className="w-4 h-4" />
                        </button>

                        {/* Suspend/Activate Button */}
                        {currentStatus === 'active' ? (
                          <button
                            onClick={() => handleStatusUpdate(user.id, 'suspended')}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                            title="Suspend User"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusUpdate(user.id, 'active')}
                            className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors"
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL: View User Details --- */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">User Profile</h3>
              <button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Name</p>
                  <p className="font-semibold">{viewUser.name || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="font-semibold">{viewUser.emailId || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Mobile</p>
                  <p className="font-semibold">{viewUser.mobileNo || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Referral Code</p>
                  <p className="font-semibold">{viewUser.myReferralCode || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Current Balance</p>
                  <p className="font-bold text-blue-600 text-lg">₹{viewUser.availableFunds?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}</p>
                </div>
              </div>

              {/* Holdings Section */}
              <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Active Holdings / Positions</h4>
              {(!viewUser.optionHoldings || viewUser.optionHoldings.length === 0) ? (
                <p className="text-sm text-gray-500 italic">No active holdings found for this user.</p>
              ) : (
                <div className="space-y-3">
                  {viewUser.optionHoldings.map((holding, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-lg border flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{holding.contractSymbol || 'Unknown Contract'}</p>
                        <p className="text-xs text-gray-500">Days to Expiry: {holding.daysToExpiry || '-'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Avg Price: <span className="font-medium">₹{holding.averagePrice || 0}</span></p>
                        <p className="text-sm">Current LTP: <span className="font-medium text-blue-600">₹{holding.currentLtp || 0}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t bg-gray-50 text-right rounded-b-xl">
              <button onClick={() => setViewUser(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: Adjust Balance --- */}
      {balanceModal.isOpen && balanceModal.user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Adjust Wallet Balance</h3>
              <button onClick={() => setBalanceModal({ isOpen: false, user: null, amount: '', type: 'add' })} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleBalanceAdjust} className="p-6 space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Target User</p>
                <p className="font-semibold text-gray-900">{balanceModal.user.name || balanceModal.user.emailId}</p>
                <p className="text-xs text-gray-500 font-mono mt-1">Current Balance: ₹{balanceModal.user.availableFunds?.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '0.00'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={balanceModal.type === 'add'} 
                      onChange={() => setBalanceModal(prev => ({ ...prev, type: 'add' }))}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm font-medium text-green-700">Add Funds</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={balanceModal.type === 'deduct'} 
                      onChange={() => setBalanceModal(prev => ({ ...prev, type: 'deduct' }))}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-sm font-medium text-red-700">Deduct Funds</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <div className="relative">
                  <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={balanceModal.amount}
                    onChange={(e) => setBalanceModal(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount..."
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className={`w-full py-2.5 rounded-lg font-medium text-white transition-colors ${
                  balanceModal.type === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {balanceModal.type === 'add' ? 'Add Funds to Wallet' : 'Deduct Funds from Wallet'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}