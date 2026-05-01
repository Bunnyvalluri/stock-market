import React, { useState, useEffect, useCallback, useMemo, memo, Suspense, lazy } from 'react';
const LineChart = lazy(() => import('recharts').then(mod => ({ default: mod.LineChart })));
const Line = lazy(() => import('recharts').then(mod => ({ default: mod.Line })));
const XAxis = lazy(() => import('recharts').then(mod => ({ default: mod.XAxis })));
const YAxis = lazy(() => import('recharts').then(mod => ({ default: mod.YAxis })));
const Tooltip = lazy(() => import('recharts').then(mod => ({ default: mod.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));
const CartesianGrid = lazy(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })));
const AreaChart = lazy(() => import('recharts').then(mod => ({ default: mod.AreaChart })));
const Area = lazy(() => import('recharts').then(mod => ({ default: mod.Area })));
import { 
  Cpu, Settings2, Target, Activity, Shield, 
  Server, Gauge, Sparkles, Network, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import './Predictions.css';

// ==========================================
// UTILITY & DATA GENERATION (Moved outside component to avoid recreation)
// ==========================================
const generatePredictionData = (model, seed = 850) => {
  const data = [];
  let basePrice = seed;
  
  for (let i = 30; i > 0; i--) {
    basePrice = basePrice + (Math.random() - 0.45) * (seed * 0.015);
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      historical: basePrice,
      prediction: null,
      confidenceHigh: null,
      confidenceLow: null
    });
  }
  
  let predPrice = basePrice;
  for (let i = 0; i <= 10; i++) {
    const shift = model === 'LSTM' ? (Math.random() - 0.4) * (seed * 0.01) : (Math.random() - 0.5) * (seed * 0.02);
    predPrice += shift;
    data.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      historical: i === 0 ? basePrice : null,
      prediction: predPrice,
      confidenceHigh: predPrice + (i * (seed * 0.005)),
      confidenceLow: predPrice - (i * (seed * 0.005))
    });
  }
  return data;
};

const INITIAL_BASE_PRICES = { NVDA: 850, AAPL: 175, SPY: 512, BTC: 65000 };
const MODEL_OPTIONS = ['LSTM', 'Transformer', 'XGBoost'];
const ASSET_OPTIONS = ['NVDA', 'AAPL', 'SPY', 'BTC'];

// ==========================================
// MEMOIZED SUB-COMPONENTS (Performance Optimization)
// ==========================================

// 1. Metric Card
const MetricPremium = memo(({ label, value, sub, icon, trend, delay }) => (
  <motion.div 
    className="metric-premium-card glass-panel"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="metric-header">
       <div className="metric-icon-wrap">{icon}</div>
    </div>
    <div className="metric-body">
       <span className="metric-label">{label}</span>
       <h3 className="metric-val">{value}</h3>
       <div className="metric-sub">
          <span className={`trend-dot ${trend === 'up' ? 'dot-up' : 'dot-down'}`}></span>
          {sub}
       </div>
    </div>
  </motion.div>
));
MetricPremium.displayName = 'MetricPremium';

// 2. Status Bar Component
const SystemStatusBar = memo(({ isLive }) => (
  <div className="system-status-bar glass-panel">
    <div className="status-items-wrap">
      <div className="status-item">
         <Server size={16} className="text-brand" />
         <span className="label">Compute Node:</span>
         <span className="value">A100-Tensor-Cluster</span>
      </div>
      <div className="status-divider"></div>
      <div className="status-item">
         <Activity size={16} className="text-cyan" />
         <span className="label">Training Epochs:</span>
         <span className="value">4.2M</span>
      </div>
      <div className="status-divider"></div>
      <div className="status-item">
         <Gauge size={16} className="text-orange" />
         <span className="label">System Load:</span>
         <span className="value">24%</span>
      </div>
    </div>
    <div className="status-live">
      <span className={`live-indicator ${!isLive ? 'paused' : ''}`}></span>
      {isLive ? 'Inference Active' : 'System Paused'}
    </div>
  </div>
));
SystemStatusBar.displayName = 'SystemStatusBar';

