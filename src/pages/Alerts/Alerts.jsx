import React, { useState, useEffect } from 'react';
import { BellRing, Plus, Settings2, BellOff, ArrowUpRight, ArrowDownRight, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Alerts.css';

const INITIAL_ALERTS = [
  { id: 1, type: 'price', target: 'NVDA', condition: '> $900', active: true, desc: 'Price crosses $900 threshold', triggered: false },
  { id: 2, type: 'ai', target: 'AAPL', condition: 'Uptrend Shift', active: true, desc: 'LSTM detects trend shift to BULLISH', triggered: false },
  { id: 3, type: 'market', target: 'SPY', condition: 'Volatility > 2%', active: false, desc: 'S&P 500 swings more than 2%', triggered: false }
];

const Alerts = () => {
  const [alertsList, setAlertsList] = useState(INITIAL_ALERTS);
  const [incomingLog, setIncomingLog] = useState([]);
  const [isLive, setIsLive] = useState(true);

  // Simulate random incoming triggered alerts from the ML backend/WebSockets
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types = ['AI Prediction', 'Price Hit', 'Volume Spike'];
        const targets = ['NVDA', 'TSLA', 'BTC', 'AAPL', 'AMD'];
        
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: types[Math.floor(Math.random() * types.length)],
          target: targets[Math.floor(Math.random() * targets.length)],
          msg: `Threshold crossed. Immediate action recommended.`
        };

        setIncomingLog(prev => [newLog, ...prev].slice(0, 15)); // Keep last 15
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const toggleAlert = (id) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="alerts-container animate-fade-in">
      <div className="page-header flex-between">
         <div className="header-title">
           <BellRing className="text-gradient-cyan" size={28} />
           <h1>Notification Engine</h1>
           <div className={`live-badge ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
             <div className="pulse-dot"></div>
             {isLive ? 'LISTENING TO SOCKET' : 'PAUSED'}
           </div>
         </div>
         <div className="header-actions">
           <button className="primary-btn"><Plus size={16} /> Create Alert</button>
         </div>
      </div>

      <div className="alerts-layout">
        
        <div className="active-rules glass-card">
           <div className="ar-header">
             <h3>Active Triggers</h3>
             <button className="icon-btn"><Settings2 size={16}/></button>
           </div>
           
           <div className="rules-list">
             {alertsList.map(alert => (
                <div key={alert.id} className={`rule-item ${alert.active ? 'is-active' : 'is-disabled'}`}>
                   <div className="rule-icon">
                     {alert.type === 'ai' ? <Zap size={20} className="text-purple"/> : <Activity size={20} className="text-brand"/>}
                   </div>
                   <div className="rule-info">
                     <h4>{alert.target} <span>{alert.condition}</span></h4>
                     <p>{alert.desc}</p>
                   </div>
                   <div className="rule-toggle">
                     <button className={`toggle-btn ${alert.active ? 'on' : 'off'}`} onClick={() => toggleAlert(alert.id)}>
                        <div className="toggle-slider"></div>
                     </button>
                   </div>
                </div>
             ))}
           </div>
        </div>

        <div className="live-logs glass-card">
          <div className="log-header">
            <h3>Event Stream</h3>
            <span className="text-muted text-sm">Real-time Push</span>
          </div>
          
          <div className="log-feed">
             <AnimatePresence>
                {incomingLog.length === 0 && (
                  <div className="empty-log text-muted">Listening for market events...</div>
                )}
                {incomingLog.map(log => (
                  <motion.div 
                    key={log.id} 
                    className="log-entry"
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                     <div className="log-timestamp">{log.time}</div>
                     <div className="log-content">
                       <span className={`log-badge ${log.type === 'AI Prediction' ? 'p-ai' : 'p-price'}`}>
                         {log.type}
                       </span>
                       <span className="log-target">{log.target}</span>
                       <p className="log-msg">{log.msg}</p>
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
