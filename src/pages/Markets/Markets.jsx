import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { 
  Activity, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, 
  Clock, Globe, Search, Filter, BarChart3, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGlobalQuote } from '../../services/alphaVantage';
import './Markets.css';

const MOCK_TICKERS = [
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 175.50, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft', basePrice: 410.20, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet', basePrice: 140.80, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon', basePrice: 145.20, sector: 'E-commerce' },
  { symbol: 'META', name: 'Meta', basePrice: 480.10, sector: 'Social' },
  { symbol: 'NVDA', name: 'NVIDIA', basePrice: 890.50, sector: 'Semi' },
  { symbol: 'TSLA', name: 'Tesla', basePrice: 215.30, sector: 'Auto' },
  { symbol: 'AMD', name: 'AMD', basePrice: 178.90, sector: 'Semi' },
];

const INDICES = [
  { symbol: 'S&P 500', val: '5,123.45', change: '+0.85%', isUp: true },
  { symbol: 'NASDAQ', val: '16,234.10', change: '-0.32%', isUp: false },
  { symbol: 'VIX', val: '14.22', change: '-5.20%', isUp: false },
  { symbol: 'US 10Y', val: '4.21%', change: '+0.01', isUp: true },
];

const generateHistory = (basePrice) => {
  return Array.from({ length: 15 }, (_, i) => ({
    time: i,
    price: basePrice + (Math.random() - 0.5) * 4
  }));
};

