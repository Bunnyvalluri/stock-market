import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Database, ShieldCheck, Mail, Smartphone, Globe, Save, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      setSaveStatus('WRITING TO CLUSTER...');
      setTimeout(() => setSaveStatus('CONFIGURATION PERSISTED [OK]'), 1000);
      setTimeout(() => setSaveStatus(''), 4000);
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'api':
        return (
          <div className="settings-section-pro animate-fade-in">
            <div className="section-head-term">
                <Key size={18} className="text-brand" />
                <h2>API / DATA VECTORS</h2>
            </div>
            <p className="subtitle-term text-muted">Initialize high-frequency data pipelines and LLM inference endpoints.</p>
            
            <div className="form-grid-pro">
              <div className="input-block-pro">
                <label>ALPHA VANTAGE DATA STREAM (MANDATORY)</label>
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
                <label>OPENAI INFERENCE KEY (GPT-4O)</label>
                <input 
                  type="password" 
                  placeholder="sk-proj-xxxxxxxxxxxx" 
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="input-pro" 
                />
                <span className="info-txt">Required for Firecrawl unstructured news sentiment extraction.</span>
              </div>
            </div>
            
            <div className="broker-integration-pro mt-8">
               <label className="section-label">OAUTH BROKERAGE TUNNELS</label>
               <div className="broker-list-pro">
                  <div className="broker-item-pro">
                     <div className="b-id">
                        <div className="b-logo" style={{background: '#facc15', color: '#000'}}>A</div>
                        <div className="b-meta">
                           <h4>Alpaca Trading</h4>
                           <span className="text-muted">Status: DISCONNECTED</span>
                        </div>
                     </div>
                     <button className="btn-pro-outline">CONNECT TUNNEL</button>
                  </div>
                  <div className="broker-item-pro active">
                     <div className="b-id">
                        <div className="b-logo" style={{background: '#ef4444', color: '#fff'}}>I</div>
                        <div className="b-meta">
                           <h4>Interactive Brokers</h4>
                           <span className="text-up font-mono">Status: ACTIVE_PRO</span>
                        </div>
                     </div>
                     <button className="btn-pro-danger">SEVER LINK</button>
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
                    <h2>ML INFERENCE PARAMETERS</h2>
                </div>
                <p className="subtitle-term text-muted">Adjust neural network hyper-parameters for the predictive core.</p>
                
                <div className="form-group-pro">
                   <label>DEFAULT FORECAST HORIZON (LSTM)</label>
                   <select className="select-pro w-full">
                      <option>T+7 Days (Optimal Purity)</option>
                      <option>T+14 Days (Medium Bias)</option>
                      <option>T+30 Days (Experimental / High Variance)</option>
                   </select>
                </div>
                
                <div className="form-group-pro mt-6">
                   <label>RETRAINING CRON JOB</label>
                   <div className="radio-group-pro">
                      <label className="radio-pro">
                          <input type="radio" name="cron" /> 
                          <span>HOURLY CLUSTER BUILD (Heavy Compute)</span>
                      </label>
                      <label className="radio-pro">
                          <input type="radio" name="cron" defaultChecked /> 
                          <span>DAILY MARKET CLOSE (Recommended)</span>
                      </label>
                      <label className="radio-pro">
                          <input type="radio" name="cron" /> 
                          <span>WEEKLY SKEW ADJUSTMENT</span>
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
                    <h2>INFRASTRUCTURE SECURITY</h2>
                 </div>
                 <p className="subtitle-term text-muted">Configure access controls and automated kill-switches.</p>

                 <div className="risk-zone-pro mt-4">
                     <h3 className="text-down mb-2">Automated Liquidation (Stop-Loss)</h3>
                     <p className="text-muted text-sm mb-4">If the ML Engine detects an unrecoverable "Black Swan" event or severe portfolio drawdown, the system can automatically sever connections and liquidate all long positions.</p>
                     
                     <div className="kill-switch-wrap">
                         <span className="text-bold">GLOBAL PORTFOLIO KILL-SWITCH:</span>
                         <button className="btn-pro-kill">ACTIVATE PANIC LIQUIDATION</button>
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
               <h1>System Infrastructure</h1>
               <p className="text-muted text-sm">Cluster configuration and API integration</p>
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
               <Save size={14} /> PUSH CONFIG
           </button>
         </div>
      </div>

      <div className="settings-pro-layout glass-card">
         <div className="settings-pro-sidebar">
            <nav className="settings-pro-nav">
               <button className={`nav-pro-item ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>
                 <Key size={16} /> API TUNNELS
               </button>
               <button className={`nav-pro-item ${activeTab === 'models' ? 'active' : ''}`} onClick={() => setActiveTab('models')}>
                 <Database size={16} /> CORE MODEL
               </button>
               <button className={`nav-pro-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                 <ShieldCheck size={16} /> SECURITY
               </button>
               <button className="nav-pro-item">
                 <Globe size={16} /> UI OVERRIDE
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
