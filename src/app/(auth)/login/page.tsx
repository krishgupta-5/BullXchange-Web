'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@bullxchange.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>BullXchange Admin</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Sign in to access the control panel</p>
        
        <form onSubmit={handleLogin} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '28rem', width: '100%' }}>
          {error && (
            <div style={{ backgroundColor: '#fee', color: '#c00', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                placeholder="admin@bullxchange.com"
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                placeholder="••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', 
                backgroundColor: loading ? '#9ca3af' : '#3b82f6', 
                color: 'white', 
                padding: '0.625rem 1rem', 
                borderRadius: '0.375rem', 
                border: 'none', 
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Signing in...' : 'Sign in to Dashboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
