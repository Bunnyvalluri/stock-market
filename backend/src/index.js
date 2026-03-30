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


const app = express();
const httpServer = createServer(app);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(compression()); // OSI Layer 6: Payload Compression
app.use(responseTime()); // OSI Layer 7: Latency Identification
app.use(express.json());



// ─── Health & Latency Sync (OSI Layer 7) ──────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'stockmind-backend' }));
app.get('/api/ping', (_req, res) => res.json({ timestamp: Date.now() })); // For frontend RTT measurement


// ─── API Routes ───────────────────────────────────────────────────────────────
// All routes below require a valid Firebase JWT token
app.use('/api/stocks',      verifyFirebaseToken, stockRoutes);
app.use('/api/predict',     verifyFirebaseToken, predictionRoutes);
app.use('/api/portfolio',   verifyFirebaseToken, portfolioRoutes);
app.use('/api/alerts',      verifyFirebaseToken, alertRoutes);
app.use('/api/news',        verifyFirebaseToken, newsRoutes);

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

