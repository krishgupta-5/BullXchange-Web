'use client';

import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();

  const handleLogin = () => {
    console.log('Login button clicked!');
    router.push('/admin');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>BullXchange Admin</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>Sign in to access the control panel</p>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', maxWidth: '28rem', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Email address
              </label>
              <input
                type="email"
                style={{ width: '100%', padding: '0.75rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                placeholder="admin@bullxchange.com"
                defaultValue="admin@bullxchange.com"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Password
              </label>
              <input
                type="password"
                style={{ width: '100%', padding: '0.75rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                placeholder="••••••"
                defaultValue="password"
              />
            </div>
            
            <button
              onClick={handleLogin}
              style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '0.625rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
            >
              Sign in to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
