import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as PieTooltip } from 'recharts';
import { Briefcase, ArrowUpRight, ArrowDownRight, MoreHorizontal, Plus, Download, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Portfolio.css';
import './PortfolioRealTime.css';

const initialAssets = [
  { id: 1, symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 45, avgPrice: 420.50, currentPrice: 890.10, value: 40054.50 },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', shares: 120, avgPrice: 310.20, currentPrice: 405.30, value: 48636.00 },
  { id: 3, symbol: 'TSLA', name: 'Tesla Inc.', shares: 85, avgPrice: 195.40, currentPrice: 212.45, value: 18058.25 },
  { id: 4, symbol: 'AAPL', name: 'Apple Inc.', shares: 100, avgPrice: 165.80, currentPrice: 173.50, value: 17350.00 }
];

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const Portfolio = () => {
  const [portfolioAssets, setPortfolioAssets] = useState(initialAssets);
  const [isLive, setIsLive] = useState(true);

  // Simulate Real-time WebSocket Data
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setPortfolioAssets(currentAssets => {
        return currentAssets.map(asset => {
          // Random walk volatility
          const volatility = asset.currentPrice * 0.002; // max 0.2% change per tick
          const change = (Math.random() - 0.45) * volatility; // slight upward bias
          const newPrice = asset.currentPrice + change;
          
          return {
            ...asset,
            lastPrice: asset.currentPrice, // Keep track for flash color
            currentPrice: newPrice,
            value: newPrice * asset.shares
          };
        });
      });
    }, 2000); // 2-second tick rate

    return () => clearInterval(interval);
  }, [isLive]);

  const totalValue = portfolioAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalCost = portfolioAssets.reduce((sum, asset) => sum + (asset.shares * asset.avgPrice), 0);
  const totalPNL = totalValue - totalCost;
  const pnlPercent = totalCost > 0 ? (totalPNL / totalCost) * 100 : 0;

  const allocationData = portfolioAssets.map(asset => ({
    name: asset.symbol,
    value: asset.value
  }));

  return (
    <div className="portfolio-container animate-fade-in">
      <div className="page-header flex-between">
        <div className="header-title">
          <Briefcase className="text-gradient" size={28} />
          <h1>My Portfolio</h1>
          <div className={`live-badge ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
            <div className="pulse-dot"></div>
            {isLive ? 'LIVE FEED ON' : 'FEED PAUSED'}
          </div>
        </div>
        <div className="header-actions">
          <button className="secondary-btn"><Download size={16} /> Export</button>
          <button className="primary-btn"><Plus size={16} /> Add Position</button>
        </div>
      </div>

      <div className="portfolio-summary-grid">
        <div className="summary-card glass-card">
          <span className="summary-label">Real-time Balance</span>
          <h2 className="summary-value">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h2>
          <div className="summary-change text-up">
            <Activity size={16} /> Updating live internally
          </div>
        </div>
        
        <div className="summary-card glass-card">
          <span className="summary-label">Total Profit / Loss</span>
          <h2 className={`summary-value ${totalPNL >= 0 ? 'text-up' : 'text-down'}`}>
            {totalPNL >= 0 ? '+' : '-'}${Math.abs(totalPNL).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </h2>
          <div className={`summary-change ${totalPNL >= 0 ? 'text-up' : 'text-down'}`}>
            {totalPNL >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(pnlPercent).toFixed(2)}% All Time
          </div>
        </div>

        <div className="summary-card glass-card allocation-card">
           <span className="summary-label">Asset Allocation</span>
           <div className="mini-pie">
             <ResponsiveContainer width={120} height={120}>
               <PieChart>
                 <Pie data={allocationData} innerRadius={35} outerRadius={50} paddingAngle={5} dataKey="value" stroke="none" isAnimationActive={false}>
                   {allocationData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <PieTooltip formatter={(val) => `$${val.toLocaleString(undefined, {maximumFractionDigits: 0})}`} contentStyle={{ background: 'var(--bg-card)', border: 'none', borderRadius: '8px' }} />
               </PieChart>
             </ResponsiveContainer>
             <div className="allocation-legend">
               {allocationData.slice(0,3).map((item, i) => (
                 <div key={item.name} className="legend-item">
                   <span className="dot" style={{backgroundColor: COLORS[i]}}></span>
                   <span className="name">{item.name}</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>

      <div className="assets-table-container glass-card">
        <div className="table-header">
          <h3>Live Holdings</h3>
          <div className="table-search">
            <input type="text" placeholder="Search assets..." className="custom-input" />
          </div>
        </div>
        
        <div className="table-responsive">
          <table className="assets-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Live Price</th>
                <th>Holdings</th>
                <th>Avg. Cost</th>
                <th>Total Value</th>
                <th>P&L</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {portfolioAssets.map((asset, i) => {
                const pnl = asset.value - (asset.shares * asset.avgPrice);
                const pnlP = (pnl / (asset.shares * asset.avgPrice)) * 100;
                const isUp = pnl >= 0;
                
                // Determine if price ticked up or down for flash effect
                const tickUp = asset.lastPrice && asset.currentPrice > asset.lastPrice;
                const tickDown = asset.lastPrice && asset.currentPrice < asset.lastPrice;
                
                return (
                  <motion.tr 
                    key={asset.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <td>
                      <div className="asset-info">
                        <div className="asset-icon">{asset.symbol.substring(0,1)}</div>
                        <div>
                          <div className="asset-symbol">{asset.symbol}</div>
                          <div className="asset-name">{asset.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className={`font-mono price-cell ${tickUp ? 'flash-up' : tickDown ? 'flash-down' : ''}`}>
                      ${asset.currentPrice.toFixed(2)}
                    </td>
                    <td>
                      <div className="asset-shares">{asset.shares} req</div>
                    </td>
                    <td className="font-mono text-muted">${asset.avgPrice.toFixed(2)}</td>
                    <td className="font-mono font-bold">${asset.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td>
                      <div className={`pnl-badge ${isUp ? 'bg-up' : 'bg-down'}`}>
                        {isUp ? '+' : ''}{pnlP.toFixed(2)}%
                      </div>
                    </td>
                    <td>
                      <button className="action-btn"><MoreHorizontal size={18} /></button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
