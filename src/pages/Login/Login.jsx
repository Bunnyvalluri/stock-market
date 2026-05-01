import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, FileKey, Database, Server, Fingerprint, Eye, EyeOff, AlertCircle, Terminal, TrendingUp } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../../firebase';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const validateForm = () => {
    if (!email) return 'User Identifier is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'User Identifier format is invalid';
    if (!password) return 'Security Passphrase is required';
    if (password.length < 8) return 'Passphrase must be at least 8 characters';
    return null;
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (isRegisterMode) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        localStorage.setItem('auth_token', userCredential.user.accessToken);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('auth_token', userCredential.user.accessToken);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
         setError('Invalid credentials provided. Execution rejected.');
      } else if (err.code === 'auth/email-already-in-use') {
         setError('Identifier already allocated to a live account.');
      } else if (err.code === 'auth/too-many-requests') {
         setError('Access temporarily throttled. Too many failed sequence attempts.');
         setError(`Authentication failed: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem('auth_token', result.user.accessToken);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('OAUTH popup closed prematurely.');
      } else {
        setError(`OAUTH handshake failed: ${err.message}`);
      }
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    try {
      const result = await signInWithPopup(auth, githubProvider);
      localStorage.setItem('auth_token', result.user.accessToken);
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('OAUTH popup closed prematurely.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('Account namespace collision. Try Google integration.');
      } else {
        setError(`OAUTH handshake failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="login-pro-container">
      {/* Dynamic Background Elements */}
      <div className="login-bg-elements">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>
      
      <div className="login-grid-bg"></div>

      <div className="login-pro-wrapper">
        <motion.div 
          className="login-pro-card"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="login-pro-header">
             <div className="login-pro-brand">
                 <h2>StockMind <span className="text-brand-glow">AI</span></h2>
             </div>
             <p className="login-pro-sub">
               {isRegisterMode ? 'PROVISION TERMINAL INSTANCE' : 'SECURE TERMINAL ACCESS'}
             </p>
          </div>

          <form onSubmit={handleEmailAuth} className="login-pro-form">
            {error && (
              <motion.div 
                className="error-banner-pro"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle size={18} /> {error}
              </motion.div>
            )}

            <div className="input-group-pro">
              <label>USER IDENTIFIER</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@stockmind.ai" 
                className="custom-input-pro" 
              />
            </div>
            
            <div className="input-group-pro">
              <div className="label-row-pro">
                <label>ENCRYPTED PASSPHRASE</label>
              </div>
              <div className="password-wrapper-pro">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  className="custom-input-pro" 
                />
                <button type="button" className="eye-btn-pro" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!isRegisterMode && (
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <a href="#" className="forgot-link-pro" style={{ fontSize: '0.75rem', color: 'var(--accent-brand)' }}>Recover Access</a>
                </div>
              )}
            </div>

            <button type="submit" className="btn-pro-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="pulse-text">AUTHENTICATING...</span>
              ) : (
                <>
                  {isRegisterMode ? 'INITIALIZE PROVISION' : 'ESTABLISH CONNECTION'} 
                  <ShieldCheck size={18} />
                </>
              )}
            </button>
          </form>

          <div className="divider-pro">
             <span>OAUTH GATEWAY</span>
          </div>

          <div className="social-auth-pro">
            <button type="button" className="btn-pro-social" onClick={handleGoogleLogin}>
               <svg width="18" height="18" viewBox="0 0 48 48">
                 <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                 <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                 <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                 <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
               </svg>
               Google
            </button>

            <button type="button" className="btn-pro-social" onClick={handleGithubLogin}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
               </svg>
               GitHub
            </button>
          </div>
          
          <div className="toggle-mode-pro">
             <span>
                {isRegisterMode ? 'ALREADY REGISTERED?' : 'NEW INSTITUTIONAL USER?'}
             </span>
             <button type="button" onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}>
                {isRegisterMode ? 'SWITCH TO LOGIN' : 'CREATE ACCOUNT'}
             </button>
          </div>
        </motion.div>
        
        {/* Side Status Widget */}
        <motion.div 
          className="login-pro-side-log"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
            <div className="status-widget">
                <div className="widget-header">
                    <Database size={20} className="text-brand" />
                    <div className="status-indicator">
                        <div className="status-dot"></div>
                        SYSTEM OPERATIONAL
                    </div>
                </div>

                <div className="data-bars">
                    <div className="data-bar-item">
                        <div className="bar-label">
                            <span>Connection Quality</span>
                            <span>98.2%</span>
                        </div>
                        <div className="bar-track">
                            <motion.div 
                                className="bar-fill" 
                                initial={{ width: 0 }}
                                animate={{ width: "98.2%" }}
                                transition={{ duration: 1.5, delay: 1 }}
                            />
                        </div>
                    </div>
                    <div className="data-bar-item">
                        <div className="bar-label">
                            <span>Encryption Strength</span>
                            <span>AES-256</span>
                        </div>
                        <div className="bar-track">
                            <motion.div 
                                className="bar-fill" 
                                style={{ background: 'var(--accent-purple)' }}
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1.5, delay: 1.2 }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="terminal-mini">
                <div className="terminal-line">&gt; initializing secure tunnel...</div>
                <div className="terminal-line">&gt; fetching node clusters...</div>
                <div className="terminal-line">&gt; encryption handshake ok.</div>
                {email && <div className="terminal-line" style={{ color: 'var(--accent-brand)' }}>&gt; targeting: {email}</div>}
                {isLoading && <div className="terminal-line" style={{ color: 'var(--status-up)' }}>&gt; authenticating hash sequence...</div>}
                <div className="terminal-line">
                  &gt; waiting for input<span className="terminal-cursor"></span>
                </div>
            </div>

            <div style={{ padding: '0 1rem', display: 'flex', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <ShieldCheck size={14} /> SECURE
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                  <Fingerprint size={14} /> ENCRYPTED
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
