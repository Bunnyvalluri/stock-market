import React, { useState, useEffect, useCallback, memo } from 'react';
import { 
  Settings as SettingsIcon, Key, Database, ShieldCheck, 
  Globe, Save, Terminal, Cpu, Layout, Bell, 
  ChevronRight, Smartphone, Mail, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './Settings.css';

// ==========================================
// CONSTANTS
// ==========================================
const SETTINGS_TABS = [
  { id: 'api', label: 'API Integrations', icon: <Key size={18} /> },
  { id: 'models', label: 'AI Prediction', icon: <Database size={18} /> },
  { id: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
  { id: 'appearance', label: 'Appearance', icon: <Globe size={18} /> },
];

// ==========================================
// MEMOIZED SUB-COMPONENTS
// ==========================================

const SidebarItem = memo(({ item, isActive, onClick }) => (
  <button 
    className={`settings-nav-item ${isActive ? 'active' : ''}`}
    onClick={() => onClick(item.id)}
  >
    <div className="nav-icon">{item.icon}</div>
    <span>{item.label}</span>
    {isActive && <motion.div layoutId="activeNav" className="active-nav-indicator" />}
  </button>
));
SidebarItem.displayName = 'SidebarItem';

const BrokerCard = memo(({ name, status, logo, color, isActive, onAction }) => (
  <div className={`broker-card glass-panel ${isActive ? 'active' : ''}`}>
    <div className="broker-info">
       <div className="broker-logo" style={{ background: color }}>{logo}</div>
       <div className="broker-meta">
          <h4>{name}</h4>
          <span className={isActive ? 'status-connected' : 'status-disconnected'}>
             {status}
          </span>
       </div>
    </div>
    <button 
      className={isActive ? 'btn-outline-danger' : 'btn-outline-premium'}
      onClick={onAction}
    >
      {isActive ? 'Disconnect' : 'Connect Broker'}
    </button>
  </div>
));
BrokerCard.displayName = 'BrokerCard';

// ==========================================
// MAIN COMPONENT
// ==========================================
const Settings = () => {
  const [activeTab, setActiveTab] = useState('api');
  const [saveStatus, setSaveStatus] = useState('');
  const [alphaKey, setAlphaKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');

  useEffect(() => {
    setAlphaKey(localStorage.getItem('alphaVantageKey') || '');
    setOpenaiKey(localStorage.getItem('openaiKey') || '');
  }, []);

  const handleSave = useCallback(() => {
      localStorage.setItem('alphaVantageKey', alphaKey);
      localStorage.setItem('openaiKey', openaiKey);
      setSaveStatus('SYNCING...');
      toast.success('Configuration updated globally', { icon: '🔐' });
      setTimeout(() => setSaveStatus('SAVED'), 1000);
      setTimeout(() => setSaveStatus(''), 4000);
  }, [alphaKey, openaiKey]);

  const renderContent = () => {
    switch(activeTab) {
      case 'api':
        return (
          <motion.div className="settings-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="section-header">
                <h3>Global Data Keys</h3>
                <p>Configure external data providers and AI endpoints.</p>
            </div>
            <div className="settings-grid">
               <div className="form-group-premium">
                  <label htmlFor="alpha-key">Alpha Vantage API Key</label>
                  <div className="input-wrapper">
                    <input id="alpha-key" type="password" value={alphaKey} onChange={e => setAlphaKey(e.target.value)} placeholder="••••••••••••" />
                    <Key size={16} className="input-icon" />
                  </div>
                  <span className="help-text">Used for real-time market telemetry and historical data.</span>
               </div>
               <div className="form-group-premium">
                  <label htmlFor="openai-key">OpenAI Model Endpoint</label>
                  <div className="input-wrapper">
                    <input id="openai-key" type="password" value={openaiKey} onChange={e => setOpenaiKey(e.target.value)} placeholder="••••••••••••" />
                    <Database size={16} className="input-icon" />
                  </div>
                  <span className="help-text">Required for Firecrawl AI context extraction.</span>
               </div>
            </div>
            <div className="divider" />
            <div className="section-header mt-8">
               <h3>Prime Brokerage Connections</h3>
               <p>Link your institutional accounts for autonomous trade execution.</p>
            </div>
            <div className="broker-grid">
               <BrokerCard 
                 name="Alpaca Markets" 
                 status="Disconnected" 
                 logo="A" 
                 color="#facc15" 
                 onAction={useCallback(() => toast('Initializing Alpaca handshake...'), [])} 
               />
               <BrokerCard 
                 name="Interactive Brokers" 
                 status="Connected" 
                 logo="I" 
                 color="#ef4444" 
                 isActive={true} 
                 onAction={useCallback(() => toast.error('Connection severed'), [])} 
               />
               <BrokerCard 
                 name="Coinbase Advanced" 
                 status="Disconnected" 
                 logo="C" 
                 color="#3b82f6" 
                 onAction={useCallback(() => toast('Connecting to Coinbase API...'), [])} 
               />
            </div>
          </motion.div>
        );
      case 'models':
         return (
           <motion.div className="settings-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="section-header">
                  <h3>Model Hyperparameters</h3>
                  <p>Fine-tune the intelligence engine's forecasting behavior.</p>
              </div>
              <div className="settings-grid">
                 <div className="form-group-premium">
                    <label>Default Prediction Horizon</label>
                    <select className="select-premium" onChange={e => toast(`Horizon set: ${e.target.value}`)}>
                       <option>7 Days (High Precision)</option>
                       <option>14 Days (Balanced)</option>
                       <option>30 Days (Macro Trend)</option>
                    </select>
                 </div>
                 <div className="form-group-premium">
                    <label>Neural Architecture</label>
                    <select className="select-premium" onChange={e => toast(`Engine switched: ${e.target.value}`)}>
                       <option>LSTM-v2 Core</option>
                       <option>Transformer-XL</option>
                       <option>Ensemble Meta-Model</option>
                    </select>
                 </div>
                 <div className="form-group-premium">
                    <label>Inference Confidence Threshold</label>
                    <select className="select-premium" onChange={e => toast(`Threshold: ${e.target.value}`)}>
                       <option>80% — Standard</option>
                       <option>90% — Conservative</option>
                       <option>95% — High-Conviction Only</option>
                    </select>
                 </div>
              </div>
           </motion.div>
         );
      case 'security':
         return (
           <motion.div className="settings-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="section-header">
                  <h3>Access & Protection</h3>
                  <p>Secure your terminal and monitor institutional activity logs.</p>
              </div>
              <div className="security-cards">
                 <div className="glass-panel security-card">
                    <div className="card-top">
                       <Smartphone size={24} className="text-brand" />
                       <div className="card-info">
                          <h4>Multi-Factor Auth</h4>
                          <p>Current: Google Authenticator</p>
                       </div>
                    </div>
                    <button className="btn-text-link">Update Method <ChevronRight size={14} /></button>
                 </div>
                 <div className="glass-panel security-card">
                    <div className="card-top">
                       <Lock size={24} className="text-cyan" />
                       <div className="card-info">
                          <h4>Session Security</h4>
                          <p>Auto-lock after 30m of inactivity</p>
                       </div>
                    </div>
                    <button className="btn-text-link">Manage Sessions <ChevronRight size={14} /></button>
                 </div>
              </div>
              <div className="emergency-zone glass-panel mt-8">
                  <div className="emergency-header">
                     <AlertTriangle className="text-down" size={24} />
                     <div className="emergency-info">
                        <h4 className="text-down">Portfolio Kill Switch</h4>
                        <p>Triggering this will immediately liquidate all positions to cash on linked brokers. Irreversible during active trading hours.</p>
                     </div>
                  </div>
                  <button className="btn-primary-danger" onClick={() => toast.error('Emergency trigger requires 2FA confirmation.')}>
                     EXECUTE GLOBAL LIQUIDATION
                  </button>
              </div>
           </motion.div>
         );
      case 'appearance':
         return (
           <motion.div className="settings-section" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="section-header">
                  <h3>Interface Customization</h3>
                  <p>Personalize your trading environment.</p>
              </div>
              <div className="theme-selector-grid">
                 <div 
                   className="theme-option active glass-panel" 
                   role="button"
                   tabIndex={0}
                   onClick={() => toast.success('Obsidian Dark Active')}
                   onKeyDown={(e) => e.key === 'Enter' && toast.success('Obsidian Dark Active')}
                 >
                    <div className="theme-preview dark" />
                    <div className="theme-label">
                       <span>Obsidian Dark</span>
                       <CheckCircle size={14} className="text-brand" />
                    </div>
                 </div>
                 <div 
                   className="theme-option glass-panel" 
                   role="button"
                   tabIndex={0}
                   onClick={() => toast('Solaris Light (Disabled in Demo)')}
                   onKeyDown={(e) => e.key === 'Enter' && toast('Solaris Light (Disabled in Demo)')}
                 >
                    <div className="theme-preview light" />
                    <div className="theme-label">
                       <span>Solaris Light</span>
                    </div>
                 </div>
              </div>
              <div className="settings-grid mt-8">
                 <div className="form-group-premium">
                    <label>Data Stream Refresh Rate</label>
                    <select className="select-premium" defaultValue="1s">
                       <option value="500ms">Real-time (500ms)</option>
                       <option value="1s">Standard (1s)</option>
                       <option value="5s">Stable (5s)</option>
                    </select>
                 </div>
                 <div className="form-group-premium">
                    <label>Typography Scale</label>
                    <select className="select-premium" defaultValue="normal">
                       <option value="compact">Compact (Dense)</option>
                       <option value="normal">Standard (Default)</option>
                    </select>
                 </div>
              </div>
           </motion.div>
         );
      default: return null;
    }
  };

  return (
    <div className="settings-premium-container animate-fade-in">
      <div className="premium-home-bg">
         <div className="home-glow home-glow-1"></div>
         <div className="home-glow home-glow-2"></div>
      </div>

      <div className="settings-content-wrapper">
        <div className="page-header-premium">
          <div className="header-titles">
              <SettingsIcon className="text-brand" size={28} />
              <div>
                  <h1>System Configuration</h1>
                  <p>Master terminal control, security, and AI hyperparameters.</p>
              </div>
          </div>
          <div className="header-actions-premium">
              <AnimatePresence>
                 {saveStatus && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="save-indicator">
                       {saveStatus}
                    </motion.span>
                 )}
              </AnimatePresence>
              <button className="btn-primary-premium" onClick={handleSave}>
                  <Save size={16} /> Save Changes
              </button>
          </div>
        </div>

        <div className="settings-layout-main glass-panel">
           <div className="settings-sidebar">
              {SETTINGS_TABS.map(tab => (
                 <SidebarItem 
                   key={tab.id} 
                   item={tab} 
                   isActive={activeTab === tab.id} 
                   onClick={setActiveTab} 
                 />
              ))}
           </div>
           <div className="settings-pane">
              {renderContent()}
           </div>
        </div>
      </div>
    </div>
  );
};

const AlertTriangle = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

const CheckCircle = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default Settings;
