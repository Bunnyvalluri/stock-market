import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Activity, Cpu, Newspaper, DollarSign, Globe, Shield, 
  Zap, BarChart3, Clock, Bell, Settings, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchGlobalQuote } from '../../services/alphaVantage';

import socket from '../../services/socketClient';
import './Home.css';


// Professional Institutional Mock Data
const mainChartData = Array.from({ length: 40 }, (_, i) => ({
  date: new Date(Date.now() - (39 - i) * 60 * 60 * 24 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  price: 15420 + Math.random() * 800 + (i * 50),
  volume: 1500000 + Math.random() * 2000000,
  rsi: 30 + Math.random() * 40
}));

const initialMarketOverview = [
  { symbol: 'SPX', name: 'S&P 500 Index', price: 5123.45, change: 1.25, isUp: true, vol: '2.4B' },
  { symbol: 'IXIC', name: 'NASDAQ Composite', price: 16234.10, change: -0.45, isUp: false, vol: '4.1B' },
  { symbol: 'DJI', name: 'Dow Jones Industrial', price: 38920.15, change: 0.88, isUp: true, vol: '1.2B' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 890.10, change: 5.72, isUp: true, vol: '850M' },
  { symbol: 'BTC', name: 'Bitcoin', price: 68420.50, change: 2.10, isUp: true, vol: '24B' },
];

const newsArticles = [
  { id: 1, source: 'Reuters', title: 'Global Markets Rally on Cooling Inflation Data', sentiment: 'BULLISH', time: '12m ago', impact: 'High' },
  { id: 2, source: 'Bloomberg', title: 'Tech Sector Outlook Upgraded Amid AI Integration', sentiment: 'BULLISH', time: '1h ago', impact: 'Medium' },
  { id: 3, source: 'WSJ', title: 'Oil Supply Tightens as Strategic Reserves Dwindle', sentiment: 'BEARISH', time: '3h ago', impact: 'Low' }
];

const SentimentMeter = ({ value = 75 }) => (
  <div className="sentiment-meter-wrap mt-4">
     <div className="label-group flex-between">
        <span className="text-muted text-xs font-bold uppercase tracking-widest">Aggregate Signal Conviction</span>
        <span className="text-brand font-mono text-xs">74.2%</span>
     </div>
     <div className="meter-track-pro">
        <div className="meter-fill-pro" style={{ width: '74.2%' }}></div>
        <div className="meter-marker-up" style={{ left: '74.2%' }}></div>
     </div>
     <div className="scale-labels flex-between mt-1 px-1">
        <span className="scale-item text-down">Fear</span>
        <span className="scale-item text-muted">Neutral</span>
        <span className="scale-item text-up">Greed</span>
     </div>
  </div>
);


const StatCard = ({ title, value, change, isUp, icon, glowColor }) => (
  <motion.div 
    className="stat-card terminal-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    style={{ '--card-accent': glowColor }}
  >
    <div className="stat-header">
      <div className="stat-info">
        <span className="stat-label">{title}</span>
        <h3 className="stat-value">{value}</h3>
      </div>
      <div className="stat-icon-gate" style={{ backgroundColor: `${glowColor}15`, color: glowColor }}>
        {icon}
      </div>
    </div>
    <div className="stat-footer">
      <div className={`stat-trend ${isUp ? 'trend-up' : 'trend-down'}`}>
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{change}</span>
      </div>
      <div className="stat-mini-graph">
        {/* Placeholder for a tiny sparkline */}
        <div className="spark-bar" style={{ height: '30%', width: '4px' }}></div>
        <div className="spark-bar" style={{ height: '50%', width: '4px' }}></div>
        <div className="spark-bar" style={{ height: '80%', width: '4px' }}></div>
        <div className="spark-bar" style={{ height: '60%', width: '4px' }}></div>
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const [marketOverview, setMarketOverview] = useState(initialMarketOverview);
  const [orderBook, setOrderBook] = useState({
    asks: Array.from({ length: 8 }, (_, i) => ({ price: 890.10 + (i * 0.15), size: Math.random() * 12 + 0.5 })),
    bids: Array.from({ length: 8 }, (_, i) => ({ price: 890.00 - (i * 0.15), size: Math.random() * 12 + 0.5 }))
  });
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [systemHealth, setSystemHealth] = useState(99.98);
  const [latency, setLatency] = useState(14); // OSI Layer 7: Application Latency RTT

  // RTT Monitoring Logic
  useEffect(() => {
    const pingInterval = setInterval(async () => {
      const start = Date.now();
      try {
        await fetch('http://localhost:5000/api/ping');
        setLatency(Date.now() - start);
      } catch (e) { /* ignore */ }
    }, 5000);
    return () => clearInterval(pingInterval);
  }, []);

  // ⚡ Phase 2: Live WebSocket Subscription Engine
  useEffect(() => {
    // 1. Subscribe to all core tickers
    initialMarketOverview.forEach(m => socket.emit('subscribe:stock', m.symbol));

    // 2. Listen for real-time price ticks from Backend Poller
    socket.on('price:update', (data) => {
      setMarketOverview(prev => prev.map(stock => {
         if (stock.symbol === data.symbol) {
             const flash = data.price > stock.price ? 'up' : 'down';
             return { ...stock, ...data, flash };
         }
         return stock;
      }));
    });

    // Clean up on unmount
    return () => {
      initialMarketOverview.forEach(m => socket.emit('unsubscribe:stock', m.symbol));
      socket.off('price:update');
    };
  }, []);

  // High Frequency Simulation Logic (Non-Price Elements)
  useEffect(() => {
    const streamInterval = setInterval(() => {
      // 1. Stream Order Book (L2 Simulation)
      setOrderBook(prev => ({
        asks: prev.asks.map(a => ({ ...a, size: Math.abs(a.size + (Math.random() - 0.5) * 1.5) })),
        bids: prev.bids.map(b => ({ ...b, size: Math.abs(b.size + (Math.random() - 0.5) * 1.5) }))
      }));

      // 2. Jitter System Health
      setSystemHealth(prev => (99.95 + Math.random() * 0.04).toFixed(2));
    }, 1000);

    return () => clearInterval(streamInterval);
  }, []);


  const handleAnalyzeArticle = async (id, title) => {
    setAnalyzingId(id);
    
    const mockUrls = {
      1: "https://finance.yahoo.com/news/stock-market-news-today-latest-updates.html",
      2: "https://www.cnbc.com/technology/",
      3: "https://www.wsj.com/finance/commodities-news"
    };

    try {
      const response = await fetch('http://localhost:8000/sentiment/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: mockUrls[id] || "https://finance.yahoo.com" })
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        setAnalysisResults(prev => ({
          ...prev,
          [id]: {
            sentiment: data.sentiment,
            confidence: (data.confidence * 100).toFixed(1),
            takeaway: data.takeaway
          }
        }));
      } else {
        throw new Error(data.error || "Extraction failed");
      }
    } catch (error) {
      console.warn("FastAPI backend error, falling back to UI simulation:", error);
      // Fallback for demo purposes if backend is offline
      await new Promise(r => setTimeout(r, 1500));
      setAnalysisResults(prev => ({
          ...prev,
          [id]: {
              sentiment: Math.random() > 0.4 ? 'BULLISH' : 'BEARISH',
              confidence: (88 + Math.random() * 11).toFixed(1),
              takeaway: `[MOCK] Algorithmic analysis of ${title.substring(0, 15)}... indicates significant institutional accumulation patterns.`
          }
      }));
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="terminal-container animate-fade-in">
      {/* Institutional Top Navigation Bar */}
      <div className="terminal-topbox glass">
        <div className="terminal-status-group">
          <div className="status-item">
            <Globe size={14} className="text-brand" />
            <span className="text-muted">Global Markets:</span>
            <span className="text-up font-bold">OPEN</span>
          </div>
          <div className="status-item">
            <Shield size={14} className="text-cyan" />
            <span className="text-muted">Security:</span>
            <span className="text-primary font-bold">SECURED</span>
          </div>
          <div className="status-item" title="OSI L7 Round-Trip Time Check">
            <Clock size={14} className="text-orange" />
            <span className="text-muted">Latency:</span>
            <span className="text-brand font-mono">{latency}ms</span>
          </div>

        </div>
        <div className="terminal-actions">
           <Bell size={18} className="icon-btn text-muted" style={{cursor: 'pointer'}} onClick={() => toast('No new high-priority alerts.', {icon: '🔔'})} />
           <Settings size={18} className="icon-btn text-muted" style={{cursor: 'pointer'}} onClick={() => toast.loading('Initializing workspace settings...', {duration: 1000})} />
           <div className="system-health">
              <span className="health-label">Compute Node:</span>
              <span className="health-value text-gradient">{systemHealth}%</span>
           </div>
        </div>
      </div>

      {/* Dynamic Market Ticker */}
      <div className="market-ticker-wrap">
        <div className="ticker-scroll">
          {[...marketOverview, ...marketOverview].map((m, i) => (
            <div key={i} className="ticker-chip">
              <span className="chip-symbol">{m.symbol}</span>
              <span className={`chip-price ${m.flash === 'up' ? 'flash-up' : m.flash === 'down' ? 'flash-down' : ''}`}>
                {m.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className={`chip-change ${m.isUp ? 'text-up' : 'text-down'}`}>
                {m.isUp ? '▲' : '▼'}{Math.abs(m.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Global Stat Dashboard */}
      <div className="terminal-stats-grid">
        <StatCard 
            title="Total Assets Managed" 
            value="$1.24M" 
            change="+12.4% (MTD)" 
            isUp={true} 
            icon={<DollarSign size={20} />} 
            glowColor="#2563eb" 
        />
        <StatCard 
            title="S&P 500 Performance" 
            value="5,123.45" 
            change="+0.82% Today" 
            isUp={true} 
            icon={<TrendingUp size={20} />} 
            glowColor="#10b981" 
        />
        <StatCard 
            title="Active Risk Vectors" 
            value="3 High / 12 Low" 
            change="-2 Alerts" 
            isUp={true} 
            icon={<Shield size={20} />} 
            glowColor="#0e7490" 
        />
        <StatCard 
            title="Global Sentiment" 
            value="Greed (74)" 
            change="Institutional Bias" 
            isUp={true} 
            icon={<Activity size={20} />} 
            glowColor="#10b981" 
        />
      </div>


      {/* Main Terminal Layout */}
      <div className="terminal-main-layout">
        
        {/* Left: Main Charting & Heatmap */}
        <div className="terminal-col-left">
          <div className="terminal-card glass-card main-chart-box">
             <div className="card-header-term">
                <div className="header-left">
                    <BarChart3 size={18} className="text-brand" />
                    <h4>Market Intelligence Overview</h4>
                </div>
                <div className="header-right">
                    <div className="term-pills">
                        {['1D', '1W', '1M', '3M', 'YTD'].map(p => (
                            <button key={p} className={p === '1M' ? 'active' : ''} onClick={() => toast(`Rendering ${p} historical volume profile.`, {icon: '📊'})}>{p}</button>
                        ))}
                    </div>
                </div>
             </div>
             
             <div className="chart-viewport">
                <ResponsiveContainer width="100%" height={380}>
                    <AreaChart data={mainChartData}>
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-brand)" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="var(--accent-brand)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: 'var(--text-muted)', fontSize: 11}} 
                            minTickGap={40}
                        />
                        <YAxis 
                            orientation="right" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: 'var(--text-muted)', fontSize: 11}} 
                            domain={['auto', 'auto']}
                        />
                        <Tooltip 
                            contentStyle={{ background: '#121212', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="var(--accent-brand)" strokeWidth={3} fill="url(#chartGrad)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bottom-row-term">
             <div className="terminal-card sector-watch glass-card">
                <div className="card-header-term">
                    <Globe size={16} className="text-cyan" />
                    <h4>Sector Saturation</h4>
                </div>
                <div className="sector-grid">
                    {[
                        {n: 'Tech', v: '+2.1%', up: true}, {n: 'Finance', v: '-0.4%', up: false},
                        {n: 'Energy', v: '+0.8%', up: true}, {n: 'Healthcare', v: '-1.2%', up: false}
                    ].map(s => (
                        <div key={s.n} className="sector-pill">
                            <span className="sector-name">{s.n}</span>
                            <span className={`sector-val ${s.up ? 'up' : 'down'}`}>{s.v}</span>
                        </div>
                    ))}
                </div>
             </div>
             
             <div className="terminal-card hft-log glass-card">
                <div className="card-header-term">
                    <Activity size={16} className="text-orange" />
                    <h4>System Logs / HFT Stream</h4>
                </div>
                <div className="log-stream">
                    <div className="log-line"><span>14:22:10</span> <span className="text-brand">[BRIDGE]</span> Executing Limit Order #8841-A</div>
                    <div className="log-line"><span>14:22:11</span> <span className="text-cyan">[ML_NODE]</span> Sentiment Re-indexed for AAPL</div>
                    <div className="log-line"><span>14:22:12</span> <span className="text-up">[SIGNAL]</span> Strong Accumulation in NVDA detected</div>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Order Book & Intelligence */}
        <div className="terminal-col-right">
          
          <div className="terminal-card order-book-box glass-card">
             <div className="card-header-term">
                <Zap size={16} className="text-orange" />
                <h4>Live Match Engine (L2)</h4>
             </div>
             <div className="ob-table-terminal">
                <div className="ob-head-term"><span>Price</span><span>Size</span><span>Total</span></div>
                <div className="ob-group asks">
                    <AnimatePresence>
                        {orderBook.asks.slice().reverse().map((a, i) => (
                            <div key={`ask-${i}`} className="ob-row-term ask">
                                <span className="price">{a.price.toFixed(2)}</span>
                                <span className="size font-mono">{a.size.toFixed(4)}</span>
                                <div className="bar-bg" style={{ width: `${(a.size/12)*100}%` }}></div>
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="ob-spread-term">
                    <span className="spread-label">MID MARKET:</span>
                    <span className="spread-value">890.05</span>
                </div>
                <div className="ob-group bids">
                    {orderBook.bids.map((b, i) => (
                        <div key={`bid-${i}`} className="ob-row-term bid">
                            <span className="price">{b.price.toFixed(2)}</span>
                            <span className="size font-mono">{b.size.toFixed(4)}</span>
                            <div className="bar-bg" style={{ width: `${(b.size/12)*100}%` }}></div>
                        </div>
                    ))}
                </div>
             </div>
          </div>

          <div className="terminal-card ai-intelligence glass-card">
             <div className="card-header-term">
                <Newspaper size={16} className="text-brand" />
                <h4>Institutional Intelligence</h4>
             </div>
             <div className="term-news-feed">
                {newsArticles.map(article => (
                    <div key={article.id} className="term-news-item" onClick={() => handleAnalyzeArticle(article.id, article.title)}>
                        <div className="news-meta-term">
                            <span className="source">{article.source}</span>
                            <span className="impact" style={{ color: article.impact === 'High' ? 'var(--status-down)' : 'var(--text-muted)' }}>
                                {article.impact} Impact
                            </span>
                        </div>
                        <p className="news-title-term">{article.title}</p>
                        
                        {analyzingId === article.id ? (
                            <div className="term-analysis-pulse">
                                <div className="pulse-dot"></div>
                                <span>Deep-Indexing via Firecrawl...</span>
                            </div>
                        ) : analysisResults[article.id] ? (
                            <div className="term-analysis-result animate-fade-in">
                                <span className={`term-tag ${analysisResults[article.id].sentiment === 'BULLISH' ? 'tag-up' : 'tag-down'}`}>
                                    {analysisResults[article.id].sentiment}
                                </span>
                                <p>{analysisResults[article.id].takeaway}</p>
                            </div>
                        ) : (
                            <div className="news-cta-term">Tap for AI Sentiment Extraction</div>
                        )}
                    </div>
                ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;
