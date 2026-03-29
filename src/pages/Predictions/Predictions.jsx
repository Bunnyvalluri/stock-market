import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Cpu, Settings2, Target, Info, Activity, 
  Shield, Zap, Layers, Server, Terminal, Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './Predictions.css';

const generatePredictionData = (model, seed = 850) => {
  const data = [];
  let basePrice = seed;
  for (let i = 30; i > 0; i--) {
    basePrice = basePrice + (Math.random() - 0.45) * 12;
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      historical: basePrice,
      prediction: null,
      confidenceBandLow: null,
      confidenceBandHigh: null
    });
  }
  let predPrice = basePrice;
  for (let i = 0; i <= 7; i++) {
    const shift = model === 'LSTM' ? (Math.random() - 0.3) * 10 : (Math.random() - 0.5) * 18;
    predPrice += shift;
    data.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      historical: i === 0 ? basePrice : null,
      prediction: predPrice,
      confidenceBandLow: predPrice - (i * 4),
      confidenceBandHigh: predPrice + (i * 4)
    });
  }
  return data;
};

const MetricPro = ({ label, value, sub, icon, trend }) => (
  <div className="metric-pro-card glass-card">
    <div className="metric-pro-header">
       <div className="metric-pro-icon">{icon}</div>
       <span className="metric-pro-label">{label}</span>
    </div>
    <div className="metric-pro-body">
       <h3 className="metric-pro-val">{value}</h3>
       <div className={`metric-pro-sub ${trend === 'up' ? 'up' : 'down'}`}>{sub}</div>
    </div>
  </div>
);

