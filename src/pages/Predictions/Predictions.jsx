import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Cpu, Settings2, Target, Info, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import './Predictions.css';
import '../Portfolio/PortfolioRealTime.css';

// Base generation logic
const generatePredictionData = (model, seed = 850) => {
  const data = [];
  let basePrice = seed;
  
  // Historical data (30 days)
  for (let i = 30; i > 0; i--) {
    basePrice = basePrice + (Math.random() - 0.45) * 15;
    data.push({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      historical: basePrice,
      prediction: null
    });
  }

  // Future Prediction (7 days)
  let predPrice = basePrice;
  for (let i = 0; i <= 7; i++) {
    if (model === 'LSTM') {
      predPrice = predPrice + (Math.random() - 0.3) * 12; 
    } else if (model === 'Random Forest') {
      predPrice = predPrice + (Math.random() - 0.5) * 20;
    } else {
      predPrice = predPrice + 5; 
    }
    
    data.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      historical: i === 0 ? basePrice : null,
      prediction: predPrice
    });
  }
  return data;
};

const MetricCard = ({ label, value, desc, highlight }) => (
  <motion.div 
    className={`metric-card glass-card ${highlight ? 'highlight' : ''}`}
    whileHover={{ y: -3 }}
  >
    <div className="metric-header">
      <span className="metric-label">{label}</span>
      <Info size={14} className="text-muted" />
    </div>
    <div className="metric-value">{value}</div>
    <div className="metric-desc">{desc}</div>
  </motion.div>
);

