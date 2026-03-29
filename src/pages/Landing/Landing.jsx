import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, Cpu, Activity, ShieldCheck, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import './Landing.css';

// Generate some mock history for the hero background chart
const generateHeroChart = () => {
  const data = [];
  let price = 500;
  for (let i = 0; i < 40; i++) {
    price += (Math.random() - 0.45) * 20;
    data.push({ time: i, price });
  }
  return data;
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    className="feature-card glass-card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    <div className="fc-icon">{icon}</div>
    <h3>{title}</h3>
    <p className="text-muted">{description}</p>
  </motion.div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState(generateHeroChart());

  // Make the background chart feel "live"
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroData(prev => {
        const lastPrice = prev[prev.length - 1].price;
        const newPrice = lastPrice + (Math.random() - 0.45) * 25;
        return [...prev.slice(1), { time: Date.now(), price: newPrice }];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing-container">
      {/* Navbar for Landing */}
      <nav className="landing-nav glass">
        <div className="logo-container">
          <div className="logo-icon glow-icon">
            <TrendingUp size={24} color="#fff" />
          </div>
          <h2 className="logo-text">Neural<span className="text-gradient">Trade</span></h2>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#models">AI Models</a>
          <button className="primary-btn px-6" onClick={() => navigate('/dashboard')}>
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={heroData}>
              <defs>
                <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-brand)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--accent-brand)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="var(--accent-brand)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#heroGradient)" 
                isAnimationActive={true}
                animationDuration={1500}
                animationEasing="linear"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="hero-content">
          <motion.div 
            className="beta-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="pulse-dot"></span>
            Real-Time AI Market Engine v1.0 Live
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Predict the Future of <br/>
            <span className="text-gradient-purple">Global Markets.</span>
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle text-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Institutional-grade machine learning models, real-time WebSockets, and sentiment analysis designed directly for the retail investor.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <button className="primary-btn hero-btn" onClick={() => navigate('/dashboard')}>
              Enter Dashboard <ArrowRight size={20} />
            </button>
            <button className="secondary-btn hero-btn glow-border">
              View API Docs
            </button>
          </motion.div>

          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="stat-item">
              <h4>$250B+</h4>
              <span className="text-muted">Analyzed Volume</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h4>92.4%</h4>
              <span className="text-muted">LSTM Accuracy</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <h4>&lt;500ms</h4>
              <span className="text-muted">Tick Latency</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-section glass">
        <p className="text-muted">POWERING PREDICTIONS USING DATA FROM</p>
        <div className="trust-logos">
          <h2>AlphaVantage</h2>
          <h2>NASDAQ</h2>
          <h2>NYSE</h2>
          <h2>Bloomberg</h2>
          <h2>Reuters</h2>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="section-header text-center">
          <h2 className="section-title">Why NeuralTrade?</h2>
          <p className="section-desc text-muted">Advanced analytics previously only available to hedge funds, now directly in your browser.</p>
        </div>
        
        <div className="features-grid">
          <FeatureCard 
            icon={<Activity size={28} className="text-gradient-cyan" />}
            title="Real-Time Tick Data"
            description="WebSocket integrations stream sub-500ms market changes and top gainers instantly."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Cpu size={28} className="text-gradient-purple" />}
            title="Deep Learning Models"
            description="Toggle between LSTM, Random Forest, and Linear Regression to forecast 30-day horizons."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Zap size={28} className="text-brand" />}
            title="News Sentiment NLP"
            description="We aggregate and score thousands of financial articles to generate bullish/bearish confidence thresholds."
            delay={0.3}
          />
          <FeatureCard 
            icon={<ShieldCheck size={28} className="text-status-up" />}
            title="Portfolio Tracking"
            description="Live aggregate P&L monitoring alongside risk metrics like Value at Risk (VaR)."
            delay={0.4}
          />
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
           <div className="logo-container">
             <div className="logo-icon"><TrendingUp size={20} color="#fff" /></div>
             <h2 className="logo-text">Neural<span>Trade</span></h2>
           </div>
           <p className="text-muted text-sm mt-4">© 2026 NeuralTrade Inc. All rights reserved. Predictions are not financial advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
