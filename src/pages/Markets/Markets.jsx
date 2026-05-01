import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
const AreaChart = lazy(() => import('recharts').then(mod => ({ default: mod.AreaChart })));
const Area = lazy(() => import('recharts').then(mod => ({ default: mod.Area })));
const ResponsiveContainer = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));
import { 
  Activity, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, 
  Globe, Search, Filter, BarChart3, Zap, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Sparkline from '../../components/Sparkline';
import './Markets.css';

const MOCK_TICKERS = [
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 175.50, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft', basePrice: 410.20, sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA', basePrice: 890.50, sector: 'Semiconductor' },
  { symbol: 'TSLA', name: 'Tesla', basePrice: 215.30, sector: 'Automotive' },
  { symbol: 'AMZN', name: 'Amazon', basePrice: 145.20, sector: 'E-commerce' },
  { symbol: 'META', name: 'Meta', basePrice: 480.10, sector: 'Technology' },
  { symbol: 'AMD', name: 'AMD', basePrice: 178.90, sector: 'Semiconductor' },
  { symbol: 'JPM', name: 'JPMorgan Chase', basePrice: 195.40, sector: 'Financials' },
  { symbol: 'GS', name: 'Goldman Sachs', basePrice: 410.60, sector: 'Financials' },
  { symbol: 'COIN', name: 'Coinbase', basePrice: 250.20, sector: 'Crypto' },
  { symbol: 'BTC/USD', name: 'Bitcoin', basePrice: 65420.00, sector: 'Crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum', basePrice: 3450.10, sector: 'Crypto' },
  { symbol: 'GLD', name: 'SPDR Gold Trust', basePrice: 215.80, sector: 'Commodities' },
  { symbol: 'USO', name: 'US Oil Fund', basePrice: 78.40, sector: 'Commodities' },
  { symbol: 'SPY', name: 'S&P 500 ETF', basePrice: 512.30, sector: 'Indices' }
];

const INDICES = [
  { symbol: 'S&P 500', val: '5,123.45', change: '+0.85%', isUp: true },
  { symbol: 'NASDAQ', val: '16,234.10', change: '-0.32%', isUp: false },
  { symbol: 'DOW', val: '38,714.77', change: '+0.12%', isUp: true },
  { symbol: 'VIX', val: '14.22', change: '-5.20%', isUp: false },
  { symbol: 'US 10Y', val: '4.21%', change: '+0.01', isUp: true },
];

const generateHistory = (basePrice) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    price: basePrice + (Math.random() - 0.5) * 4
  }));
};

