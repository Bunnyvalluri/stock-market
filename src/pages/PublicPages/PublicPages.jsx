import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity, ShieldCheck, Database, Zap, Code, TerminalSquare, Shield } from 'lucide-react';
import '../Landing/Landing.css'; // Re-use landing styles

const PageLayout = ({ children, title, subtitle, icon: Icon }) => (
  <div className="landing-premium" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <nav className="nav-premium">
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none' }}>
        <div className="brand-logo">
          <Activity size={20} strokeWidth={2.5} />
        </div>
        <span className="brand-text text-white">NeuralTrade</span>
      </Link>
      <Link to="/" className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Back to Home
      </Link>
    </nav>
    <main className="bento-section" style={{ flex: 1, paddingTop: '10rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="bento-header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
        {Icon && <Icon size={48} className="text-cyan mb-4" />}
        <h1 style={{ fontSize: '3.5rem', fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px', lineHeight: 1.1 }}>{title}</h1>
        <p className="text-muted mt-4" style={{ fontSize: '1.2rem', lineHeight: 1.6 }}>{subtitle}</p>
      </div>
      <div className="text-slate-300" style={{ fontSize: '1.1rem', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}
      </div>
    </main>
    <footer className="footer-premium" style={{ marginTop: 'auto', padding: '2rem', textAlign: 'center', borderColor: 'rgba(255,255,255,0.05)' }}>
      <span className="text-muted text-sm">© 2026 NeuralTrade. All rights reserved.</span>
    </footer>
  </div>
);

export const TerminalInfo = () => (
  <PageLayout 
    title="Live Trading Terminal" 
    subtitle="Execute hyper-speed algorithmic trades in a sub-40ms WebSocket environment."
    icon={TerminalSquare}
  >
    <p>
      The NeuralTrade Terminal isn't a traditional web dashboard that requires refreshing. It operates entirely on persistent <strong>WebSocket connections</strong>, rendering live ticking data seamlessly without ever touching a REST polling interval.
    </p>
    <div className="bento-card" style={{ padding: '2rem', marginTop: '1rem', background: 'rgba(15, 23, 42, 0.4)' }}>
      <h3 className="text-cyan mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={20}/> Hardware Acceleration</h3>
      <p>By leveraging hardware-accelerated charting libraries, the terminal paints up to 60 frames per second of raw, unadulterated tick data, giving you the fastest localized view of global market moving anomalies.</p>
    </div>
  </PageLayout>
);

export const MLModelsInfo = () => (
  <PageLayout 
    title="Real-Time ML Pipelines" 
    subtitle="Continuous learning. Never stagnant. Always adjusting to market velocity."
    icon={Database}
  >
    <p>
      Our Long Short-Term Memory (LSTM) arrays and Random Forest regressor nodes don't wait for end-of-day data dumps. They calculate moving gradients in <strong>real-time</strong>.
    </p>
    <p>
      Every time a financial transaction occurs anywhere in the world on integrated exchanges, that data point acts as a microscopic forward pass through our models, adjusting confidence indicators instantaneously on your live dashboard.
    </p>
    <div className="bento-card" style={{ padding: '2rem', marginTop: '1rem' }}>
      <h3 className="text-cyan mb-2">Live Inference Metrics</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '0.5rem' }}>• Latency bounds: <strong>&lt; 45ms</strong></li>
        <li style={{ marginBottom: '0.5rem' }}>• Node re-evaluation: <strong>Tick-by-tick</strong></li>
        <li>• Memory cache invalidation: <strong>Instant network sync</strong></li>
      </ul>
    </div>
  </PageLayout>
);

export const APIAccessInfo = () => (
  <PageLayout 
    title="Streaming API Access" 
    subtitle="Direct WebSockets access to our predictive modeling engine for high-frequency trading."
    icon={Code}
  >
    <p>
      Integrate NeuralTrade into any algorithmic trading bot instantly. Do not rely on REST. Establish a WSS (WebSocket Secure) pipe to our <code>market:anomaly</code> nodes, and trigger long/short executions automatically when the model’s confidence exceeds your threshold.
    </p>
    <p>
      Our real-time APIs use ultra-low overhead binary transmission schemas to ensure payload sizes are practically zero, fitting within maximum TCP packet efficiencies window size.
    </p>
  </PageLayout>
);

export const AboutInfo = () => (
  <PageLayout 
    title="About NeuralTrade" 
    subtitle="Building the fastest latency-first retail architecture."
    icon={Activity}
  >
    <p>
      NeuralTrade was founded with one strict premise: batch processing is dead. In the modern market, if your data is a second old, you are already the product. We built this platform by applying <strong>real-time game server network topologies</strong> to global financial data pipelines.
    </p>
  </PageLayout>
);

export const ResearchInfo = () => (
  <PageLayout 
    title="Quantitative Research" 
    subtitle="Advancing the field of real-time deep learning inference."
    icon={Activity}
  >
    <p>
      Historically, deep learning models required heavy computational phases. Our ongoing research has pioneered <em>Micro-Epoch Stitching</em>, allowing partial retrains to occur concurrently while live prediction WebSocket streams operate undisturbed on the opposite end of our distributed clusters.
    </p>
  </PageLayout>
);

export const SecurityInfo = () => (
  <PageLayout 
    title="Real-Time Data Security" 
    subtitle="Institutional grade encryption across all live persistent connections."
    icon={Shield}
  >
    <p>
      Real-time connections don't mean insecure protocols. Our dual-channel architecture implies that all persistent Socket.io streams are authenticated via rolling transient JWT tokens that auto-rotate securely without ever dropping the TCP pipeline. Your live portfolio balances and live neural trade signals are permanently safeguarded.
    </p>
  </PageLayout>
);
