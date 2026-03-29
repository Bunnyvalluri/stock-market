import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { connectSocket, disconnectSocket } from '../socket/socketClient';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app, exposes { user, loading }
 * Also connects / disconnects the Socket.io client on auth state change
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
      setLoading(false);

      if (firebaseUser) {
        connectSocket();       // Connect real-time socket after login
      } else {
        disconnectSocket();    // Disconnect on logout
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook: const { user, loading } = useAuth(); */
export const useAuth = () => useContext(AuthContext);
