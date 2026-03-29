import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { TrendingUp, Cpu, Activity, ShieldCheck, ArrowRight, Database, BarChart3, LineChart } from 'lucide-react';
import './Landing.css';

const generateSparkline = () => Array.from({ length: 40 }, (_, i) => ({ time: i, val: 100 + Math.random() * 20 + i }));

const Landing = () => {
  const navigate = useNavigate();
  const [sparkline, setSparkline] = useState(generateSparkline());

  useEffect(() => {
    const timer = setInterval(() => {
      setSparkline(prev => {
        const last = prev[prev.length - 1].val;
        return [...prev.slice(1), { time: Date.now(), val: last + (Math.random() - 0.45) * 5 }];
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-premium">
      {/* Navigation */}
      <nav className="nav-premium">
        <div className="nav-brand">
          <div className="brand-logo">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <span className="brand-text">NeuralTrade</span>
        </div>
        
        <div className="nav-center hidden-mobile">
          <a href="#platform" className="nav-item">Platform</a>
          <a href="#models" className="nav-item">AI Models</a>
          <a href="#pricing" className="nav-item">Pricing</a>
          <a href="#docs" className="nav-item text-muted">API Docs</a>
        </div>
        
        <div className="nav-actions">
          <button className="nav-login hidden-mobile" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn-launch" onClick={() => navigate('/login')}>
            Launch Dashboard <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-premium">
        <div className="hero-grid-bg"></div>
        <div className="hero-glow-blob"></div>

        <div className="hero-content-wrapper">
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="live-pill"><span className="dot"></span> Live Pipeline</span>
            <span className="badge-text">v2.0 LSTM Architecture deployed</span>
          </motion.div>
          
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Institutional intelligence, <br />
            <span className="text-shimmer">democratized.</span>
          </motion.h1>
          
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Execute trades with the precision of a quantitative hedge fund. Our deep learning engine analyzes millions of data points across global markets in real-time to forecast absolute price action.
          </motion.p>
          
          <motion.div 
            className="hero-cta-group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button className="btn-primary-large" onClick={() => navigate('/login')}>
              Access Terminal
            </button>
            <button className="btn-secondary-large">
              Read Whitepaper
            </button>
          </motion.div>
        </div>

        {/* Abstract Interface Preview */}
        <motion.div 
          className="hero-interface-preview"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="preview-header">
            <div className="mac-dots"><span></span><span></span><span></span></div>
            <div className="preview-title">neural-engine.tsx</div>
          </div>
          <div className="preview-body layout-split">
             <div className="preview-sidebar">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line medium mt-2"></div>
                <div className="skeleton-line long mt-2"></div>
                
                <div className="metric-box mt-4">
                  <span className="mb-label">Model Confidence</span>
                  <span className="mb-val text-cyan">94.2%</span>
                </div>
             </div>
             <div className="preview-main">
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={sparkline}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Area type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Enterprise Logos */}
      <section className="enterprise-logos">
        <p>INTEGRATING PIPELINES DIRECTLY FROM</p>
        <div className="logo-track">
           <span>ALPHAVANTAGE</span>
           <span>BLOOMBERG</span>
           <span>REUTERS</span>
           <span>NASDAQ DATA</span>
           <span>INTERACTIVE BROKERS</span>
        </div>
      </section>

      {/* Bento Box Features */}
      <section id="platform" className="bento-section">
         <div className="bento-header">
            <h2>The ultimate infrastructure <br/> for proactive investors.</h2>
         </div>
         
         <div className="bento-grid">
            <motion.div 
              className="bento-card col-span-2"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
               <div className="bento-content">
                 <div className="bIcon"><Cpu size={24} /></div>
                 <h3>Deep Learning Prediction Engine</h3>
                 <p>Deploy LSTM neural networks trained on 10+ years of historical OHLCV data. Our proprietary models adapt to shifting market regimes without human intervention.</p>
               </div>
               <div className="bento-visual overflow-hidden">
                  <div className="mock-code">
                     <code>import &#123; LSTM &#125; from '@neural/core';</code><br/>
                     <code>const model = new LSTM(&#123; layers: 5, epochs: 1000 &#125;);</code><br/>
                     <code className="text-cyan">await model.train(marketData);</code><br/>
                     <code>const prediction = model.predict('NVDA');</code>
                  </div>
               </div>
            </motion.div>
            
            <motion.div 
              className="bento-card"
              whileHover={{ y: -5 }}
            >
               <div className="bento-content">
                 <div className="bIcon"><Activity size={24} /></div>
                 <h3>Sub-500ms Execution</h3>
                 <p>Real-time WebSocket pipes ensure your dashboard reflects market volatility instantly.</p>
               </div>
            </motion.div>

            <motion.div 
              className="bento-card"
              whileHover={{ y: -5 }}
            >
               <div className="bento-content">
                 <div className="bIcon"><Database size={24} /></div>
                 <h3>Sentiment Analysis</h3>
                 <p>NLP clusters scrape headlines and assign directional bias to breaking financial news.</p>
               </div>
            </motion.div>
            
            <motion.div 
              className="bento-card col-span-2 horizontal"
              whileHover={{ y: -5 }}
            >
               <div className="bento-visual right-side">
                  <div className="mini-chart-mock">
                     <BarChart3 size={64} className="text-muted" strokeWidth={1} />
                  </div>
               </div>
               <div className="bento-content">
                 <div className="bIcon"><LineChart size={24} /></div>
                 <h3>Automated Portfolio Scaling</h3>
                 <p>Connect your brokerage account via secure OAuth and let our AI handle dynamic position sizing based on calculated risk-adjusted return parameters.</p>
               </div>
            </motion.div>
         </div>
      </section>

      {/* Footer */}
      <footer className="footer-premium">
         <div className="footer-top">
            <div className="f-col">
               <div className="nav-brand mb-4">
                 <TrendingUp size={20} strokeWidth={2.5} className="text-cyan" />
                 <span className="brand-text">NeuralTrade</span>
               </div>
               <p className="text-muted text-sm">Empowering retail traders with hedge-fund tools. AI forecasting carries inherent analytical risk.</p>
            </div>
            <div className="f-col">
               <h4>Product</h4>
               <a href="#">Terminal</a>
               <a href="#">ML Models</a>
               <a href="#">API Access</a>
            </div>
            <div className="f-col">
               <h4>Company</h4>
               <a href="#">About</a>
               <a href="#">Research</a>
               <a href="#">Security</a>
            </div>
         </div>
         <div className="footer-bottom">
            <span>© 2026 NeuralTrade. All rights reserved.</span>
            <div className="legal-links">
               <a href="#">Terms</a>
               <a href="#">Privacy</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
