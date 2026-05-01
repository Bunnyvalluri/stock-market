import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
const AreaChart = lazy(() => import('recharts').then(mod => ({ default: mod.AreaChart })));
const Area = lazy(() => import('recharts').then(mod => ({ default: mod.Area })));
const XAxis = lazy(() => import('recharts').then(mod => ({ default: mod.XAxis })));
const YAxis = lazy(() => import('recharts').then(mod => ({ default: mod.YAxis })));
const Tooltip = lazy(() => import('recharts').then(mod => ({ default: mod.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));
const CartesianGrid = lazy(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })));
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Activity, Cpu, Newspaper, DollarSign, Globe, Shield, 
  Zap, BarChart3, Clock, Bell, Settings, Layers, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import socket from '../../services/socketClient';
import './Home.css';

// Premium SaaS Mock Data
const mainChartData = Array.from({ length: 40 }, (_, i) => ({
  date: new Date(Date.now() - (39 - i) * 60 * 60 * 24 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  price: 15420 + Math.random() * 800 + (i * 50),
  volume: 1500000 + Math.random() * 2000000,
}));

const initialMarketOverview = [
  { symbol: 'SPX', name: 'S&P 500', price: 5123.45, change: 1.25, isUp: true },
  { symbol: 'IXIC', name: 'NASDAQ', price: 16234.10, change: -0.45, isUp: false },
  { symbol: 'DJI', name: 'Dow Jones', price: 38920.15, change: 0.88, isUp: true },
  { symbol: 'NVDA', name: 'NVIDIA', price: 890.10, change: 5.72, isUp: true },
  { symbol: 'BTC', name: 'Bitcoin', price: 68420.50, change: 2.10, isUp: true },
];

const newsArticles = [
  { id: 1, source: 'Reuters', title: 'Global Markets Rally on Cooling Inflation Data', sentiment: 'BULLISH', time: '12m ago', impact: 'High' },
  { id: 2, source: 'Bloomberg', title: 'Tech Sector Outlook Upgraded Amid AI Integration', sentiment: 'BULLISH', time: '1h ago', impact: 'Medium' },
  { id: 3, source: 'WSJ', title: 'Oil Supply Tightens as Strategic Reserves Dwindle', sentiment: 'BEARISH', time: '3h ago', impact: 'Low' }
];

const Sparkline = ({ data, color }) => (
  <div style={{ width: '100px', height: '40px' }}>
    <Suspense fallback={<div className="h-full w-full bg-slate-800/20 animate-pulse rounded" />}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
          type="monotone" 
          dataKey="val" 
          stroke={color} 
          fill={`url(#grad-${color})`} 
          strokeWidth={2} 
          dot={false}
          isAnimationActive={true}
        />
      </AreaChart>
    </ResponsiveContainer>
    </Suspense>
  </div>
);

const StatCard = ({ title, value, change, isUp, icon, glowColor, delay }) => {
  const sparkData = useMemo(() => Array.from({ length: 15 }, () => ({ val: 50 + Math.random() * 50 })), []);
  
  return (
    <motion.div 
      className="stat-card-premium"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="stat-header-premium">
        <div className="stat-icon-wrapper" style={{ color: glowColor, background: `rgba(${glowColor === '#10b981' ? '16, 185, 129' : glowColor === '#3b82f6' ? '59, 130, 246' : '14, 116, 144'}, 0.1)` }}>
          {icon}
        </div>
        <div className={`stat-trend-premium ${isUp ? 'trend-up' : 'trend-down'}`}>
          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{change}</span>
        </div>
      </div>
      <div className="stat-body-premium">
        <span className="stat-label-premium">{title}</span>
        <h3 className="stat-value-premium">{value}</h3>
      </div>
      <div className="stat-footer-premium">
        <Sparkline data={sparkData} color={glowColor} />
      </div>
    </motion.div>
  );
};

const Home = () => {
  const [marketOverview, setMarketOverview] = useState(initialMarketOverview);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [latency, setLatency] = useState(14);

  // Ping for latency
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

  // WebSocket Simulation / Connection
  useEffect(() => {
    initialMarketOverview.forEach(m => socket.emit('subscribe:stock', m.symbol));
    socket.on('price:update', (data) => {
      setMarketOverview(prev => prev.map(stock => {
         if (stock.symbol === data.symbol) {
             const flash = data.price > stock.price ? 'up' : 'down';
             return { ...stock, ...data, flash };
         }
         return stock;
      }));
    });
    return () => {
      initialMarketOverview.forEach(m => socket.emit('unsubscribe:stock', m.symbol));
      socket.off('price:update');
    };
  }, []);

  const handleAnalyzeArticle = async (id, title) => {
    setAnalyzingId(id);
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulate AI processing
      setAnalysisResults(prev => ({
          ...prev,
          [id]: {
              sentiment: Math.random() > 0.4 ? 'BULLISH' : 'BEARISH',
              takeaway: `Algorithmic analysis of "${title.substring(0, 20)}..." indicates strong institutional conviction. Proceed with weighted allocation.`
          }
      }));
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDownloadReport = () => {
    toast('Preparing institutional Excel report...', { icon: '📊' });
    
    // Formatting data as a CSV for Excel compatibility
    const csvContent = [
      ["STOCKMIND AI - QUANTITATIVE INSIGHT REPORT"],
      ["Generated", new Date().toLocaleString()],
      ["Classification", "CONFIDENTIAL"],
      [],
      ["METRIC", "VALUE", "CONFIDENCE / NOTES"],
      ["Market Sentiment", "BULLISH DIVERGENCE", "Detected in large-cap technology sector"],
      ["Breakout Probability", "78%", "Historical analogue projection"],
      ["Expected Timeframe", "3 Sessions", "Above 50-day moving average"],
      [],
      ["EXECUTIVE SUMMARY"],
      ["Our models detect a bullish divergence in large-cap tech. Historical analogues suggest a 78% probability of a breakout above the 50-day moving average within the next 3 sessions."]
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `StockMind_AI_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    setTimeout(() => toast.success('Excel report exported.'), 1000);
  };

  const handleAutoFixReport = () => {
    const tid = toast.loading('Scanning portfolio for architectural anomalies...', { icon: '🔍' });
    
    setTimeout(() => {
      toast.loading('Neutralizing beta-slippage in tech allocation...', { id: tid, icon: '⚡' });
    }, 1500);

    setTimeout(() => {
      toast.success('Optimization Complete. All anomalies fixed.', { id: tid, icon: '🛡️' });
      
      // Download a "Fix Report"
      const fixContent = [
        ["AUTO-FIX ADJUSTMENT LOG"],
        ["Timestamp", new Date().toLocaleString()],
        ["Status", "OPTIMIZED"],
        [],
        ["ADJUSTMENT", "RATIONALE", "IMPACT"],
        ["NVDA Re-weighting", "Detected over-exposure to volatility", "+2.4% stability"],
        ["Hedge Rebalancing", "Neutralized delta-drift", "-12% downside risk"],
        ["Liquidity Buffer", "Adjusted for slippage protection", "Secured 3.5% cash"]
      ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

      const blob = new Blob([fixContent], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `AutoFix_Optimization_Report.csv`;
      link.click();
    }, 3500);
  };

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="home-premium-container animate-fade-in">
      
      {/* Dynamic Background */}
      <div className="premium-home-bg">
         <div className="home-glow home-glow-1"></div>
         <div className="home-glow home-glow-2"></div>
      </div>

      <div className="home-content-wrapper">
        
        {/* Header Section */}
        <header className="home-header-premium">
          <div className="header-titles">
            <h1>{greeting}, Investor</h1>
            <p>Your portfolio is up <span className="text-up font-bold">1.4%</span> today. The markets are currently <span className="text-up font-bold">Open</span>.</p>
          </div>
          
          <div className="header-actions">
            <div className="status-pill">
              <Globe size={14} className="text-brand" />
              <span>{latency}ms Latency</span>
            </div>
            <button className="icon-btn-premium"><Bell size={18} /></button>
            <button className="icon-btn-premium"><Settings size={18} /></button>
            <button className="btn-primary-premium">
              <Plus size={16} /> Deploy Capital
            </button>
          </div>
        </header>

        {/* Ticker Tape */}
        <div className="ticker-premium-wrap">
          <div className="ticker-scroll">
            {[...marketOverview, ...marketOverview].map((m, i) => (
              <div key={`${m.symbol}-${i}`} className="ticker-item-premium">
                <span className="ticker-sym">{m.symbol}</span>
                <span className={`ticker-price ${m.flash === 'up' ? 'flash-up' : m.flash === 'down' ? 'flash-down' : ''}`}>
                  ${m.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className={`ticker-change ${m.isUp ? 'text-up' : 'text-down'}`}>
                  {m.isUp ? '+' : ''}{m.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-premium">
          <StatCard title="Total Assets" value="$1.24M" change="+12.4%" isUp={true} icon={<DollarSign size={22} />} glowColor="#3b82f6" delay={0.1} />
          <StatCard title="S&P 500" value="5,123.45" change="+0.82%" isUp={true} icon={<TrendingUp size={22} />} glowColor="#10b981" delay={0.2} />
          <StatCard title="Active Risk" value="Low" change="-2 Alerts" isUp={true} icon={<Shield size={22} />} glowColor="#0e7490" delay={0.3} />
          <StatCard title="Sentiment" value="Greed" change="84 / 100" isUp={true} icon={<Activity size={22} />} glowColor="#8b5cf6" delay={0.4} />
        </div>

        {/* Main Content Layout */}
        <div className="main-layout-premium">
          
          {/* Left Column: Chart & Deep Dive */}
          <div className="layout-col-main">
            
            <motion.div 
              className="chart-card-premium glass-panel"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="panel-header">
                <div className="panel-title">
                  <BarChart3 size={20} className="text-brand" />
                  <h3>Portfolio Performance</h3>
                </div>
                <div className="time-filters-premium">
                  {['1D', '1W', '1M', '3M', 'YTD'].map(f => (
                    <button key={f} className={f === '1M' ? 'active' : ''}>{f}</button>
                  ))}
                </div>
              </div>
              
              <div className="chart-container-premium">
                <Suspense fallback={<div className="h-[380px] w-full flex items-center justify-center text-muted">Loading Quantum Analytics...</div>}>
                  <ResponsiveContainer width="100%" height={380}>
                    <AreaChart data={mainChartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ca3af', fontSize: 12}} 
                      minTickGap={30}
                    />
                    <YAxis 
                      orientation="right" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ca3af', fontSize: 12}} 
                      domain={['auto', 'auto']}
                      tickFormatter={(val) => `$${(val/1000).toFixed(1)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(17, 24, 39, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)'
                      }}
                      itemStyle={{ color: '#fff', fontWeight: 600 }}
                      labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      fill="url(#colorPrice)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Suspense>
            </div>
            </motion.div>

            <div className="bottom-cards-premium">
              <motion.div className="glass-panel sector-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <Layers size={18} className="text-cyan" />
                    <h3>Sector Allocation</h3>
                  </div>
                </div>
                <div className="sector-list-premium">
                  {[
                    { name: 'Technology', weight: 45, color: '#3b82f6' },
                    { name: 'Healthcare', weight: 25, color: '#10b981' },
                    { name: 'Financials', weight: 18, color: '#8b5cf6' },
                    { name: 'Energy', weight: 12, color: '#f59e0b' }
                  ].map(sec => (
                    <div key={sec.name} className="sector-item-premium">
                      <div className="sector-meta">
                        <span className="sec-name">{sec.name}</span>
                        <span className="sec-weight">{sec.weight}%</span>
                      </div>
                      <div className="sec-bar-bg">
                        <motion.div 
                          className="sec-bar-fill" 
                          style={{ backgroundColor: sec.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${sec.weight}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="glass-panel ai-insight-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <Zap size={18} className="text-orange" />
                    <h3>AI Insight</h3>
                  </div>
                </div>
                <div className="insight-content-premium">
                  <p className="insight-text">
                    "Our models detect a <strong>bullish divergence</strong> in large-cap tech. Historical analogues suggest a 78% probability of a breakout above the 50-day moving average within the next 3 sessions."
                  </p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button className="btn-outline-premium" onClick={handleDownloadReport}>
                      Read Full Report <ChevronRight size={14} />
                    </button>
                    <button className="btn-outline-premium" style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }} onClick={handleAutoFixReport}>
                      <Wrench size={14} /> Auto-Fix Report
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>

          {/* Right Column: Intelligence Feed */}
          <div className="layout-col-side">
            <motion.div 
              className="glass-panel news-feed-panel"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="panel-header border-bottom">
                <div className="panel-title">
                  <Newspaper size={18} className="text-brand" />
                  <h3>Market Intelligence</h3>
                </div>
              </div>
              
              <div className="news-list-premium">
                {newsArticles.map(article => (
                  <div key={article.id} className="news-item-premium" onClick={() => handleAnalyzeArticle(article.id, article.title)}>
                    <div className="news-meta">
                      <span className="news-source">{article.source}</span>
                      <span className="news-time">{article.time}</span>
                    </div>
                    <h4 className="news-title">{article.title}</h4>
                    
                    {analyzingId === article.id ? (
                      <div className="analyzing-state">
                        <div className="mini-spinner"></div> Analyzing sentiment...
                      </div>
                    ) : analysisResults[article.id] ? (
                      <motion.div 
                        className={`analysis-result ${analysisResults[article.id].sentiment === 'BULLISH' ? 'result-up' : 'result-down'}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <span className="result-badge">{analysisResults[article.id].sentiment}</span>
                        <p>{analysisResults[article.id].takeaway}</p>
                      </motion.div>
                    ) : (
                      <span className="analyze-cta">Click to run AI analysis</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

// SVG Icon definition since Plus wasn't imported from lucide-react in the main block
const Plus = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Wrench = ({ size = 24, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
);

export default Home;
