import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Activity, Cpu, Newspaper, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchGlobalQuote } from '../../services/alphaVantage';
import './Home.css';

// Mock Data
const mainChartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  price: 150 + Math.random() * 50 + (i * 2), // Upward trend
  volume: 1000 + Math.random() * 5000
}));

const initialMarketOverview = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, change: 1.2, isUp: true, isLive: false },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 212.45, change: -3.4, isUp: false, isLive: false },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 890.10, change: 5.7, isUp: true, isLive: false },
  { symbol: 'AMZN', name: 'Amazon.com', price: 145.20, change: 0.8, isUp: true, isLive: false },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 405.30, change: -0.2, isUp: false, isLive: false },
];

const newsArticles = [
  { id: 1, source: 'Reuters', title: 'Fed Signals Potential Rate Cuts Later This Year', sentiment: 'positive', time: '2h ago' },
  { id: 2, source: 'Bloomberg', title: 'Tech Stocks Rally as AI Adoption Accelerates', sentiment: 'positive', time: '4h ago' },
  { id: 3, source: 'WSJ', title: 'Oil Prices Dip Amid Global Supply Concerns', sentiment: 'negative', time: '5h ago' }
];

const StatCard = ({ title, value, change, isUp, icon }) => (
  <motion.div 
    className="stat-card glass-card"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
  >
    <div className="stat-header">
      <span className="stat-title">{title}</span>
      <div className="stat-icon-wrapper">{icon}</div>
    </div>
    <div className="stat-body">
      <h3 className="stat-value">{value}</h3>
      <div className={`stat-change ${isUp ? 'text-up' : 'text-down'}`}>
        {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        <span>{change}</span>
      </div>
    </div>
  </motion.div>
);

const Home = () => {
  const [marketOverview, setMarketOverview] = useState(initialMarketOverview);

  // Fetch real data for active widget
  useEffect(() => {
    const loadRealData = async () => {
       try {
         // To avoid immediately hitting the 5/min limit, we'll fetch just 2 symbols initially: IBM/AAPL
         const symbolsToFetch = ['AAPL', 'IBM']; 
         
         const updatedData = [...marketOverview];
         
         for (const sym of symbolsToFetch) {
            const realData = await fetchGlobalQuote(sym);
            if (realData) {
               // Update or push into array
               const index = updatedData.findIndex(s => s.symbol === realData.symbol);
               const formatChange = `${realData.change > 0 ? '+' : ''}${realData.change.toFixed(2)}%`;
               
               if (index !== -1) {
                  updatedData[index] = { ...updatedData[index], price: realData.price, change: realData.change, isUp: realData.change >= 0, isLive: true };
               } else {
                  updatedData.push({ symbol: realData.symbol, name: 'Live Data', price: realData.price, change: realData.change, isUp: realData.change > 0, isLive: true });
               }
            }
         }
         
         setMarketOverview(updatedData);
       } catch(err) {
         console.error('Failed API fetch', err);
       }
    };
    
    loadRealData();
  }, []);

  return (
    <div className="home-container">
      {/* Live Ticker */}
      <div className="ticker-bar glass">
        <div className="ticker-label text-gradient">Live Markets</div>
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {[...marketOverview, ...marketOverview].map((stock, i) => (
              <div key={i} className="ticker-item">
                <span className="ticker-symbol" style={{color: stock.isLive ? 'var(--accent-purple)' : 'inherit'}}>{stock.symbol}</span>
                <span className="ticker-price">${stock.price.toFixed(2)}</span>
                <span className={`ticker-change ${stock.isUp ? 'text-up' : 'text-down'}`}>
                  {stock.change > 0 && typeof stock.change === 'number' ? '+' : ''}
                  {typeof stock.change === 'number' ? stock.change.toFixed(2) + '%' : stock.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="stats-grid">
        <StatCard 
          title="Portfolio Value" 
          value="$124,500.00" 
          change="+2.4% Today" 
          isUp={true} 
          icon={<DollarSign size={20} color="var(--accent-cyan)" />} 
        />
        <StatCard 
          title="S&P 500" 
          value="5,123.45" 
          change="+0.8% Today" 
          isUp={true} 
          icon={<TrendingUp size={20} color="var(--status-up)" />} 
        />
        <StatCard 
          title="NASDAQ" 
          value="16,234.10" 
          change="-0.5% Today" 
          isUp={false} 
          icon={<TrendingDown size={20} color="var(--status-down)" />} 
        />
        <StatCard 
          title="AI Prediction Accuracy" 
          value="87.5%" 
          change="+1.2% (7 Days)" 
          isUp={true} 
          icon={<Cpu size={20} color="var(--accent-purple)" />} 
        />
      </div>

      <div className="main-grid">
        {/* Main Chart Section */}
        <div className="chart-section glass-card">
          <div className="section-header">
            <h3>Portfolio Performance Overview</h3>
            <div className="time-filters">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map(t => (
                <button key={t} className={`filter-btn ${t === '1M' ? 'active' : ''}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mainChartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-brand)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-brand)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tick={{fill: 'var(--text-muted)', fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tick={{fill: 'var(--text-muted)', fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={val => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="price" stroke="var(--accent-brand)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panels */}
        <div className="side-panels">
          {/* AI Prediction Widget */}
          <div className="ai-widget glass-card">
            <div className="widget-header">
              <div className="flex-row">
                <Cpu size={18} className="text-gradient-purple" />
                <h3>ML Prediction <span className="badge-pro">BETA</span></h3>
              </div>
            </div>
            <div className="predict-content">
              <div className="predict-target">
                <div className="target-icon bg-blue">NVDA</div>
                <div className="target-info">
                  <h4>NVIDIA Corp.</h4>
                  <p>Next 7 Days Forecast</p>
                </div>
              </div>
              <div className="predict-result bullish pulse-bg">
                <div className="result-main">
                  <TrendingUp size={28} />
                  <span className="result-text">Strong Buy</span>
                </div>
                <div className="confidence-score">
                  <div className="progress-bar"><div className="progress-fill" style={{width: '92%'}}></div></div>
                  <span className="score-text">92% Confidence (LSTM)</span>
                </div>
              </div>
            </div>
          </div>

          {/* News Sentiment */}
          <div className="news-widget glass-card">
            <div className="widget-header">
              <div className="flex-row">
                <Newspaper size={18} color="var(--accent-cyan)" />
                <h3>Market Sentiment</h3>
              </div>
            </div>
            <div className="news-list">
              {newsArticles.map(news => (
                <div key={news.id} className="news-item">
                  <div className={`sentiment-badge ${news.sentiment}`}></div>
                  <div className="news-content">
                    <h4>{news.title}</h4>
                    <div className="news-meta">
                      <span className="source">{news.source}</span>
                      <span className="dot">•</span>
                      <span className="time">{news.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn">View All News</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
