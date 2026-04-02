import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Database, Settings as SettingsIcon, Bell, Search, Menu, X, TrendingUp, Zap, LogOut, Clock, ChevronRight } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import './App.css';

import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Predictions from './pages/Predictions/Predictions';
import Portfolio from './pages/Portfolio/Portfolio';
import Markets from './pages/Markets/Markets';
import Alerts from './pages/Alerts/Alerts';
import Settings from './pages/Settings/Settings';
import ThemeToggle from './components/ThemeToggle';
import StockDetail from './pages/StockDetail/StockDetail';

// ──────────────────────────────────────────────
// Protected Route Guard
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// Protected Route Guard
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// Protected Route Guard
// ──────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = still loading

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  if (user === undefined) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner"></div>
        <p>Authenticating...</p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// ──────────────────────────────────────────────
// Sidebar
// ──────────────────────────────────────────────
const Sidebar = ({ isOpen, toggleSidebar, user }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Markets',   path: '/markets',   icon: <Activity size={20} /> },
    { name: 'AI Insights', path: '/predictions', icon: <Zap size={20} /> },
    { name: 'Portfolio', path: '/portfolio', icon: <Database size={20} /> },
    { name: 'Alerts',   path: '/alerts',    icon: <Bell size={20} /> },
    { name: 'Settings', path: '/settings',  icon: <SettingsIcon size={20} /> },
  ];

  const handleLogout = () => signOut(auth);
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0]?.toUpperCase() || 'U');
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Investor';

  return (
    <aside className={`sidebar glass-card ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <TrendingUp size={20} color="#fff" />
          </div>
          <h2 className="logo-text">StockMind <span className="text-gradient">AI</span></h2>
        </div>
        <button className="mobile-close" onClick={toggleSidebar}><X size={22} /></button>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`nav-link ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                onClick={() => { if (window.innerWidth <= 768) toggleSidebar(); }}
              >
                <div className="nav-icon">{item.icon}</div>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-profile">
            {user.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="avatar-img" />
            ) : (
              <div className="avatar">{initials}</div>
            )}
            <div className="user-info">
              <p className="user-name">{displayName}</p>
              <p className="user-tier text-gradient">Institutional Access</p>
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

// ──────────────────────────────────────────────
// Live Clock
// ──────────────────────────────────────────────
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
      {time.toLocaleTimeString('en-US', { hour12: false })}
    </span>
  );
};

// ──────────────────────────────────────────────
// Navbar
// ──────────────────────────────────────────────
const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/markets': 'Markets',
  '/predictions': 'AI Insights',
  '/portfolio': 'Portfolio',
  '/alerts': 'Smart Alerts',
  '/settings': 'Settings',
};

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'StockMind AI';
  const [searchVal, setSearchVal] = useState('');

  return (
    <header className="navbar glass">
      <div className="nav-left">
        <button className="menu-toggle" onClick={toggleSidebar}><Menu size={24} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--text-muted)' }}>StockMind AI</span>
          <ChevronRight size={14} style={{ opacity: 0.4 }} />
          <span style={{ color: 'var(--text-primary)' }}>{pageTitle}</span>
        </div>
        <div className="search-bar" style={{ marginLeft: '1.5rem' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search stocks, AI models, news..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && searchVal.trim()) { toast(`Searching: "${searchVal}"`, { icon: '🔍' }); setSearchVal(''); } }}
          />
        </div>
      </div>
      <div className="nav-right">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
          <Clock size={13} style={{ color: 'var(--accent-brand)' }} />
          <LiveClock />
        </div>
        <ThemeToggle />
        <button
          className="icon-btn"
          onClick={() => toast('3 new market alerts triggered. Check Alerts page.', { icon: '🔔' })}
          title="Notifications"
        >
          <Bell size={20} />
          <span className="badge indicator-pulse"></span>
        </button>
        <div className="live-status-badge">
          <span className="live-dot"></span>
          Markets Live
        </div>
      </div>
    </header>
  );
};

// ──────────────────────────────────────────────
// Dashboard Layout
// ──────────────────────────────────────────────
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const toggleSidebar = () => setSidebarOpen(s => !s);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  return (
    <div className="app-container bg-grid-pattern">
      <div className={`mobile-overlay ${sidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}></div>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} user={user} />
      <main className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="page-wrapper animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

// ──────────────────────────────────────────────
// App Router
// ──────────────────────────────────────────────

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            fontFamily: 'Inter, monospace',
            fontSize: '0.8rem',
            fontWeight: '600'
          },
          success: {
            iconTheme: {
              primary: 'var(--accent-brand)',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Home /></DashboardLayout></ProtectedRoute>} />
        <Route path="/markets"   element={<ProtectedRoute><DashboardLayout><Markets /></DashboardLayout></ProtectedRoute>} />
        <Route path="/stocks/:symbol" element={<ProtectedRoute><DashboardLayout><StockDetail /></DashboardLayout></ProtectedRoute>} />
        <Route path="/predictions" element={<ProtectedRoute><DashboardLayout><Predictions /></DashboardLayout></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><DashboardLayout><Portfolio /></DashboardLayout></ProtectedRoute>} />
        <Route path="/alerts"    element={<ProtectedRoute><DashboardLayout><Alerts /></DashboardLayout></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
