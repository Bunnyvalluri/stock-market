import { Server } from 'socket.io';

let io;

/**
 * Initialize Socket.io on the HTTP server.
 * Called once from src/index.js
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Client subscribes to a stock symbol for live price updates
    socket.on('subscribe:stock', (symbol) => {
      const room = `stock:${symbol.toUpperCase()}`;
      socket.join(room);
      console.log(`[Socket.io] ${socket.id} subscribed to ${room}`);
    });

    // Client unsubscribes from a stock symbol
    socket.on('unsubscribe:stock', (symbol) => {
      const room = `stock:${symbol.toUpperCase()}`;
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Broadcast a live price update to all subscribers of a symbol.
 * Called by the stock polling service in backend/src/services/stockPoller.js
 *
 * @param {string} symbol - e.g. 'AAPL'
 * @param {object} data   - { price, change, volume, timestamp }
 */
export const emitPriceUpdate = (symbol, data) => {
  if (!io) return;
  io.to(`stock:${symbol.toUpperCase()}`).emit('price:update', { symbol, ...data });
};

/**
 * Broadcast an ML prediction result to all subscribers of a symbol.
 * @param {string} symbol
 * @param {object} prediction - { predictedPrice, confidence, trend }
 */
export const emitPrediction = (symbol, prediction) => {
  if (!io) return;
  io.to(`stock:${symbol.toUpperCase()}`).emit('prediction:update', { symbol, ...prediction });
};

/**
 * Broadcast a price alert notification to a specific user.
 * @param {string} userId - Firebase UID
 * @param {object} alert  - { symbol, triggeredAt, condition, threshold }
 */
export const emitAlert = (userId, alert) => {
  if (!io) return;
  io.to(`user:${userId}`).emit('alert:triggered', alert);
};

export { io };
