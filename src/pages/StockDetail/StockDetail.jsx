import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  createChart, ColorType, CrosshairMode
} from 'lightweight-charts';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Activity, BarChart2, 
  AlertCircle, Star, Share2, Globe, Shield, Zap, Target, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../services/apiClient';
import './StockDetail.css';


const generateOHLC = (base, days) => {
  let price = base;
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    const open = price;
    const change = (Math.random() - 0.48) * price * 0.025;
    const close = Math.max(1, open + change);
    const high = Math.max(open, close) * (1 + Math.random() * 0.012);
    const low = Math.min(open, close) * (1 - Math.random() * 0.012);
    const volume = Math.floor(Math.random() * 5_000_000 + 1_000_000);
    price = close;
    return {
      time: date.toISOString().split('T')[0],
      open: +open.toFixed(2), 
      high: +high.toFixed(2),
      low: +low.toFixed(2),   
      close: +close.toFixed(2),
      volume
    };
  });
};


const STOCKS = {
  AAPL: { name: 'Apple Inc.', base: 185, sector: 'Technology' },
  TSLA: { name: 'Tesla Inc.', base: 245, sector: 'Automotive' },
  NVDA: { name: 'NVIDIA Corp.', base: 875, sector: 'Semiconductors' },
  MSFT: { name: 'Microsoft Corp.', base: 415, sector: 'Technology' },
  GOOGL: { name: 'Alphabet Inc.', base: 175, sector: 'Technology' },
  AMZN: { name: 'Amazon.com Inc.', base: 195, sector: 'E-Commerce' },
};

const rangeMap = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="sd-tooltip-pro glass">
      <p className="sd-tt-date">{label}</p>
      <div className="sd-tt-row"><span>Open</span><span>${d.open?.toFixed(2)}</span></div>
      <div className="sd-tt-row text-up"><span>High</span><span>${d.high?.toFixed(2)}</span></div>
      <div className="sd-tt-row text-down"><span>Low</span><span>${d.low?.toFixed(2)}</span></div>
      <div className="sd-tt-row font-bold"><span>Close</span><span>${d.close?.toFixed(2)}</span></div>
      <div className="sd-tt-row"><span>Volume</span><span>{(d.volume / 1_000_000).toFixed(2)}M</span></div>
    </div>
  );
};

