import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, BarChart2, AlertCircle, Star, Share2 } from 'lucide-react';
import './StockDetail.css';

// --- Mock data generator ---
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
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      open: +open.toFixed(2), high: +high.toFixed(2),
      low: +low.toFixed(2),   close: +close.toFixed(2),
      volume,
      sma20: 0, rsi: 0,
    };
  });
};

const calcSMA = (data, period) =>
  data.map((d, i) => {
    if (i < period - 1) return { ...d, sma20: null };
    const avg = data.slice(i - period + 1, i + 1).reduce((s, x) => s + x.close, 0) / period;
    return { ...d, sma20: +avg.toFixed(2) };
  });

const STOCKS = {
  AAPL: { name: 'Apple Inc.', base: 185, sector: 'Technology' },
  TSLA: { name: 'Tesla Inc.', base: 245, sector: 'Automotive' },
  NVDA: { name: 'NVIDIA Corp.', base: 875, sector: 'Semiconductors' },
  MSFT: { name: 'Microsoft Corp.', base: 415, sector: 'Technology' },
  GOOGL: { name: 'Alphabet Inc.', base: 175, sector: 'Technology' },
  AMZN: { name: 'Amazon.com Inc.', base: 195, sector: 'E-Commerce' },
};

// Custom Candlestick bar
const CandlestickBar = (props) => {
  const { x, y, width, payload } = props;
  if (!payload) return null;
  const { open, close, high, low } = payload;
  const isUp = close >= open;
  const color = isUp ? '#10b981' : '#ef4444';
  const barTop = Math.min(open, close);
  const barH = Math.abs(open - close) || 1;

  // We approximate the pixel positions using the chart domain
  // This is a simplified visual only
  return (
    <g>
      <line x1={x + width / 2} y1={y - 4} x2={x + width / 2} y2={y + 4} stroke={color} strokeWidth={1.5} />
      <rect x={x + 1} y={y} width={width - 2} height={Math.max(2, barH)} fill={color} opacity={0.9} rx={1} />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const isUp = d.close >= d.open;
  return (
    <div className="sd-tooltip">
      <p className="sd-tt-date">{label}</p>
      <div className="sd-tt-row"><span>Open</span><span>${d.open?.toFixed(2)}</span></div>
      <div className="sd-tt-row"><span>High</span><span className="text-up">${d.high?.toFixed(2)}</span></div>
      <div className="sd-tt-row"><span>Low</span><span className="text-down">${d.low?.toFixed(2)}</span></div>
      <div className="sd-tt-row"><span>Close</span><span className={isUp ? 'text-up' : 'text-down'}>${d.close?.toFixed(2)}</span></div>
      <div className="sd-tt-row"><span>Volume</span><span>{(d.volume / 1_000_000).toFixed(2)}M</span></div>
      {d.sma20 && <div className="sd-tt-row"><span>SMA20</span><span className="text-cyan">${d.sma20}</span></div>}
    </div>
  );
};

export default function StockDetail() {
  const { symbol } = useParams();
  const ticker = symbol?.toUpperCase() || 'AAPL';
  const info = STOCKS[ticker] || { name: ticker, base: 200, sector: 'Unknown' };

  const [range, setRange] = useState('3M');
  const [data, setData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(info.base);
  const [change, setChange] = useState(0);
  const [changePct, setChangePct] = useState(0);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const rangeMap = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 };

  useEffect(() => {
    const days = rangeMap[range] || 90;
    const raw = generateOHLC(info.base, days);
    const withSMA = calcSMA(raw, 20);
    setData(withSMA);
    const last = withSMA[withSMA.length - 1];
    const first = withSMA[0];
    setCurrentPrice(last.close);
    setChange(+(last.close - first.close).toFixed(2));
    setChangePct(+(((last.close - first.close) / first.close) * 100).toFixed(2));
  }, [range, ticker]);

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
    <div className="sd-container animate-fade-in">
      {/* Header */}
      <div className="sd-header">
        <Link to="/markets" className="sd-back-btn">
          <ArrowLeft size={18} /> Back to Markets
        </Link>
        <div className="sd-header-actions">
          <button className={`sd-action-btn ${isWatchlisted ? 'active' : ''}`} onClick={() => setIsWatchlisted(!isWatchlisted)}>
            <Star size={16} fill={isWatchlisted ? 'currentColor' : 'none'} />
            {isWatchlisted ? 'Watchlisted' : 'Watchlist'}
          </button>
          <button className="sd-action-btn">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* Stock Identity */}
      <div className="sd-identity glass-card">
        <div className="sd-id-left">
          <div className="sd-ticker-badge">{ticker}</div>
          <div>
            <h1 className="sd-company-name">{info.name}</h1>
            <p className="sd-sector">{info.sector} · NASDAQ</p>
          </div>
        </div>
        <div className="sd-id-right">
          <div className="sd-price">${currentPrice.toFixed(2)}</div>
          <div className={`sd-change ${isPositive ? 'text-up' : 'text-down'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{changePct}%)
          </div>
          <div className="sd-realtime-badge">
            <span className="sd-rt-dot"></span> Live Price
          </div>
        </div>
      </div>

      {/* Chart + Stats */}
      <div className="sd-main-grid">
        {/* Main Chart Panel */}
        <div className="sd-chart-panel glass-card">
          <div className="sd-chart-header">
            <div className="sd-chart-tabs">
              <button className="sd-chart-tab active"><Activity size={14} /> Price</button>
              <button className="sd-chart-tab"><BarChart2 size={14} /> Volume</button>
            </div>
            <div className="sd-range-tabs">
              {Object.keys(rangeMap).map(r => (
                <button
                  key={r}
                  className={`sd-range-btn ${range === r ? 'active' : ''}`}
                  onClick={() => setRange(r)}
                >{r}</button>
              ))}
            </div>
          </div>

          {/* Area / Candlestick Approximation using AreaChart */}
          <div className="sd-chart-area">
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} interval={Math.floor(data.length / 6)} />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} width={65} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="close" stroke={isPositive ? '#10b981' : '#ef4444'} strokeWidth={2} fill="url(#priceGradient)" dot={false} />
                <Line type="monotone" dataKey="sma20" stroke="#06b6d4" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="SMA 20" />
                <Bar dataKey="volume" yAxisId={1} fill="rgba(79,70,229,0.15)" radius={[2, 2, 0, 0]} />
                <YAxis yAxisId={1} orientation="right" hide />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="sd-chart-legend">
            <div className="sd-legend-item">
              <span className="sd-legend-dot" style={{ background: isPositive ? '#10b981' : '#ef4444' }}></span>
              <span>Price</span>
            </div>
            <div className="sd-legend-item">
              <span className="sd-legend-line cyan"></span>
              <span>SMA 20</span>
            </div>
            <div className="sd-legend-item">
              <span className="sd-legend-dot" style={{ background: '#4f46e5', opacity: 0.6 }}></span>
              <span>Volume</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Stats + AI Signal */}
        <div className="sd-right-panel">
          {/* AI Signal Card */}
          <div className="sd-signal-card glass-card">
            <div className="sd-signal-header">
              <span className="sd-signal-label">AI Prediction Signal</span>
              <span className="sd-signal-badge pro">PRO</span>
            </div>
            <div className={`sd-signal-value ${isPositive ? 'bullish' : 'bearish'}`}>
              {isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              <span>{isPositive ? 'BULLISH' : 'BEARISH'}</span>
            </div>
            <div className="sd-confidence">
              <div className="sd-confidence-label">
                <span>Model Confidence</span>
                <span className={isPositive ? 'text-up' : 'text-down'}>
                  {isPositive ? '78.4%' : '63.1%'}
                </span>
              </div>
              <div className="sd-confidence-bar">
                <div
                  className="sd-confidence-fill"
                  style={{
                    width: isPositive ? '78.4%' : '63.1%',
                    background: isPositive ? '#10b981' : '#ef4444'
                  }}
                ></div>
              </div>
            </div>
            <p className="sd-signal-note">
              <AlertCircle size={12} />
              AI signals are for informational purposes only.
            </p>
          </div>

          {/* Key Stats */}
          <div className="sd-stats-card glass-card">
            <h3 className="sd-stats-title">Key Statistics</h3>
            <div className="sd-stats-grid">
              {stats.map(s => (
                <div key={s.label} className="sd-stat-item">
                  <span className="sd-stat-label">{s.label}</span>
                  <span className="sd-stat-value">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
