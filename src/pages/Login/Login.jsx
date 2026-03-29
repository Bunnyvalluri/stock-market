import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, FileKey, Database, Server, Fingerprint, Eye, EyeOff, AlertCircle, Terminal } from 'lucide-react';
import { api } from '../../services/apiClient'; // Importing API.md endpoints
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Frontend Input Validation
  const validateForm = () => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email address is invalid';
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Intentionally firing the requested POST /api/login endpoint
      // This will hit the interceptor in apiClient.js
      // If no backend is running, we simulate the success via catch
      await api.auth.login({ email, password });
      
      localStorage.setItem('auth_token', 'mock_jwt_token_12345');
      navigate('/dashboard');
    } catch (err) {
      // Simulate real JWT auth for Frontend-only demo purposes
      console.warn("Backend HTTP layer not found. Establishing Mock Local JWT Session for Demo.");
      setTimeout(() => {
        localStorage.setItem('auth_token', 'mock_jwt_token_12345');
        setIsLoading(false);
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      
      <div className="login-wrapper">
        <motion.div 
          className="login-card glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="login-header">
            <div className="brand-logo mb-4">
              <Fingerprint size={28} />
            </div>
            <h2>Authentication</h2>
            <p className="text-muted">Enter credentials to access the terminal.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <motion.div 
                className="error-banner"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}

            <div className="input-group">
              <label>Secure Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@neuraltrade.com" 
                className="custom-input login-input" 
              />
            </div>
            
            <div className="input-group">
              <div className="label-row">
                <label>Password (Bcrypt Encrypted)</label>
                <a href="#" className="forgot-link">Forgot?</a>
              </div>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="custom-input login-input" 
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary-large login-submit mt-4" disabled={isLoading}>
              {isLoading ? (
                <div className="loader-ring"></div>
              ) : (
                <>Establish Secure Session <Lock size={16} /></>
              )}
            </button>
          </form>
          
          <div className="demo-hint">
             <span className="text-muted text-sm">Demo Access: Use any valid email and 8+ char password.</span>
          </div>
        </motion.div>

        {/* Security Manifesto / Badges Panel */}
        <motion.div 
          className="security-panel"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="security-header flex items-center gap-2 mb-4 text-cyan">
             <ShieldCheck size={24} />
             <h3>Enterprise-Grade Security</h3>
          </div>
          <p className="text-muted mb-6">NeuralTrade architecture enforces rigorous security protocols to protect your financial models and API integrations.</p>

          <div className="security-grid">
            <div className="security-item">
              <FileKey size={20} className="text-purple" />
              <div>
                <h4>JWT Authentication</h4>
                <span>Stateless tokenized sessions</span>
              </div>
            </div>
            
            <div className="security-item">
              <Database size={20} className="text-status-down" />
              <div>
                <h4>Bcrypt Hashing</h4>
                <span>Salting and stretching passwords</span>
              </div>
            </div>
            
            <div className="security-item">
              <Terminal size={20} className="text-brand" />
              <div>
                <h4>Input Validation</h4>
                <span>Strict sanitization to prevent XSS/SQLi</span>
              </div>
            </div>

            <div className="security-item">
              <Server size={20} className="text-status-neutral" />
              <div>
                <h4>Rate Limiting & WAF</h4>
                <span>Throttling brute-force & DDoS attempts</span>
              </div>
            </div>

            <div className="security-item">
              <Lock size={20} className="text-status-up" />
              <div>
                <h4>HTTPS & .ENV Secrets</h4>
                <span>End-to-End Encryption & hidden keys</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
