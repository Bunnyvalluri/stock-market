import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

/**
 * Singleton Socket.io client instance.
 * Connected to the Node.js backend's Socket.io server.
 *
 * Usage in a React component:
 *   import { socket } from '../socket/socketClient';
 *   useEffect(() => {
 *     socket.on('price:update', handler);
 *     return () => socket.off('price:update', handler);
 *   }, []);
 */
export const socket = io(BACKEND_URL, {
  autoConnect: false,   // Connect manually after user auth
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

/** Connect (call after Firebase login) */
export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

/** Disconnect (call on logout) */
export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

/** Subscribe to live price updates for a symbol */
export const subscribeToStock = (symbol) => {
  socket.emit('subscribe:stock', symbol);
};

/** Unsubscribe from live price updates */
export const unsubscribeFromStock = (symbol) => {
  socket.emit('unsubscribe:stock', symbol);
};
