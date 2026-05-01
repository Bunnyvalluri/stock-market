import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip, LineChart, Line, YAxis } from 'recharts';
import { 
  Briefcase, ArrowUpRight, ArrowDownRight, MoreHorizontal, 
  Plus, Download, Activity, Shield, TrendingUp, TrendingDown,
  DollarSign, PieChart as PieIcon, Layers, History, Terminal, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Sparkline from '../../components/Sparkline';
import './Portfolio.css';

const generateHistory = (base) => Array.from({length: 15}, () => ({ val: base + (Math.random() - 0.5) * (base * 0.03) }));

const initialAssets = [
  { id: 1, symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 450, avgPrice: 420.50, currentPrice: 890.10, value: 400545.00, sector: 'Technology', beta: 1.8, history: generateHistory(890.10) },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', shares: 1200, avgPrice: 310.20, currentPrice: 405.30, value: 486360.00, sector: 'Technology', beta: 1.1, history: generateHistory(405.30) },
  { id: 3, symbol: 'TSLA', name: 'Tesla Inc.', shares: 850, avgPrice: 195.40, currentPrice: 212.45, value: 180582.50, sector: 'Automotive', beta: 2.1, history: generateHistory(212.45) },
  { id: 4, symbol: 'AAPL', name: 'Apple Inc.', shares: 1000, avgPrice: 165.80, currentPrice: 173.50, value: 173500.00, sector: 'Technology', beta: 1.05, history: generateHistory(173.50) },
  { id: 5, symbol: 'BTC/USD', name: 'Bitcoin', shares: 2.5, avgPrice: 45200.00, currentPrice: 65420.00, value: 163550.00, sector: 'Crypto', beta: 3.2, history: generateHistory(65420.00) }
];

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

const SummaryStat = ({ label, value, subValue, isUp, icon, trendData }) => (
  <motion.div 
    whileHover={{ translateY: -4 }}
    className="portfolio-summary-card-saas glass-card"
  >
    <div className="card-ambient-glow-saas"></div>
    <div className="summary-saas-header flex items-center justify-between mb-4">
       <div className="summary-saas-icon-box glass">
          {icon}
       </div>
       <div className={`summary-saas-pill font-bold ${isUp ? 'text-up bg-up/10' : 'text-down bg-down/10'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {subValue.split(' ')[0]}
       </div>
    </div>
    <div className="summary-saas-body">
       <span className="text-muted text-xs font-bold uppercase tracking-widest">{label}</span>
       <h2 className="text-3xl font-black mt-1 font-outfit tracking-tight">{value}</h2>
       <p className="text-[11px] text-muted font-medium mt-1">{subValue.includes('Today') ? subValue : `Performance: ${subValue}`}</p>
    </div>
  </motion.div>
);

const Portfolio = () => {
  const [portfolioAssets, setPortfolioAssets] = useState(initialAssets);
  const [isLive, setIsLive] = useState(true);
  const [systemLogs, setSystemLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [loading, setLoading] = useState(true);

  // Synchronize portfolio with real-time market data
  const syncRealTimeData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stocks');
      const result = await response.json();
      if (result.status === 'success') {
        const liveMap = result.data.reduce((acc, s) => ({ ...acc, [s.symbol]: s }), {});
        
        setPortfolioAssets(current => current.map(asset => {
          const live = liveMap[asset.symbol];
          if (live) {
            const shift = live.price - asset.currentPrice;
            return {
              ...asset,
              currentPrice: live.price,
              value: live.price * asset.shares,
              tickDir: shift > 0 ? 'up' : shift < 0 ? 'down' : asset.tickDir,
              history: [...asset.history.slice(1), { val: live.price }]
            };
          }
          return asset;
        }));

        // Add to system log
        const d = new Date();
        const newLog = {
          id: Math.random().toString(36).substring(2, 10).toUpperCase(),
          time: d.toLocaleTimeString(undefined, { hour12: false }),
          module: 'SYNC_DAEMON',
          asset: 'MARKET_DATA',
          status: 'OK'
        };
        setSystemLogs(prev => [newLog, ...prev].slice(0, 10));
      }
    } catch (err) {
      console.error('Portfolio sync failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncRealTimeData();
    if (isLive) {
      const interval = setInterval(syncRealTimeData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const totalValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalCost = portfolioAssets.reduce((sum, asset) => sum + (asset.shares * asset.avgPrice), 0);
  const totalPNL = totalValue - totalCost;
  const pnlPercent = (totalPNL / totalCost) * 100;

  const allocationData = portfolioAssets.map(asset => ({
    name: asset.symbol,
    value: asset.value
  }));

  return (
    <div className="portfolio-pro-container animate-fade-in">
      {/* Institutional Navigation Actions */}
      <div className="portfolio-header-pro">
        <div className="header-pro-left">
        </div>
        <div className="header-pro-right">
            <div className="header-pro-pills">
                <button className={activeTab === 'OVERVIEW' ? 'active' : ''} onClick={() => { setActiveTab('OVERVIEW'); toast('Displaying Portfolio Overview', { icon: '📊' }); }}>OVERVIEW</button>
                <button className={activeTab === 'RISK' ? 'active' : ''} onClick={() => { setActiveTab('RISK'); toast('Risk metrics recalculated.', { icon: '🛡️' }); }}>RISK & EXPOSURE</button>
                <button className={activeTab === 'ROUTING' ? 'active' : ''} onClick={() => { setActiveTab('ROUTING'); toast.loading('Connecting to routing engine...', { duration: 1000 }); }}>ORDER ROUTING</button>
            </div>
            <div className="header-pro-actions flex gap-2">
                <button 
                  className="btn-pro-outline" 
                  onClick={handleExportCSV}
                >
                  <Download size={14} className="mr-1"/> EXPORT CSV
                </button>
                <button 
                  className="btn-saas-primary"
                  onClick={() => { setActiveTab('ROUTING'); toast.success('Capital Deployment sequence initialized.', { icon: '💸' }); }}
                >
                  <Plus size={16} className="mr-1"/> DEPLOY CAPITAL
                </button>
            </div>
        </div>
      </div>

      {/* Advanced Quant Metrics Bar */}
      <div className="quant-metrics-bar glass-card">
          <div className="qm-item">
              <span className="qm-label">SHARPE RATIO (1Y)</span>
              <span className="qm-val text-brand">3.42</span>
          </div>
          <div className="qm-divider"></div>
          <div className="qm-item">
              <span className="qm-label">PORTFOLIO BETA</span>
              <span className="qm-val">1.24</span>
          </div>
          <div className="qm-divider"></div>
          <div className="qm-item">
              <span className="qm-label">ALPHA (VS SPY)</span>
              <span className="qm-val text-up">+4.12%</span>
          </div>
          <div className="qm-divider"></div>
          <div className="qm-item">
              <span className="qm-label">MAX DRAWDOWN</span>
              <span className="qm-val text-down">-12.4%</span>
          </div>
          <div className="qm-divider"></div>
          <div className="qm-item">
              <span className="qm-label">MARGIN USAGE</span>
              <span className="qm-val text-orange">24.5%</span>
          </div>
      </div>

      {/* Modern Financial Summary Grid */}
      <div className="portfolio-stats-grid-pro mt-4">
         <SummaryStat 
            label="Gross Asset Value (GAV)" 
            value={`$${(totalValue / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}k`} 
            subValue={`+$4,120.45 (1.4%) Today`} 
            isUp={true} 
            icon={<DollarSign size={18} />}
         />
         <SummaryStat 
            label="Unrealized PNL" 
            value={`${totalPNL >= 0 ? '+' : '-'}$${(Math.abs(totalPNL) / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}k`} 
            subValue={`${pnlPercent.toFixed(2)}% Cumulative Return`} 
            isUp={totalPNL >= 0} 
            icon={<Activity size={18} />}
         />
         <SummaryStat 
            label="Available Liquidity" 
            value="$424,840.45" 
            subValue="Immediate Settlement Available" 
            isUp={true} 
            icon={<Shield size={18} />}
         />
      </div>

      <div className="portfolio-main-layout-pro mt-4">
         
         {activeTab === 'OVERVIEW' && (
         <div className="portfolio-holdings-grid-pro glass-card">
            <div className="card-header-term flex items-center justify-between border-b border-light p-4">
               <div className="flex items-center gap-3">
                   <Briefcase size={18} className="text-brand" />
                   <h3 className="font-bold text-lg tracking-tight">Institutional Asset Matrix</h3>
               </div>
               <div className="live-status-pro text-xs font-bold font-mono py-1 px-3 rounded-full bg-black/40 border border-light flex items-center gap-2">
                   <div className={`status-dot ${isLive ? 'active-pulse' : 'bg-muted'}`} style={{width: 8, height: 8, borderRadius: '50%', background: isLive ? 'var(--status-up)' : 'var(--text-muted)'}}></div>
                   <span style={{color: isLive ? 'var(--status-up)' : 'var(--text-muted)'}}>ENGINE: {isLive ? 'SYNCHRONIZED' : 'OFFLINE'}</span>
               </div>
            </div>
            
            <div className="holdings-matrix-pro w-full overflow-x-auto">
               <div className="matrix-head-pro">
                  <div className="text-left">Instrument</div>
                  <div className="text-center">Trend</div>
                  <div className="text-right">Price</div>
                  <div className="text-right">Unrl PNL</div>
                  <div className="text-right">Position</div>
                  <div className="text-right">Exposure</div>
               </div>
               
               <div className="matrix-body-pro flex flex-col">
                  {portfolioAssets.map(asset => {
                     const pnlVal = asset.value - (asset.shares * asset.avgPrice);
                     const pnlPct = (pnlVal / (asset.shares * asset.avgPrice)) * 100;
                     const isUp = pnlVal >= 0;
                     const exposure = (asset.value / totalValue) * 100;

                     return (
                        <div key={asset.symbol} className="matrix-row-pro">
                           <div className="matrix-id-pro col-span-1 flex flex-col">
                              <span className="font-bold text-sm tracking-wide">{asset.symbol}</span>
                              <span className="text-[10px] text-muted font-mono uppercase">{asset.sector}</span>
                           </div>
                           
                           {/* Live Sparkline */}
                           <div className="h-10 w-full pl-4">
                               <Sparkline 
                                  data={asset.history.map(h => ({ price: h.val }))} 
                                  color={isUp ? 'var(--status-up)' : 'var(--status-down)'} 
                               />
                           </div>

                           <div className={`matrix-price-pro text-right font-mono text-sm font-bold ${asset.tickDir ? `flash-${asset.tickDir}` : ''}`}>
                              ${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                           </div>
                           <div className={`matrix-pnl-pro text-right flex flex-col ${isUp ? 'text-up' : 'text-down'}`}>
                              <span className="font-mono text-sm font-bold">${(Math.abs(pnlVal)/1000).toFixed(1)}k</span>
                              <span className="text-xs font-mono">{isUp ? '+' : ''}{pnlPct.toFixed(2)}%</span>
                           </div>
                           <div className="matrix-holdings-pro text-right flex flex-col">
                              <span className="font-mono text-sm font-bold">{asset.shares.toLocaleString()}</span>
                              <span className="text-xs text-muted font-mono">@ ${(asset.avgPrice).toFixed(2)}</span>
                           </div>
                           <div className="matrix-exposure-pro text-right flex items-center justify-end gap-2">
                              <span className="font-mono text-xs w-10 font-bold">{exposure.toFixed(1)}%</span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
         )}

         {activeTab === 'RISK' && (
          <div className="portfolio-risk-layout flex flex-col gap-6">
             <div className="portfolio-holdings-grid-pro glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                   <Shield size={18} className="text-orange" />
                   <h3 className="font-bold tracking-wide uppercase">Portfolio Risk Matrix</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="glass p-4 rounded-xl border border-light">
                      <div className="text-sm text-muted font-mono">Value at Risk (95% CI)</div>
                      <div className="text-2xl font-bold font-mono text-down mt-1">${(totalValue * 0.05).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
                   </div>
                   <div className="glass p-4 rounded-xl border border-light">
                      <div className="text-sm text-muted font-mono">Systematic Beta vs SPY</div>
                      <div className="text-2xl font-bold font-mono mt-1">1.24 <span className="text-orange text-sm font-outfit uppercase">Aggressive</span></div>
                   </div>
                   <div className="glass p-4 rounded-xl border border-light">
                      <div className="text-sm text-muted font-mono">Sharpe Ratio</div>
                      <div className="text-2xl font-bold font-mono text-brand mt-1">3.42</div>
                   </div>
                   <div className="glass p-4 rounded-xl border border-light">
                      <div className="text-sm text-muted font-mono">Sortino Ratio</div>
                      <div className="text-2xl font-bold font-mono text-cyan mt-1">4.18</div>
                   </div>
                </div>
                <div className="mt-6 border-t border-light pt-6">
                   <h4 className="font-bold text-xs text-muted uppercase tracking-wider mb-4">Monte Carlo Stress Scenarios</h4>
                   <div className="text-sm font-mono flex flex-col gap-3">
                      <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                          <span>S&P Black Swan (-20% Gap)</span>
                          <span className="text-down font-bold">-$ {(totalValue * 0.248).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-3 rounded">
                          <span>VIX Volatility Expansion (+40%)</span>
                          <span className="text-up font-bold">+$ {(totalValue * 0.12).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* AI Risk Advisory (Phase 5) */}
             <div className="portfolio-holdings-grid-pro glass-card p-6 border-brand/30 bg-brand/5">
                <div className="flex items-center gap-2 mb-4">
                   <Zap size={18} className="text-brand pulse-fast" />
                   <h3 className="font-bold tracking-wide uppercase text-brand">Autonomous Risk Advisory</h3>
                </div>
                <div className="advisory-grid grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="advisory-item p-4 border border-light bg-black/40 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                         <Layers size={14} className="text-orange" />
                         <span className="text-xs font-bold uppercase text-muted">Concentration Alert</span>
                      </div>
                      <p className="text-xs font-medium text-secondary leading-relaxed">
                         Tech exposure exceeds 65%. Neural Core suggests rotating 12% into Defensive sectors (Healthcare/Energy) to mitigate idiosyncratic sector risk.
                      </p>
                   </div>
                   <div className="advisory-item p-4 border border-light bg-black/40 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                         <Shield size={14} className="text-brand" />
                         <span className="text-xs font-bold uppercase text-muted">Tail Risk Hedging</span>
                      </div>
                      <p className="text-xs font-medium text-secondary leading-relaxed">
                         High systematic beta detected (1.24). Consider buying $VIX call options or $SPY puts to protect against impending CPI release.
                      </p>
                   </div>
                   <div className="advisory-item p-4 border border-light bg-black/40 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                         <TrendingUp size={14} className="text-up" />
                         <span className="text-xs font-bold uppercase text-muted">Alpha Opportunity</span>
                      </div>
                      <p className="text-xs font-medium text-secondary leading-relaxed">
                         NVDA momentum is overextended (RSI: 82). Take partial profits and increase weight in AAPL for better risk-adjusted return ratio.
                      </p>
                   </div>
                </div>
             </div>
          </div>
         )}


         {activeTab === 'ROUTING' && (() => {
           const [orderSide, setOrderSide] = React.useState('BUY');
           const [orderTicker, setOrderTicker] = React.useState('');
           const [orderShares, setOrderShares] = React.useState('');
           const [orderType, setOrderType] = React.useState('MKT');
           const [limitPrice, setLimitPrice] = React.useState('');
           const estimatedCost = orderShares && limitPrice ? (parseFloat(orderShares) * parseFloat(limitPrice)).toFixed(2) : '—';
           return (
           <div className="portfolio-holdings-grid-pro glass-card p-6">
             <div className="flex items-center gap-2 mb-6">
               <Zap size={18} className="text-up" />
               <h3 className="font-bold tracking-wide uppercase">Direct Market Access (DMA)</h3>
               <div style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>VENUE: DARK POOL + LIT</div>
             </div>
             <div className="flex flex-col gap-4 max-w-md mx-auto">
               {/* Side Selector */}
               <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '4px' }}>
                 {['BUY','SELL'].map(side => (
                   <button
                     key={side}
                     onClick={() => setOrderSide(side)}
                     style={{ flex: 1, padding: '10px', fontWeight: 800, fontSize: '0.85rem', borderRadius: '7px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                       background: orderSide === side ? (side === 'BUY' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)') : 'transparent',
                       color: orderSide === side ? (side === 'BUY' ? 'var(--status-up)' : 'var(--status-down)') : 'var(--text-muted)',
                       boxShadow: orderSide === side ? `0 0 12px ${side === 'BUY' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` : 'none'
                     }}
                   >{side}</button>
                 ))}
               </div>

               {/* Ticker */}
               <div>
                 <label style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>TICKER SYMBOL</label>
                 <input
                   type="text"
                   placeholder="e.g. NVDA, AAPL, BTC"
                   value={orderTicker}
                   onChange={e => setOrderTicker(e.target.value.toUpperCase())}
                   style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', outline: 'none' }}
                 />
               </div>

               {/* Shares */}
               <div>
                 <label style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>QUANTITY (SHARES)</label>
                 <input
                   type="number"
                   placeholder="0"
                   min="1"
                   value={orderShares}
                   onChange={e => setOrderShares(e.target.value)}
                   style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', outline: 'none' }}
                 />
               </div>

               {/* Order Type */}
               <div>
                 <label style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>ORDER TYPE</label>
                 <div style={{ display: 'flex', gap: '8px' }}>
                   {['MKT','LMT','STP','STP-LMT'].map(t => (
                     <button
                       key={t}
                       onClick={() => setOrderType(t)}
                       style={{ flex: 1, padding: '10px 6px', fontWeight: 800, fontSize: '0.7rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s',
                         background: orderType === t ? 'rgba(37,99,235,0.15)' : 'rgba(0,0,0,0.4)',
                         border: orderType === t ? '1px solid var(--accent-brand)' : '1px solid var(--border-light)',
                         color: orderType === t ? 'var(--accent-brand)' : 'var(--text-muted)',
                         boxShadow: orderType === t ? '0 0 10px rgba(37,99,235,0.2)' : 'none'
                       }}
                     >{t}</button>
                   ))}
                 </div>
               </div>

               {/* Limit Price (only for LMT/STP/STP-LMT) */}
               {orderType !== 'MKT' && (
                 <div>
                   <label style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                     {orderType === 'STP' ? 'STOP PRICE (USD)' : 'LIMIT PRICE (USD)'}
                   </label>
                   <input
                     type="number"
                     placeholder="0.00"
                     value={limitPrice}
                     onChange={e => setLimitPrice(e.target.value)}
                     style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', outline: 'none' }}
                   />
                 </div>
               )}

               {/* Estimated Cost */}
               <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>EST. ORDER VALUE</span>
                 <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--text-primary)' }}>
                   {orderType === 'MKT' ? '(Market Price)' : estimatedCost === '—' ? '—' : `$${parseFloat(estimatedCost).toLocaleString()}`}
                 </span>
               </div>

               {/* Execute Button */}
               <button
                 style={{
                   width: '100%',
                   background: orderSide === 'BUY' ? 'var(--status-up)' : 'var(--status-down)',
                   color: '#fff',
                   border: 'none',
                   borderRadius: '10px',
                   padding: '16px',
                   fontWeight: 800,
                   fontSize: '0.9rem',
                   cursor: 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   gap: '8px',
                   letterSpacing: '0.5px',
                   boxShadow: orderSide === 'BUY' ? '0 4px 20px rgba(16,185,129,0.35)' : '0 4px 20px rgba(239,68,68,0.35)',
                   transition: 'all 0.2s'
                 }}
                 onClick={() => {
                   if (!orderTicker.trim()) { toast.error('Enter a ticker symbol.'); return; }
                   if (!orderShares || parseInt(orderShares) <= 0) { toast.error('Enter a valid share quantity.'); return; }
                   toast.success(`${orderSide} order for ${orderShares} × ${orderTicker} [${orderType}] routed to prime brokerage.`, { icon: '🚀', duration: 4000 });
                   setOrderTicker(''); setOrderShares(''); setLimitPrice('');
                 }}
               >
                 <Activity size={18} strokeWidth={3} />
                 SUBMIT {orderSide} ORDER — {orderTicker || 'TICKER'} [{orderType}]
               </button>
               <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>Simulated order routing. No real trades are executed.</p>
             </div>
           </div>
           );
         })()}

         {/* Right Sidebar: Intelligence & Logs (30% width) */}
         <div className="portfolio-side-pro flex flex-col gap-4">
            
            {/* Sector Weightage Chart */}
            <div className="allocation-card-pro glass-card">
               <div className="card-header-term border-b border-light p-4 flex items-center gap-2">
                  <PieIcon size={16} className="text-orange" />
                  <h4 className="font-bold text-sm tracking-wide uppercase">Capital Distribution</h4>
               </div>
               <div className="allocation-content-pro p-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie 
                        data={allocationData} 
                        innerRadius={50} 
                        outerRadius={70} 
                        paddingAngle={5} 
                        dataKey="value" 
                        stroke="none"
                        isAnimationActive={false}
                      >
                        {allocationData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <PieTooltip 
                        contentStyle={{ background: '#000', border: '1px solid #333', borderRadius: '4px', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => [`$${(value/1000).toFixed(1)}k`, 'Exposure']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Terminal System Trace */}
            <div className="allocation-card-pro glass-card flex-1 flex flex-col">
                <div className="card-header-term border-b border-light p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Terminal size={16} className="text-brand" />
                       <h4 className="font-bold text-sm tracking-wide uppercase">System Trace</h4>
                    </div>
                    <span className="text-xs font-mono text-muted">PORT_SYNC_DAEMON</span>
                </div>
                
                {/* Raw Terminal Data Feed */}
                <div className="terminal-logs-pro p-2">
                    {systemLogs.map((log, i) => (
                        <div key={`${log.id}-${i}`} className={`log-item-term ${i === 0 ? 'flash-bg-term' : ''}`}>
                            <span className="l-time">{log.time}</span>
                            <span className="l-symb">{log.module.padEnd(10, ' ')}</span>
                            <span className="l-qty text-brand font-bold">{log.asset.padEnd(6, ' ')}</span>
                            <span className={`l-status font-bold ${log.status === 'OK' ? 'text-up' : 'text-orange'}`}>
                                {log.status === 'OK' ? '✓ READY' : '⚠ WARN'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

         </div>

      </div>
    </div>
  );
};

export default Portfolio;