const Predictions = () => {
  const [selectedStock, setSelectedStock] = useState('NVDA');
  const [selectedModel, setSelectedModel] = useState('LSTM');
  const [chartData, setChartData] = useState(generatePredictionData('LSTM', 850));
  const [isLive, setIsLive] = useState(true);
  const [basePrice, setBasePrice] = useState(850);
  
  const [liveMetrics, setLiveMetrics] = useState({ rmse: '4.21', r2: '0.92', direction: 'Strong Uptrend', conf: '92%' });

  // Simulate real-time continuous inference recalibration
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
        // Shift base price slightly to represent realtime action
        const shift = (Math.random() - 0.45) * 5;
        const newBasePrice = basePrice + shift;
        setBasePrice(newBasePrice);
        setChartData(generatePredictionData(selectedModel, newBasePrice));
        
        // Slightly jitter metrics to simulate live continuous ML output stream
        setLiveMetrics(prev => {
           let confBase = selectedModel === 'LSTM' ? 92 : selectedModel === 'Random Forest' ? 76 : 65;
           let newConf = (confBase + (Math.random() * 2 - 1)).toFixed(1);
           
           let rmseBase = selectedModel === 'LSTM' ? 4.21 : selectedModel === 'Random Forest' ? 6.45 : 8.12;
           let newRmse = (rmseBase + (Math.random() * 0.1 - 0.05)).toFixed(3);
           
           return {
               ...prev,
               conf: `${newConf}%`,
               rmse: newRmse
           };
        });
        
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isLive, selectedModel, basePrice]);

  const handleModelChange = (model) => {
    setSelectedModel(model);
    setChartData(generatePredictionData(model, basePrice));
    
    // Initial static metrics reset before live jitter takes over
    if (model === 'LSTM') setLiveMetrics({ rmse: '4.21', r2: '0.92', direction: 'Strong Uptrend', conf: '92%' });
    if (model === 'Random Forest') setLiveMetrics({ rmse: '6.45', r2: '0.86', direction: 'Volatile/Uptrend', conf: '76%' });
    if (model === 'Linear Regression') setLiveMetrics({ rmse: '8.12', r2: '0.74', direction: 'Moderate Uptrend', conf: '65%' });
  };

  return (
    <div className="predictions-container animate-fade-in">
      <div className="page-header flex-between">
        <div className="header-title">
          <Cpu className="text-gradient-purple" size={28} />
          <h1>AI Core Predictions</h1>
          <div className={`live-badge ${isLive ? 'active' : ''}`} onClick={() => setIsLive(!isLive)}>
            <div className="pulse-dot"></div>
            {isLive ? 'LIVE INFERENCE' : 'PAUSED'}
          </div>
        </div>
        <p className="header-subtitle">Continuous machine learning pipeline connected.</p>
      </div>

      <div className="control-panel glass-card">
        <div className="control-group">
          <label>Target Asset</label>
          <select 
            className="custom-select" 
            value={selectedStock} 
            onChange={(e) => {
                setSelectedStock(e.target.value);
                const seeds = { 'NVDA': 850, 'AAPL': 175, 'TSLA': 210, 'BTC': 65000 };
                setBasePrice(seeds[e.target.value]);
                setChartData(generatePredictionData(selectedModel, seeds[e.target.value]));
            }}
          >
            <option value="NVDA">NVIDIA Corp (NVDA)</option>
            <option value="AAPL">Apple Inc (AAPL)</option>
            <option value="TSLA">Tesla Inc (TSLA)</option>
            <option value="BTC">Bitcoin (BTC)</option>
          </select>
        </div>
        
        <div className="control-group model-selector">
          <label>ML Architecture</label>
          <div className="model-tabs">
            {['LSTM', 'Random Forest', 'Linear Regression'].map(model => (
              <button 
                key={model}
                className={`model-tab ${selectedModel === model ? 'active' : ''}`}
                onClick={() => handleModelChange(model)}
              >
                {model}
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label>Time Horizon</label>
          <select className="custom-select">
            <option value="7">7 Days</option>
            <option value="14">14 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>
      </div>

      <div className="prediction-layout">
        <div className="chart-main glass-card">
          <div className="chart-header">
            <h3>{selectedStock} - {selectedModel} Forecast <span className="text-muted" style={{fontSize:'0.8rem', marginLeft: '10px'}}>{isLive && "(Recalibrating...)"}</span></h3>
            <div className="chart-actions">
              <button className="icon-btn"><Settings2 size={16} /></button>
            </div>
          </div>
          
          <div className="main-graph">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{fill: 'var(--text-muted)', fontSize: 12}}
                  axisLine={{stroke: 'var(--border-light)'}}
                  tickLine={false}
                  minTickGap={20}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{fill: 'var(--text-muted)', fontSize: 12}}
                  axisLine={{stroke: 'var(--border-light)'}}
                  tickLine={false}
                  tickFormatter={(val) => `$${val.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card-hover)', border: '1px solid var(--border-medium)', borderRadius: '12px' }}
                />
                <Legend iconType="circle" />
                <Line 
                  type="monotone" 
                  dataKey="historical" 
                  name="Live Feed Price" 
                  stroke="var(--text-secondary)" 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="prediction" 
                  name="AI Future Prediction" 
                  stroke="var(--accent-purple)" 
                  strokeWidth={3} 
                  strokeDasharray="5 5"
                  dot={{ r: 4, fill: 'var(--bg-primary)', stroke: 'var(--accent-purple)', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'var(--accent-purple)' }}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="metrics-sidebar">
          <div className="insight-card glass-card">
            <div className="insight-icon"><Target size={24} color="var(--accent-brand)" /></div>
            <h4>Model Consensus</h4>
            <div className="consensus-value text-gradient">{liveMetrics.direction}</div>
            <p>Based on deeply connected neural network layers analyzing OHLCV + Sentiment data.</p>
          </div>

          <MetricCard 
            label="Real-time Confidence" 
            value={liveMetrics.conf} 
            desc="Probability of directional accuracy updating live" 
            highlight={true} 
          />
          <MetricCard 
            label="Root Mean Square Error" 
            value={liveMetrics.rmse} 
            desc="Average deviation from actuals in stream" 
          />
          <MetricCard 
            label="R² Score" 
            value={liveMetrics.r2} 
            desc="Coefficient of determination" 
          />
          
        </div>
      </div>
    </div>
  );
};

export default Predictions;
