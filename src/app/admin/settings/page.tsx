'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Settings, Shield, Key, Save, RefreshCw, Network, Cpu, Lock, KeyRound, Zap } from 'lucide-react';

interface GlobalConfig {
  maintenanceMode: boolean;
  tradingEnabled: boolean;
  registrationEnabled: boolean;
}

interface AngelOneConfig {
  privateKey: string;
  sourceId: string;
  clientLocalIP: string;
  clientPublicIP: string;
  macAddress: string;
  clientCode: string;
  jwtToken: string;
  updatedAt?: any;
}

export default function AdminSettingsPage() {
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>({
    maintenanceMode: false,
    tradingEnabled: true,
    registrationEnabled: true,
  });
  
  const [angelConfig, setAngelConfig] = useState<AngelOneConfig>({
    privateKey: 'NdcoPXBK',
    sourceId: 'WEB',
    clientLocalIP: '172.16.52.194',
    clientPublicIP: '172.16.52.194',
    macAddress: '00:00:00:00:00:00',
    clientCode: 'AAAO784393',
    jwtToken: '',
  });

  // Temporary state for the API call (NEVER saved to Firebase)
  const [angelPassword, setAngelPassword] = useState('');
  const [angelTotp, setAngelTotp] = useState('');
  const [generatingToken, setGeneratingToken] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  // Fetch current configurations
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [globalDoc, angelDoc] = await Promise.all([
          getDoc(doc(db, 'admin_config', 'global_settings')),
          getDoc(doc(db, 'admin_config', 'angelone'))
        ]);
        
        if (globalDoc.exists()) {
          const data = globalDoc.data();
          setGlobalConfig({
            maintenanceMode: data.maintenanceMode || false,
            tradingEnabled: data.tradingEnabled !== false, 
            registrationEnabled: data.registrationEnabled !== false,
          });
        }

        if (angelDoc.exists()) {
          const data = angelDoc.data();
          setAngelConfig(prev => ({
            privateKey: data.privateKey || prev.privateKey,
            sourceId: data.sourceId || prev.sourceId,
            clientLocalIP: data.clientLocalIP || prev.clientLocalIP,
            clientPublicIP: data.clientPublicIP || prev.clientPublicIP,
            macAddress: data.macAddress || prev.macAddress,
            clientCode: data.clientCode || prev.clientCode,
            jwtToken: data.jwtToken || '',
            updatedAt: data.updatedAt
          }));
        }
      } catch (error) {
        console.error("Error fetching configs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfigs();
  }, []);

  // 🚀 Generate JWT Token via Angel One API
  const handleGenerateToken = async () => {
    if (!angelPassword || !angelTotp) {
      alert("Please enter both Password and TOTP to generate a token.");
      return;
    }

    setGeneratingToken(true);
    try {
      const response = await fetch('https://apiconnect.angelone.in/rest/auth/angelbroking/user/v1/loginByPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-PrivateKey': angelConfig.privateKey,
          'X-SourceID': angelConfig.sourceId,
          'X-ClientLocalIP': angelConfig.clientLocalIP,
          'X-ClientPublicIP': angelConfig.clientPublicIP,
          'X-MACAddress': angelConfig.macAddress,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          clientcode: angelConfig.clientCode,
          password: angelPassword,
          totp: angelTotp
        })
      });

      const data = await response.json();

      if (data.status === true && data.data?.jwtToken) {
        const newJwtToken = data.data.jwtToken;
        
        // Save immediately to Firebase
        await setDoc(doc(db, 'admin_config', 'angelone'), {
          ...angelConfig,
          jwtToken: newJwtToken,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // Update local state and clear password/totp fields
        setAngelConfig(prev => ({ ...prev, jwtToken: newJwtToken, updatedAt: new Date() }));
        setAngelPassword('');
        setAngelTotp('');
        
        alert("Success! JWT Token generated and saved to Firebase.");
      } else {
        throw new Error(data.message || "Failed to generate token.");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      alert(`Error generating token: ${error.message}\n\n(If this is a Network Error, it means Angel One blocks direct browser requests due to CORS, and this fetch call needs to be moved to a Next.js Server Action / API Route).`);
    } finally {
      setGeneratingToken(false);
    }
  };

  // Save manual configuration changes to Firebase
  const handleUpdateConfig = async () => {
    setSaving(true);
    try {
      await Promise.all([
        setDoc(doc(db, 'admin_config', 'global_settings'), {
          ...globalConfig,
          updatedAt: serverTimestamp()
        }, { merge: true }),
        
        setDoc(doc(db, 'admin_config', 'angelone'), {
          ...angelConfig,
          updatedAt: serverTimestamp()
        }, { merge: true })
      ]);
      
      alert('Settings updated successfully!');
      setAngelConfig(prev => ({ ...prev, updatedAt: new Date() }));
    } catch (error) {
      console.error("Error updating config:", error);
      alert("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleGlobalToggle = (field: keyof GlobalConfig) => {
    setGlobalConfig(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-zinc-500 animate-pulse">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-mono uppercase tracking-widest">Loading Configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl text-white" style={{ fontFamily: '"DM Sans", sans-serif' }}>
      
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-1">System Configuration</h2>
        <p className="text-sm text-zinc-500">Manage global platform state and external API integrations.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        
        {/* Angel One API Configuration */}
        <div className="bg-[#050505] rounded-2xl border border-[#222] shadow-xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>

          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2.5 bg-[#111] text-emerald-500 rounded-xl border border-[#333]">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Smart API Integration</h3>
          </div>
          
          <div className="space-y-6">
            
            {/* Generate Token UI */}
            <div className="bg-[#0a0a0a] p-5 rounded-xl border border-[#333] relative overflow-hidden">
              {/* Subtle background glow for the token generation box */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-[40px] pointer-events-none"></div>

              <h4 className="text-[11px] font-mono uppercase tracking-widest text-white mb-4 flex items-center">
                <Zap className="w-4 h-4 text-amber-500 mr-2" /> 
                Generate Live Session Token
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                    <Lock className="w-3 h-3 inline mr-1" /> Password
                  </label>
                  <input
                    type="password"
                    value={angelPassword}
                    onChange={(e) => setAngelPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#111] border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-white placeholder-zinc-700 transition-all"
                    placeholder="Enter Password"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                    <KeyRound className="w-3 h-3 inline mr-1" /> TOTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={angelTotp}
                    onChange={(e) => setAngelTotp(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#111] border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-emerald-400 tracking-widest font-mono placeholder-zinc-700 transition-all"
                    placeholder="123456"
                  />
                </div>
              </div>
              <button
                onClick={handleGenerateToken}
                disabled={generatingToken || !angelPassword || !angelTotp}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-bold text-black bg-white hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:-translate-y-0.5 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                {generatingToken ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating API Token...</>
                ) : (
                  'Generate & Sync Token'
                )}
              </button>
            </div>

            {/* Current JWT Status */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                <Key className="w-3 h-3 inline mr-1" /> Current Active JWT
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={angelConfig.jwtToken}
                  readOnly
                  className="w-full px-3 py-2.5 pr-16 border border-[#222] rounded-lg bg-[#0a0a0a] text-emerald-500/70 focus:outline-none font-mono text-[10px] tracking-wider"
                  placeholder="No active token. Generate one above."
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  {showSecret ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-[#222]">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Client Code</label>
                <input
                  type="text"
                  value={angelConfig.clientCode}
                  onChange={(e) => setAngelConfig({ ...angelConfig, clientCode: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0a0a0a] border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-white uppercase font-mono transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Private Key</label>
                <input
                  type="text"
                  value={angelConfig.privateKey}
                  onChange={(e) => setAngelConfig({ ...angelConfig, privateKey: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0a0a0a] border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-white font-mono transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                  <Network className="w-3 h-3 inline mr-1" /> Local IP
                </label>
                <input
                  type="text"
                  value={angelConfig.clientLocalIP}
                  onChange={(e) => setAngelConfig({ ...angelConfig, clientLocalIP: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0a0a0a] border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-zinc-300 font-mono transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                  <Network className="w-3 h-3 inline mr-1" /> Public IP
                </label>
                <input
                  type="text"
                  value={angelConfig.clientPublicIP}
                  onChange={(e) => setAngelConfig({ ...angelConfig, clientPublicIP: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0a0a0a] border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-zinc-300 font-mono transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t pt-6 border-[#222]">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">Source ID</label>
                <input
                  type="text"
                  value={angelConfig.sourceId}
                  onChange={(e) => setAngelConfig({ ...angelConfig, sourceId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0a0a0a] border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-white uppercase font-mono transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-2">
                  <Cpu className="w-3 h-3 inline mr-1" /> MAC Address
                </label>
                <input
                  type="text"
                  value={angelConfig.macAddress}
                  onChange={(e) => setAngelConfig({ ...angelConfig, macAddress: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0a0a0a] border border-[#333] rounded-lg focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none text-zinc-300 font-mono transition-all"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-[#222]">
        <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 flex items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
          {angelConfig.updatedAt ? (
            <>Last Synced: {angelConfig.updatedAt?.toDate?.() ? 
              new Date(angelConfig.updatedAt.toDate()).toLocaleString('en-IN') :
              new Date(angelConfig.updatedAt).toLocaleString('en-IN')
            }</>
          ) : (
            'System Ready'
          )}
        </div>
        
        <button
          onClick={handleUpdateConfig}
          disabled={saving || generatingToken}
          className="flex items-center space-x-2 px-8 py-3 bg-[#111] border border-[#333] text-white font-semibold rounded-lg hover:bg-[#222] hover:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:-translate-y-0.5"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
          ) : (
            <Save className="w-4 h-4 text-emerald-500" />
          )}
          <span>{saving ? 'Syncing...' : 'Save Configuration'}</span>
        </button>
      </div>
    </div>
  );
}