'use client';

import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Settings, Shield, Key, Save, RefreshCw, UserCheck, Network, Cpu, Lock, KeyRound, Zap } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-gray-500 flex items-center"><RefreshCw className="w-5 h-5 animate-spin mr-2"/> Loading settings...</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center space-x-3">
        <Settings className="w-6 h-6 text-gray-800" />
        <h2 className="text-2xl font-bold text-gray-800">Global Settings</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* System Settings */}
        <div className="bg-white rounded-xl border shadow-sm p-6 h-fit">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="w-5 h-5 text-gray-800" />
            <h3 className="text-lg font-semibold text-gray-800">Platform Controls</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Maintenance Mode</label>
                <p className="text-xs text-gray-500 mt-0.5">Locks the app for users showing a maintenance screen.</p>
              </div>
              <button
                onClick={() => handleGlobalToggle('maintenanceMode')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  globalConfig.maintenanceMode ? 'bg-red-500' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${globalConfig.maintenanceMode ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-t pt-6">
              <div>
                <label className="text-sm font-medium text-gray-900">Allow Trading</label>
                <p className="text-xs text-gray-500 mt-0.5">Enable or disable placing new buy/sell orders.</p>
              </div>
              <button
                onClick={() => handleGlobalToggle('tradingEnabled')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  globalConfig.tradingEnabled ? 'bg-green-500' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${globalConfig.tradingEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-t pt-6">
              <div>
                <label className="text-sm font-medium text-gray-900">New User Registration</label>
                <p className="text-xs text-gray-500 mt-0.5">Allow new accounts to sign up on BullXchange.</p>
              </div>
              <button
                onClick={() => handleGlobalToggle('registrationEnabled')}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  globalConfig.registrationEnabled ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${globalConfig.registrationEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Angel One API Configuration */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Angel One Integration</h3>
          </div>
          
          <div className="space-y-4">
            
            {/* Generate Token UI */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
              <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                <Zap className="w-4 h-4 text-amber-500 mr-1.5" /> 
                Generate Live Session Token
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <Lock className="w-3 h-3 inline mr-1" /> Password
                  </label>
                  <input
                    type="password"
                    value={angelPassword}
                    onChange={(e) => setAngelPassword(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="Angel One Password"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <KeyRound className="w-3 h-3 inline mr-1" /> TOTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={angelTotp}
                    onChange={(e) => setAngelTotp(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none tracking-widest font-mono"
                    placeholder="123456"
                  />
                </div>
              </div>
              <button
                onClick={handleGenerateToken}
                disabled={generatingToken || !angelPassword || !angelTotp}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generatingToken ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating API Token...</>
                ) : (
                  'Generate & Save JWT Token'
                )}
              </button>
            </div>

            {/* Current JWT Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Key className="w-4 h-4 inline mr-1" /> Current Active JWT
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={angelConfig.jwtToken}
                  readOnly
                  className="w-full px-3 py-2 pr-16 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 focus:outline-none font-mono text-xs"
                  placeholder="No active token. Generate one above."
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                >
                  {showSecret ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Client Code</label>
                <input
                  type="text"
                  value={angelConfig.clientCode}
                  onChange={(e) => setAngelConfig({ ...angelConfig, clientCode: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Private Key</label>
                <input
                  type="text"
                  value={angelConfig.privateKey}
                  onChange={(e) => setAngelConfig({ ...angelConfig, privateKey: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Network className="w-3 h-3 inline mr-1" /> Local IP
                </label>
                <input
                  type="text"
                  value={angelConfig.clientLocalIP}
                  onChange={(e) => setAngelConfig({ ...angelConfig, clientLocalIP: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Network className="w-3 h-3 inline mr-1" /> Public IP
                </label>
                <input
                  type="text"
                  value={angelConfig.clientPublicIP}
                  onChange={(e) => setAngelConfig({ ...angelConfig, clientPublicIP: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4 border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Source ID</label>
                <input
                  type="text"
                  value={angelConfig.sourceId}
                  onChange={(e) => setAngelConfig({ ...angelConfig, sourceId: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  <Cpu className="w-3 h-3 inline mr-1" /> MAC Address
                </label>
                <input
                  type="text"
                  value={angelConfig.macAddress}
                  onChange={(e) => setAngelConfig({ ...angelConfig, macAddress: e.target.value })}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-500">
          {angelConfig.updatedAt && (
            <>DB Synced: {angelConfig.updatedAt?.toDate?.() ? 
              new Date(angelConfig.updatedAt.toDate()).toLocaleString('en-IN') :
              new Date(angelConfig.updatedAt).toLocaleString('en-IN')
            }</>
          )}
        </div>
        
        <button
          onClick={handleUpdateConfig}
          disabled={saving || generatingToken}
          className="flex items-center space-x-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>
    </div>
  );
}