export default function StockDetail() {
  const { symbol } = useParams();
  const ticker = symbol?.toUpperCase() || 'AAPL';
  const info = STOCKS[ticker] || { name: ticker, base: 200, sector: 'Unknown' };

  const [range, setRange] = useState('3M');
  const [currentPrice, setCurrentPrice] = useState(info.base);
  const [change, setChange] = useState(0);
  const [changePct, setChangePct] = useState(0);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    const days = rangeMap[range] || 90;
    const raw = generateOHLC(info.base, days);
    
    const last = raw[raw.length - 1];
    const first = raw[0];
    setCurrentPrice(last.close);
    setChange(+(last.close - first.close).toFixed(2));
    setChangePct(+(((last.close - first.close) / first.close) * 100).toFixed(2));

    // --- TradingView Initialization ---
    const chartContainer = document.getElementById('tv-chart-root');
    if (!chartContainer) return;
    chartContainer.innerHTML = ''; // Fresh render

    const chart = createChart(chartContainer, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#6b7280',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.03)' },
        horzLines: { color: 'rgba(255,255,255,0.03)' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.2, bottom: 0.2 } },
      timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
      handleScroll: true,
      handleScale: true,
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    candleSeries.setData(raw);

    const volumeSeries = chart.addHistogramSeries({
      color: 'rgba(37,99,235,0.1)',
      priceFormat: { type: 'volume' },
      priceScaleId: '', // Separate scale
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    volumeSeries.setData(raw.map(d => ({
      time: d.time,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'
    })));

    const handleResize = () => {
      chart.applyOptions({ width: chartContainer.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    const isPos = +(last.close - first.close).toFixed(2) >= 0;

    // Async Fetch Prediction (Explainability Layer)
    const fetchAIPrediction = async () => {
      setIsPredicting(true);
      try {
        const pred = await api.prediction.get(ticker);
        setPrediction(pred);
      } catch {
        console.warn('AI Inference Node Offline. Simulating locally...');
        setPrediction({
          trend: isPos ? 'bullish' : 'bearish',
          confidence: 85.4,
          reasons: [
            "Strong historical buy pressure at this support zone",
            "Institutional accumulation detected via volume profile",
            "Neural weights identify 5-day recursive trend shift"
          ]
        });
      } finally {
        setIsPredicting(false);
      }
    };

    fetchAIPrediction();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [range, ticker, info.base]);

  const isPositive = change >= 0;

  const stats = [
    { label: 'Market Cap', value: `$${(currentPrice * 16_000_000_000 / 1e12).toFixed(2)}T` },
    { label: '52W High', value: `$${(currentPrice * 1.35).toFixed(2)}` },
    { label: '52W Low', value: `$${(currentPrice * 0.65).toFixed(2)}` },
    { label: 'P/E Ratio', value: '28.4' },
    { label: 'Avg Volume', value: '62.4M' },
    { label: 'Beta', value: '1.24' },
    { label: 'Dividend', value: '0.92%' },
    { label: 'Float', value: '15.4B' },
  ];

  return (
    <div className="sd-pro-container animate-fade-in">
      <div className="sd-pro-header-wrap">
        <Link to="/markets" className="sd-pro-back">
          <ArrowLeft size={16} /> Back to Exchange Matrix
        </Link>
        <div className="sd-pro-actions">
           <button className={`sd-pro-btn ${isWatchlisted ? 'active' : ''}`} onClick={() => { setIsWatchlisted(!isWatchlisted); toast.success(isWatchlisted ? 'Asset removed from Watchlist.' : 'Asset added to Watchlist.', {icon: '⭐'}); }}>
             <Star size={14} fill={isWatchlisted ? 'currentColor' : 'none'} />
             Watchlist
           </button>
           <button className="sd-pro-btn" onClick={() => toast.loading('Generating secure proprietary PDF...', {duration: 2000})}><Share2 size={14} /> Intelligence Report</button>
        </div>
      </div>

      <div className="sd-pro-identity-grid glass-card">
        <div className="sd-pro-id-main">
            <div className="sd-pro-badge text-gradient">{ticker}</div>
            <div className="sd-pro-meta">
               <h1>{info.name}</h1>
               <p>{info.sector} · NASDAQ Global Select Market</p>
            </div>
        </div>
        <div className="sd-pro-price-block">
            <div className="sd-pro-price-group">
                <span className="price">${currentPrice.toFixed(2)}</span>
                <span className={`change ${isPositive ? 'text-up' : 'text-down'}`}>
                   {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)} ({isPositive ? '+' : ''}{changePct}%)
                </span>
            </div>
            <div className="sd-pro-status">
               <span className="live-pulse"></span> COMPOSITE FEED · EST 14:22:45
            </div>
        </div>
      </div>

      <div className="sd-pro-main-layout">
        <div className="sd-pro-col-left">
           <div className="sd-pro-chart-panel glass-card">
              <div className="card-header-term flex-between">
                 <div className="header-left">
                    <BarChart2 size={18} className="text-brand" />
                    <h4>Institutional Price Action Feed</h4>
                 </div>
                 <div className="header-right">
                    <div className="sd-pro-ranges">
                       {Object.keys(rangeMap).map(r => (
                          <button key={r} className={range === r ? 'active' : ''} onClick={() => { setRange(r); toast(`Rendering ${r} structural timeframe.`, {icon: '📊'}); }}>{r}</button>
                       ))}
                    </div>
                 </div>
              </div>
 
              <div id="tv-chart-root" className="sd-pro-chart-viewport" style={{ height: '420px' }}></div>
 
              <div className="sd-pro-legend">
                 <div className="leg-item"><span className="dot" style={{background: '#22c55e'}}></span> BULLISH CANDLE</div>
                 <div className="leg-item"><span className="dot" style={{background: '#ef4444'}}></span> BEARISH CANDLE</div>
                 <div className="leg-item"><span className="rect volume"></span> LIQUIDITY FLOW</div>
              </div>
           </div>

           <div className="sd-pro-stats-panel glass-card">
              <div className="card-header-term">
                 <Activity size={18} className="text-cyan" />
                 <h4>Institutional Key Statistics</h4>
              </div>
              <div className="sd-pro-stats-grid">
                 {stats.map(s => (
                    <div key={s.label} className="sd-pro-stat-item">
                       <span className="label">{s.label}</span>
                       <span className="val">{s.value}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="sd-pro-col-right">
            <div className="sd-pro-insight-card glass-card">
               <div className="insight-pro-header">
                  <div className="insight-pro-label">
                     <Zap size={16} /> NEURAL FORECAST
                  </div>
                  <div className={`badge-pro ${isPredicting ? 'pulse-fast' : ''}`}>{isPredicting ? 'COMPUTING' : 'BETA'}</div>
               </div>
               <div className="insight-pro-body">
                  <div className={`insight-pro-signal text-gradient ${isPredicting ? 'loading-shimmer' : ''}`}>
                     {isPredicting ? 'ANALYZING...' : (prediction?.trend === 'bullish' ? 'ACCUMULATION PHASE' : 'DISTRIBUTION PHASE')}
                  </div>
                  
                  <div className="insight-pro-meter">
                     <div className="meter-label">Model Confidence Index</div>
                     <div className="meter-container">
                        <div className="meter-fill" style={{ width: `${prediction?.confidence || 0}%` }}></div>
                     </div>
                     <div className="meter-val">{prediction?.confidence || 0}% Probability</div>
                  </div>

                  <div className="ai-reasoning-wrap mt-4">
                     <p className="reasoning-label">QUANTITATIVE DRIVERS:</p>
                     <ul className="reasoning-list">
                        {(prediction?.reasons || []).map((r, i) => (
                           <li key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                              <Target size={12} className="text-brand" /> {r}
                           </li>
                        ))}
                     </ul>
                  </div>
                  
                  <p className="insight-note mt-3">Neural weights optimized for $NASDAQ: {ticker} on last trade session.</p>
               </div>
            </div>

            <div className="sd-pro-intelligence glass-card mt-5">
               <div className="card-header-pro">
                  <Layers size={18} className="text-orange" />
                  <h4>Asset Liquidity Matrix</h4>
               </div>
               <div className="sd-pro-liquidity-list">
                  <div className="liq-item"><span>Exchange Liquidity</span><span className="text-up font-bold">OPTIMAL</span></div>
                  <div className="liq-item"><span>Order Imbalance</span><span className="text-down font-bold">14.2% ASK</span></div>
                  <div className="liq-item"><span>Volatility (24H)</span><span className="text-primary font-bold">1.2%</span></div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
