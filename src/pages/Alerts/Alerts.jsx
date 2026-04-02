import React, { useState, useEffect } from 'react';
import { BellRing, Plus, Settings2, ArrowUpRight, ArrowDownRight, Activity, Zap, Terminal, ShieldAlert, Cpu, ExternalLink, X, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Alerts.css';

const INITIAL_ALERTS = [
  { id: 1, type: 'price', target: 'NVDA', condition: '≥ $900.00', active: true, desc: 'Execute Block Trade upon crossing threshold', triggered: false },
  { id: 2, type: 'ai', target: 'AAPL', condition: 'MACD Convergence', active: true, desc: 'LSTM detects bullish trend shift in dark pools', triggered: false },
  { id: 3, type: 'market', target: 'SPY', condition: 'VIX > 20', active: false, desc: 'Global Market Volatility Exceeds 20% Baseline', triggered: false },
  { id: 4, type: 'danger', target: 'PORTFOLIO', condition: 'Drawdown > 3%', active: true, desc: 'CRITICAL: Trigger Emergency Liquidate All', triggered: false },
];

const NewAlertModal = ({ onClose, onAdd }) => {
  const [ticker, setTicker] = useState('');
  const [condition, setCondition] = useState('price_above');
  const [value, setValue] = useState('');
  const [desc, setDesc] = useState('');

  const conditionLabels = {
    price_above: 'Price ≥',
    price_below: 'Price ≤',
    percent_up: '% Gain ≥',
    percent_down: '% Drop ≥',
    volume_spike: 'Volume Spike',
    ai_signal: 'AI Signal',
  };

  const handleSubmit = () => {
    if (!ticker.trim()) { toast.error('Please enter a ticker symbol.'); return; }
    if (!value.trim() && condition !== 'volume_spike' && condition !== 'ai_signal') { toast.error('Please enter a threshold value.'); return; }
    const newAlert = {
      id: Date.now(),
      type: condition.startsWith('ai') ? 'ai' : condition.includes('percent_down') ? 'danger' : 'price',
      target: ticker.toUpperCase(),
      condition: `${conditionLabels[condition]} ${value}${condition.includes('percent') ? '%' : condition === 'price_above' || condition === 'price_below' ? ' USD' : ''}`,
      active: true,
      desc: desc || `Automated alert for ${ticker.toUpperCase()} — ${conditionLabels[condition]} ${value}`,
      triggered: false,
    };
    onAdd(newAlert);
    toast.success(`Alert created for ${ticker.toUpperCase()}`, { icon: '🔔' });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '16px', padding: '2rem', width: '440px', maxWidth: '90vw', boxShadow: '0 24px 80px rgba(0,0,0,0.4)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BellRing size={20} style={{ color: 'var(--accent-brand)' }} />
            <h3 style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>Create Alert Rule</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>TICKER SYMBOL</label>
            <input
              type="text"
              placeholder="e.g. NVDA, BTC, SPY"
              value={ticker}
              onChange={e => setTicker(e.target.value.toUpperCase())}
              className="input-pro"
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>CONDITION TYPE</label>
            <select
              value={condition}
              onChange={e => setCondition(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none' }}
            >
              <option value="price_above">Price rises above threshold</option>
              <option value="price_below">Price falls below threshold</option>
              <option value="percent_up">% Gain exceeds threshold</option>
              <option value="percent_down">% Drop exceeds threshold</option>
              <option value="volume_spike">Volume spike detected</option>
              <option value="ai_signal">AI model signal generated</option>
            </select>
          </div>

          {!['volume_spike','ai_signal'].includes(condition) && (
            <div>
              <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                {condition.includes('percent') ? 'THRESHOLD (%)' : 'THRESHOLD (USD)'}
              </label>
              <input
                type="number"
                placeholder={condition.includes('percent') ? 'e.g. 5' : 'e.g. 900.00'}
                value={value}
                onChange={e => setValue(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 700, outline: 'none' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>NOTE (OPTIONAL)</label>
            <input
              type="text"
              placeholder="Add a note for this alert..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              onClick={handleSubmit}
              style={{ flex: 1, background: 'var(--accent-brand)', color: '#fff', border: 'none', borderRadius: '8px', padding: '14px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Plus size={16} /> CREATE ALERT
            </button>
            <button
              onClick={onClose}
              style={{ padding: '14px 20px', background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Alerts = () => {
  const [alertsList, setAlertsList] = useState(INITIAL_ALERTS);
  const [incomingLog, setIncomingLog] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [showNewAlertModal, setShowNewAlertModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const types = ['AI ALERT', 'PRICE ACTION', 'BLOCK TRADE', 'RISK ALERT'];
        const targets = ['NVDA', 'TSLA', 'BTC', 'AAPL', 'AMD', 'SPY', 'JPM'];
        const pType = types[Math.floor(Math.random() * types.length)];
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 2 }),
          type: pType,
          target: targets[Math.floor(Math.random() * targets.length)],
          msg: pType === 'RISK ALERT' ? 'CRITICAL RISK DETECTED. PORTFOLIO PROTECTION ACTIVE.' : 'Significant momentum detected. AI model suggests review.',
          isCritical: pType === 'RISK ALERT'
        };
        setIncomingLog(prev => [newLog, ...prev].slice(0, 20));
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [isLive]);

  const toggleAlert = (id) => {
    setAlertsList(prev => prev.map(a => {
      if (a.id === id) {
        if (!a.active) toast.success(`Alert rule engaged: ${a.target}`);
        else toast(`Alert rule paused: ${a.target}`, { icon: '⏸️' });
        return { ...a, active: !a.active };
      }
      return a;
    }));
  };

  const deleteAlert = (id) => {
    setAlertsList(prev => prev.filter(a => a.id !== id));
    toast('Alert rule removed.', { icon: '🗑️' });
  };

  const routeToStock = (symbol) => {
    if (symbol !== 'PORTFOLIO') {
        navigate(`/stocks/${symbol}`);
    } else {
        navigate(`/settings`);
    }
  };

  const activeCount = alertsList.filter(a => a.active).length;

  return (
    <div className="alerts-pro-container animate-fade-in">
      {/* Summary Stats Bar */}
      <div style={{ display: 'flex', gap: '1rem', padding: '1rem 1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
        {[
          { label: 'ACTIVE RULES', val: activeCount, color: 'var(--accent-brand)' },
          { label: 'TRIGGERED TODAY', val: 7, color: 'var(--status-up)' },
          { label: 'RISK ALERTS', val: 1, color: 'var(--status-down)' },
          { label: 'AI SIGNALS', val: 12, color: 'var(--accent-purple)' },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center', borderRight: '1px solid var(--border-light)', paddingRight: '1rem' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: 'monospace', marginTop: '2px' }}>{s.val}</div>
          </div>
        ))}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>ENGINE STATUS</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isLive ? 'var(--status-up)' : 'var(--text-muted)', marginTop: '4px' }}>
            {isLive ? '● ONLINE' : '○ PAUSED'}
          </div>
        </div>
      </div>

      <div className="alerts-pro-header flex-between mb-6">
         <div className="header-pro-title">
           <Cpu className="text-cyan" size={24} />
           <div>
               <h1>Smart Alerts Engine</h1>
               <p className="text-muted text-sm font-mono">Real-time market notifications & AI-driven price triggers</p>
           </div>
         </div>
         <div className="header-pro-actions flex-row">
           <div className={`live-toggle-pro ${isLive ? 'active' : ''}`} onClick={() => {
              setIsLive(!isLive);
              if (!isLive) toast.success("Live Market Feed Stream Connected", { icon: '⚡' });
              else toast.error("Live Feed Paused");
           }}>
             <div className="pulse-dot-cyan"></div>
             {isLive ? 'LIVE CONNECTION: ON' : 'CONNECTION PAUSED'}
           </div>
           <button className="btn-pro-primary" onClick={() => setShowNewAlertModal(true)}>
             <Plus size={14} /> NEW ALERT
           </button>
         </div>
      </div>

      <div className="alerts-pro-layout">
        {/* Active Triggers - Left Panel */}
        <div className="active-rules-pro glass-card">
           <div className="section-head-term">
             <Activity size={18} className="text-orange" />
             <h2>ACTIVE PRICE RULES</h2>
             <button className="icon-btn-pro ms-auto" onClick={() => toast('All rules sorted by priority.', { icon: '⚙️' })}><Settings2 size={16}/></button>
           </div>
           <p className="subtitle-term text-muted">Your custom rules that trigger automatic notifications or trades.</p>
           
           <div className="rules-list-pro mt-4">
             {alertsList.map(alert => (
                <div key={alert.id} className={`rule-item-pro ${alert.active ? 'is-active' : 'is-disabled'}`}>
                   <div className="rule-icon-pro">
                     {alert.type === 'ai' ? <Zap size={20} className="text-purple"/> : 
                      alert.type === 'danger' ? <ShieldAlert size={20} className="text-down"/> : 
                      <TrendingUp size={20} className="text-brand"/>}
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
                   <div className="rule-toggle-pro" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <button
                       style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                       onClick={() => deleteAlert(alert.id)}
                       title="Delete alert"
                     ><X size={14} /></button>
                     <button className={`toggle-btn-pro ${alert.active ? 'on' : 'off'}`} onClick={() => toggleAlert(alert.id)}>
                        <div className="toggle-slider-pro"></div>
                     </button>
                   </div>
                </div>
             ))}

             {alertsList.length === 0 && (
               <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                 <BellRing size={32} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                 <div>No alert rules configured.</div>
                 <button onClick={() => setShowNewAlertModal(true)} style={{ marginTop: '1rem', background: 'var(--accent-brand)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                   Create First Alert
                 </button>
               </div>
             )}
           </div>
        </div>

        {/* Live Event Stream - Right Panel */}
        <div className="live-logs-pro glass-card">
          <div className="section-head-term">
            <Terminal size={18} className="text-brand" />
            <h2>LIVE MARKET EVENTS</h2>
            <span className="text-up text-xs font-mono ms-auto tracking-widest">[LIVE FEED]</span>
          </div>
          <p className="subtitle-term text-muted mb-4">Real-time institutional trades and AI market predictions.</p>
          
          <div className="log-feed-pro terminal-bg">
             <AnimatePresence>
                {incomingLog.length === 0 && (
                  <div className="empty-log text-muted font-mono">Listening for market events...<span className="blink-cursor">_</span></div>
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
                       <span className={`log-badge-pro ${log.isCritical ? 'badge-danger' : log.type === 'AI ALERT' ? 'badge-ai' : 'badge-standard'}`}>
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

      {/* New Alert Modal */}
      <AnimatePresence>
        {showNewAlertModal && (
          <NewAlertModal
            onClose={() => setShowNewAlertModal(false)}
            onAdd={alert => setAlertsList(prev => [alert, ...prev])}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alerts;
