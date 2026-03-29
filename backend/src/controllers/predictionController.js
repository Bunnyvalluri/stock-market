import axios from 'axios';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * GET /api/predict/:symbol
 * Proxies request to Python FastAPI ML service.
 * Flow: Frontend → Backend → ML Service → Prediction → Backend → Frontend
 */
export const getPrediction = async (req, res) => {
  const { symbol } = req.params;
  try {
    const mlResponse = await axios.get(`${ML_URL}/predict/${symbol.toUpperCase()}`, {
      timeout: 30000, // LSTM inference can take time
    });

    const prediction = mlResponse.data;

    // Optionally broadcast via Socket.io to subscribed clients
    // import { emitPrediction } from '../socket/socketManager.js';
    // emitPrediction(symbol, prediction);

    return res.json(prediction);
  } catch (err) {
    console.error(`[Prediction] ML service error for ${symbol}:`, err.message);
    return res.status(502).json({
      error: 'ML service unavailable',
      details: err.message,
    });
  }
};
