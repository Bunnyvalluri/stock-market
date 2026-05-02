import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip } from 'recharts';
import { 
  Briefcase, ArrowUpRight, ArrowDownRight, 
  Plus, Download, Activity, Shield, TrendingUp, TrendingDown,
  DollarSign, PieChart as PieIcon, Layers, Terminal, Zap, CheckCircle, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Sparkline from '../../components/Sparkline';
import './Portfolio.css';

// ==========================================
// CONSTANTS & UTILITIES
// ==========================================
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const TABS = ['OVERVIEW', 'RISK', 'ROUTING'];

const generateHistory = (base) => Array.from({length: 20}, () => ({ price: base + (Math.random() - 0.5) * (base * 0.03) }));

const initialAssets = [
  { id: 1, symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 450, avgPrice: 420.50, currentPrice: 890.10, sector: 'Technology', beta: 1.8, history: generateHistory(890.10) },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', shares: 1200, avgPrice: 310.20, currentPrice: 405.30, sector: 'Technology', beta: 1.1, history: generateHistory(405.30) },
  { id: 3, symbol: 'TSLA', name: 'Tesla Inc.', shares: 850, avgPrice: 195.40, currentPrice: 212.45, sector: 'Automotive', beta: 2.1, history: generateHistory(212.45) },
  { id: 4, symbol: 'AAPL', name: 'Apple Inc.', shares: 1000, avgPrice: 165.80, currentPrice: 173.50, sector: 'Technology', beta: 1.05, history: generateHistory(173.50) },
  { id: 5, symbol: 'BTC/USD', name: 'Bitcoin', shares: 2.5, avgPrice: 45200.00, currentPrice: 65420.00, sector: 'Crypto', beta: 3.2, history: generateHistory(65420.00) }
];

// ==========================================
// CUSTOM HOOKS
// ==========================================
const usePortfolioEngine = (isLive) => {
  const [portfolioAssets, setPortfolioAssets] = useState(initialAssets);
  const [systemLogs, setSystemLogs] = useState([]);

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
              tickDir: shift > 0 ? 'up' : shift < 0 ? 'down' : asset.tickDir,
              history: [...asset.history.slice(1), { price: live.price }]
            };
          }
          return asset;
        }));

        const d = new Date();
        const newLog = {
          id: Math.random().toString(36).substring(2, 10).toUpperCase(),
          time: d.toLocaleTimeString(undefined, { hour12: false }),
          action: 'SYNC_DAEMON',
          asset: 'MARKET_DATA',
          status: 'OK'
        };
        setSystemLogs(prev => [newLog, ...prev].slice(0, 8));
      }
    } catch {
        // Fallback to synthetic jitter if API is down
      setPortfolioAssets(current => 
        current.map(asset => {
          const shift = (Math.random() - 0.48) * (asset.currentPrice * (asset.beta * 0.0008));
          const newPrice = asset.currentPrice + shift;
          return {
            ...asset,
            currentPrice: newPrice,
            history: [...asset.history.slice(1), { price: newPrice }],
            tickDir: shift > 0 ? 'up' : 'down'
          };
        })
      );
    }
  };

  useEffect(() => {
    // Initial sync
    const initSync = async () => {
      await syncRealTimeData();
    };
    initSync();

    if (isLive) {
      const interval = setInterval(syncRealTimeData, 10000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  return { portfolioAssets, systemLogs };
};

// ==========================================
// MEMOIZED SUB-COMPONENTS
// ==========================================

const SummaryStat = memo(({ label, value, subValue, isUp, icon, delay }) => (
  <motion.div 
    className="metric-premium-card glass-panel"
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
  >
    <div className="metric-header">
       <div className="metric-icon-wrap bg-brand-light">{icon}</div>
       <div className={`metric-pill ${isUp ? 'pill-up' : 'pill-down'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {subValue.split(' ')[0]}
       </div>
    </div>
    <div className="metric-body mt-3">
       <span className="metric-label">{label}</span>
       <h3 className="metric-val text-3xl">{value}</h3>
       <div className="metric-sub text-xs text-muted">{subValue.includes('Today') ? subValue : `Performance: ${subValue}`}</div>
    </div>
  </motion.div>
));
SummaryStat.displayName = 'SummaryStat';

const HoldingsMatrix = memo(({ assets, totalValue, isLive }) => (
  <motion.div className="glass-panel" initial={{opacity:0}} animate={{opacity:1}}>
    <div className="panel-header border-bottom">
       <div className="panel-title">
           <Layers size={20} className="text-brand" />
           <h3>Asset Matrix</h3>
       </div>
       <div className="status-live">
           <span className={`live-indicator ${!isLive ? 'paused' : ''}`}></span>
           {isLive ? 'Real-time Sync' : 'Offline'}
       </div>
    </div>
    <div className="matrix-table-premium">
       <div className="matrix-header-row">
          <div>Asset</div><div>Trend</div><div className="text-right">Price</div>
          <div className="text-right">Unrealized PNL</div><div className="text-right">Holdings</div><div className="text-right">Exposure</div>
       </div>
       <div className="matrix-body">
          {assets.map(asset => {
             const assetValue = asset.shares * asset.currentPrice;
             const costBasis = asset.shares * asset.avgPrice;
             const pnlVal = assetValue - costBasis;
             const pnlPct = (pnlVal / costBasis) * 100;
             const isUp = pnlVal >= 0;
             const exposure = (assetValue / totalValue) * 100;

             return (
                <div key={asset.symbol} className="matrix-data-row">
                   <div className="matrix-cell asset-info">
                      <span className="asset-sym">{asset.symbol}</span>
                      <span className="asset-sec">{asset.sector}</span>
                   </div>
                   <div className="matrix-cell sparkline-cell">
                       <Sparkline data={asset.history} color={isUp ? '#10b981' : '#ef4444'} />
                   </div>
                   <div className={`matrix-cell text-right asset-price ${asset.tickDir ? `flash-${asset.tickDir}` : ''}`}>
                      ${asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                   </div>
                   <div className={`matrix-cell text-right flex-col ${isUp ? 'text-up' : 'text-down'}`}>
                      <span className="pnl-val">${(Math.abs(pnlVal)/1000).toFixed(1)}k</span>
                      <span className="pnl-pct">{isUp ? '+' : ''}{pnlPct.toFixed(2)}%</span>
                   </div>
                   <div className="matrix-cell text-right flex-col">
                      <span className="hold-shares">{asset.shares.toLocaleString()}</span>
                      <span className="hold-avg text-muted">@ ${asset.avgPrice.toFixed(2)}</span>
                   </div>
                   <div className="matrix-cell text-right flex-center-right">
                      <span className="exposure-val">{exposure.toFixed(1)}%</span>
                   </div>
                </div>
             );
          })}
       </div>
    </div>
  </motion.div>
));
HoldingsMatrix.displayName = 'HoldingsMatrix';

const RiskPanel = memo(({ totalValue }) => (
  <motion.div className="flex-col gap-6" initial={{opacity:0}} animate={{opacity:1}}>
     <div className="glass-panel p-6">
        <div className="panel-title mb-6">
           <Shield size={20} className="text-orange" /><h3>Risk & Exposure Analysis</h3>
        </div>
        <div className="risk-metrics-grid">
           <div className="risk-card">
              <span className="risk-label">Value at Risk (95% CI)</span>
              <span className="risk-val text-down">${(totalValue * 0.05).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
           </div>
           <div className="risk-card">
              <span className="risk-label">Systematic Beta vs SPY</span>
              <span className="risk-val">1.24 <span className="risk-tag orange">Aggressive</span></span>
           </div>
           <div className="risk-card">
              <span className="risk-label">Sharpe Ratio</span>
              <span className="risk-val text-brand">3.42</span>
           </div>
           <div className="risk-card">
              <span className="risk-label">Sortino Ratio</span>
              <span className="risk-val text-cyan">4.18</span>
           </div>
        </div>
        <div className="mt-8">
           <h4 className="section-subtitle">Monte Carlo Stress Scenarios</h4>
           <div className="scenario-list mt-4">
              <div className="scenario-item">
                  <span>S&P Black Swan (-20% Gap)</span>
                  <span className="text-down font-bold">-$ {(totalValue * 0.248).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
              </div>
              <div className="scenario-item">
                  <span>VIX Volatility Expansion (+40%)</span>
                  <span className="text-up font-bold">+$ {(totalValue * 0.12).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
              </div>
           </div>
        </div>
     </div>
     <div className="glass-panel p-6 border-brand">
        <div className="panel-title mb-4">
           <Zap size={20} className="text-brand" /><h3 className="text-brand">Autonomous Risk Advisory</h3>
        </div>
        <div className="advisory-grid">
           <div className="advisory-card">
              <div className="adv-header"><Layers size={16} className="text-orange" /><span>Concentration Alert</span></div>
              <p>Tech exposure exceeds 65%. Neural Core suggests rotating 12% into Defensive sectors (Healthcare) to mitigate idiosyncratic risk.</p>
           </div>
           <div className="advisory-card">
              <div className="adv-header"><Shield size={16} className="text-cyan" /><span>Tail Risk Hedging</span></div>
              <p>High systematic beta detected (1.24). Consider buying $VIX call options or $SPY puts to protect against impending CPI release.</p>
           </div>
        </div>
     </div>
  </motion.div>
));
RiskPanel.displayName = 'RiskPanel';

const OrderRoutingPanel = memo(() => {
   const [orderSide, setOrderSide] = useState('BUY');
   const [orderTicker, setOrderTicker] = useState('');
   const [orderShares, setOrderShares] = useState('');
   const [orderType, setOrderType] = useState('MKT');
   const [limitPrice, setLimitPrice] = useState('');
   
   const estimatedCost = useMemo(() => {
      return orderShares && limitPrice ? (parseFloat(orderShares) * parseFloat(limitPrice)).toFixed(2) : '—';
   }, [orderShares, limitPrice]);

   const handleSubmit = useCallback(() => {
      if (!orderTicker.trim()) { toast.error('Enter a ticker symbol.'); return; }
      if (!orderShares || parseInt(orderShares) <= 0) { toast.error('Enter a valid quantity.'); return; }
      toast.success(`${orderSide} order for ${orderShares} × ${orderTicker} routed to exchange.`, { icon: '🚀' });
      setOrderTicker(''); setOrderShares(''); setLimitPrice('');
   }, [orderTicker, orderShares, orderSide]);

   return (
     <motion.div className="glass-panel p-8" initial={{opacity:0}} animate={{opacity:1}}>
       <div className="panel-title mb-6 flex-between">
         <div className="flex items-center gap-2">
           <Zap size={20} className="text-up" /><h3>Direct Market Access (DMA)</h3>
         </div>
         <span className="venue-tag">VENUE: DARK POOL + LIT</span>
       </div>
       <div className="routing-form-premium">
         <div className="side-selector">
           {['BUY','SELL'].map(side => (
             <button 
               key={side} 
               className={`side-btn ${orderSide === side ? (side === 'BUY' ? 'active-buy' : 'active-sell') : ''}`} 
               onClick={() => setOrderSide(side)}
               aria-pressed={orderSide === side}
             >
               {side}
             </button>
           ))}
         </div>
         <div className="form-group">
           <label htmlFor="order-ticker">Ticker Symbol</label>
           <input id="order-ticker" type="text" placeholder="e.g. NVDA, AAPL" value={orderTicker} onChange={e => setOrderTicker(e.target.value.toUpperCase())} />
         </div>
         <div className="form-group">
           <label htmlFor="order-quantity">Quantity (Shares)</label>
           <input id="order-quantity" type="number" placeholder="0" min="1" value={orderShares} onChange={e => setOrderShares(e.target.value)} />
         </div>
         <div className="form-group">
           <label htmlFor="order-type">Order Type</label>
           <div className="type-selector">
             {['MKT','LMT','STP','STP-LMT'].map(t => (
               <button key={t} className={`type-btn ${orderType === t ? 'active' : ''}`} onClick={() => setOrderType(t)}>{t}</button>
             ))}
           </div>
         </div>
         {orderType !== 'MKT' && (
           <div className="form-group">
             <label htmlFor="limit-price">{orderType === 'STP' ? 'Stop Price (USD)' : 'Limit Price (USD)'}</label>
             <input id="limit-price" type="number" placeholder="0.00" value={limitPrice} onChange={e => setLimitPrice(e.target.value)} />
           </div>
         )}
         <div className="est-cost-panel">
           <span>Estimated Value</span>
           <span className="est-val">{orderType === 'MKT' ? '(Market Price)' : estimatedCost === '—' ? '—' : `$${parseFloat(estimatedCost).toLocaleString()}`}</span>
         </div>
         <button className={`submit-order-btn ${orderSide === 'BUY' ? 'btn-buy' : 'btn-sell'}`} onClick={handleSubmit}>
           <Activity size={18} /> Submit {orderSide} Order — {orderTicker || 'TICKER'}
         </button>
       </div>
     </motion.div>
   );
});
OrderRoutingPanel.displayName = 'OrderRoutingPanel';

// ==========================================
// MAIN COMPONENT
// ==========================================
const Portfolio = () => {
  const [isLive] = useState(true);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const { portfolioAssets, systemLogs } = usePortfolioEngine(isLive);

  // Derived State Memoization
  const { totalValue, totalCost, allocationData } = useMemo(() => {
    return portfolioAssets.reduce((acc, asset) => {
      const val = asset.shares * asset.currentPrice;
      const cost = asset.shares * asset.avgPrice;
      acc.totalValue += val;
      acc.totalCost += cost;
      acc.allocationData.push({ name: asset.symbol, value: val });
      return acc;
    }, { totalValue: 0, totalCost: 0, allocationData: [] });
  }, [portfolioAssets]);

  const totalPNL = totalValue - totalCost;
  const pnlPercent = (totalPNL / totalCost) * 100;

  const handleExportCSV = useCallback(() => {
    try {
        const headers = ['Symbol', 'Name', 'Sector', 'Shares', 'Avg Price', 'Current Price', 'Total Value', 'Beta', 'Unrealized PNL'];
        const rows = portfolioAssets.map(asset => {
            const assetVal = asset.shares * asset.currentPrice;
            const pnlVal = assetVal - (asset.shares * asset.avgPrice);
            return [
                asset.symbol, `"${asset.name}"`, asset.sector, asset.shares,
                asset.avgPrice.toFixed(2), asset.currentPrice.toFixed(2),
                assetVal.toFixed(2), asset.beta, pnlVal.toFixed(2)
            ].join(',');
        });
        const blob = new Blob([[headers.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `StockMind_Portfolio_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success('CSV Export downloaded.', { icon: '📄' });
    } catch {
        toast.error('Failed to generate export file.');
    }
  }, [portfolioAssets]);

  const handleTabChange = useCallback((tab) => setActiveTab(tab), []);

  return (
    <div className="portfolio-premium-container animate-fade-in">
      <div className="premium-home-bg"><div className="home-glow home-glow-1"></div><div className="home-glow home-glow-2"></div></div>

      <div className="portfolio-content-wrapper">
        <div className="quant-metrics-premium glass-panel">
          <div className="qm-item"><span className="qm-label">Sharpe (1Y)</span><span className="qm-val text-brand">3.42</span></div>
          <div className="qm-item"><span className="qm-label">Port Beta</span><span className="qm-val text-white">1.24</span></div>
          <div className="qm-item"><span className="qm-label">Alpha v SPY</span><span className="qm-val text-up">+4.12%</span></div>
          <div className="qm-item"><span className="qm-label">Max Drawdown</span><span className="qm-val text-down">-12.4%</span></div>
          <div className="qm-item"><span className="qm-label">Margin Use</span><span className="qm-val text-orange">24.5%</span></div>
        </div>

        <div className="page-header-premium">
          <div className="header-titles">
              <Briefcase className="text-brand" size={28} />
              <div><h1>Portfolio Management</h1><p>Track performance, analyze risk, and deploy capital.</p></div>
          </div>
          <div className="header-actions-premium">
              <div className="portfolio-tabs-premium">
                  {TABS.map(tab => (
                      <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => handleTabChange(tab)}>{tab}</button>
                  ))}
              </div>
              <button className="btn-icon-premium" onClick={handleExportCSV} title="Export CSV"><Download size={18} /></button>
              <button className="btn-primary-premium" onClick={() => handleTabChange('ROUTING')}><Plus size={16} /> Deploy Capital</button>
          </div>
        </div>

        <div className="portfolio-stats-grid">
           <SummaryStat label="Gross Asset Value (GAV)" value={`$${(totalValue / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}k`} subValue={`+$4,120.45 (1.4%) Today`} isUp={true} icon={<DollarSign size={20} className="text-brand" />} delay={0.1}/>
           <SummaryStat label="Unrealized PNL" value={`${totalPNL >= 0 ? '+' : '-'}$${(Math.abs(totalPNL) / 1000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}k`} subValue={`${pnlPercent.toFixed(2)}% Cumulative Return`} isUp={totalPNL >= 0} icon={<Activity size={20} className={totalPNL >= 0 ? "text-up" : "text-down"} />} delay={0.2}/>
           <SummaryStat label="Available Liquidity" value="$424,840.45" subValue="Immediate Settlement Available" isUp={true} icon={<Shield size={20} className="text-cyan" />} delay={0.3}/>
        </div>

        <div className="portfolio-main-layout">
           <div className="portfolio-col-main">
             {activeTab === 'OVERVIEW' && <HoldingsMatrix assets={portfolioAssets} totalValue={totalValue} isLive={isLive} />}
             {activeTab === 'RISK' && <RiskPanel totalValue={totalValue} />}
             {activeTab === 'ROUTING' && <OrderRoutingPanel />}
           </div>

           <div className="portfolio-col-side">
              <div className="glass-panel">
                 <div className="panel-header border-bottom"><div className="panel-title"><PieIcon size={18} className="text-orange" /><h3>Capital Distribution</h3></div></div>
                 <div className="p-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={allocationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                          {allocationData.map((e) => <Cell key={`c-${e.name}`} fill={COLORS[allocationData.indexOf(e) % COLORS.length]} />)}
                        </Pie>
                        <PieTooltip 
                          contentStyle={{ background: '#030712', border: '1px solid #1f2937', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#fff', fontWeight: 600 }}
                          formatter={(value) => [`$${(value/1000).toFixed(1)}k`, 'Exposure']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="glass-panel flex-1">
                  <div className="panel-header border-bottom"><div className="panel-title"><Terminal size={18} className="text-brand" /><h3>System Trace</h3></div></div>
                  <div className="system-trace-list">
                      <AnimatePresence mode="popLayout">
                          {systemLogs.map((log) => (
                              <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="trace-item">
                                  <div className="trace-time">{log.time}</div>
                                  <div className="trace-info"><span className="trace-action">{log.action}</span><span className="trace-asset">{log.asset}</span></div>
                                  <div className="trace-status">{log.status === 'OK' ? <CheckCircle size={14} className="text-up" /> : <AlertTriangle size={14} className="text-orange" />}</div>
                              </motion.div>
                          ))}
                      </AnimatePresence>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
