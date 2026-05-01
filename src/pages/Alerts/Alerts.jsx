import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { 
  BellRing, Plus, Settings2, ArrowUpRight, ArrowDownRight, 
  Activity, Zap, Terminal, ShieldAlert, Cpu, ExternalLink, 
  X, TrendingUp, CheckCircle, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Alerts.css';

// ==========================================
// CONSTANTS & MOCK DATA
// ==========================================
const INITIAL_ALERTS = [
  { id: 1, type: 'ai', target: 'NVDA', condition: 'Dark Pool Accumulation', active: true, desc: 'LSTM-Transformer detects unusual institutional buy-side pressure in off-exchange blocks.' },
  { id: 2, type: 'price', target: 'BTC/USD', condition: '≥ $72,500.00', active: true, desc: 'Execute Momentum long if psychological resistance level is breached with high volume.' },
  { id: 3, type: 'market', target: 'SPY', condition: 'Gamma Exposure < 0', active: false, desc: 'Negative GEX detected; volatility expansion likely. Automate downside protection.' },
  { id: 4, type: 'danger', target: 'PORTFOLIO', condition: 'Drawdown > 2.5%', active: true, desc: 'CRITICAL: Delta-Neutral rebalancing triggered. Neutralizing beta exposure.' },
  { id: 5, type: 'ai', target: 'TSLA', condition: 'Sentiment Divergence', active: true, desc: 'Proprietary NLP detects bearish shift in institutional analyst reports vs retail flow.' },
  { id: 6, type: 'market', target: 'DXY', condition: 'Fibonacci 61.8% Retracement', active: true, desc: 'US Dollar Index approaching critical inflection point. Monitor FX-correlated assets.' },
];

// ==========================================
// MEMOIZED SUB-COMPONENTS
// ==========================================

const StatCard = memo(({ label, val, sub, color, delay }) => (
  <motion.div 
    className="metric-premium-card glass-panel"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="metric-header">
       <div className="metric-icon-wrap" style={{ background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
          <BellRing size={18} />
       </div>
    </div>
    <div className="metric-body mt-2">
       <span className="metric-label">{label}</span>
       <h3 className="metric-val" style={{ color: `rgb(${color})` }}>{val}</h3>
       <span className="text-xs text-muted font-mono">{sub}</span>
    </div>
  </motion.div>
));
StatCard.displayName = 'StatCard';

const RuleItem = memo(({ alert, onToggle, onDelete, onRoute }) => (
  <motion.div 
    layout
    className={`rule-item-premium ${alert.active ? 'active' : 'disabled'}`}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <div className="rule-type-icon">
      {alert.type === 'ai' ? <Zap size={18} className="text-brand" /> : 
       alert.type === 'danger' ? <ShieldAlert size={18} className="text-down" /> : 
       <TrendingUp size={18} className="text-cyan" />}
    </div>
    <div className="rule-details">
      <div className="rule-header">
        <span className="rule-target" onClick={() => onRoute(alert.target)}>
          {alert.target} <ExternalLink size={10} />
        </span>
        <span className="rule-condition">{alert.condition}</span>
      </div>
      <p className="rule-desc">{alert.desc}</p>
    </div>
    <div className="rule-actions">
       <button className={`toggle-pill ${alert.active ? 'on' : 'off'}`} onClick={() => onToggle(alert.id)}>
          <div className="toggle-dot"></div>
       </button>
       <button className="delete-btn" onClick={() => onDelete(alert.id)}>
          <X size={14} />
       </button>
    </div>
  </motion.div>
));
RuleItem.displayName = 'RuleItem';

const EventLogItem = memo(({ log }) => (
  <motion.div 
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0 }}
    className={`log-item-premium ${log.isCritical ? 'critical' : ''}`}
  >
    <div className="log-time">{log.time}</div>
    <div className="log-badge" style={{ color: log.isCritical ? '#ef4444' : log.type.includes('AI') ? '#8b5cf6' : '#3b82f6' }}>
      [{log.type}]
    </div>
    <div className="log-msg">
      <span className="log-target">{log.target}</span>: {log.msg}
    </div>
    <div className="log-status">
       {log.isCritical ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
    </div>
  </motion.div>
));
EventLogItem.displayName = 'EventLogItem';

const NewAlertModal = ({ onClose, onAdd }) => {
  const [ticker, setTicker] = useState('');
  const [condition, setCondition] = useState('price_above');
  const [value, setValue] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!ticker.trim()) { toast.error('Enter a ticker symbol'); return; }
    onAdd({
      id: Date.now(),
      type: condition.startsWith('ai') ? 'ai' : condition.includes('percent_down') ? 'danger' : 'price',
      target: ticker.toUpperCase(),
      condition: `${condition.replace('_', ' ')} ${value}`,
      active: true,
      desc: desc || `Auto-alert for ${ticker.toUpperCase()}`,
    });
    toast.success('Alert rule deployed');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        className="glass-panel modal-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="modal-header">
           <h3>Create Intelligence Trigger</h3>
           <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
           <div className="form-group">
              <label htmlFor="symbol-input">Symbol</label>
              <input id="symbol-input" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="NVDA..." />
           </div>
           <div className="form-group">
              <label htmlFor="trigger-type">Trigger Type</label>
              <select id="trigger-type" value={condition} onChange={e => setCondition(e.target.value)}>
                 <option value="price_above">Price Above</option>
                 <option value="price_below">Price Below</option>
                 <option value="ai_signal">AI Model Signal</option>
              </select>
           </div>
           <div className="form-group">
              <label htmlFor="trigger-value">Value</label>
              <input id="trigger-value" type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0.00" />
           </div>
           <div className="form-group">
              <label htmlFor="trigger-note">Note</label>
              <input id="trigger-note" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Optional logic note..." />
           </div>
           <button className="btn-primary-premium w-full mt-4" onClick={handleSubmit}>
              <Plus size={16} /> Deploy Trigger
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const Alerts = () => {
  const [alertsList, setAlertsList] = useState(INITIAL_ALERTS);
  const [incomingLogs, setIncomingLogs] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Simulated Live Events
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const types = ['AI SIGNAL', 'DARK POOL PRINT', 'ORDER IMBALANCE', 'SENTIMENT PULSE', 'RISK BREACH'];
        const targets = ['NVDA', 'TSLA', 'BTC/USD', 'AAPL', 'SPY', 'QQQ', 'MSFT'];
        const pType = types[Math.floor(Math.random() * types.length)];
        const isCrit = pType === 'RISK BREACH';
        
        const messages = {
          'AI SIGNAL': 'Neural pattern detected institutional buy-side pressure. Conviction: 92%.',
          'DARK POOL PRINT': 'Large block trade detected at mid-point liquidity. Off-exchange volume surging.',
          'ORDER IMBALANCE': 'Buy-side imbalance detected in NASDAQ opening cross. Adjusting limit orders.',
          'SENTIMENT PULSE': 'Proprietary NLP detects bullish shift in institutional analyst reports.',
          'RISK BREACH': 'Critical delta-drift detected in tech allocation. Automated hedging initiated.'
        };
        
        setIncomingLogs(prev => [{
          id: crypto.randomUUID(),
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: pType,
          target: targets[Math.floor(Math.random() * targets.length)],
          msg: messages[pType] || 'Market signal detected.',
          isCritical: isCrit
        }, ...prev].slice(0, 20));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const toggleAlert = useCallback((id) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    toast.success('Trigger status toggled');
  }, []);

  const deleteAlert = useCallback((id) => {
    setAlertsList(prev => prev.filter(a => a.id !== id));
    toast('Trigger removed');
  }, []);

  const routeToStock = useCallback((sym) => {
    navigate(sym === 'PORTFOLIO' ? '/portfolio' : `/stocks/${sym}`);
  }, [navigate]);

  return (
    <div className="alerts-premium-container animate-fade-in">
      <div className="premium-home-bg">
         <div className="home-glow home-glow-1"></div>
         <div className="home-glow home-glow-2"></div>
      </div>

      <div className="alerts-content-wrapper">
        
        {/* Top Summary Bar */}
        <div className="alerts-summary-grid">
           <StatCard label="Active Rules" val={alertsList.filter(a => a.active).length} sub="Monitored by AI" color="59, 130, 246" delay={0.1} />
           <StatCard label="Events Detected" val="24" sub="Last 24 Hours" color="16, 185, 129" delay={0.2} />
           <StatCard label="Risk Signals" val="2" sub="Immediate Attention" color="239, 68, 68" delay={0.3} />
           <StatCard label="AI Conviction" val="High" sub="Pattern Stability" color="139, 92, 246" delay={0.4} />
        </div>

        {/* Page Header */}
        <div className="page-header-premium">
          <div className="header-titles">
              <Cpu className="text-brand" size={28} />
              <div>
                  <h1>Intelligence Triggers</h1>
                  <p>Configure autonomous alerts and AI-driven market responses.</p>
              </div>
          </div>
          <div className="header-actions-premium">
              <button 
                className={`status-live-toggle ${isLive ? 'on' : 'off'}`} 
                onClick={() => setIsLive(!isLive)}
                onKeyDown={(e) => e.key === 'Enter' && setIsLive(!isLive)}
                role="switch"
                aria-checked={isLive}
                aria-label="Toggle live feed"
              >
                  <div className="live-dot"></div>
                  {isLive ? 'Feed Synchronized' : 'Feed Paused'}
              </button>
              <button className="btn-primary-premium" onClick={() => setShowModal(true)}>
                  <Plus size={16} /> New Trigger
              </button>
          </div>
        </div>

        <div className="alerts-layout-grid">
           
           {/* Active Rules List */}
           <div className="alerts-col">
              <div className="glass-panel alerts-panel">
                 <div className="panel-header border-bottom">
                    <div className="panel-title">
                       <Activity size={18} className="text-brand" />
                       <h3>Strategic Triggers</h3>
                    </div>
                    <button className="icon-btn-premium"><Settings2 size={16} /></button>
                 </div>
                 <div className="rules-scroll-area">
                    <AnimatePresence mode="popLayout">
                       {alertsList.map(alert => (
                          <RuleItem 
                            key={alert.id} 
                            alert={alert} 
                            onToggle={toggleAlert} 
                            onDelete={deleteAlert} 
                            onRoute={routeToStock} 
                          />
                       ))}
                    </AnimatePresence>
                    {alertsList.length === 0 && (
                       <div className="empty-state">
                          <BellRing size={40} className="text-muted mb-4" />
                          <p>No active intelligence triggers found.</p>
                          <button onClick={() => setShowModal(true)} className="btn-text-link mt-2">Initialize new rule</button>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Live Event Feed */}
           <div className="alerts-col">
              <div className="glass-panel alerts-panel">
                 <div className="panel-header border-bottom">
                    <div className="panel-title">
                       <Terminal size={18} className="text-brand" />
                       <h3>Live Inference Feed</h3>
                    </div>
                    <div className="venue-tag">PROXIMITY: 0.2ms</div>
                 </div>
                 <div className="logs-scroll-area">
                    <AnimatePresence mode="popLayout">
                       {incomingLogs.map(log => (
                          <EventLogItem key={log.id} log={log} />
                       ))}
                    </AnimatePresence>
                    {incomingLogs.length === 0 && (
                       <div className="empty-logs">Listening for market signals...</div>
                    )}
                 </div>
              </div>
           </div>

        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <NewAlertModal 
            onClose={() => setShowModal(false)} 
            onAdd={a => setAlertsList(prev => [a, ...prev])} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alerts;