// 3. Neural Activity Timeline
const NeuralActivityFeed = memo(({ logs }) => (
  <motion.div 
    className="glass-panel inference-feed-panel mt-4"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    <div className="panel-header border-bottom">
        <div className="panel-title">
            <Cpu size={18} className="text-brand" />
            <h3>Neural Activity Feed</h3>
        </div>
    </div>
    <div className="inference-feed-list">
        <AnimatePresence mode="popLayout">
            {logs.map((log) => (
                <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, height: 0, x: -20 }} 
                    animate={{ opacity: 1, height: 'auto', x: 0 }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="inference-item"
                >
                    <div className="inference-timeline-dot"></div>
                    <div className="inference-content">
                        <span className="inf-time">{log.time}</span>
                        <p className="inf-msg">{log.msg}</p>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
    </div>
    <div className="panel-footer">
        <button className="btn-text-link">
            View Full Logs <ArrowRight size={14} />
        </button>
    </div>
  </motion.div>
));
NeuralActivityFeed.displayName = 'NeuralActivityFeed';

// ==========================================
// CUSTOM HOOKS (Logic Extraction)
// ==========================================
const useInferenceEngine = (selectedModel, selectedStock) => {
  const [basePrice, setBasePrice] = useState(INITIAL_BASE_PRICES[selectedStock]);
  const [chartData, setChartData] = useState([]);
  const [inferenceLogs, setInferenceLogs] = useState([]);
  const [isLive, setIsLive] = useState(true);

  // Handle model/stock changes - Batched logic
  useEffect(() => {
    const newBase = INITIAL_BASE_PRICES[selectedStock];
    const newChartData = generatePredictionData(selectedModel, newBase);
    const initialLog = {
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
      msg: `Model architecture [${selectedModel}] compiled for ${selectedStock}.`
    };

    setBasePrice(newBase);
    setChartData(newChartData);
    setInferenceLogs(prev => [initialLog, ...prev].slice(0, 6));
  }, [selectedModel, selectedStock]);

  // Handle simulation loop
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setBasePrice(prev => {
        const shift = (Math.random() - 0.45) * (prev * 0.005);
        const newPrice = prev + shift;
        
        // Update chart synchronously with price
        setChartData(generatePredictionData(selectedModel, newPrice));
        
        // Generate contextual log
        const logMessages = [
          `Adjusting attention weights for ${selectedStock} volume spike.`,
          `Recalculating confidence bands based on live order flow.`,
          `New target vector projected: $${(newPrice * 1.05).toFixed(2)}`,
          `Optimizing hyperparameters via dynamic stochastic routing.`
        ];
        
        setInferenceLogs(currentLogs => [{
            id: crypto.randomUUID(),
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
            msg: logMessages[Math.floor(Math.random() * logMessages.length)]
        }, ...currentLogs].slice(0, 6));

        return newPrice;
      });
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isLive, selectedModel, selectedStock]);

  return { chartData, inferenceLogs, isLive, setIsLive };
};


