import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, ShieldCheck, Mail, Smartphone, Globe, Save, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  }

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
                   <select className="select-pro w-full">
                      <option>7 Days (High Accuracy)</option>
                      <option>14 Days (Medium Accuracy)</option>
                      <option>30 Days (Lower Accuracy)</option>
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
             </div>
         );
      case 'security':
         return (
             <div className="settings-section-pro animate-fade-in">
                 <div className="section-head-term">
                    <ShieldCheck size={18} className="text-orange" />
                    <h2>Security & Risk Control</h2>
                 </div>
                 <p className="subtitle-term text-muted">Manage automated protections for your portfolio.</p>

                 <div className="risk-zone-pro mt-4">
                     <h3 className="text-down mb-2">Automated Liquidation (Stop-Loss)</h3>
                     <p className="text-muted text-sm mb-4">If a major market crash is detected, the system can automatically sell all positions to protect your capital.</p>
                     
                     <div className="kill-switch-wrap">
                         <span className="text-bold">Emergency Sell All:</span>
                         <button className="btn-pro-kill" onClick={() => toast.error('ACTION ILLEGAL: MARKET CLOSED', { icon: '🛑' })}>LIQUIDATE POSITIONS</button>
                     </div>
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
               <p className="text-muted text-sm">Manage your account, connections, and security</p>
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
                 <ShieldCheck size={16} /> SECURITY
               </button>
               <button className="nav-pro-item">
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
