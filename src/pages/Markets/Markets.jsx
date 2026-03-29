import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { Activity, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Markets.css';
import '../Portfolio/PortfolioRealTime.css';

const MOCK_TICKERS = [
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 175.50 },
  { symbol: 'MSFT', name: 'Microsoft', basePrice: 410.20 },
  { symbol: 'GOOGL', name: 'Alphabet', basePrice: 140.80 },
  { symbol: 'AMZN', name: 'Amazon', basePrice: 145.20 },
  { symbol: 'META', name: 'Meta', basePrice: 480.10 },
  { symbol: 'NVDA', name: 'NVIDIA', basePrice: 890.50 },
  { symbol: 'TSLA', name: 'Tesla', basePrice: 215.30 },
  { symbol: 'AMD', name: 'AMD', basePrice: 178.90 },
];

const generateHistory = (basePrice) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    price: basePrice + (Math.random() - 0.5) * 5
  }));
};

const MarketCard = ({ data, isLive }) => {
  const isUp = data.change >= 0;
  
  return (
    <motion.div 
      className="market-card glass-card"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mc-header">
        <div className="mc-symbol">{data.symbol}</div>
        <div className="mc-name text-muted">{data.name}</div>
      </div>
      
      <div className="mc-price-row">
        <div className={`mc-price ${data.pulseDir ? `flash-${data.pulseDir}` : ''}`}>
          ${data.price.toFixed(2)}
        </div>
        <div className={`mc-change ${isUp ? 'text-up' : 'text-down'}`}>
          {isUp ? '+' : ''}{data.change.toFixed(2)}%
        </div>
      </div>

      <div className="mc-chart">
         <ResponsiveContainer width="100%" height={60}>
            <AreaChart data={data.history}>
               <defs>
                 <linearGradient id={`grad-${data.symbol}`} x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor={isUp ? 'var(--status-up)' : 'var(--status-down)'} stopOpacity={0.3}/>
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
                 isAnimationActive={isLive}
                 animationDuration={400}
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
      
      <div className="mc-footer">
        <div className="mc-vol">Vol: {(Math.random() * 10 + 1).toFixed(1)}M</div>
      </div>
    </motion.div>
  );
};

const Markets = () => {
  const [marketsData, setMarketsData] = useState(() => 
    MOCK_TICKERS.map(t => ({
      ...t,
      price: t.basePrice,
      change: (Math.random() - 0.3) * 3, // Initial random change
      history: generateHistory(t.basePrice),
      pulseDir: null,
      isLive: false
    }))
  );
  
  const [isLive, setIsLive] = useState(true);

  // Fetch true baseline prices on mount
  useEffect(() => {
    import('../../services/alphaVantage').then(({ fetchGlobalQuote }) => {
      // Pick one symbol to fetch to avoid quick limit issues on free tier.
      const sym = 'IBM'; 
      fetchGlobalQuote(sym).then(realData => {
         if (realData) {
            setMarketsData(prev => {
                const arr = [...prev];
                const i = arr.findIndex(x => x.symbol === sym);
                if (i !== -1) {
                   arr[i] = { 
                     ...arr[i], 
                     price: realData.price, 
                     basePrice: realData.price,
                     change: realData.change, 
                     history: generateHistory(realData.price),
                     isLive: true 
                   };
                } else {
                   arr.push({
                     symbol: realData.symbol,
                     name: 'IBM Corp (LIVE)',
                     price: realData.price,
                     basePrice: realData.price,
                     change: realData.change,
                     history: generateHistory(realData.price),
                     pulseDir: null,
                     isLive: true
                   });
                }
                return arr;
            });
         }
      });
    });
  }, []);

  // High Frequency Trading Simulation
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMarketsData(prev => prev.map(stock => {
        // Only update random stocks to simulate asymmetric market activity
        if (Math.random() > 0.4) {
          const shift = (Math.random() - 0.45) * (stock.basePrice * 0.005);
          const newPrice = stock.price + shift;
          const newChange = stock.change + (shift / stock.basePrice) * 100;
          
          const newHistory = [...stock.history.slice(1), { time: Date.now(), price: newPrice }];
          
          return {
            ...stock,
            price: newPrice,
            change: newChange,
            history: newHistory,
            pulseDir: shift > 0 ? 'up' : 'down'
          };
        }
        return { ...stock, pulseDir: null };
      }));
    }, 1000); // 1-second ticks

    return () => clearInterval(interval);
  }, [isLive]);

  // Sort by biggest movers
  const topGainers = [...marketsData].sort((a, b) => b.change - a.change).slice(0, 4);
  const activeVolume = [...marketsData].sort(() => 0.5 - Math.random());

  return (
    <div className="markets-container animate-fade-in">
      <div className="page-header flex-between">
        <div className="header-title">
          <Activity className="text-gradient-cyan" size={28} />
          <h1>Global Markets Overview</h1>
          <div className={`live-badge ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
            <div className="pulse-dot"></div>
            {isLive ? 'WEBSOCKET CONNECTED' : 'DISCONNECTED'}
          </div>
        </div>
        <div className="market-status">
           <Clock size={16} /> US Market Open | High Volatility
        </div>
      </div>

      <div className="markets-layout">
        <div className="main-feed">
          <h3 className="section-heading">Top Gainers & Losers <span className="text-muted">(Live Array)</span></h3>
          <div className="grid-feed">
            <AnimatePresence>
              {topGainers.map(data => (
                <MarketCard key={data.symbol} data={data} isLive={isLive} />
              ))}
            </AnimatePresence>
          </div>
          
          <h3 className="section-heading" style={{marginTop: '2rem'}}>High Volume Assets</h3>
          <div className="grid-feed">
             {activeVolume.map(data => (
               <MarketCard key={`vol-${data.symbol}`} data={data} isLive={isLive} />
             ))}
          </div>
        </div>
        
        <div className="order-book glass-card">
           <div className="ob-header">
             <h4>Live Activity Log</h4>
             <Activity size={16} className="text-brand" />
           </div>
           
           <div className="ob-list">
             <AnimatePresence>
               {activeVolume.slice(0, 10).map((mock, i) => (
                 <motion.div 
                   key={mock.symbol + i} 
                   className="ob-row"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ duration: 0.3, delay: i * 0.1 }}
                 >
                   <span className="ob-time">{new Date().toLocaleTimeString('en-US', { hour12: false, second: '2-digit', fractionalSecondDigits: 2 })}</span>
                   <span className="ob-sym">{mock.symbol}</span>
                   <span className={`ob-type ${Math.random() > 0.5 ? 'ob-buy' : 'ob-sell'}`}>{Math.random() > 0.5 ? 'BUY' : 'SELL'}</span>
                   <span className="ob-qty">{(Math.random() * 500).toFixed(0)}</span>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Markets;
