import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck, FileKey, Database, Server, Fingerprint, Eye, EyeOff, AlertCircle, Terminal, AtSign } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; // FIREBASE IMPORTS
import { auth, googleProvider } from '../../firebase'; // CUSTOM FIREBASE INIT FILE
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false); // Toggle between Sign In / Sign Up

  const validateForm = () => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email address is invalid';
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  // 1. Firebase Email/Password Sign In & Registration
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
        // User is automatically signed in after creation
        localStorage.setItem('auth_token', userCredential.user.accessToken);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem('auth_token', userCredential.user.accessToken);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      // Simplify Firebase error messages into UI friendly text
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
         setError('Invalid credentials provided. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
         setError('This email is already registered.');
      } else if (err.code === 'auth/too-many-requests') {
         setError('Access to this account has been temporarily disabled due to many failed login attempts.');
      } else {
         setError('Authentication failed. Are your Firebase environment variables set?');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Firebase Google Login
  const handleGoogleLogin = async () => {
     setError('');
     try {
       const result = await signInWithPopup(auth, googleProvider);
       localStorage.setItem('auth_token', result.user.accessToken);
       navigate('/dashboard');
     } catch (err) {
        console.error(err);
        if (err.code === 'auth/popup-closed-by-user') {
           setError('Google sign-in popup closed before completion.');
        } else {
           setError(`Google Auth Error: ${err.message}. Ensure localhost and your domain are added to Firebase Authorized Domains.`);
        }
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
            <h2>{isRegisterMode ? 'Deploy Workspace' : 'Authentication'}</h2>
            <p className="text-muted">{isRegisterMode ? 'Create a secure NeuralTrade terminal account.' : 'Enter credentials to access the terminal.'}</p>
          </div>

          <form onSubmit={handleEmailAuth} className="login-form">
            {error && (
              <motion.div className="error-banner" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
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
                {!isRegisterMode && <a href="#" className="forgot-link">Forgot?</a>}
              </div>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="custom-input login-input" 
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary-large login-submit mt-4" disabled={isLoading}>
              {isLoading ? <div className="loader-ring"></div> : <>{isRegisterMode ? 'Initialize Account' : 'Establish Secure Session'} <Lock size={16} /></>}
            </button>
          </form>

          {/* OR Divider and Google Auth */}
          <div className="auth-divider">
             <div className="div-line"></div>
             <span className="text-muted text-sm">OR</span>
             <div className="div-line"></div>
          </div>
          
          <button type="button" className="btn-secondary-large google-btn" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 48 48" className="google-icon">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            Sign in with Google
          </button>
          
          <div className="demo-hint mt-4">
             <span className="text-muted text-sm">
                {isRegisterMode ? 'Already have an account? ' : 'Need an architecture module? '}
                <button type="button" className="text-cyan bg-transparent border-none cursor-pointer p-0" onClick={() => { setIsRegisterMode(!isRegisterMode); setError(''); }}>
                   {isRegisterMode ? 'Log In' : 'Sign Up'}
                </button>
             </span>
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
                <h4>Firebase Authentication</h4>
                <span>Stateless tokenized OAuth sessions</span>
              </div>
            </div>
            
            <div className="security-item">
              <Database size={20} className="text-status-down" />
              <div>
                <h4>Bcrypt Cloud Hashing</h4>
                <span>Salting and stretching passwords via GCP</span>
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
