import React, { useState, useEffect } from 'react';
import { BellRing, Plus, Settings2, BellOff, ArrowUpRight, ArrowDownRight, Activity, Zap, Terminal, ShieldAlert, Cpu, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Alerts.css';

const INITIAL_ALERTS = [
  { id: 1, type: 'price', target: 'NVDA', condition: '≥ $900.00', active: true, desc: 'Execute Block Trade upon crossing threshold', triggered: false },
  { id: 2, type: 'ai', target: 'AAPL', condition: 'MACD Convergence', active: true, desc: 'LSTM detects bullish trend shift in dark pools', triggered: false },
  { id: 3, type: 'market', target: 'SPY', condition: 'VIX > 20', active: false, desc: 'Global Market Volatility Exceeds 20% Baseline', triggered: false },
  { id: 4, type: 'danger', target: 'PORTFOLIO', condition: 'Drawdown > 3%', active: true, desc: 'CRITICAL: Trigger Emergency Liquidate All', triggered: false },
];

const Alerts = () => {
  const [alertsList, setAlertsList] = useState(INITIAL_ALERTS);
  const [incomingLog, setIncomingLog] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const navigate = useNavigate();

  // Simulate High-Frequency Alert Engine
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const types = ['NEURAL NET', 'PRICE ACTION', 'DARK POOL', 'MARGIN CALL'];
        const targets = ['NVDA', 'TSLA', 'BTC', 'AAPL', 'AMD', 'SPY', 'JPM'];
        const pType = types[Math.floor(Math.random() * types.length)];
        
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 2 }),
          type: pType,
          target: targets[Math.floor(Math.random() * targets.length)],
          msg: pType === 'MARGIN CALL' ? 'CRITICAL RISK EXPOSURE DETECTED. SEVER LINK INITIATED.' : 'Threshold divergence detected. AI model recalibrating positions.',
          isCritical: pType === 'MARGIN CALL'
        };

        setIncomingLog(prev => [newLog, ...prev].slice(0, 20)); // Keep last 20
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleAlert = (id) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const routeToStock = (symbol) => {
    if (symbol !== 'PORTFOLIO') {
        navigate(`/stock/${symbol}`);
    } else {
        navigate(`/settings`); // Route portfolio/margin alerts to security
    }
  };

  return (
    <div className="alerts-pro-container animate-fade-in">
      <div className="alerts-pro-header flex-between mb-6">
         <div className="header-pro-title">
           <Cpu className="text-cyan" size={24} />
           <div>
               <h1>Algorithmic Telemetry Engine</h1>
               <p className="text-muted text-sm font-mono">Real-time socket notifications & predictive trigger limits</p>
           </div>
         </div>
         <div className="header-pro-actions flex-row">
           <div className={`live-toggle-pro ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
             <div className="pulse-dot-cyan"></div>
             {isLive ? 'WEBSOCKET INTERCEPT: ACTIVE' : 'CONNECTION SEVERED'}
           </div>
           <button className="btn-pro-primary"><Plus size={14} /> NEW ALGORITHM</button>
         </div>
      </div>

      <div className="alerts-pro-layout">
        
        {/* Active Triggers - Left Panel */}
        <div className="active-rules-pro glass-card">
           <div className="section-head-term">
             <Activity size={18} className="text-orange" />
             <h2>HARD-CODED EXECUTION PARAMETERS</h2>
             <button className="icon-btn-pro ms-auto"><Settings2 size={16}/></button>
           </div>
           <p className="subtitle-term text-muted">Fixed threshold nodes explicitly overriding Neural Net predictions.</p>
           
           <div className="rules-list-pro mt-4">
             {alertsList.map(alert => (
                <div key={alert.id} className={`rule-item-pro ${alert.active ? 'is-active' : 'is-disabled'}`}>
                   <div className="rule-icon-pro">
                     {alert.type === 'ai' ? <Zap size={20} className="text-purple"/> : 
                      alert.type === 'danger' ? <ShieldAlert size={20} className="text-down"/> : 
                      <Terminal size={20} className="text-brand"/>}
                   </div>
                   <div className="rule-info-pro">
                     <h4>
                        <span 
                           className="r-target clickable-target" 
                           onClick={() => routeToStock(alert.target)}
                           title={`Inspect ${alert.target} Data`}
                        >
                            {alert.target} <ExternalLink size={10}/>
                        </span>
                        <span className="r-cond">{alert.condition}</span>
                     </h4>
                     <p className={alert.type === 'danger' ? 'text-down font-bold' : ''}>{alert.desc}</p>
                   </div>
                   <div className="rule-toggle-pro">
                     <button className={`toggle-btn-pro ${alert.active ? 'on' : 'off'}`} onClick={() => toggleAlert(alert.id)}>
                        <div className="toggle-slider-pro"></div>
                     </button>
                   </div>
                </div>
             ))}
           </div>
        </div>

        {/* Live Event Stream - Right Panel (Raw Terminal) */}
        <div className="live-logs-pro glass-card">
          <div className="section-head-term">
            <Terminal size={18} className="text-brand" />
            <h2>GLOBAL EVENT STREAM</h2>
            <span className="text-up text-xs font-mono ms-auto tracking-widest">[ENCRYPTED SSL]</span>
          </div>
          <p className="subtitle-term text-muted mb-4">Raw institutional order flow and ML prediction inferences.</p>
          
          <div className="log-feed-pro terminal-bg">
             <AnimatePresence>
                {incomingLog.length === 0 && (
                  <div className="empty-log text-muted font-mono">Listening on port 8443...<span className="blink-cursor">_</span></div>
                )}
                {incomingLog.map((log, i) => (
                  <motion.div 
                    key={log.id} 
                    className={`log-entry-term ${i === 0 ? 'flash-bg-term' : ''} ${log.isCritical ? 'critical-border' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                  >
                     <div className="log-timestamp-pro">{log.time}</div>
                     <div className="log-content-pro">
                       <span className={`log-badge-pro ${log.isCritical ? 'badge-danger' : log.type === 'NEURAL NET' ? 'badge-ai' : 'badge-standard'}`}>
                         [{log.type}]
                       </span>
                       <span 
                          className="log-target-pro clickable-target"
                          onClick={() => routeToStock(log.target)}
                       >
                           {log.target} <ArrowUpRight size={10} className="inline-icon"/>
                       </span>
                       <span className={`log-msg-pro ${log.isCritical ? 'text-down' : ''}`}>
                          {log.msg}
                       </span>
                     </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Alerts;
