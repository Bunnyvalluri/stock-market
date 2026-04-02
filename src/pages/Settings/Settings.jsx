import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, ShieldCheck, Mail, Smartphone, Globe, Save, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('api');
  const [saveStatus, setSaveStatus] = useState('');
  const [alphaKey, setAlphaKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');

  useEffect(() => {
    const savedAlpha = localStorage.getItem('alphaVantageKey');
    if (savedAlpha) setAlphaKey(savedAlpha);
    const savedAI = localStorage.getItem('openaiKey');
    if (savedAI) setOpenaiKey(savedAI);
  }, []);

  const handleSave = () => {
      localStorage.setItem('alphaVantageKey', alphaKey);
      localStorage.setItem('openaiKey', openaiKey);
      setSaveStatus('SAVING SETTINGS...');
      toast.success('Configuration synced globally.', { icon: '🔐' });
      setTimeout(() => setSaveStatus('SETTINGS SAVED'), 1000);
      setTimeout(() => setSaveStatus(''), 4000);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'api':
        return (
          <div className="settings-section-pro animate-fade-in">
            <div className="section-head-term">
                <Key size={18} className="text-brand" />
                <h2>API Connections</h2>
            </div>
            <p className="subtitle-term text-muted">Manage your external data and AI capabilities.</p>
            
            <div className="form-grid-pro">
              <div className="input-block-pro">
                <label>ALPHA VANTAGE KEY</label>
                <input 
                  type="password" 
                  placeholder="ALPHAV-XXXX-XXXX" 
                  value={alphaKey}
                  onChange={(e) => setAlphaKey(e.target.value)}
                  className="input-pro" 
                />
                <span className="info-txt text-orange">Limits subject to AlphaVantage tier. Real-time websocket enabled on PRO.</span>
              </div>
              <div className="input-block-pro">
                <label>OPENAI API KEY</label>
                <input 
                  type="password" 
                  placeholder="sk-proj-xxxxxxxxxxxx" 
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="input-pro" 
                />
                <span className="info-txt">Required for Firecrawl AI content extraction.</span>
              </div>
            </div>
            
            <div className="broker-integration-pro mt-8">
               <label className="section-label">Broker Connections</label>
               <div className="broker-list-pro">
                  <div className="broker-item-pro">
                     <div className="b-id">
                        <div className="b-logo" style={{background: '#facc15', color: '#000'}}>A</div>
                        <div className="b-meta">
                           <h4>Alpaca Trading</h4>
                           <span className="text-muted">Status: DISCONNECTED</span>
                        </div>
                     </div>
                     <button className="btn-pro-outline" onClick={() => toast.loading('Connecting to Alpaca...', { duration: 2000 })}>CONNECT BROKER</button>
                  </div>
                  <div className="broker-item-pro active">
                     <div className="b-id">
                        <div className="b-logo" style={{background: '#ef4444', color: '#fff'}}>I</div>
                        <div className="b-meta">
                           <h4>Interactive Brokers</h4>
                           <span className="text-up font-mono">Status: CONNECTED</span>
                        </div>
                     </div>
                     <button className="btn-pro-danger" onClick={() => toast.error('Broker interface disconnected.')}>DISCONNECT</button>
                  </div>
                  <div className="broker-item-pro">
                     <div className="b-id">
                        <div className="b-logo" style={{background: '#0f172a', color: '#fff'}}>C</div>
                        <div className="b-meta">
                           <h4>Coinbase Advanced</h4>
                           <span className="text-muted">Status: DISCONNECTED</span>
                        </div>
                     </div>
                     <button className="btn-pro-outline" onClick={() => toast.loading('Connecting to Coinbase...', { duration: 2000 })}>CONNECT BROKER</button>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'models':
         return (
             <div className="settings-section-pro animate-fade-in">
                <div className="section-head-term">
                    <Database size={18} className="text-cyan" />
                    <h2>AI Prediction Settings</h2>
                </div>
                <p className="subtitle-term text-muted">Adjust settings for AI-driven market predictions.</p>
                
                <div className="form-group-pro">
                   <label>Prediction Timeframe</label>
                   <select className="select-pro w-full" onChange={e => toast(`Timeframe: ${e.target.value}`, { icon: '🧠' })}>
                      <option>7 Days (High Accuracy)</option>
                      <option>14 Days (Medium Accuracy)</option>
                      <option>30 Days (Lower Accuracy)</option>
                   </select>
                </div>
                
                <div className="form-group-pro mt-6">
                   <label>Primary AI Model</label>
                   <select className="select-pro w-full" onChange={e => toast(`Model switched: ${e.target.value}`, { icon: '🤖' })}>
                      <option>LSTM-v2 (Recommended)</option>
                      <option>Transformer (High Accuracy)</option>
                      <option>XGBoost (Fast)</option>
                      <option>Ensemble (All Models)</option>
                   </select>
                </div>

                <div className="form-group-pro mt-6">
                   <label>AI Learning Frequency</label>
                   <div className="radio-group-pro">
                      <label className="radio-pro">
                          <input type="radio" name="cron" /> 
                          <span>Hourly Update</span>
                      </label>
                      <label className="radio-pro">
                          <input type="radio" name="cron" defaultChecked /> 
                          <span>Daily Update (Recommended)</span>
                      </label>
                      <label className="radio-pro">
                          <input type="radio" name="cron" /> 
                          <span>Weekly Update</span>
                      </label>
                   </div>
                </div>

                <div className="form-group-pro mt-6">
                   <label>Confidence Threshold</label>
                   <select className="select-pro w-full" onChange={e => toast(`Threshold set: ${e.target.value}`, { icon: '🎯' })}>
                      <option>70% — Aggressive</option>
                      <option>80% — Balanced (Default)</option>
                      <option>90% — Conservative</option>
                      <option>95% — High-Confidence Only</option>
                   </select>
                </div>
             </div>
         );
      case 'security':
         return (
             <div className="settings-section-pro animate-fade-in">
                 <div className="section-head-term">
                    <ShieldCheck size={18} className="text-orange" />
                    <h2>Security &amp; Risk Control</h2>
                 </div>
                 <p className="subtitle-term text-muted">Manage automated protections for your portfolio.</p>

                 <div className="form-grid-pro mt-4">
                   <div className="input-block-pro">
                     <label>2FA AUTHENTICATION</label>
                     <select className="select-pro">
                       <option>Google Authenticator</option>
                       <option>SMS (Phone)</option>
                       <option>Hardware Key (YubiKey)</option>
                     </select>
                     <span className="info-txt text-up">2FA is currently ENABLED on your account.</span>
                   </div>
                   <div className="input-block-pro">
                     <label>SESSION TIMEOUT</label>
                     <select className="select-pro">
                       <option>15 minutes</option>
                       <option>30 minutes (Default)</option>
                       <option>1 hour</option>
                       <option>Never (Not Recommended)</option>
                     </select>
                   </div>
                 </div>

                 <div className="risk-zone-pro mt-8">
                     <h3 className="text-down mb-2">⚠️ Automated Liquidation (Stop-Loss)</h3>
                     <p className="text-muted text-sm mb-4">If a major market crash is detected, the system can automatically sell all positions to protect your capital.</p>
                     <div className="kill-switch-wrap">
                         <div>
                           <div className="text-bold">Emergency Sell All Positions</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Irreversible during market hours. Requires 2FA confirmation.</div>
                         </div>
                         <button className="btn-pro-kill" onClick={() => toast.error('ACTION BLOCKED: Market hours protection active.', { icon: '🛑' })}>LIQUIDATE ALL</button>
                     </div>
                 </div>
             </div>
         );
      case 'appearance':
         return (
             <div className="settings-section-pro animate-fade-in">
                 <div className="section-head-term">
                    <Globe size={18} className="text-brand" />
                    <h2>Appearance</h2>
                 </div>
                 <p className="subtitle-term text-muted">Customize the look and feel of your terminal.</p>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', maxWidth: '600px' }}>
                   <div
                     onClick={() => { document.documentElement.setAttribute('data-theme','dark'); localStorage.setItem('theme','dark'); toast.success('Dark mode activated.', { icon: '🌙' }); }}
                     style={{ padding: '1.25rem', borderRadius: '12px', border: '2px solid var(--accent-brand)', background: '#02040A', cursor: 'pointer', transition: 'transform 0.2s' }}
                     onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                   >
                     <div style={{ width: '100%', height: '70px', borderRadius: '8px', background: 'linear-gradient(135deg,#02040A,#090C15)', marginBottom: '0.75rem', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                       <div style={{ width: '60%', height: '5px', borderRadius: '4px', background: 'linear-gradient(90deg,#3B82F6,#8B5CF6)' }}></div>
                       <div style={{ width: '40%', height: '5px', borderRadius: '4px', background: '#1E293B' }}></div>
                     </div>
                     <div style={{ color: '#F8FAFC', fontWeight: 700, fontSize: '0.9rem' }}>🌙 Dark Mode</div>
                     <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '2px' }}>Infinite Slate — Currently Active</div>
                   </div>
                   <div
                     onClick={() => { document.documentElement.setAttribute('data-theme','light'); localStorage.setItem('theme','light'); toast.success('Light mode activated.', { icon: '☀️' }); }}
                     style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.25)', background: '#fafbff', cursor: 'pointer', transition: 'transform 0.2s' }}
                     onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                   >
                     <div style={{ width: '100%', height: '70px', borderRadius: '8px', background: 'linear-gradient(135deg,#f0f4ff,#fdf4ff)', marginBottom: '0.75rem', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                       <div style={{ width: '60%', height: '5px', borderRadius: '4px', background: 'linear-gradient(90deg,#4f46e5,#ec4899)' }}></div>
                       <div style={{ width: '40%', height: '5px', borderRadius: '4px', background: 'rgba(99,102,241,0.2)' }}></div>
                     </div>
                     <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.9rem' }}>☀️ Light Mode</div>
                     <div style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '2px' }}>Premium Indigo — Vibrant</div>
                   </div>
                 </div>

                 <div className="form-group-pro mt-8" style={{ maxWidth: '400px' }}>
                   <label>Chart Default Timeframe</label>
                   <select className="select-pro w-full" onChange={e => toast(`Default chart: ${e.target.value}`, { icon: '📊' })}>
                     <option>1 Day</option>
                     <option>1 Week</option>
                     <option>1 Month (Default)</option>
                     <option>3 Months</option>
                     <option>YTD</option>
                   </select>
                 </div>
                 <div className="form-group-pro mt-4" style={{ maxWidth: '400px' }}>
                   <label>Price Display Format</label>
                   <select className="select-pro w-full" onChange={e => toast(`Format: ${e.target.value}`, { icon: '💲' })}>
                     <option>USD — $1,234.56 (Default)</option>
                     <option>Compact — $1.23K</option>
                     <option>Full Precision — 1234.5600</option>
                   </select>
                 </div>
                 <div className="form-group-pro mt-4" style={{ maxWidth: '400px' }}>
                   <label>Data Refresh Rate</label>
                   <select className="select-pro w-full" onChange={e => toast(`Refresh rate: ${e.target.value}`, { icon: '⚡' })}>
                     <option>Ultra-Fast — 500ms</option>
                     <option>Fast — 1 Second (Default)</option>
                     <option>Normal — 5 Seconds</option>
                     <option>Slow — 30 Seconds</option>
                   </select>
                 </div>
             </div>
         );
      default:
         return null;
    }
  };

  return (
    <div className="settings-pro-container animate-fade-in">
      <div className="settings-pro-header flex-between mb-6">
         <div className="header-pro-title">
           <Terminal className="text-brand" size={24} />
           <div>
               <h1>System Settings</h1>
               <p className="text-muted text-sm">Manage your account, API keys, AI models, and security</p>
           </div>
         </div>
         <div className="header-pro-actions flex-row">
           <AnimatePresence>
               {saveStatus && (
                 <motion.span 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="save-status-pro text-up font-mono"
                 >
                    {saveStatus}
                 </motion.span>
               )}
           </AnimatePresence>
           <button className="btn-pro-primary" onClick={handleSave}>
               <Save size={14} /> SAVE CHANGES
           </button>
         </div>
      </div>

      <div className="settings-pro-layout glass-card">
         <div className="settings-pro-sidebar">
            <nav className="settings-pro-nav">
               <button className={`nav-pro-item ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>
                 <Key size={16} /> API Integrations
               </button>
               <button className={`nav-pro-item ${activeTab === 'models' ? 'active' : ''}`} onClick={() => setActiveTab('models')}>
                 <Database size={16} /> AI Models
               </button>
               <button className={`nav-pro-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                 <ShieldCheck size={16} /> Security
               </button>
               <button className={`nav-pro-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
                 <Globe size={16} /> Appearance
               </button>
            </nav>
         </div>
         
         <div className="settings-pro-content">
            {renderContent()}
         </div>
      </div>
    </div>
  );
};

export default Settings;
