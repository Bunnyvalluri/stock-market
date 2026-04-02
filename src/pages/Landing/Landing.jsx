import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import {
  TrendingUp, Cpu, Activity, ShieldCheck, ArrowRight,
  Database, Zap, Shield, Briefcase, Gauge, Target,
  Menu, X, Lock, Server, Fingerprint, BarChart2,
  ChevronRight, Sparkles, Globe2, LineChart, CheckCircle2,
  ArrowUpRight, Brain, Layers3
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Landing.css';

/* ─── Animated sparkline data ─── */
const genSpark = () => Array.from({ length: 50 }, (_, i) => ({ t: i, v: 100 + Math.random() * 40 + i * 0.5 }));

/* ─── Floating particle component ─── */
const Particle = ({ delay, x, y, size }) => (
  <motion.div
    className="lp-particle"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ y: [0, -30, 0], opacity: [0, 0.6, 0] }}
    transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

/* ─── Stats ticker items ─── */
const TICKERS = [
  { label: 'AAPL', val: '+2.34%', up: true },
  { label: 'TSLA', val: '+5.17%', up: true },
  { label: 'NVDA', val: '+8.92%', up: true },
  { label: 'MSFT', val: '+1.28%', up: true },
  { label: 'GOOGL', val: '-0.41%', up: false },
  { label: 'AMZN', val: '+3.66%', up: true },
  { label: 'META', val: '+4.12%', up: true },
  { label: 'BTC/USD', val: '+6.88%', up: true },
];

/* ─── Feature cards ─── */
const FEATURES = [
  {
    icon: <Brain size={26} />, color: 'blue',
    title: 'Multi-Layer LSTM AI',
    desc: 'Deep-stacked neural networks analyze autocorrelation + real-time news sentiment to forecast price discovery before it hits the tape.',
    span: 2
  },
  {
    icon: <Zap size={26} />, color: 'cyan',
    title: 'WebSocket Pulse',
    desc: 'Zero-latency data pipelines stream quotes at 144Hz with sub-millisecond execution.',
    span: 1
  },
  {
    icon: <Database size={26} />, color: 'purple',
    title: 'Firecrawl Dataset',
    desc: 'LLM extraction of unstructured web data into actionable sentiment matrices.',
    span: 1
  },
  {
    icon: <Shield size={26} />, color: 'green',
    title: 'Zero-Knowledge Security',
    desc: 'AES-256-GCM encryption with isolated air-gapped compute nodes.',
    span: 1
  },
  {
    icon: <Briefcase size={26} />, color: 'orange',
    title: 'Total Capital Control',
    desc: 'Institutional risk management with AI-powered position sizing & stop-loss automation.',
    span: 1
  },
];

/* ─── Stats ─── */
const STATS = [
  { val: '91.2%', label: 'Directional Win Rate', color: 'blue' },
  { val: '3.42', label: 'Sharpe Ratio', color: 'cyan' },
  { val: '14ms', label: 'Inference Latency', color: 'purple' },
  { val: '99.99%', label: 'Uptime SLA', color: 'green' },
];

/* ─── Trusted by logos ─── */
const TRUSTED = ['NASDAQ', 'NYSE', 'BLOOMBERG LP', 'CME GROUP', 'INTERACTIVE BROKERS', 'GOLDMAN SACHS'];

/* ─── Counter animation hook ─── */
function useCounter(target, duration = 2) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseFloat(target.replace(/[^0-9.]/g, ''));
        const suffix = target.replace(/[0-9.]/g, '');
        let start = 0;
        const steps = 60;
        const inc = num / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += inc;
          if (current >= num) { current = num; clearInterval(timer); }
          setCount(current.toFixed(target.includes('.') ? 1 : 0) + suffix);
        }, (duration * 1000) / steps);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return [count || '0', ref];
}

