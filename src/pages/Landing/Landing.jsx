import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';
import { 
  TrendingUp, Cpu, Activity, ShieldCheck, ArrowRight, 
  Database, BarChart3, LineChart, CheckCircle, 
  TerminalSquare, Globe, Zap, Shield, Layers, 
  Maximize, Briefcase, Gauge, Target, Menu, X,
  Lock, Server, Fingerprint
} from 'lucide-react';

import toast from 'react-hot-toast';
import './Landing.css';

const generateSparkline = () => Array.from({ length: 40 }, (_, i) => ({ time: i, val: 100 + Math.random() * 30 + i }));



const Landing = () => {
  const navigate = useNavigate();
  const [sparkline, setSparkline] = useState(generateSparkline());
  const [activeModelTab, setActiveModelTab] = useState('LSTM');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);


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
        <div className="nav-brand-wrap cursor-pointer" onClick={() => navigate('/dashboard')}>
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
          <button className="btn-terminal-launch hidden-mobile" onClick={() => navigate('/login')}>
            Launch Terminal <Maximize size={14} />
          </button>
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="mobile-nav-overlay"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-nav-links">
                <a href="#engine" onClick={toggleMobileMenu}>Engine</a>
                <a href="#performance" onClick={toggleMobileMenu}>Performance</a>
                <a href="#terminal" onClick={toggleMobileMenu}>Terminal</a>
                <a href="#pricing" onClick={toggleMobileMenu}>Security</a>
                <div className="mobile-nav-divider"></div>
                <button className="mobile-login-btn" onClick={() => { navigate('/login'); toggleMobileMenu(); }}>Sign In</button>
                <button className="mobile-launch-btn" onClick={() => { navigate('/login'); toggleMobileMenu(); }}>Launch Terminal</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
            Institutional AI Trading <br />
            <span className="text-shimmer-pro">built for maximum performance.</span>
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
            <button className="btn-pro-outline" onClick={() => toast('Methodology documentation opening securely...', {icon: '📚'})}>
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
            <div className="viewport-title font-mono flex items-center gap-2">
               <div className="mini-pulse"></div>
               STOCKMIND_TERMINAL_V2.EXE // SESSION: ACTIVE
            </div>
          </div>
          <div className="viewport-body">
             <div className="viewport-sidebar">
                <div className="v-stat">
                   <span className="v-label">Inference Latency</span>
                   <span className="v-val text-brand tabular-nums">14.22ms</span>
                </div>
                <div className="v-stat mt-4">
                   <span className="v-label">Model Confidence</span>
                   <span className="v-val text-cyan tabular-nums">92.48%</span>
                </div>
                <div className="v-stat mt-4">
                    <span className="v-label">Backtest Grains</span>
                    <span className="v-val text-orange tabular-nums">4.2M</span>
                </div>
                <div className="v-graph-skeleton mt-6">
                   <div className="bar-pro" style={{height: '40%'}}></div>
                   <div className="bar-pro active" style={{height: '70%'}}></div>
                   <div className="bar-pro" style={{height: '30%'}}></div>
                   <div className="bar-pro" style={{height: '55%'}}></div>
                </div>
             </div>
             <div className="viewport-main">
                <ResponsiveContainer width="100%" height={260}>
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
                    <div className="flex-between">
                        <span className="text-muted text-xs font-mono">FEED: CONNECTED [12.4K TPS]</span>
                        <div className="flex gap-4">
                           <span className="text-xs font-mono text-brand">NODE: EAST-01</span>
                           <span className="text-xs font-mono text-cyan">LATENCY: OPTIMAL</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Security Hub - New (Institutional) */}
      <section id="pricing" className="security-hub-section py-20">
          <div className="max-w-7xl mx-auto px-6">
              <div className="glass-card security-matrix-card p-10 border-brand/30 bg-brand/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                      <div>
                          <div className="flex items-center gap-3 mb-4">
                              <div className="p-2 bg-brand/20 rounded-lg text-brand"><ShieldCheck size={28} /></div>
                              <h2 className="text-2xl font-bold uppercase tracking-wider">Enterprise Security Matrix</h2>
                          </div>
                          <p className="text-muted mb-8 leading-relaxed">
                              StockMind AI utilizes military-grade AES-256 encryption for all data transit. Our infrastructure is SOC-2 Type II compliant and undergoes monthly penetration testing by independent security auditors.
                          </p>
                          <div className="security-badges flex gap-6">
                              <div className="s-badge"><span>SOC2</span> CERTIFIED</div>
                              <div className="s-badge"><span>GDPR</span> COMPLIANT</div>
                              <div className="s-badge"><span>ISO</span> 27001</div>
                          </div>
                      </div>
                      <div className="security-features-list grid grid-cols-1 gap-4">
                          <div className="s-feat-item glass p-4 rounded-lg flex gap-4 items-start">
                             <Fingerprint className="text-brand shrink-0" size={20} />
                             <div>
                                <h4 className="text-sm font-bold">Biometric Vaulting</h4>
                                <p className="text-xs text-muted mt-1">Multi-factor authentication via hardware keys (YubiKey) required for high-volume execution orders.</p>
                             </div>
                          </div>
                          <div className="s-feat-item glass p-4 rounded-lg flex gap-4 items-start">
                             <Server className="text-cyan shrink-0" size={20} />
                             <div>
                                <h4 className="text-sm font-bold">Isolated Execution Nodes</h4>
                                <p className="text-xs text-muted mt-1">Each institutional instance runs on an air-gapped, dedicated compute cluster for zero cross-contamination.</p>
                             </div>
                          </div>
                          <div className="s-feat-item glass p-4 rounded-lg flex gap-4 items-start">
                             <Lock className="text-orange shrink-0" size={20} />
                             <div>
                                <h4 className="text-sm font-bold">Zero-Knowledge Architecture</h4>
                                <p className="text-xs text-muted mt-1">Your trading strategies and API credentials are never stored in plain text, even within internal memory.</p>
                             </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>


      {/* Corporate Liquidity Bar */}
      <section className="liquidity-track-pro">
        <div 
           className="liquidity-routing-btn" 
           onClick={() => navigate('/markets')}
        >
           INSTITUTIONAL LIQUIDITY PIPELINES <ArrowRight size={14} />
        </div>
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
              <div className="perf-card-pro glass-card cursor-pointer pb-hover" onClick={() => navigate('/predictions')}>
                  <Gauge size={24} className="text-brand mb-4" />
                  <h4>Sharpe Ratio</h4>
                  <h3>3.42</h3>
                  <p>Weighted risk-adjusted return parameters.</p>
              </div>
              <div className="perf-card-pro glass-card cursor-pointer pb-hover" onClick={() => navigate('/predictions')}>
                  <Target size={24} className="text-cyan mb-4" />
                  <h4>Directional Win Rate</h4>
                  <h3>91.2%</h3>
                  <p>Binary forecast accuracy over 7-day horizons.</p>
              </div>
              <div className="perf-card-pro glass-card cursor-pointer pb-hover" onClick={() => navigate('/predictions')}>
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
            <motion.div 
               className="bento-pro-card col-span-2 horizontal-pro cursor-pointer transition-transform hover:-translate-y-1" 
               onClick={() => navigate('/predictions')}
               whileInView={{ opacity: [0, 1], y: [20, 0] }}
               viewport={{ once: true }}
            >
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
            </motion.div>
            
            <motion.div 
               className="bento-pro-card cursor-pointer transition-transform hover:-translate-y-1" 
               onClick={() => navigate('/markets')}
               whileInView={{ opacity: [0, 1], x: [20, 0] }}
               viewport={{ once: true }}
            >
               <div className="b-pro-content">
                  <div className="b-pro-icon icon-cyan"><Zap size={28} /></div>
                  <h3>WebSocket Pulse</h3>
                  <p>Zero-latency data pipelines stream quotes and AI signals directly to your terminal at 144Hz.</p>
               </div>
            </motion.div>

            <motion.div 
               className="bento-pro-card cursor-pointer transition-transform hover:-translate-y-1" 
               onClick={() => navigate('/predictions')}
               whileInView={{ opacity: [0, 1], x: [-20, 0] }}
               viewport={{ once: true }}
            >
               <div className="b-pro-content">
                  <div className="b-pro-icon icon-orange"><Database size={28} /></div>
                  <h3>Firecrawl Dataset</h3>
                  <p>In-situ LLM extraction of unstructured news web-data into actionable sentiment matrices.</p>
               </div>
            </motion.div>
            
            <motion.div 
               className="bento-pro-card col-span-2 h-pro-v2 cursor-pointer transition-transform hover:-translate-y-1" 
               onClick={() => navigate('/portfolio')}
               whileInView={{ opacity: [0, 1], y: [20, 0] }}
               viewport={{ once: true }}
            >
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
            </motion.div>
          </div>
       </section>

       {/* Neural Highway - NEW (The WOW factor) */}
       <section className="neural-highway-section py-32 relative overflow-hidden">
          <div className="highway-bg-glow"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="highway-stats">
                   <motion.span 
                      className="tag-pro mb-4 inline-block"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                   >THE NEURAL HIGHWAY</motion.span>
                   <motion.h2 
                      className="text-5xl font-bold mb-6"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                   >Flowing with <span className="text-brand">Alpha.</span></motion.h2>
                   <p className="text-lg text-muted leading-relaxed">
                      Our proprietary fiber pathways connect the StockMind AI core directly to NYSE and NASDAQ liquidity pools, bypassing the public internet for absolute execution superiority.
                   </p>
                   <div className="flex gap-10 mt-10">
                       <div className="h-stat">
                           <div className="h-val font-mono text-3xl text-up">99.99%</div>
                           <div className="h-lab text-xs uppercase font-bold text-muted">Availability</div>
                       </div>
                       <div className="h-stat">
                           <div className="h-val font-mono text-3xl text-cyan">0.08ms</div>
                           <div className="h-lab text-xs uppercase font-bold text-muted">Jitter</div>
                       </div>
                   </div>
                </div>
                <div className="highway-visual relative h-64 md:h-96">
                   <div className="highway-line"></div>
                   <motion.div 
                      className="data-packet p-1"
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   >
                      <Zap size={14} className="text-brand" />
                   </motion.div>
                   <motion.div 
                      className="data-packet p-1"
                      animate={{ offsetDistance: ["0%", "100%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                   >
                      <Cpu size={14} className="text-cyan" />
                   </motion.div>
                   <div className="node-box n-start">STOCKMIND CORE</div>
                   <div className="node-box n-end">NYSE / NASDAQ</div>
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
               <a href="#" onClick={(e) => { e.preventDefault(); navigate('/markets'); }}>Market Matrix</a>
               <a href="#" onClick={(e) => { e.preventDefault(); navigate('/predictions'); }}>AI Insights</a>
               <a href="#" onClick={(e) => { e.preventDefault(); navigate('/portfolio'); }}>Portfolio Alpha</a>
            </div>
            <div className="f-pro-col">
               <h4>Resources</h4>
               <a href="#" onClick={(e) => { e.preventDefault(); toast.loading('Establishing secure API tunnel...', {duration: 1500}); }}>API Docs</a>
               <a href="#" onClick={(e) => { e.preventDefault(); toast('Accessing methodology archives...', {icon:'📚'}); }}>Methodology</a>
               <a href="#" onClick={(e) => { e.preventDefault(); toast('Fetching institutional case studies...', {icon:'💼'}); }}>Case Studies</a>
            </div>
            <div className="f-pro-col">
               <h4>Security</h4>
               <a href="#" onClick={(e) => { e.preventDefault(); toast.success('Encryption standards verified.', {icon:'🔒'}); }}>Data Encryption</a>
               <a href="#" onClick={(e) => { e.preventDefault(); toast('Viewing GDPR Compliance Matrix...', {icon:'🛡️'}); }}>GDPR Policy</a>
               <a href="#" onClick={(e) => { e.preventDefault(); toast('SOC-2 Type II Compliance achieved.', {icon:'✅'}); }}>Compliance</a>
            </div>
         </div>
         <div className="f-pro-bottom">
            <span>© 2026 StockMind AI High-Frequency Infrastructure. All rights reserved.</span>
            <div className="f-pro-legal">
               <a href="#" onClick={(e) => { e.preventDefault(); toast('Loading execution SLA terms...', {icon:'⚖️'}); }}>Terms of Execution</a>
               <a href="#" onClick={(e) => { e.preventDefault(); toast('Loading privacy telemetry details...', {icon:'👀'}); }}>Privacy Matrix</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
