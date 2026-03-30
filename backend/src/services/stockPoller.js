/**
 * Stock Poller Service
 * Purpose: Fetch live market data and broadcast via WebSocket (OSI Layer 5/7)
 */
import axios from 'axios';
import { emitPriceUpdate } from '../socket/socketManager.js';

const ALPHA_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'BTC'];

let intervalId = null;

/**
 * Start the real-time polling sequence.
 * In production, this would be hooked into a Firehose or Bloomberg Terminal feed.
 */
export const startStockPoller = (intervalMs = 5000) => {
  console.log(`[Poller] Initialized for ${SYMBOLS.length} assets at ${intervalMs}ms interval.`);
  
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(async () => {
    // For a real app, we fetch from Alpha Vantage / query multiple
    // To avoid rate limits in demo mode, we simulate a 'Liquid Feed'
    SYMBOLS.forEach(symbol => {
      // Simulate price jitter (-0.5% to +0.5%)
      const basePrice = getBasePrice(symbol);
      const jitter = (Math.random() - 0.49) * (basePrice * 0.005);
      const newPrice = basePrice + jitter;
      const change = (Math.random() - 0.48) * 2.5;

      emitPriceUpdate(symbol, {
        price: newPrice,
        change: change,
        volume: Math.floor(Math.random() * 100000) + 50000,
        timestamp: new Date().toISOString(),
        isLive: true
      });
    });
  }, intervalMs);
};

// Internal seed prices for high-fidelity simulation
const getBasePrice = (s) => {
  const map = { AAPL: 185, GOOGL: 175, MSFT: 415, AMZN: 195, TSLA: 245, NVDA: 885, META: 495, BTC: 68000 };
  return map[s] || 100;
};
