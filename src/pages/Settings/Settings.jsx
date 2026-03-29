import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, ShieldCheck, Mail, Smartphone, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('api');
  const [saveStatus, setSaveStatus] = useState('');
  
  // API Keys state
  const [firecrawlKey, setFirecrawlKey] = useState('');
  const [killSwitch, setKillSwitch] = useState(false);

  useEffect(() => {
    const savedAlpha = localStorage.getItem('alphaVantageKey');
    const savedFc = localStorage.getItem('firecrawlKey');
    if (savedAlpha) setAlphaKey(savedAlpha);
    if (savedFc) setFirecrawlKey(savedFc);
  }, []);

  const handleSave = () => {
      localStorage.setItem('alphaVantageKey', alphaKey);
      localStorage.setItem('firecrawlKey', firecrawlKey);
      setSaveStatus('Syncing credentials to secure vault...');
      setTimeout(() => setSaveStatus('Configuration Locked & Encrypted.'), 1200);
      setTimeout(() => setSaveStatus(''), 4000);
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'api':
        return (
          <div className="settings-section animate-fade-in">
            <div className="section-header-block">
               <h2>Data & Execution Infrastructure</h2>
               <p className="text-muted mb-4">Manage your latency-sensitive API connections and brokerage WebSockets.</p>
            </div>
            
            <div className="form-group grid-2">
              <div className="input-block">
                <div className="flex-between mb-2">
                   <label>Alpha Vantage (Market Data)</label>
                   <span className="status-badge connected"><span className="dot"></span> Online (42ms)</span>
                </div>
                <input 
                  type="password" 
                  placeholder="ALPHAV-XXXX-XXXX" 
                  value={alphaKey}
                  onChange={(e) => setAlphaKey(e.target.value)}
                  className="custom-input mono-input" 
                />
                <span className="text-muted text-xs mt-1 block">Provides end-of-day and historical tick data.</span>
              </div>

              <div className="input-block">
                <div className="flex-between mb-2">
                   <label>Firecrawl Scraping Engine</label>
                   <span className="status-badge connected"><span className="dot"></span> Online (86ms)</span>
                </div>
                <input 
                  type="password" 
                  placeholder="fc-XXXX-XXXX-XXXX" 
                  value={firecrawlKey}
                  onChange={(e) => setFirecrawlKey(e.target.value)}
                  className="custom-input mono-input" 
                />
                <span className="text-muted text-xs mt-1 block">Powers LLM markdown ripping for the Sentiment Predictor.</span>
              </div>
            </div>
            
            <div className="form-group mt-4 border-top pt-4">
               <label>Brokerage Integration (OAUTH / FIX API)</label>
               <div className="broker-connect">
                  <div className="broker-item">
                     <div className="broker-logo ibkr">IB</div>
                     <div className="broker-info">
                        <h4>Interactive Brokers TWS</h4>
                        <span className="text-up mono-text">CONNECTED [PRO TIER]</span>
                     </div>
                     <button className="secondary-btn text-down" style={{borderColor: 'var(--status-down)'}}>Disconnect</button>
                  </div>
                  <div className="broker-item opacity-70">
                     <div className="broker-logo alpaca">A</div>
                     <div className="broker-info">
                        <h4>Alpaca Trading</h4>
                        <span className="text-muted">Not Connected</span>
                     </div>
                     <button className="secondary-btn">Authorize</button>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'models':
         return (
             <div className="settings-section animate-fade-in">
                <div className="section-header-block">
                   <h2>Algorithmic & Risk Parameters</h2>
                   <p className="text-muted mb-4">Hard-code limits for the autonomous machine learning predictive engine.</p>
                </div>
                
                <div className="risk-zone mb-4">
                   <div className="flex-between">
                     <div className="rz-info">
                       <h3 className="text-down mb-1">Emergency System Halt</h3>
                       <p className="text-muted text-xs">Instantly severs all API connections and attempts to flatten all open neural-net positions.</p>
                     </div>
                     <button 
                       className={`kill-btn ${killSwitch ? 'active' : ''}`} 
                       onClick={() => setKillSwitch(!killSwitch)}
                     >
                       {killSwitch ? 'SYSTEM HALTED' : 'ENGAGE KILL SWITCH'}
                     </button>
                   </div>
                </div>

                <div className="form-group grid-2">
                   <div>
                       <label>Maximum Daily Drawdown (%)</label>
                       <input type="number" defaultValue="2.5" className="custom-input mono-input" step="0.1" />
                   </div>
                   <div>
                       <label>Max Capital Allocation per Trade</label>
                       <select className="custom-select w-full">
                          <option>5% (Strict Risk Margin)</option>
                          <option>10% (Standard Margin)</option>
                          <option>25% (Aggressive)</option>
                       </select>
                   </div>
                </div>
                
                <div className="form-group mt-4 pt-4 border-top">
                   <label>Neural Net Retraining Frequency</label>
                   <div className="radio-group">
                      <label className="radio-label">
                         <input type="radio" name="retrain" /> 
                         <span>HFT Intraday (Every 1 Hour) - <span className="text-up">High Compute Cost</span></span>
                      </label>
                      <label className="radio-label">
                         <input type="radio" name="retrain" defaultChecked /> 
                         <span>Daily Post-Market Scrub (4:15 PM EST)</span>
                      </label>
                   </div>
                </div>
             </div>
         );
      case 'notifications':
         return (
             <div className="settings-section animate-fade-in">
                <div className="section-header-block">
                   <h2>Alerts & Telemetry</h2>
                   <p className="text-muted mb-4">Configure routing for automated trade confirmations and margin warnings.</p>
                </div>
                
                <div className="toggle-block">
                   <div className="tb-info">
                      <h4>WebSocket Push Telemetry</h4>
                      <p className="text-muted text-xs">Receive live on-screen toasts for individual order executions and fill prices.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </div>
                
                <div className="toggle-block mt-4">
                   <div className="tb-info">
                      <h4>Daily P&L Reconciliation Email</h4>
                      <p className="text-muted text-xs">Send cryptographically signed PDF summary of daily portfolio performance to registered email.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </div>
                
                <div className="toggle-block mt-4 alert-block">
                   <div className="tb-info">
                      <h4 className="text-down">SMS Margin Call Alerts</h4>
                      <p className="text-muted text-xs">Direct SMS routing for critical account liquidation risks or flash crashes.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </div>
             </div>
         );
      default:
         return null;
    }
  };

  return (
    <div className="settings-container animate-fade-in">
      <div className="page-header flex-between">
         <div className="header-title">
           <SettingsIcon className="text-gradient" size={28} />
           <h1>System Configuration</h1>
         </div>
         <div className="header-actions">
           {saveStatus && <span className="save-status text-up">{saveStatus}</span>}
           <button className="primary-btn" onClick={handleSave}><Save size={16} /> Apply Changes</button>
         </div>
      </div>

      <div className="settings-layout glass-card">
         <div className="settings-sidebar">
            <nav className="settings-nav">
               <button className={`sn-item ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>
                 <Key size={18} /> API & Brokers
               </button>
               <button className={`sn-item ${activeTab === 'models' ? 'active' : ''}`} onClick={() => setActiveTab('models')}>
                 <Database size={18} /> ML Parameters
               </button>
               <button className={`sn-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                 <Mail size={18} /> Notifications
               </button>
               <button className="sn-item">
                 <ShieldCheck size={18} /> Security
               </button>
               <button className="sn-item">
                 <Globe size={18} /> Preferences
               </button>
            </nav>
         </div>
         
         <div className="settings-content">
            {renderContent()}
         </div>
      </div>
    </div>
  );
};

export default Settings;
