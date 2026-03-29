import express from 'express';
import { getPrediction } from '../controllers/predictionController.js';

const router = express.Router();

// GET /api/predict/:symbol
// → Proxies to Python ML Service, returns LSTM/RF forecast
router.get('/:symbol', getPrediction);

export default router;
