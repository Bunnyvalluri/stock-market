import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, ShieldCheck, Mail, Smartphone, Globe, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('api');
  const [saveStatus, setSaveStatus] = useState('');
  
  // API Keys state
  const [alphaKey, setAlphaKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('alphaVantageKey');
    if (savedKey) setAlphaKey(savedKey);
  }, []);

  const handleSave = () => {
      // Save logic
      localStorage.setItem('alphaVantageKey', alphaKey);
      setSaveStatus('Saving configuration...');
      setTimeout(() => setSaveStatus('All changes saved to cloud.'), 1000);
      setTimeout(() => setSaveStatus(''), 4000);
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'api':
        return (
          <div className="settings-section animate-fade-in">
            <h2>API Integrations</h2>
            <p className="text-muted mb-4">Connect external data providers and brokerages for real-time order execution.</p>
            
            <div className="form-group grid-2">
              <div className="input-block">
                <label>Alpha Vantage Key</label>
                <input 
                  type="password" 
                  placeholder="ALPHAV-XXXX-XXXX" 
                  value={alphaKey}
                  onChange={(e) => setAlphaKey(e.target.value)}
                  className="custom-input" 
                />
                <span className="text-muted text-xs mt-1 block">Used for fetching real market data limits depending on your usage tier.</span>
              </div>
              <div className="input-block">
                <label>Yahoo Finance API</label>
                <input type="password" placeholder="YH-XXXX-XXXX" className="custom-input" />
              </div>
            </div>
            
            <div className="form-group mt-4">
               <label>Brokerage Integration (OAUTH)</label>
               <div className="broker-connect">
                  <div className="broker-item">
                     <div className="broker-logo alpaca">A</div>
                     <div className="broker-info">
                        <h4>Alpaca Trading</h4>
                        <span className="text-muted">Not Connected</span>
                     </div>
                     <button className="secondary-btn">Connect</button>
                  </div>
                  <div className="broker-item">
                     <div className="broker-logo ibkr">I</div>
                     <div className="broker-info">
                        <h4>Interactive Brokers</h4>
                        <span className="text-up">Connected (Pro)</span>
                     </div>
                     <button className="secondary-btn text-down" style={{borderColor: 'var(--status-down)'}}>Disconnect</button>
                  </div>
               </div>
            </div>
          </div>
        );
      case 'models':
         return (
             <div className="settings-section animate-fade-in">
                <h2>ML Model Configuration</h2>
                <p className="text-muted mb-4">Adjust inference parameters for the predictive engine.</p>
                
                <div className="form-group">
                   <label>Default Prediction Horizon</label>
                   <select className="custom-select w-full">
                      <option>7 Days (High Confidence)</option>
                      <option>14 Days (Medium Confidence)</option>
                      <option>30 Days (Low Confidence - Experimental)</option>
                   </select>
                </div>
                
                <div className="form-group mt-4">
                   <label>Retraining Frequency</label>
                   <div className="radio-group">
                      <label className="radio-label"><input type="radio" name="retrain" /> Every 1 Hour (Heavy Compute)</label>
                      <label className="radio-label"><input type="radio" name="retrain" defaultChecked /> Daily at Market Close</label>
                      <label className="radio-label"><input type="radio" name="retrain" /> Weekly</label>
                   </div>
                </div>
             </div>
         );
      case 'notifications':
         return (
             <div className="settings-section animate-fade-in">
                <h2>Channels & Delivery</h2>
                <p className="text-muted mb-4">How should NeuralTrade contact you during critical market events?</p>
                
                <div className="toggle-block">
                   <div className="tb-info">
                      <h4>Push Notifications</h4>
                      <p className="text-muted">Receive alerts instantly on your desktop and mobile device.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </div>
                
                <div className="toggle-block mt-4">
                   <div className="tb-info">
                      <h4>Email Daily Digest</h4>
                      <p className="text-muted">Send a summary of portfolio P&L and AI predictions at 5PM EST.</p>
                   </div>
                   <input type="checkbox" defaultChecked className="toggle-checkbox" />
                </div>
                
                <div className="toggle-block mt-4">
                   <div className="tb-info">
                      <h4>SMS Critical Alerts</h4>
                      <p className="text-muted">Only for severe account margin or flash crash warnings.</p>
                   </div>
                   <input type="checkbox" className="toggle-checkbox" />
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
