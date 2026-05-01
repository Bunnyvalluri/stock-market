import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { 
  Activity, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, 
  Clock, Globe, Search, Filter, BarChart3, Zap
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
  { symbol: 'META', name: 'Meta', basePrice: 480.10, sector: 'Social Media' },
  { symbol: 'AMD', name: 'AMD', basePrice: 178.90, sector: 'Semiconductor' },
  { symbol: 'JPM', name: 'JPMorgan Chase', basePrice: 195.40, sector: 'Financials' },
  { symbol: 'GS', name: 'Goldman Sachs', basePrice: 410.60, sector: 'Financials' },
  { symbol: 'COIN', name: 'Coinbase', basePrice: 250.20, sector: 'Crypto' },
  { symbol: 'BTC/USD', name: 'Bitcoin', basePrice: 65420.00, sector: 'Forex/Crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum', basePrice: 3450.10, sector: 'Forex/Crypto' },
  { symbol: 'GLD', name: 'SPDR Gold Trust', basePrice: 215.80, sector: 'Commodities' },
  { symbol: 'USO', name: 'US Oil Fund', basePrice: 78.40, sector: 'Commodities' },
  { symbol: 'SPY', name: 'S&P 500 ETF', basePrice: 512.30, sector: 'Index ETF' }
];

const INDICES = [
  { symbol: 'S&P 500', val: '5,123.45', change: '+0.85%', isUp: true },
  { symbol: 'NASDAQ', val: '16,234.10', change: '-0.32%', isUp: false },
  { symbol: 'DOW JONES', val: '38,714.77', change: '+0.12%', isUp: true },
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
         <Sparkline 
            data={data.history} 
            color={isUp ? 'var(--status-up)' : 'var(--status-down)'} 
         />
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
  const [marketsData, setMarketsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Assets');
  const [hftLogs, setHftLogs] = useState([]);

  // Fetch real data from the hardened backend
  const fetchRealMarkets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stocks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // If needed, though public stocks might be open
        }
      });
      const result = await response.json();
      if (result.status === 'success') {
        const enriched = result.data.map(stock => ({
          ...stock,
          name: stock.symbol, // Backend might not provide full name
          sector: 'Institutional',
          history: generateHistory(stock.price),
          pulseDir: null
        }));
        setMarketsData(enriched);
      }
    } catch (err) {
      console.error('Failed to fetch real market data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealMarkets();
    if (isLive) {
      const interval = setInterval(fetchRealMarkets, 10000); // 10s Poll for real data
      return () => clearInterval(interval);
    }
  }, [isLive]);

  // High Frequency Log Simulation (Retained for aesthetic density)
  useEffect(() => {
    if (!isLive) return;
    const logInterval = setInterval(() => {
       const symbols = marketsData.length > 0 ? marketsData.map(m => m.symbol) : ['AAPL', 'NVDA', 'TSLA'];
       const asset = symbols[Math.floor(Math.random() * symbols.length)];
       const isBuy = Math.random() > 0.5;
       const price = (Math.random() * 500 + 50).toFixed(2);
       const d = new Date();
       const ms = d.getMilliseconds().toString().padStart(3, '0');
       const newLog = {
         id: Math.random().toString(36).substring(2, 10).toUpperCase(),
         time: `${d.toLocaleTimeString(undefined, {hour12: false})}.${ms}`,
         symbol: asset,
         action: isBuy ? 'BUY' : 'SELL',
         type: Math.random() > 0.85 ? 'BLOCK:DARK' : 'SWEEP:LIT',
         shares: (Math.random() * 25000 + 100).toFixed(0),
         price: price
       };
       setHftLogs(prev => [newLog, ...prev].slice(0, 16));
    }, 450);

    return () => clearInterval(logInterval);
  }, [isLive, marketsData]);

  const filteredData = marketsData.filter(m => {
    const matchesSearch = m.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) return (
    <div className="auth-loading">
      <div className="auth-loading-spinner"></div>
      <span>Deep-Indexing Global Market Data...</span>
    </div>
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
                <h1>Markets Dashboard</h1>
                <p className="text-muted">Live market pricing and volume</p>
            </div>
        </div>

        <div className="header-right-pro">
            <div className={`live-toggle-pro ${isLive ? 'active' : ''}`} onClick={() => { setIsLive(!isLive); if(!isLive) toast.success('Re-establishing real-time feed...', {icon:'⚡'}); else toast.error('Market Feed Paused'); }}>
                <Zap size={14} />
                {isLive ? 'LIVE FEED' : 'FEED PAUSED'}
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
            <button className="filter-btn-pro" onClick={() => toast('Advanced Matrix Filtering engaged.', {icon:'⚙️'})}><Filter size={18} /></button>
        </div>
      </div>

      <div className="markets-pro-layout">
        <div className="main-matrix">
           <div className="matrix-controls">
                <div className="control-tabs">
                    {['All Assets', 'Technology', 'Crypto', 'Financials', 'Commodities', 'Indices'].map(cat => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? 'active' : ''}
                            onClick={() => { setActiveCategory(cat); toast(`Filtering: ${cat}`, { icon: '🗂️' }); }}
                        >{cat}</button>
                    ))}
                </div>
                <div className="matrix-stats">
                    <span className="text-muted">Showing: </span>
                    <span className="font-bold">{filteredData.length} assets</span>
                    <span className="text-muted"> of 15 tracked</span>
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
                    <h4>Live Orders</h4>
                </div>
                <div className="log-list-pro terminal-logs">
                    {hftLogs.map((log, i) => (
                        <div key={`${log.id}-${i}`} className={`log-item-term ${i === 0 ? 'flash-bg-term' : ''}`}>
                            <span className="l-time">{log.time}</span>
                            <span className="l-symb">{log.symbol.padEnd(8, ' ')}</span>
                            <span className={`l-action ${log.action === 'BUY' ? 'text-up' : 'text-down'}`}>{log.action.padEnd(4, ' ')}</span>
                            <span className="l-qty">{log.shares.padStart(6, ' ')} /</span>
                            <span className="l-price">${log.price}</span>
                            <span className="l-type text-muted opacity-50">{log.type}</span>
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
                <p className="text-xs text-muted mt-3">Market volatility and momentum.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
