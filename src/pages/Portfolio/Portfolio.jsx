import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip } from 'recharts';
import { 
  Briefcase, ArrowUpRight, ArrowDownRight, MoreHorizontal, 
  Plus, Download, Activity, Shield, TrendingUp, TrendingDown,
  DollarSign, PieChart as PieIcon, Layers, History, Terminal, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './Portfolio.css';

const initialAssets = [
  { id: 1, symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 450, avgPrice: 420.50, currentPrice: 890.10, value: 400545.00, sector: 'Technology', beta: 1.8 },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', shares: 1200, avgPrice: 310.20, currentPrice: 405.30, value: 486360.00, sector: 'Technology', beta: 1.1 },
  { id: 3, symbol: 'TSLA', name: 'Tesla Inc.', shares: 850, avgPrice: 195.40, currentPrice: 212.45, value: 180582.50, sector: 'Automotive', beta: 2.1 },
  { id: 4, symbol: 'AAPL', name: 'Apple Inc.', shares: 1000, avgPrice: 165.80, currentPrice: 173.50, value: 173500.00, sector: 'Technology', beta: 1.05 },
  { id: 5, symbol: 'BTC/USD', name: 'Bitcoin', shares: 2.5, avgPrice: 45200.00, currentPrice: 65420.00, value: 163550.00, sector: 'Crypto', beta: 3.2 }
];

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

const SummaryStat = ({ label, value, subValue, isUp, icon }) => (
  <div className="portfolio-summary-card-pro glass-card text-left">
    <div className="summary-pro-header flex-between">
       <span className="summary-pro-label text-muted font-bold text-xs uppercase tracking-wider">{label}</span>
       <div className="summary-pro-icon opacity-70">{icon}</div>
    </div>
    <div className="summary-pro-body mt-2">
       <h2 className="summary-pro-val font-mono text-2xl font-bold">{value}</h2>
       <div className={`summary-pro-sub mt-1 text-xs font-mono flex items-center gap-1 ${isUp ? 'text-up' : 'text-down'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{subValue}</span>
       </div>
    </div>
  </div>
);

const Portfolio = () => {
  const [portfolioAssets, setPortfolioAssets] = useState(initialAssets);
  const [isLive, setIsLive] = useState(true);
  const [systemLogs, setSystemLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  const handleExportCSV = () => {
    try {
        const headers = ['Symbol', 'Name', 'Sector', 'Shares', 'Avg Price', 'Current Price', 'Total Value', 'Beta', 'Unrealized PNL'];
        const rows = portfolioAssets.map(asset => {
            const pnlVal = asset.value - (asset.shares * asset.avgPrice);
            return [
                asset.symbol,
                `"${asset.name}"`,
                asset.sector,
                asset.shares,
                asset.avgPrice.toFixed(2),
                asset.currentPrice.toFixed(2),
                asset.value.toFixed(2),
                asset.beta,
                pnlVal.toFixed(2)
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `StockMind_Portfolio_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('CSV Export generated and downloaded.', { icon: '📄' });
    } catch(err) {
        toast.error('Failed to generate export file.');
    }
  };

  // High Frequency Data Streams
  useEffect(() => {
    if (!isLive) return;
    
    // 1. Jitter Portfolio Prices
    const priceInterval = setInterval(() => {
      setPortfolioAssets(currentAssets => 
        currentAssets.map(asset => {
          const volatility = asset.beta * 0.0008; // Higher beta = more jitter
          const shift = (Math.random() - 0.48) * (asset.currentPrice * volatility);
          const newPrice = asset.currentPrice + shift;
          return {
            ...asset,
            lastPrice: asset.currentPrice,
            currentPrice: newPrice,
            value: newPrice * asset.shares,
            tickDir: shift > 0 ? 'up' : 'down'
          };
        })
      );
    }, 800);

    // 2. Generate Real-time Sync Logs
    const logInterval = setInterval(() => {
      if (Math.random() > 0.6) {
         const asset = initialAssets[Math.random() * initialAssets.length | 0].symbol;
         const d = new Date();
         const ms = d.getMilliseconds().toString().padStart(3, '0');
         const type = Math.random() > 0.5 ? 'SYNC_PRICE' : 'MARGIN_CHK';
         const status = Math.random() > 0.95 ? 'WARN' : 'OK';
         
         const newLog = {
           id: Math.random().toString(36).substring(2, 10).toUpperCase(),
           time: `${d.toLocaleTimeString(undefined, {hour12: false})}.${ms}`,
           module: type,
           asset: asset,
           status: status
         };
         setSystemLogs(prev => [newLog, ...prev].slice(0, 12));
      }
    }, 450);

    return () => {
      clearInterval(priceInterval);
      clearInterval(logInterval);
    };
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
            <div className="brand-icon-box" style={{ width: '40px', height: '40px', background: 'rgba(37,99,235,0.1)', color: 'var(--accent-brand)' }}>
                <div className="flex items-center gap-3">
                <Shield className="text-brand" size={28} />
                <h1 className="font-outfit text-2xl font-bold tracking-tight">STOCKMIND AI PORTFOLIO</h1>
              </div>  <p className="text-muted text-xs font-mono mt-1">UUID: 8F92-A14B • INSTITUTIONAL OMNIBUS • LIVE STREAM</p>
            </div>
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
                  className="btn-pro-primary"
                  onClick={() => { setActiveTab('ROUTING'); toast.success('Capital Deployment sequence initialized.', { icon: '💸' }); }}
                >
                  <Plus size={14} className="mr-1"/> DEPLOY CAPITAL
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
            <div className="card-header-term flex-between border-b border-light p-4">
               <div className="flex items-center gap-2">
                   <Briefcase size={16} className="text-cyan" />
                   <h4 className="font-bold text-sm tracking-wide uppercase">Asset Allocation Matrix</h4>
               </div>
               <div className="live-status-pro text-xs font-mono flex items-center gap-2">
                   <div className={`status-dot ${isLive ? 'active bg-up' : 'bg-muted'}`} style={{width: 8, height: 8, borderRadius: '50%'}}></div>
                   <span>ENGINE: {isLive ? 'SYNCED' : 'OFFLINE'}</span>
               </div>
            </div>
            
            <div className="holdings-matrix-pro w-full overflow-hidden">
               <div className="matrix-head-pro grid text-xs font-bold text-muted uppercase tracking-wider py-3 px-4 border-b border-light">
                  <div className="col-span-2">Instrument</div>
                  <div className="text-right">Market Px</div>
                  <div className="text-right">Unrl PNL</div>
                  <div className="text-right">Position</div>
                  <div className="text-right">Exposure %</div>
               </div>
               
               <div className="matrix-body-pro flex flex-col">
                  {portfolioAssets.map(asset => {
                     const pnlVal = asset.value - (asset.shares * asset.avgPrice);
                     const pnlPct = (pnlVal / (asset.shares * asset.avgPrice)) * 100;
                     const isUp = pnlVal >= 0;
                     const exposure = (asset.value / totalValue) * 100;

                     return (
                        <div key={asset.symbol} className="matrix-row-pro grid items-center py-3 px-4 border-b border-light hover:bg-white/5 transition-colors">
                           <div className="matrix-id-pro col-span-2 flex flex-col">
                              <span className="font-bold text-sm">{asset.symbol}</span>
                              <span className="text-xs text-muted font-mono">{asset.sector.toUpperCase()}</span>
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
                              <span className="text-xs text-muted font-mono">@ ${asset.avgPrice.toFixed(2)}</span>
                           </div>
                           <div className="matrix-exposure-pro text-right flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-brand" style={{width: `${exposure}%`}}></div>
                              </div>
                              <span className="font-mono text-xs w-10">{exposure.toFixed(1)}%</span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
         )}

         {activeTab === 'RISK' && (
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
         )}

         {activeTab === 'ROUTING' && (
         <div className="portfolio-holdings-grid-pro glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
               <Zap size={18} className="text-up" />
               <h3 className="font-bold tracking-wide uppercase">Direct Market Access (DMA)</h3>
            </div>
            <div className="flex flex-col gap-5 max-w-md mx-auto py-4">
               <div className="flex p-1 bg-black/40 border border-light rounded-lg">
                   <button className="flex-1 py-2 text-sm font-bold bg-up/20 text-up rounded-md shadow-[0_0_10px_rgba(34,197,94,0.3)]">BUY</button>
                   <button className="flex-1 py-2 text-sm font-bold text-muted hover:text-white transition-colors">SELL</button>
               </div>
               <input type="text" placeholder="TICKER (e.g. NVDA)" className="bg-black/40 border border-light rounded-md p-4 font-mono text-xl outline-none focus:border-brand transition-colors uppercase" />
               <input type="number" placeholder="SHARES" className="bg-black/40 border border-light rounded-md p-4 font-mono text-xl outline-none focus:border-brand transition-colors" />
               <div className="flex gap-2">
                   <button className="flex-1 bg-white/10 border border-brand text-brand font-bold p-3 text-sm rounded-md shadow-[0_0_10px_rgba(79,70,229,0.3)]">MKT</button>
                   <button className="flex-1 bg-black/40 border border-light text-muted hover:text-white p-3 text-sm rounded-md transition-colors font-bold">LMT</button>
                   <button className="flex-1 bg-black/40 border border-light text-muted hover:text-white p-3 text-sm rounded-md transition-colors font-bold">STP</button>
               </div>
               <button 
                  className="w-full bg-up text-black font-extrabold py-4 rounded-lg mt-4 flex items-center justify-center gap-2 hover:bg-green-400 transition-all shadow-[0_4px_15px_rgba(34,197,94,0.4)]" 
                  onClick={() => toast.success('Order routed to dark-pool prime brokerage.', {icon:'🚀'})}
               >
                  <Activity size={18} strokeWidth={3} /> EXECUTE TARGET BLOCK
               </button>
            </div>
         </div>
         )}

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
                            <span className="l-qty text-brand">{log.asset.padEnd(6, ' ')}</span>
                            <span className={`l-status font-bold ${log.status === 'OK' ? 'text-up' : 'text-orange'}`}>
                                [{log.status}]
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
