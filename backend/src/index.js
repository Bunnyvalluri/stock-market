import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import responseTime from 'response-time';



import { initSocket } from './socket/socketManager.js';
import stockRoutes from './routes/stocks.js';
import predictionRoutes from './routes/predictions.js';
import portfolioRoutes from './routes/portfolio.js';
import alertRoutes from './routes/alerts.js';
import newsRoutes from './routes/news.js';
import { verifyFirebaseToken } from './middleware/auth.js';
import { startStockPoller } from './services/stockPoller.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimit } from 'express-rate-limit';

const app = express();
const httpServer = createServer(app);

// ─── Security Middleware ──────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

app.use(helmet());
app.use(limiter); // Apply rate limiting to all requests
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(compression());
app.use(responseTime());
app.use(express.json());



// ─── Health & Latency Sync (OSI Layer 7) ──────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'stockmind-backend' }));
app.get('/api/ping', (_req, res) => res.json({ timestamp: Date.now() })); // For frontend RTT measurement


// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/stocks',      verifyFirebaseToken, stockRoutes);
app.use('/api/predict',     verifyFirebaseToken, predictionRoutes);
app.use('/api/portfolio',   verifyFirebaseToken, portfolioRoutes);
app.use('/api/alerts',      verifyFirebaseToken, alertRoutes);
app.use('/api/news',        verifyFirebaseToken, newsRoutes);

// ─── Error Handling (Keep at bottom) ──────────────────────────────────────────
// 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Global Error Handler
app.use(errorHandler);

// ─── Socket.io Real-time ──────────────────────────────────────────────────────
initSocket(httpServer);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 StockMind AI Backend running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io real-time layer active`);
  console.log(`🤖 ML Service proxy → ${process.env.ML_SERVICE_URL || 'http://localhost:8000'}\n`);
  
  // ─── Phase 2 Optimization ──────────────────────────────────────────────────
  startStockPoller(5000); // 5 sec Market Heartbeat
});

