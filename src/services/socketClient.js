import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('⚡ [Socket] Connected to Institutional Hub:', socket.id);
});

socket.on('connect_error', (err) => {
  console.error('❌ [Socket] Connection Error:', err.message);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 [Socket] Disconnected:', reason);
});

export default socket;