// ==========================================
// MAIN COMPONENT
// ==========================================
const Predictions = () => {
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [selectedModel, setSelectedModel] = useState('LSTM');
  
  const { chartData, inferenceLogs, isLive } = useInferenceEngine(selectedModel, selectedStock);

  // Handlers memoized to prevent unnecessary sub-component renders
  const handleModelSelect = useCallback((model) => {
    if (model === selectedModel) return;
    setSelectedModel(model);
    toast(`Loading ${model} weights...`, { icon: '🧠' });
  }, [selectedModel]);

  const handleStockSelect = useCallback((ticker) => {
    if (ticker === selectedStock) return;
    setSelectedStock(ticker);
  }, [selectedStock]);

  // Memoize chart config to prevent Recharts churn
  const chartMargins = useMemo(() => ({ top: 20, right: 30, left: 0, bottom: 0 }), []);
  
  return (
    <div className="predictions-premium-container animate-fade-in">
      <div className="premium-home-bg">
         <div className="home-glow home-glow-1"></div>
         <div className="home-glow home-glow-2"></div>
      </div>

      <div className="predictions-content-wrapper">
        <SystemStatusBar isLive={isLive} />

        <div className="page-header-premium">
          <div className="header-titles">
              <Sparkles className="text-brand" size={28} />
              <div>
                  <h1>Predictive Intelligence</h1>
                  <p>Next-generation machine learning forecasts for institutional assets.</p>
              </div>
          </div>
          <div className="header-actions-premium">
              <div className="model-selector-premium">
                  {MODEL_OPTIONS.map(m => (
                      <button 
                         key={m} 
                         className={m === selectedModel ? 'active' : ''}
                         onClick={() => handleModelSelect(m)}
                      >
                         {m}
                      </button>
                  ))}
              </div>
              <button className="btn-icon-premium" title="Model Parameters">
                  <Settings2 size={18} />
              </button>
          </div>
        </div>

        <div className="predictions-layout-grid">
           <div className="predictions-main-col">
              <motion.div 
                 className="glass-panel chart-panel-premium"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.5, delay: 0.1 }}
              >
                  <div className="panel-header border-bottom">
                      <div className="panel-title">
                          <Network size={20} className="text-brand" />
                          <h3>Asset Projection Path</h3>
                      </div>
                      
                      <div className="asset-selector-premium">
                          {ASSET_OPTIONS.map(ticker => (
                              <button 
                                  key={ticker} 
                                  className={selectedStock === ticker ? 'active' : ''}
                                  onClick={() => handleStockSelect(ticker)}
                              >
                                  {ticker}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="chart-legend-premium">
                      <div className="legend-item"><span className="legend-line historical"></span> Historical Data</div>
                      <div className="legend-item"><span className="legend-line prediction"></span> AI Forecast</div>
                      <div className="legend-item"><span className="legend-box confidence"></span> Confidence Interval</div>
                  </div>

                  <div className="chart-viewport-premium">
                      <Suspense fallback={<div className="h-[450px] w-full flex items-center justify-center text-muted font-mono">NEURAL_NET_LOAD...</div>}>
                        <ResponsiveContainer width="100%" height={450}>
                        <AreaChart data={chartData} margin={chartMargins}>
                          <defs>
                            <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="confGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} minTickGap={30} />
                          <YAxis orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={['auto', 'auto']} tickFormatter={v => `$${v.toFixed(0)}`} />
                          
                          <Tooltip 
                            contentStyle={{ 
                                background: 'rgba(17, 24, 39, 0.9)', border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#fff', fontWeight: 600 }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '8px' }}
                          />
                          
                          <Area type="monotone" dataKey="confidenceHigh" stroke="none" fill="url(#confGradient)" isAnimationActive={false} />
                          <Area type="monotone" dataKey="confidenceLow" stroke="none" fill="#030712" fillOpacity={0.8} isAnimationActive={false} />
                          
                          <Line type="monotone" dataKey="historical" stroke="#6b7280" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                          <Area 
                            type="monotone" dataKey="prediction" stroke="#3b82f6" strokeWidth={3} fill="url(#predGradient)" 
                            dot={{r: 4, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2}} activeDot={{r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2}}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Suspense>
                  </div>
              </motion.div>
           </div>

           <div className="predictions-side-col">
              <div className="metrics-grid-premium">
                  <MetricPremium label="Model Accuracy" value="92.4%" sub="Outperforming benchmarks" icon={<Target size={22} className="text-brand" />} trend="up" delay={0.2} />
                  <MetricPremium label="Inference Latency" value="42ms" sub="Real-time execution" icon={<Activity size={22} className="text-cyan" />} trend="up" delay={0.3} />
                  <MetricPremium label="Market Volatility" value="High" sub="Expanding confidence bands" icon={<Shield size={22} className="text-orange" />} trend="down" delay={0.4} />
              </div>
              <NeuralActivityFeed logs={inferenceLogs} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
