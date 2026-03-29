import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LineChart, LayoutDashboard, Activity, Database, Settings as SettingsIcon, Bell, Search, Menu, X, TrendingUp, Zap } from 'lucide-react';
import './App.css';

import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';
import Predictions from './pages/Predictions/Predictions';
import Portfolio from './pages/Portfolio/Portfolio';
import Markets from './pages/Markets/Markets';
import Alerts from './pages/Alerts/Alerts';
import Settings from './pages/Settings/Settings';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Markets', path: '/markets', icon: <Activity size={20} /> },
    { name: 'Predictions', path: '/predictions', icon: <Zap size={20} /> },
    { name: 'Portfolio', path: '/portfolio', icon: <Database size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon size={20} /> }
  ];

  return (
    <aside className={`sidebar glass-card ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">
            <TrendingUp size={24} color="var(--bg-primary)" />
          </div>
          <h2 className="logo-text">Neural<span className="text-gradient">Trade</span></h2>
        </div>
        <button className="mobile-close" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => { if(window.innerWidth <= 768) toggleSidebar() }}
              >
                <div className="nav-icon">{item.icon}</div>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">A</div>
          <div className="user-info">
            <p className="user-name">Alex Investor</p>
            <p className="user-tier text-gradient-purple">Pro Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="navbar glass">
      <div className="nav-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
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
        <button className="connect-wallet-btn">
          Connect Broker
        </button>
      </div>
    </header>
  );
};

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="main-content">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <div className="page-wrapper animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout><Home /></DashboardLayout>} />
        <Route path="/markets" element={<DashboardLayout><Markets /></DashboardLayout>} />
        <Route path="/predictions" element={<DashboardLayout><Predictions /></DashboardLayout>} />
        <Route path="/portfolio" element={<DashboardLayout><Portfolio /></DashboardLayout>} />
        <Route path="/alerts" element={<DashboardLayout><Alerts /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