const MarketChip = ({ data, isLive }) => {
  const isUp = data.change >= 0;
  return (
    <motion.div 
      className="market-card-premium glass-panel"
      whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.3)' }}
    >
      <div className="mc-premium-header">
        <div className="mc-premium-id">
            <span className="mc-premium-symbol">{data.symbol}</span>
            <span className="mc-premium-name">{data.name}</span>
        </div>
        <div className={`mc-premium-indicator ${isUp ? 'bg-up-light' : 'bg-down-light'}`}>
            {isUp ? <TrendingUp size={16} className="text-up" /> : <TrendingDown size={16} className="text-down" />}
        </div>
      </div>
      
      <div className="mc-premium-body">
         <div className={`mc-premium-price ${data.pulseDir ? `flash-${data.pulseDir}` : ''}`}>
           ${data.price.toFixed(2)}
         </div>
         <div className={`mc-premium-change ${isUp ? 'text-up' : 'text-down'}`}>
           {isUp ? '+' : ''}{data.change.toFixed(2)}%
         </div>
      </div>

      <div className="mc-premium-chart">
         <Sparkline 
            data={data.history} 
            color={isUp ? '#10b981' : '#ef4444'} 
         />
      </div>

      <div className="mc-premium-footer">
          <div className="mc-premium-stat">
              <span>Volume</span>
              <span className="val">{(Math.random() * 5 + 1).toFixed(1)}M</span>
          </div>
          <div className="mc-premium-stat">
              <span>RSI</span>
              <span className="val text-muted">{(40 + Math.random() * 30).toFixed(0)}</span>
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
  const [activeCategory, setActiveCategory] = useState('All');
  const [hftLogs, setHftLogs] = useState([]);

  // Stability for random nodes to avoid hydration mismatch
  const heatNodes = useMemo(() => Array.from({length: 16}).map(() => ({
    id: crypto.randomUUID(),
    opacity: 0.4 + Math.random() * 0.6,
    isUp: Math.random() > 0.5
  })), []);

  // Generate ultra-fast trade blocks
  useEffect(() => {
    if (!isLive) return;
    const logInterval = setInterval(() => {
       const asset = MOCK_TICKERS[Math.floor(Math.random() * MOCK_TICKERS.length)].symbol;
       const isBuy = Math.random() > 0.5;
       const price = (Math.random() * 500 + 50).toFixed(2);
       const d = new Date();
       const newLog = {
         id: Math.random().toString(36).substring(2, 10).toUpperCase(),
         time: d.toLocaleTimeString(undefined, {hour12: false}) + '.' + d.getMilliseconds().toString().padStart(3, '0'),
         symbol: asset,
         action: isBuy ? 'BUY' : 'SELL',
         shares: (Math.random() * 25000 + 100).toFixed(0),
         price: price
       };
       setHftLogs(prev => [newLog, ...prev].slice(0, 8)); // Maintain latest 8 trades
    }, 400);

    return () => clearInterval(logInterval);
  }, [isLive]);

  // Simulate price ticks
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
            history: [...stock.history.slice(1), {time: Date.now(), val: newPrice}],
            pulseDir: shift > 0 ? 'up' : 'down'
          };
        }
        return { ...stock, pulseDir: null };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredData = marketsData.filter(m => {
    const matchesSearch = m.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || m.sector === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getHeatNodeStyle = (node) => ({
    opacity: node.opacity,
    background: node.isUp 
        ? 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.8))'
        : 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.8))'
  });

  return (
    <div className="markets-premium-container animate-fade-in">
      
      {/* Background Orbs */}
      <div className="premium-home-bg">
         <div className="home-glow home-glow-1"></div>
         <div className="home-glow home-glow-2"></div>
      </div>

      <div className="markets-content-wrapper">
        
        {/* Indices Bar */}
        <div className="indices-bar-premium glass-panel">
          <div className="indices-scroll">
            {INDICES.map(idx => (
                <div key={idx.symbol} className="index-pill-premium">
                    <span className="idx-label">{idx.symbol}</span>
                    <span className="idx-val">{idx.val}</span>
                    <span className={`idx-change ${idx.isUp ? 'text-up' : 'text-down'}`}>
                      {idx.change}
                    </span>
                </div>
            ))}
          </div>
          <div className="feed-status-premium">
              <span className={`status-dot ${isLive ? 'dot-live' : 'dot-paused'}`}></span>
              <span>{isLive ? 'LIVE FEED' : 'PAUSED'}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="page-header-premium">
          <div className="header-titles">
              <Globe className="text-brand" size={28} />
              <div>
                  <h1>Global Markets</h1>
                  <p>Real-time pricing, liquidity metrics, and market momentum.</p>
              </div>
          </div>

          <div className="header-actions-premium">
              <div className="search-box-premium">
                  <Search size={18} className="text-muted" />
                  <input 
                      type="text" 
                      placeholder="Search ticker or company..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
              <button 
                  className={`btn-icon-premium ${isLive ? 'active-feed' : ''}`}
                  onClick={() => setIsLive(!isLive)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsLive(!isLive)}
                  role="switch"
                  aria-checked={isLive}
                  title="Toggle Live Feed"
                  aria-label="Toggle Live Feed"
              >
                  <Zap size={18} />
              </button>
              <button className="btn-icon-premium">
                  <SlidersHorizontal size={18} />
              </button>
          </div>
        </div>

        <div className="markets-layout-grid">
          
          {/* Main Matrix */}
          <div className="matrix-col-main">
             <div className="matrix-filters-premium">
                  <div className="filter-tabs">
                      {['All', 'Technology', 'Semiconductor', 'Financials', 'Crypto', 'Commodities'].map(cat => (
                          <button
                              key={cat}
                              className={activeCategory === cat ? 'active' : ''}
                              onClick={() => setActiveCategory(cat)}
                          >{cat}</button>
                      ))}
                  </div>
                  <div className="matrix-count">
                      <span>{filteredData.length}</span> Assets Tracked
                  </div>
             </div>

             <div className="market-cards-grid">
                  <AnimatePresence>
                      {filteredData.map((data, i) => (
                          <motion.div
                             key={data.symbol}
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 0.95 }}
                             transition={{ delay: i * 0.05 }}
                          >
                            <MarketChip data={data} isLive={isLive} />
                          </motion.div>
                      ))}
                  </AnimatePresence>
             </div>
          </div>

          {/* Side Intelligence */}
          <div className="matrix-col-side">
              
              {/* Live Order Flow */}
              <div className="glass-panel side-panel-premium">
                  <div className="panel-header border-bottom">
                      <div className="panel-title">
                          <Activity size={18} className="text-orange" />
                          <h3>Live Order Flow</h3>
                      </div>
                  </div>
                  <div className="live-trades-list">
                      {hftLogs.map((log, i) => (
                          <div key={log.id} className="trade-row-premium">
                              <div className="trade-meta">
                                  <span className="trade-time">{log.time}</span>
                                  <span className="trade-sym">{log.symbol}</span>
                              </div>
                              <div className="trade-details">
                                  <span className={`trade-action ${log.action === 'BUY' ? 'bg-up-light text-up' : 'bg-down-light text-down'}`}>
                                      {log.action}
                                  </span>
                                  <span className="trade-size">{log.shares}</span>
                                  <span className="trade-price">${log.price}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Market Heatmap */}
              <div className="glass-panel side-panel-premium">
                  <div className="panel-header border-bottom">
                      <div className="panel-title">
                          <BarChart3 size={18} className="text-cyan" />
                          <h3>Volatility Map</h3>
                      </div>
                  </div>
                  <div className="heatmap-container-premium">
                      {heatNodes.map((node) => (
                          <div 
                              key={node.id} 
                              className="heat-node" 
                              style={getHeatNodeStyle(node)}
                          ></div>
                      ))}
                  </div>
                  <div className="heatmap-legend">
                      <span className="text-muted text-xs">Selling Pressure</span>
                      <div className="legend-gradient"></div>
                      <span className="text-muted text-xs">Buying Pressure</span>
                  </div>
              </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Markets;