const MarketChip = ({ data, isLive }) => {
  const isUp = data.change >= 0;
  return (
    <motion.div 
      className="market-card-pro glass-card"
      whileHover={{ y: -4, borderColor: 'var(--accent-brand)' }}
    >
      <div className="mc-pro-header">
        <div className="mc-pro-id">
            <span className="mc-pro-symbol">{data.symbol}</span>
            <span className="mc-pro-sector">{data.sector}</span>
        </div>
        <div className={`mc-pro-indicator ${isUp ? 'up' : 'down'}`}>
            {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </div>
      </div>
      
      <div className="mc-pro-body">
         <div className={`mc-pro-price ${data.pulseDir ? `flash-${data.pulseDir}` : ''}`}>
           ${data.price.toFixed(2)}
         </div>
         <div className={`mc-pro-change ${isUp ? 'text-up' : 'text-down'}`}>
           {isUp ? '+' : ''}{data.change.toFixed(2)}%
         </div>
      </div>

      <div className="mc-pro-chart">
         <ResponsiveContainer width="100%" height={50}>
            <AreaChart data={data.history}>
               <defs>
                 <linearGradient id={`grad-${data.symbol}`} x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor={isUp ? 'var(--status-up)' : 'var(--status-down)'} stopOpacity={0.2}/>
                   <stop offset="95%" stopColor={isUp ? 'var(--status-up)' : 'var(--status-down)'} stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <YAxis domain={['auto', 'auto']} hide />
               <Area 
                 type="monotone" 
                 dataKey="price" 
                 stroke={isUp ? 'var(--status-up)' : 'var(--status-down)'} 
                 fill={`url(#grad-${data.symbol})`} 
                 strokeWidth={2}
                 dot={false}
                 isAnimationActive={false}
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>

      <div className="mc-pro-footer">
          <div className="mc-pro-stat">
              <span>VOL</span>
              <span className="val">{(Math.random() * 5 + 1).toFixed(1)}M</span>
          </div>
          <div className="mc-pro-stat">
              <span>RSI</span>
              <span className="val">{(40 + Math.random() * 30).toFixed(0)}</span>
          </div>
      </div>
    </motion.div>
  );
};

const Markets = () => {
  const [marketsData, setMarketsData] = useState(() => 
    MOCK_TICKERS.map(t => ({
      ...t,
      price: t.basePrice,
      change: (Math.random() - 0.3) * 2,
      history: generateHistory(t.basePrice),
      pulseDir: null
    }))
  );
  
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setMarketsData(prev => prev.map(stock => {
        if (Math.random() > 0.6) {
          const shift = (Math.random() - 0.48) * (stock.basePrice * 0.002);
          const newPrice = stock.price + shift;
          return {
            ...stock,
            price: newPrice,
            change: stock.change + (shift/stock.basePrice)*100,
            history: [...stock.history.slice(1), {time: Date.now(), price: newPrice}],
            pulseDir: shift > 0 ? 'up' : 'down'
          };
        }
        return { ...stock, pulseDir: null };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredData = marketsData.filter(m => 
    m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="markets-pro-container animate-fade-in">
      {/* Institutional Index Bar */}
      <div className="index-bar-pro glass">
        {INDICES.map(idx => (
            <div key={idx.symbol} className="index-item-pro">
                <span className="idx-label">{idx.symbol}</span>
                <span className="idx-val">{idx.val}</span>
                <span className={`idx-change ${idx.isUp ? 'text-up' : 'text-down'}`}>{idx.change}</span>
            </div>
        ))}
        <div className="index-status">
            <span className="live-pulse"></span> SYSTEM OK
        </div>
      </div>

      {/* Page Header */}
      <div className="page-header-pro">
        <div className="header-left">
            <Globe className="text-brand" size={24} />
            <div>
                <h1>Global Equities Dashboard</h1>
                <p className="text-muted">Real-time institutional liquidity & pricing matrix</p>
            </div>
        </div>

        <div className="header-right-pro">
            <div className={`live-toggle-pro ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
                <Zap size={14} />
                {isLive ? 'TERMINAL LIVE' : 'STREAM PAUSED'}
            </div>
            <div className="search-wrap-pro">
                <Search size={16} />
                <input 
                    type="text" 
                    placeholder="Search instrument..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button className="filter-btn-pro"><Filter size={18} /></button>
        </div>
      </div>

      <div className="markets-pro-layout">
        <div className="main-matrix">
           <div className="matrix-controls">
                <div className="control-tabs">
                    <button className="active">All Assets</button>
                    <button>Technology</button>
                    <button>Indices</button>
                </div>
                <div className="matrix-stats">
                    <span className="text-muted">Tracking: </span>
                    <span className="font-bold">2,482 Instruments</span>
                </div>
           </div>

           <div className="matrix-grid">
                <AnimatePresence>
                    {filteredData.map(data => (
                        <MarketChip key={data.symbol} data={data} isLive={isLive} />
                    ))}
                </AnimatePresence>
           </div>
        </div>

        <div className="side-intelligence">
            <div className="intelligence-card glass-card">
                <div className="int-header">
                    <Activity size={18} className="text-orange" />
                    <h4>HFT Event Log</h4>
                </div>
                <div className="log-list-pro">
                    {filteredData.slice(0, 8).map((m, i) => (
                        <div key={i} className="log-item-pro">
                            <span className="time">{new Date().toLocaleTimeString(undefined, {hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit'})}</span>
                            <span className="symbol">{m.symbol}</span>
                            <span className={`action ${Math.random() > 0.5 ? 'buy' : 'sell'}`}>
                                {Math.random() > 0.4 ? 'LIMIT' : 'MARKET'}
                            </span>
                            <span className="shares">{(Math.random()*1000).toFixed(0)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="intelligence-card glass-card mt-5">
                <div className="int-header">
                    <BarChart3 size={18} className="text-cyan" />
                    <h4>Volatility Heatmap</h4>
                </div>
                <div className="heatmap-pro">
                    {/* Simulated heatmap blocks */}
                    {Array.from({length: 12}).map((_, i) => (
                        <div 
                            key={i} 
                            className="heatmap-block" 
                            style={{ 
                                opacity: 0.3 + Math.random() * 0.7,
                                backgroundColor: Math.random() > 0.5 ? 'var(--status-up)' : 'var(--status-down)'
                            }}
                        ></div>
                    ))}
                </div>
                <p className="text-xs text-muted mt-3">Calculated real-time via VIX & Skew metrics.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
