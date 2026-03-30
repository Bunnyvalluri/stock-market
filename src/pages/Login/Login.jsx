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
      {/* Background Matrix Grid */}
      <div className="login-grid-bg"></div>

      <div className="login-pro-wrapper">
        <motion.div 
          className="login-pro-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-pro-header">
             <div className="login-pro-brand">
                 <h2>StockMind <span className="text-brand">AI</span></h2>
             </div>
             <p className="login-pro-sub">{isRegisterMode ? 'PROVISION TERMINAL INSTANCE (REGISTER)' : 'SECURE TERMINAL ACCESS (LOGIN)'}</p>
          </div>

          <form onSubmit={handleEmailAuth} className="login-pro-form">
            {error && (
              <motion.div className="error-banner-pro" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}

            <div className="input-group-pro">
              <label>USER IDENTIFIER</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@institution.com" 
                className="custom-input-pro" 
              />
            </div>
            
            <div className="input-group-pro">
              <div className="label-row-pro">
                <label>ENCRYPTED PASSPHRASE</label>
                {!isRegisterMode && <a href="#" className="forgot-link-pro">Recover Access</a>}
              </div>
              <div className="password-wrapper-pro">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="custom-input-pro" 
                />
                <button type="button" className="eye-btn-pro" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-pro-submit" disabled={isLoading}>
              {isLoading ? <span className="pulse-text">AUTHENTICATING...</span> : <>{isRegisterMode ? 'PROVISION NODE' : 'INITIALIZE CONNECTION'} <Lock size={14} /></>}
            </button>
          </form>

          <div className="divider-pro">
             <span>OAUTH INTEGRATIONS</span>
          </div>

          <div className="social-auth-pro">
            <button type="button" className="btn-pro-social" onClick={handleGoogleLogin}>
               <svg width="14" height="14" viewBox="0 0 48 48">
                 <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                 <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                 <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                 <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                 <path fill="none" d="M0 0h48v48H0z"></path>
               </svg>
               Google Workspace
            </button>

            <button type="button" className="btn-pro-social" onClick={handleGithubLogin}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
               </svg>
               GitHub Enterprise
            </button>
          </div>
          
          <div className="toggle-mode-pro">
             <span className="text-muted">
                {isRegisterMode ? 'HAVE CREDENTIALS?' : 'NO SECURE ACCESS?'}
             </span>
             <button type="button" onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}>
                {isRegisterMode ? 'SWITCH TO SECURE LOGIN' : 'PROVISION NEW ACCOUNT'}
             </button>
          </div>
        </motion.div>
        
        {/* Terminal decorative side-log */}
        <div className="login-pro-side-log hidden-mobile">
            <div className="log-header">
                <Terminal size={14} className="text-cyan" /> TERMINAL TRACE
            </div>
            <div className="log-body font-mono text-xs">
                <p>&gt; ENCRYPTING CONNECTION...</p>
                <p>&gt; SECURE TUNNEL ESTABLISHED.</p>
                <p>&gt; WAITING FOR CREDENTIALS...</p>
                {email && <p className="text-brand">&gt; PARSING IDENTIFIER: {email}</p>}
                {password.length > 0 && <p className="text-orange">&gt; VALIDATING HASH: {password.replace(/./g, '*')}</p>}
                {isLoading && <p className="text-up">&gt; COMMUNICATING WITH MAINFRAME...</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
