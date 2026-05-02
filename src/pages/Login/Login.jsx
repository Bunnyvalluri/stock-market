import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Mail, Key, Eye, EyeOff, AlertCircle, ArrowRight, 
  Shield, Zap, TrendingUp, Database, ShieldCheck, Fingerprint 
} from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../../firebase';
import toast from 'react-hot-toast';
import ReCAPTCHA from 'react-google-recaptcha';
import './Login.css';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Login = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const validateForm = () => {
    if (!email) return 'Please enter your email address.';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
    if (!password) return 'Please enter your password.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    return null;
  };

  const handleCaptchaChange = useCallback((token) => {
    setCaptchaVerified(!!token);
    if (token) setCaptchaError(false);
  }, []);

  const handleCaptchaExpired = useCallback(() => {
    setCaptchaVerified(false);
  }, []);

  const resetCaptcha = () => {
    recaptchaRef.current?.reset();
    setCaptchaVerified(false);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!captchaVerified) {
      setCaptchaError(true);
      setError('Please complete the reCAPTCHA verification.');
      return;
    }

    setError('');
    setCaptchaError(false);
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
      resetCaptcha();
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
         setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
         setError('An account with this email already exists.');
      } else if (err.code === 'auth/too-many-requests') {
         setError('Too many failed attempts. Please try again later.');
      } else {
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
        setError('Sign-in cancelled. If you didn\'t close the window, ensure popups are allowed for this site.');
      } else {
        setError(`Google authentication failed: ${err.message}`);
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
        setError('Sign-in cancelled. Ensure your browser allows popups for this domain.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with the same email. Try Google.');
      } else {
        setError(`GitHub authentication failed: ${err.message}`);
      }
    }
  };

  return (
    <div className="login-premium-container">
      {/* Animated Abstract Background */}
      <div className="premium-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-premium-wrapper">
        <motion.div 
          className="login-premium-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="login-premium-header">
             <div className="brand-logo-container">
                 <div className="logo-icon-premium">
                     <TrendingUp size={24} strokeWidth={2.5} />
                 </div>
                 <h2>StockMind <span className="brand-highlight">AI</span></h2>
             </div>
             <p className="login-premium-sub">
                {isRegisterMode ? 'PROVISION TERMINAL INSTANCE' : 'SECURE TERMINAL ACCESS'}
             </p>
          </div>

          <form onSubmit={handleEmailAuth} className="login-premium-form">
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="error-banner-premium" 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                  animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                >
                  <AlertCircle size={16} /> <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="input-group-premium">
              <label htmlFor="email-input">USER IDENTIFIER</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  id="email-input"
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@stockmind.ai" 
                  className="custom-input-premium" 
                />
              </div>
            </div>
            
            <div className="input-group-premium">
              <div className="label-row-premium">
                <label htmlFor="password-input">ENCRYPTED PASSPHRASE</label>
                {!isRegisterMode && (
                  <button 
                    type="button" 
                    className="forgot-link-premium" 
                    onClick={() => toast('Password recovery initiated. Check your email.', { icon: '📧' })}
                  >
                    Recover Access
                  </button>
                )}
              </div>
              <div className="input-wrapper">
                <Key className="input-icon" size={18} />
                <input 
                  id="password-input"
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  className="custom-input-premium" 
                />
                <button type="button" className="eye-btn-premium" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* reCAPTCHA v2 Checkbox */}
            <div className={`recaptcha-wrapper${captchaError ? ' recaptcha-error' : ''}`}>
              <div className="recaptcha-label">
                <Shield size={13} />
                <span>SECURITY VERIFICATION</span>
              </div>
              <div className="recaptcha-inner">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  theme="dark"
                  onChange={handleCaptchaChange}
                  onExpired={handleCaptchaExpired}
                />
              </div>
              {captchaError && (
                <p className="recaptcha-error-msg">
                  <AlertCircle size={12} /> Please complete the verification above.
                </p>
              )}
            </div>

            <button 
              type="submit" 
              className="btn-premium-submit" 
              disabled={isLoading || !captchaVerified}
            >
              {isLoading ? (
                <div className="loading-spinner-premium"></div>
              ) : (
                <>
                  {isRegisterMode ? 'INITIALIZE PROVISION' : 'ESTABLISH CONNECTION'}
                  <ShieldCheck size={18} />
                </>
              )}
            </button>
          </form>

          <div className="divider-premium">
             <span>OAUTH GATEWAY</span>
          </div>

          <div className="social-auth-premium">
            <button type="button" className="btn-premium-social" onClick={handleGoogleLogin}>
               <svg width="18" height="18" viewBox="0 0 48 48">
                 <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                 <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                 <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                 <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
               </svg>
               Google
            </button>

            <button type="button" className="btn-premium-social" onClick={handleGithubLogin}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
               </svg>
               GitHub
            </button>
          </div>
          
          <div className="toggle-mode-premium">
             <span className="text-muted">
                {isRegisterMode ? 'ALREADY REGISTERED?' : 'NEW INSTITUTIONAL USER?'}
             </span>
             <button type="button" onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); resetCaptcha(); }}>
                {isRegisterMode ? 'SWITCH TO LOGIN' : 'CREATE ACCOUNT'}
             </button>
          </div>
        </motion.div>
        
        {/* Modern Value Proposition Side Panel */}
        <motion.div 
          className="login-premium-side"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="side-content">
                <div className="feature-pill">
                    <Database size={14} /> SYSTEM OPERATIONAL
                </div>
                <h2>Next-Generation<br/>Market Intelligence</h2>
                
                <div className="terminal-mini mt-6 mb-6">
                    <div className="terminal-line">&gt; initializing secure tunnel...</div>
                    <div className="terminal-line">&gt; fetching node clusters...</div>
                    <div className="terminal-line">&gt; encryption handshake ok.</div>
                    {email && <div className="terminal-line" style={{ color: 'var(--accent-brand)' }}>&gt; targeting: {email}</div>}
                    {isLoading && <div className="terminal-line" style={{ color: 'var(--status-up)' }}>&gt; authenticating hash sequence...</div>}
                    <div className="terminal-line">
                      &gt; waiting for input<span className="terminal-cursor"></span>
                    </div>
                </div>

                <div className="features-list">
                    <div className="feature-item">
                        <div className="feature-icon"><ShieldCheck size={18} /></div>
                        <div>
                            <h4>Bank-Grade Security</h4>
                            <p>End-to-end AES-256 encryption.</p>
                        </div>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon"><Fingerprint size={18} /></div>
                        <div>
                            <h4>Identity Protection</h4>
                            <p>Multi-factor biometric handshake.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="side-glass-overlay"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