/* ─── Individual stat card with counter ─── */
const StatCard = ({ val, label, color, index }) => {
  const [animated, ref] = useCounter(val);
  return (
    <motion.div
      ref={ref}
      className={`lp-stat-card lp-stat-${color}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.03, y: -4 }}
    >
      <div className="lp-stat-val">{animated}</div>
      <div className="lp-stat-label">{label}</div>
      <div className="lp-stat-glow" />
    </motion.div>
  );
};

/* ─── Main Landing Component ─── */
const Landing = () => {
  const navigate = useNavigate();
  const [spark, setSpark] = useState(genSpark());
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  /* Live sparkline */
  useEffect(() => {
    const t = setInterval(() => {
      setSpark(p => {
        const last = p[p.length - 1].v;
        return [...p.slice(1), { t: Date.now(), v: Math.max(80, last + (Math.random() - 0.47) * 6) }];
      });
    }, 1200);
    return () => clearInterval(t);
  }, []);

  /* Nav scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Particles */
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 4,
  }));

  return (
    <div className="lp-root">
      {/* ─── NAVIGATION ─── */}
      <motion.nav
        className={`lp-nav ${scrolled ? 'lp-nav-scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="lp-nav-brand" onClick={() => navigate('/')}>
          <div className="lp-brand-icon">
            <TrendingUp size={16} strokeWidth={3} />
          </div>
          <span className="lp-brand-text">StockMind<span className="lp-brand-ai"> AI</span></span>
        </div>

        <div className="lp-nav-links">
          {['Engine', 'Performance', 'Security', 'Terminal'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="lp-nav-link">{item}</a>
          ))}
        </div>

        <div className="lp-nav-ctas">
          <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="lp-btn-primary" onClick={() => navigate('/login')}>
            Get Started <ChevronRight size={16} />
          </button>
          <button className="lp-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="lp-mobile-menu"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            >
              {['Engine', 'Performance', 'Security', 'Terminal'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>
              ))}
              <div className="lp-mobile-divider" />
              <button onClick={() => { navigate('/login'); setMenuOpen(false); }}>Sign In</button>
              <button className="lp-btn-primary" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Launch Terminal</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section className="lp-hero" ref={heroRef}>
        {/* Dot grid */}
        <div className="lp-dot-grid" />
        {/* Ambient glows */}
        <div className="lp-glow lp-glow-blue" />
        <div className="lp-glow lp-glow-purple" />
        <div className="lp-glow lp-glow-teal" />

        {/* Particles */}
        <div className="lp-particles-wrap">
          {particles.map(p => <Particle key={p.id} {...p} />)}
        </div>

        <motion.div className="lp-hero-content" style={{ y: heroY, opacity: heroOpacity }}>
          {/* Badge */}
          <motion.div
            className="lp-badge"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="lp-badge-dot" />
            <span>Live System Active</span>
            <span className="lp-badge-sep" />
            <span className="lp-badge-ver">v2.4.0 · US-EAST</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="lp-hero-h1"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="lp-h1-gradient">AI-Powered</span>
            <br />
            <span className="lp-h1-gradient">Market Intelligence</span>
          </motion.h1>

          <motion.p
            className="lp-hero-sub"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            The next generation of quantitative asset intelligence. Deep learning models ingest
            4PB of tick data daily to forecast alpha across 12,000+ global instruments.
          </motion.p>

          <motion.div
            className="lp-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <button className="lp-cta-main" onClick={() => navigate('/login')}>
              <Sparkles size={18} />
              Deploy Terminal Account
            </button>
            <button className="lp-cta-secondary" onClick={() => toast('Methodology documentation opening...', { icon: '📚' })}>
              Review Methodology
              <ArrowUpRight size={16} />
            </button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="lp-trust-strip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="lp-trust-label">Trusted data from</span>
            {TRUSTED.map(t => <span key={t} className="lp-trust-item">{t}</span>)}
          </motion.div>
        </motion.div>

        {/* ─── TERMINAL MOCKUP ─── */}
        <motion.div
          className="lp-terminal-wrap"
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="lp-terminal">
            {/* Window chrome */}
            <div className="lp-terminal-chrome">
              <div className="lp-chrome-dots">
                <span style={{ background: '#ff5f57' }} />
                <span style={{ background: '#febc2e' }} />
                <span style={{ background: '#28c840' }} />
              </div>
              <div className="lp-chrome-title">
                <span className="lp-live-dot" />
                STOCKMIND_TERMINAL · SESSION ACTIVE
              </div>
              <div className="lp-chrome-badge">LIVE</div>
            </div>

            {/* Body */}
            <div className="lp-terminal-body">
              {/* Sidebar */}
              <div className="lp-t-sidebar">
                <div className="lp-t-metric">
                  <span className="lp-t-mlabel">Inference</span>
                  <span className="lp-t-mval" style={{ color: 'var(--lp-blue)' }}>14.2ms</span>
                </div>
                <div className="lp-t-metric">
                  <span className="lp-t-mlabel">Confidence</span>
                  <span className="lp-t-mval" style={{ color: '#22d3ee' }}>92.48%</span>
                </div>
                <div className="lp-t-metric">
                  <span className="lp-t-mlabel">Backtest</span>
                  <span className="lp-t-mval" style={{ color: '#a78bfa' }}>4.2M</span>
                </div>
                <div className="lp-t-bars">
                  {[40, 70, 35, 58, 80].map((h, i) => (
                    <motion.div
                      key={i}
                      className="lp-t-bar"
                      style={{ height: `${h}%` }}
                      animate={{ height: [`${h}%`, `${h + Math.random() * 20}%`, `${h}%`] }}
                      transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="lp-t-chart">
                <div className="lp-t-chart-header">
                  <span className="lp-t-ticker">AAPL · USD</span>
                  <span className="lp-t-price">$182.47</span>
                  <span className="lp-t-change">▲ +2.34%</span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={spark}>
                    <defs>
                      <linearGradient id="lpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={['auto', 'auto']} hide />
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2.5} fill="url(#lpGrad)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="lp-t-footer">
                  <span>FEED: CONNECTED · 12.4K TPS</span>
                  <span style={{ color: 'var(--lp-blue)' }}>NODE: EAST-01 · OPTIMAL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating ticker pills */}
          {TICKERS.slice(0, 4).map((tk, i) => (
            <motion.div
              key={tk.label}
              className={`lp-ticker-pill ${tk.up ? 'up' : 'down'}`}
              style={{
                top: `${12 + i * 22}%`,
                right: i % 2 === 0 ? '-120px' : '-100px',
              }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="lp-pill-label">{tk.label}</span>
              <span className="lp-pill-val">{tk.val}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── STATS BAND ─── */}
      <section className="lp-stats-band">
        <div className="lp-stats-inner">
          {STATS.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
        </div>
      </section>

      {/* ─── FEATURES (BENTO) ─── */}
      <section id="engine" className="lp-section lp-features-section">
        <div className="lp-section-inner">
          <motion.div
            className="lp-section-head"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="lp-tag">INFRASTRUCTURE</span>
            <h2 className="lp-section-h2">Sub-Millisecond <span className="lp-h2-accent">AI Core.</span></h2>
            <p className="lp-section-desc">Built for institutional-grade performance with unmatched reliability.</p>
          </motion.div>

          <div className="lp-bento">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className={`lp-bento-card lp-bento-${f.color} ${f.span === 2 ? 'lp-bento-wide' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.01 }}
              >
                <div className={`lp-bento-icon lp-icon-${f.color}`}>{f.icon}</div>
                <h3 className="lp-bento-h3">{f.title}</h3>
                <p className="lp-bento-desc">{f.desc}</p>
                <div className="lp-bento-glow" />
                <div className="lp-bento-arrow">
                  <ArrowUpRight size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PERFORMANCE ─── */}
      <section id="performance" className="lp-section lp-perf-section">
        <div className="lp-perf-glow" />
        <div className="lp-section-inner">
          <div className="lp-perf-grid">
            {/* Left: text */}
            <motion.div
              className="lp-perf-text"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="lp-tag">PERFORMANCE</span>
              <h2 className="lp-section-h2">Flowing with <span className="lp-h2-accent">Alpha.</span></h2>
              <p className="lp-section-desc">
                Proprietary fiber pathways connect directly to NYSE and NASDAQ liquidity pools,
                bypassing the public internet for absolute execution superiority.
              </p>
              <div className="lp-perf-kpis">
                {[
                  { val: '99.99%', label: 'Uptime', color: '#22c55e' },
                  { val: '0.08ms', label: 'Jitter', color: '#22d3ee' },
                  { val: '4.2M', label: 'Backtests', color: '#a78bfa' },
                ].map(k => (
                  <div className="lp-kpi" key={k.label}>
                    <span className="lp-kpi-val" style={{ color: k.color }}>{k.val}</span>
                    <span className="lp-kpi-label">{k.label}</span>
                  </div>
                ))}
              </div>
              <button className="lp-cta-main" onClick={() => navigate('/predictions')}>
                View AI Predictions <ChevronRight size={17} />
              </button>
            </motion.div>

            {/* Right: metrics cards */}
            <div className="lp-perf-cards">
              {[
                { icon: <Gauge size={22} />, label: 'Sharpe Ratio', val: '3.42', color: '#3b82f6', sub: 'Risk-adjusted returns' },
                { icon: <Target size={22} />, label: 'Win Rate', val: '91.2%', color: '#22d3ee', sub: '7-day forecast accuracy' },
                { icon: <Activity size={22} />, label: 'Convergence', val: '<40ms', color: '#a78bfa', sub: 'Inference to execution' },
                { icon: <CheckCircle2 size={22} />, label: 'Validation', val: '99.98%', color: '#22c55e', sub: 'Out-of-sample purity' },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  className="lp-metric-card"
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  onClick={() => navigate('/predictions')}
                >
                  <div className="lp-mc-icon" style={{ color: card.color, background: `${card.color}18` }}>{card.icon}</div>
                  <div className="lp-mc-body">
                    <span className="lp-mc-label">{card.label}</span>
                    <span className="lp-mc-val" style={{ color: card.color }}>{card.val}</span>
                    <span className="lp-mc-sub">{card.sub}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECURITY ─── */}
      <section id="security" className="lp-section lp-security-section">
        <div className="lp-section-inner">
          <motion.div
            className="lp-section-head"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="lp-tag">ENTERPRISE SECURITY</span>
            <h2 className="lp-section-h2">Military-Grade <span className="lp-h2-accent">Protection.</span></h2>
          </motion.div>

          <div className="lp-security-grid">
            {[
              { icon: <Fingerprint size={24} />, title: 'Biometric Vaulting', desc: 'Multi-factor hardware key authentication required for high-volume orders.', tag: 'AES-256-GCM', color: '#3b82f6' },
              { icon: <Server size={24} />, title: 'Isolated Execution Nodes', desc: 'Air-gapped dedicated compute clusters with zero cross-contamination.', tag: 'TLS 1.3 / mTLS', color: '#22d3ee' },
              { icon: <Lock size={24} />, title: 'Zero-Knowledge Arch', desc: 'Strategies and credentials never stored in plain text, even in memory.', tag: 'SHA-512-V3', color: '#a78bfa' },
              { icon: <ShieldCheck size={24} />, title: 'SOC-2 Type II', desc: 'Monthly penetration testing by independent security auditors worldwide.', tag: 'ISO 27001', color: '#22c55e' },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                className="lp-sec-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <div className="lp-sec-icon" style={{ color: s.color, background: `${s.color}18` }}>{s.icon}</div>
                <h4 className="lp-sec-title">{s.title}</h4>
                <p className="lp-sec-desc">{s.desc}</p>
                <span className="lp-sec-tag" style={{ color: s.color, borderColor: `${s.color}40`, background: `${s.color}10` }}>{s.tag}</span>
                <div className="lp-sec-scan" />
              </motion.div>
            ))}
          </div>

          {/* Badge bar */}
          <motion.div
            className="lp-badge-bar"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {['SOC2 CERTIFIED', 'GDPR COMPLIANT', 'ISO 27001', 'FINRA', 'SEC REG SCI'].map(b => (
              <div key={b} className="lp-compliance-badge">{b}</div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── GLOBAL NODES ─── */}
      <section id="terminal" className="lp-section lp-global-section">
        <div className="lp-global-glow" />
        <div className="lp-section-inner">
          <motion.div
            className="lp-section-head lp-centered"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Globe2 size={40} className="lp-globe-icon" />
            <span className="lp-tag">GLOBAL INFRASTRUCTURE</span>
            <h2 className="lp-section-h2">Zero-Distance <span className="lp-h2-accent">Connectivity.</span></h2>
            <p className="lp-section-desc">Direct fiber links to major exchanges for absolute speed superiority.</p>
          </motion.div>

          <div className="lp-nodes-grid">
            {[
              { city: 'New York', code: 'NYC', ms: '< 1ms', exch: 'NYSE · NASDAQ', color: '#3b82f6' },
              { city: 'London', code: 'LON', ms: '12ms', exch: 'LSE · Euronext', color: '#22d3ee' },
              { city: 'Tokyo', code: 'TKO', ms: '42ms', exch: 'TSE · OSE', color: '#a78bfa' },
              { city: 'Hong Kong', code: 'HKG', ms: '45ms', exch: 'HKEX · SGX', color: '#22c55e' },
            ].map((n, i) => (
              <motion.div
                key={n.code}
                className="lp-node-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.03 }}
              >
                <div className="lp-node-code" style={{ color: n.color }}>{n.code}</div>
                <div className="lp-node-city">{n.city}</div>
                <div className="lp-node-ms" style={{ color: n.color }}>{n.ms}</div>
                <div className="lp-node-exch">{n.exch}</div>
                <div className="lp-node-pulse" style={{ background: n.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section className="lp-cta-band">
        <div className="lp-cta-glow-1" />
        <div className="lp-cta-glow-2" />
        <motion.div
          className="lp-cta-inner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="lp-tag">GET STARTED TODAY</span>
          <h2 className="lp-cta-h2">Ready to gain an <span className="lp-h2-accent">unfair edge?</span></h2>
          <p className="lp-cta-desc">Join thousands of institutional traders already using StockMind AI to outperform global markets.</p>
          <div className="lp-cta-btns">
            <button className="lp-cta-main lp-cta-large" onClick={() => navigate('/login')}>
              <Sparkles size={20} />
              Deploy Your Terminal
            </button>
            <button className="lp-cta-secondary" onClick={() => navigate('/markets')}>
              View Live Markets <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <div className="lp-brand-icon lp-brand-icon-sm">
                <TrendingUp size={14} strokeWidth={3} />
              </div>
              <span className="lp-brand-text">StockMind<span className="lp-brand-ai"> AI</span></span>
              <p className="lp-footer-tagline">Empowering quantitative traders with the world's most sophisticated deep learning engine.</p>
            </div>

            {[
              {
                title: 'Terminal', links: [
                  { label: 'Market Matrix', action: () => navigate('/markets') },
                  { label: 'AI Insights', action: () => navigate('/predictions') },
                  { label: 'Portfolio Alpha', action: () => navigate('/portfolio') },
                ]
              },
              {
                title: 'Resources', links: [
                  { label: 'API Docs', action: () => toast.loading('Establishing secure API tunnel...', { duration: 1500 }) },
                  { label: 'Methodology', action: () => toast('Accessing methodology archives...', { icon: '📚' }) },
                  { label: 'Case Studies', action: () => toast('Fetching institutional case studies...', { icon: '💼' }) },
                ]
              },
              {
                title: 'Security', links: [
                  { label: 'Data Encryption', action: () => toast.success('Encryption standards verified.', { icon: '🔒' }) },
                  { label: 'GDPR Policy', action: () => toast('Viewing GDPR Compliance Matrix...', { icon: '🛡️' }) },
                  { label: 'Compliance', action: () => toast('SOC-2 Type II Compliance achieved.', { icon: '✅' }) },
                ]
              },
            ].map(col => (
              <div className="lp-footer-col" key={col.title}>
                <h4 className="lp-footer-col-title">{col.title}</h4>
                {col.links.map(link => (
                  <button key={link.label} className="lp-footer-link" onClick={(e) => { e.preventDefault(); link.action(); }}>
                    {link.label}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="lp-footer-bottom">
            <span>© 2026 StockMind AI · All rights reserved.</span>
            <div className="lp-footer-legal">
              <button onClick={() => toast('Loading Terms...', { icon: '⚖️' })}>Terms</button>
              <button onClick={() => toast('Loading Privacy Policy...', { icon: '👀' })}>Privacy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