const Predictions = () => {
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [selectedModel, setSelectedModel] = useState('LSTM');
  const [chartData, setChartData] = useState(generatePredictionData('LSTM', 850));
  const [isLive, setIsLive] = useState(true);
  const [basePrice, setBasePrice] = useState(850);
  const [inferenceLogs, setInferenceLogs] = useState([]);

  // Instant data snap on model or stock change
  useEffect(() => {
     setChartData(generatePredictionData(selectedModel, basePrice));
     setInferenceLogs(prev => [`[${selectedModel}] Architecture recompiled for $${selectedStock}.`, ...prev].slice(0, 4));
  }, [selectedModel, selectedStock]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const shift = (Math.random() - 0.45) * 4;
      const newPrice = basePrice + shift;
      setBasePrice(newPrice);
      setChartData(generatePredictionData(selectedModel, newPrice));
      
      // Update Inference Log
      const logEntries = [
        `[${selectedModel}] Backpropagating loss gradients... (loss: ${Math.random().toFixed(4)})`,
        `[ENGINE] Adjusting attention weights for $${selectedStock} vol-spike.`,
        `[SIGNAL] New Target Re-calculated: $${(newPrice * (1.1)).toFixed(2)}`,
        `[INFERENCE] Confidence score updated via TensorCore.`
      ];
      setInferenceLogs(prev => [logEntries[Math.floor(Math.random() * logEntries.length)], ...prev].slice(0, 4));
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive, selectedModel, basePrice, selectedStock]);

  return (
    <div className="predictions-pro-container animate-fade-in">
      {/* High-Tech Engine Bar */}
      <div className="engine-status-pro glass">
         <div className="engine-item">
            <Server size={14} className="text-cyan" />
            <span className="text-muted">Compute Cluster:</span>
            <span className="font-bold">A100-NODE-4</span>
         </div>
         <div className="engine-item">
            <Activity size={14} className="text-brand" />
            <span className="text-muted">Training Epochs:</span>
            <span className="font-bold">4,280,000</span>
         </div>
         <div className="engine-item">
            <Gauge size={14} className="text-orange" />
            <span className="text-muted">Confidence:</span>
            <span className="font-bold text-gradient">92.4% Avg</span>
         </div>
         <div className="engine-actions">
            <div className={`engine-live-tag ${isLive ? 'active' : ''}`}>
               {isLive ? 'SYSTEM INFERENCING' : 'IDLE'}
            </div>
         </div>
      </div>

      <div className="page-header-pro flex-between mt-4">
        <div className="header-pro-left">
            <Cpu className="text-brand" size={28} />
            <div>
                <h1>Neural Forecasting Core</h1>
                <p className="text-muted">Deep learning architecture for multi-horizon price prediction</p>
            </div>
        </div>
        <div className="header-pro-right">
            <div className="control-tabs-pro">
                {['LSTM-v2', 'Transformer', 'XGBoost'].map(m => (
                    <button 
                       key={m} 
                       className={m === selectedModel || (m === 'LSTM-v2' && selectedModel === 'LSTM') ? 'active' : ''}
                       onClick={() => {
                          const newModel = m === 'LSTM-v2' ? 'LSTM' : m;
                          setSelectedModel(newModel);
                          toast(`Recompiling architecture: ${newModel}`, { icon: '🧠' });
                       }}
                    >
                       {m}
                    </button>
                ))}
            </div>
            <button className="settings-btn-pro" onClick={() => toast.loading('Loading Hyperparameters', {duration: 1500})}><Settings2 size={18} /></button>
        </div>
      </div>

      <div className="predictions-main-grid-pro">
         {/* Main Simulation Viewport */}
         <div className="predictions-viewport-pro glass-card">
            <div className="card-header-pro flex-between mb-2 border-b border-light pb-3">
                <div className="flex-row gap-4 items-center">
                    <div className="flex-row items-center gap-2">
                        <Target size={18} className="text-brand" />
                        <h4 className="font-bold tracking-wide uppercase">Asset Forecast:</h4>
                    </div>
                    {/* Interactive Ticker Selection */}
                    <div className="flex gap-2">
                        {['NVDA', 'AAPL', 'SPY', 'BTC'].map(ticker => (
                            <button 
                                key={ticker} 
                                className={`px-3 py-1 text-xs font-mono font-bold rounded-full border transition-all ${selectedStock === ticker ? 'bg-brand/20 text-brand border-brand/40' : 'bg-transparent text-muted hover:text-white border-light'}`}
                                onClick={() => {
                                    setSelectedStock(ticker);
                                    const baseMap = { NVDA: 850, AAPL: 175, SPY: 512, BTC: 65000 };
                                    setBasePrice(baseMap[ticker]);
                                    toast(`Routing signal feed to ${ticker}...`, {icon:'📡'});
                                }}
                            >
                                {ticker}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="viewport-legend">
                    <div className="leg-item"><span className="dot historical"></span> Actual</div>
                    <div className="leg-item"><span className="dot forecast"></span> Prediction</div>
                </div>
            </div>

            <div className="chart-wrapper-pro mt-4">
              <ResponsiveContainer width="100%" height={450}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-brand)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent-brand)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="confBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} minTickGap={30} />
                  <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 11}} domain={['auto', 'auto']} tickFormatter={v => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ background: '#121212', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                  />
                  
                  {/* Confidence Interval Band */}
                  <Area 
                    type="monotone" 
                    dataKey="confidenceBandHigh" 
                    stroke="none" 
                    fill="url(#confBand)" 
                    isAnimationActive={false} 
                  />
                  
                  <Line type="monotone" dataKey="historical" stroke="var(--text-muted)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  <Area 
                    type="monotone" 
                    dataKey="prediction" 
                    stroke="var(--accent-brand)" 
                    strokeWidth={4} 
                    fill="url(#colorPred)" 
                    dot={{r: 4, fill: '#fff', stroke: 'var(--accent-brand)', strokeWidth: 2}}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         {/* Model Intelligence Sidebar */}
         <div className="predictions-intelligence-pro">
            <MetricPro 
                label="Directional Accuracy" 
                value="91.42%" 
                sub="+2.1% against Benchmarking" 
                icon={<Target size={20} className="text-brand" />}
                trend="up"
            />
            <MetricPro 
                label="Inference Latency" 
                value="42ms" 
                sub="Sub-millisecond Tensor Scaling" 
                icon={<Activity size={20} className="text-cyan" />}
                trend="up"
            />
            <MetricPro 
                label="Risk Tolerance Index" 
                value="0.12" 
                sub="Statistically Insignificant Skew" 
                icon={<Shield size={20} className="text-orange" />}
                trend="down"
            />

            <div className="terminal-logs-pro glass-card mt-5">
                <div className="card-header-pro">
                    <Terminal size={18} className="text-brand" />
                    <h4>Model Inference Logs</h4>
                </div>
                <div className="logs-stream-pro">
                    <AnimatePresence mode="popLayout">
                        {inferenceLogs.map((log, i) => (
                            <motion.div 
                                key={log + i} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                className="log-entry-pro"
                            >
                                <span className="timestamp">{new Date().toLocaleTimeString()}</span>
                                <span className="entry">{log}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Predictions;
