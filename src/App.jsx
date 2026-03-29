import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { LineChart, LayoutDashboard, Activity, Database, Settings as SettingsIcon, Bell, Search, Menu, X, TrendingUp, Zap, LogOut } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
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
    { name: 'Predictions', path: '/predictions', icon: <Zap size={20} /> },
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
          <h2 className="logo-text">Neural<span className="text-gradient">Trade</span></h2>
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
// Navbar
// ──────────────────────────────────────────────
const Navbar = ({ toggleSidebar }) => (
  <header className="navbar glass">
    <div className="nav-left">
      <button className="menu-toggle" onClick={toggleSidebar}><Menu size={24} /></button>
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search stocks, models, news..." />
      </div>
    </div>
    <div className="nav-right">
      <button className="icon-btn">
        <Bell size={20} />
        <span className="badge indicator-pulse"></span>
      </button>
      <div className="live-status-badge">
        <span className="live-dot"></span>
        Live
      </div>
    </div>
  </header>
);

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
    <div className="app-container">
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
