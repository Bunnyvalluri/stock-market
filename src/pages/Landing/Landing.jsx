import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { 
  TrendingUp, Cpu, Activity, ShieldCheck, ArrowRight, 
  Database, BarChart3, LineChart, CheckCircle, 
  TerminalSquare, Globe, Zap, Shield, Layers, 
  Maximize, Briefcase, Gauge, Target
} from 'lucide-react';
import './Landing.css';

const generateSparkline = () => Array.from({ length: 40 }, (_, i) => ({ time: i, val: 100 + Math.random() * 30 + i }));

const Landing = () => {
  const navigate = useNavigate();
  const [sparkline, setSparkline] = useState(generateSparkline());
  const [activeModelTab, setActiveModelTab] = useState('LSTM');

  useEffect(() => {
    const timer = setInterval(() => {
      setSparkline(prev => {
        const last = prev[prev.length - 1].val;
        return [...prev.slice(1), { time: Date.now(), val: last + (Math.random() - 0.48) * 8 }];
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-premium-container">
      {/* Institutional Top Navigation */}
      <nav className="nav-institutional glass">
        <div className="nav-brand-wrap">
          <div className="brand-icon-box">
            <TrendingUp size={18} strokeWidth={3} />
          </div>
          <span className="brand-name">StockMind <span className="text-brand">AI</span></span>
        </div>
        
        <div className="nav-links-desktop">
          <a href="#engine" className="nav-link-pro">Engine</a>
          <a href="#performance" className="nav-link-pro">Performance</a>
          <a href="#terminal" className="nav-link-pro">Terminal</a>
          <a href="#pricing" className="nav-link-pro">Security</a>
        </div>
        
        <div className="nav-cta-group">
          <button className="login-link hidden-mobile" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn-terminal-launch" onClick={() => navigate('/login')}>
            Launch Terminal <Maximize size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section - Quantitative Intel */}
      <section className="hero-institutional">
        <div className="hero-noise-overlay"></div>
        <div className="hero-grid-pro"></div>
        <div className="hero-glow-blue"></div>

        <div className="hero-content-pro">
          <motion.div 
            className="pro-badge-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="node-status"><span className="dot pulse"></span> CLUSTER ACTIVE</span>
            <span className="node-id">v2.4.0-STABLE [US-EAST]</span>
          </motion.div>
          
          <motion.h1 
            className="hero-pro-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Precision execution <br />
            <span className="text-shimmer-pro">built on neural code.</span>
          </motion.h1>
          
          <motion.p 
            className="hero-pro-desc"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The next generation of quantitative asset management. Our deep learning core ingests 4PB of tick data daily to forecast absolute alpha across 12,000+ global instruments.
          </motion.p>
          
          <motion.div 
            className="hero-pro-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button className="btn-pro-primary" onClick={() => navigate('/login')}>
              Deploy Terminal Account
            </button>
            <button className="btn-pro-outline">
              Review Methodology
            </button>
          </motion.div>
        </div>

        {/* Live Interface Simulation */}
        <motion.div 
          className="hero-pro-viewport glass-card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <div className="viewport-header">
            <div className="mac-controls"><span></span><span></span><span></span></div>
            <div className="viewport-title font-mono">STOCKMIND_TERMINAL_V2.EXE</div>
          </div>
          <div className="viewport-body">
             <div className="viewport-sidebar">
                <div className="v-stat">
                   <span className="v-label">Inference Latency</span>
                   <span className="v-val text-brand">14.2ms</span>
                </div>
                <div className="v-stat mt-4">
                   <span className="v-label">Model Confidence</span>
                   <span className="v-val text-cyan">92.4%</span>
                </div>
                <div className="v-graph-skeleton mt-6">
                   <div className="bar-pro" style={{height: '40%'}}></div>
                   <div className="bar-pro active" style={{height: '70%'}}></div>
                   <div className="bar-pro" style={{height: '30%'}}></div>
                   <div className="bar-pro" style={{height: '55%'}}></div>
                </div>
             </div>
             <div className="viewport-main">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={sparkline}>
                    <defs>
                      <linearGradient id="heroPriceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent-brand)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent-brand)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Area 
                        type="monotone" 
                        dataKey="val" 
                        stroke="var(--accent-brand)" 
                        strokeWidth={3} 
                        fill="url(#heroPriceGrad)" 
                        isAnimationActive={false} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="viewport-footer-pro">
                    <span className="text-muted text-xs font-mono">TERMINAL FEED: CONNECTED [12,482 TPS]</span>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Corporate Liquidity Bar */}
      <section className="liquidity-track-pro">
        <p>INSTITUTIONAL LIQUIDITY PIPELINES</p>
        <div className="ticker-scroll-pro">
           <span>NASDAQ</span>
           <span className="dot"></span>
           <span>NYSE</span>
           <span className="dot"></span>
           <span>BLOOMBERG LP</span>
           <span className="dot"></span>
           <span>INTERACTIVE BROKERS</span>
           <span className="dot"></span>
           <span>CME GROUP</span>
           <span className="dot"></span>
           <span>GOLDMAN SACHS DATA</span>
        </div>
      </section>

      {/* Quantitative Backtesting Section */}
      <section id="performance" className="performance-pro-section">
          <div className="section-head-pro">
              <span className="tag-pro">MODEL PERFORMANCE</span>
              <h2>Proprietary Backtesting Matrix</h2>
              <p>Institutional benchmarks based on 10,000+ simulated market regimes.</p>
          </div>
          
          <div className="perf-grid-pro">
              <div className="perf-card-pro glass-card">
                  <Gauge size={24} className="text-brand mb-4" />
                  <h4>Sharpe Ratio</h4>
                  <h3>3.42</h3>
                  <p>Weighted risk-adjusted return parameters.</p>
              </div>
              <div className="perf-card-pro glass-card">
                  <Target size={24} className="text-cyan mb-4" />
                  <h4>Directional Win Rate</h4>
                  <h3>91.2%</h3>
                  <p>Binary forecast accuracy over 7-day horizons.</p>
              </div>
              <div className="perf-card-pro glass-card">
                  <Activity size={24} className="text-orange mb-4" />
                  <h4>Model Convergence</h4>
                  <h3>&lt; 40ms</h3>
                  <p>Inference to execution delta across global nodes.</p>
              </div>
              <div className="perf-card-pro glass-card">
                  <CheckCircle size={24} className="text-brand mb-4" />
                  <h4>Validation Purity</h4>
                  <h3>99.98%</h3>
                  <p>Loss gradient minimization in Out-of-Sample testing.</p>
              </div>
          </div>
      </section>

      {/* Core Technology Features - Bento Pro */}
      <section id="engine" className="engine-pro-section">
         <div className="section-head-pro">
            <span className="tag-pro">STOCKMIND AI INFRASTRUCTURE</span>
            <h2>Sub-Millisecond AI Core</h2>
         </div>
         
         <div className="bento-pro-grid">
            <div className="bento-pro-card col-span-2 horizontal-pro">
               <div className="b-pro-content">
                  <div className="b-pro-icon"><Cpu size={28} /></div>
                  <h3>Multi-Layer LSTM Architectures</h3>
                  <p>Our deep-stacked networks analyze historical autocorrelation combined with real-time news sentiment to predict price discovery before it hits the tape.</p>
                  <ul className="b-pro-list">
                      <li><CheckCircle size={14} className="text-brand" /> 512 Hidden Units Layer-1</li>
                      <li><CheckCircle size={14} className="text-brand" /> Softmax Liquidity Scoring</li>
                      <li><CheckCircle size={14} className="text-brand" /> Dynamic Loss Gradient Shifting</li>
                  </ul>
               </div>
               <div className="b-pro-visual">
                  <div className="visual-code-term">
                     <span className="c-blue">export</span> <span className="c-gold">class</span> <span className="c-cyan">StockMindEngine</span> &#123; <br />
                     &nbsp;&nbsp;<span className="c-muted">// High-Frequency Execution Hook</span> <br />
                     &nbsp;&nbsp;<span className="c-gold">async</span> <span className="c-cyan">executeTarget</span>(symbol) &#123; <br />
                     &nbsp;&nbsp;&nbsp;&nbsp;<span className="c-blue">const</span> signal = <span className="c-blue">await</span> <span className="c-red">model</span>.<span className="c-gold">forwardPass</span>(symbol); <br />
                     &nbsp;&nbsp;&nbsp;&nbsp;<span className="c-gold">return</span> <span className="c-red">signal</span>.confidence &gt; <span className="c-purple">0.92</span>; <br />
                     &nbsp;&nbsp;&#125; <br />
                     &#125;
                  </div>
               </div>
            </div>
            
            <div className="bento-pro-card">
               <div className="b-pro-content">
                  <div className="b-pro-icon icon-cyan"><Zap size={28} /></div>
                  <h3>WebSocket Pulse</h3>
                  <p>Zero-latency data pipelines stream quotes and AI signals directly to your terminal at 144Hz.</p>
               </div>
            </div>

            <div className="bento-pro-card">
               <div className="b-pro-content">
                  <div className="b-pro-icon icon-orange"><Database size={28} /></div>
                  <h3>Firecrawl Dataset</h3>
                  <p>In-situ LLM extraction of unstructured news web-data into actionable sentiment matrices.</p>
               </div>
            </div>
            
            <div className="bento-pro-card col-span-2 h-pro-v2">
               <div className="b-pro-content">
                  <div className="b-pro-icon"><Briefcase size={28} /></div>
                  <h3>Total Capital Control</h3>
                  <p>Institutional-grade risk management. Set automated stop-losses, dynamic position sizing, and margin controls powered by our AI risk-scoring engine.</p>
               </div>
               <div className="b-pro-visual center-items">
                   <div className="risk-dial-pro">
                        <div className="dial-val">RISK: 0.12</div>
                        <div className="dial-sub">OPTIMAL LIQUIDITY</div>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* Global Connectivity Maps */}
      <section className="global-map-pro mt-20">
         <div className="section-head-pro text-center">
            <Globe size={40} className="mx-auto text-brand mb-4" />
            <h2>Zero-Distance Connectivity</h2>
            <p>Direct fiber links to major financial exchanges for absolute speed superiority.</p>
         </div>
         <div className="connection-nodes-wrap">
            <div className="node-item">NYC <span className="ms">&lt; 1ms</span></div>
            <div className="node-item">LON <span className="ms">12ms</span></div>
            <div className="node-item">TYO <span className="ms">42ms</span></div>
            <div className="node-item">HKG <span className="ms">45ms</span></div>
         </div>
      </section>

      {/* Footer Pro */}
      <footer className="footer-institutional">
         <div className="f-pro-grid">
            <div className="f-pro-identity">
                <div className="brand-logo-small mb-4">
                  <TrendingUp size={16} strokeWidth={3} className="text-brand" />
                  <span className="font-bold">STOCKMIND AI</span>
                </div>
                <p className="text-muted text-sm">Empowering quantitative traders with the world's most sophisticated deep learning engine.</p>
            </div>
            <div className="f-pro-col">
               <h4>Core Terminal</h4>
               <a href="#">Market Matrix</a>
               <a href="#">AI Predictions</a>
               <a href="#">Portfolio Alpha</a>
            </div>
            <div className="f-pro-col">
               <h4>Resources</h4>
               <a href="#">API Docs</a>
               <a href="#">Methodology</a>
               <a href="#">Case Studies</a>
            </div>
            <div className="f-pro-col">
               <h4>Security</h4>
               <a href="#">Data Encryption</a>
               <a href="#">GDPR Policy</a>
               <a href="#">Compliance</a>
            </div>
         </div>
         <div className="f-pro-bottom">
            <span>© 2026 StockMind AI High-Frequency Infrastructure. All rights reserved.</span>
            <div className="f-pro-legal">
               <a href="#">Terms of Execution</a>
               <a href="#">Privacy Matrix</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
