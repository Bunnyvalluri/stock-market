import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip } from 'recharts';
import { 
  Briefcase, ArrowUpRight, ArrowDownRight, MoreHorizontal, 
  Plus, Download, Activity, Shield, TrendingUp, TrendingDown,
  DollarSign, PieChart as PieIcon, Layers, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Portfolio.css';

const initialAssets = [
  { id: 1, symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 45, avgPrice: 420.50, currentPrice: 890.10, value: 40054.50, sector: 'Technology' },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', shares: 120, avgPrice: 310.20, currentPrice: 405.30, value: 48636.00, sector: 'Technology' },
  { id: 3, symbol: 'TSLA', name: 'Tesla Inc.', shares: 85, avgPrice: 195.40, currentPrice: 212.45, value: 18058.25, sector: 'Automotive' },
  { id: 4, symbol: 'AAPL', name: 'Apple Inc.', shares: 100, avgPrice: 165.80, currentPrice: 173.50, value: 17350.00, sector: 'Technology' }
];

const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

const SummaryStat = ({ label, value, subValue, isUp, icon }) => (
  <div className="portfolio-summary-card-pro glass-card">
    <div className="summary-pro-header">
       <div className="summary-pro-icon">{icon}</div>
       <span className="summary-pro-label">{label}</span>
    </div>
    <div className="summary-pro-body">
       <h2 className="summary-pro-val">{value}</h2>
       <div className={`summary-pro-sub ${isUp ? 'up' : 'down'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{subValue}</span>
       </div>
    </div>
  </div>
);

const Portfolio = () => {
  const [portfolioAssets, setPortfolioAssets] = useState(initialAssets);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setPortfolioAssets(currentAssets => 
        currentAssets.map(asset => {
          const shift = (Math.random() - 0.48) * (asset.currentPrice * 0.001);
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
    }, 1800);
    return () => clearInterval(interval);
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
            <Layers className="text-brand" size={24} />
            <div>
                <h1>Global Equities Alpha</h1>
                <p className="text-muted">Managed Institutional Portfolio (Live Feed)</p>
            </div>
        </div>
        <div className="header-pro-right">
            <div className="header-pro-pills">
                <button className="active">Live Dashboard</button>
                <button>Tax Analytics</button>
                <button>Rebalancing</button>
            </div>
            <div className="header-pro-actions">
                <button className="action-btn-pro"><Download size={18} /></button>
                <button className="add-btn-pro"><Plus size={18} /> Deploy Capital</button>
            </div>
        </div>
      </div>

      {/* Modern Financial Summary Grid */}
      <div className="portfolio-stats-grid-pro">
         <SummaryStat 
            label="Total Equity Value" 
            value={`$${totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
            subValue={`+$4,120.45 (1.4%) Today`} 
            isUp={true} 
            icon={<DollarSign size={20} className="text-brand" />}
         />
         <SummaryStat 
            label="Net Profit / Loss" 
            value={`${totalPNL >= 0 ? '+' : '-'}$${Math.abs(totalPNL).toLocaleString(undefined, {maximumFractionDigits: 0})}`} 
            subValue={`${pnlPercent.toFixed(2)}% All Time`} 
            isUp={totalPNL >= 0} 
            icon={<Activity size={20} className="text-cyan" />}
         />
         <SummaryStat 
            label="Buying Power (USD)" 
            value="$42,840.45" 
            subValue="Level 2 Margin Enabled" 
            isUp={true} 
            icon={<Shield size={20} className="text-orange" />}
         />
      </div>

      <div className="portfolio-main-layout-pro">
         {/* Allocation & Intelligence Segment */}
         <div className="portfolio-side-pro">
            <div className="allocation-card-pro glass-card">
               <div className="card-header-pro">
                  <PieIcon size={18} className="text-brand" />
                  <h4>Global Weightage</h4>
               </div>
               <div className="allocation-content-pro">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie 
                        data={allocationData} 
                        innerRadius={55} 
                        outerRadius={75} 
                        paddingAngle={10} 
                        dataKey="value" 
                        stroke="none"
                        isAnimationActive={false}
                      >
                        {allocationData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <PieTooltip 
                        contentStyle={{ background: '#121212', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="allocation-legend-pro">
                     {portfolioAssets.map((asset, i) => (
                        <div key={asset.symbol} className="legend-item-pro">
                           <span className="dot" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                           <span className="sym">{asset.symbol}</span>
                           <span className="pct text-muted">{((asset.value/totalValue)*100).toFixed(1)}%</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="allocation-card-pro glass-card mt-5">
                <div className="card-header-pro">
                    <History size={18} className="text-cyan" />
                    <h4>Market Pulse Alerts</h4>
                </div>
                <div className="portfolio-alerts-pro">
                    <div className="alert-item-pro">
                        <span className="alert-tag up">BULLISH</span>
                        <p>MSFT support levels respected at $405. Neural bias positive.</p>
                    </div>
                    <div className="alert-item-pro">
                        <span className="alert-tag up">VOLATILE</span>
                        <p>NVDA approaching overhead Resistance Zone (920).</p>
                    </div>
                </div>
            </div>
         </div>

         {/* Holdings Matrix (Main View) */}
         <div className="portfolio-holdings-grid-pro glass-card">
            <div className="card-header-pro flex-between mb-4">
               <h4>Asset Holdings Matrix</h4>
               <div className="live-status-pro">
                   <div className={`status-dot ${isLive ? 'active' : ''}`}></div>
                   <span>ENGINE {isLive ? 'ACTIVE' : 'IDLE'}</span>
               </div>
            </div>
            
            <div className="holdings-matrix-pro">
               <div className="matrix-head-pro">
                  <span>Instrument</span>
                  <span>Price</span>
                  <span>Profit/Loss</span>
                  <span>Holdings</span>
                  <span>Sector</span>
               </div>
               <div className="matrix-body-pro">
                  {portfolioAssets.map(asset => {
                     const pnlVal = asset.value - (asset.shares * asset.avgPrice);
                     const pnlPct = (pnlVal / (asset.shares * asset.avgPrice)) * 100;
                     const isUp = pnlVal >= 0;

                     return (
                        <div key={asset.symbol} className="matrix-row-pro">
                           <div className="matrix-id-pro">
                              <span className="font-bold">{asset.symbol}</span>
                              <span className="text-xs text-muted">{asset.name}</span>
                           </div>
                           <div className={`matrix-price-pro font-mono ${asset.tickDir ? `flash-${asset.tickDir}` : ''}`}>
                              ${asset.currentPrice.toFixed(2)}
                           </div>
                           <div className={`matrix-pnl-pro ${isUp ? 'text-up' : 'text-down'}`}>
                              <span className="font-bold">${Math.abs(pnlVal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              <span className="text-xs">({isUp ? '+' : ''}{pnlPct.toFixed(2)}%)</span>
                           </div>
                           <div className="matrix-holdings-pro">
                              <span className="font-bold">{asset.shares} Units</span>
                              <span className="text-xs text-muted">Cost: ${asset.avgPrice.toFixed(1)}</span>
                           </div>
                           <div className="matrix-sector-pro">
                              <span className="sector-tag">{asset.sector}</span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};

export default Portfolio;
