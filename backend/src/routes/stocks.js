import express from 'express';
import { getAllStocks, getStockBySymbol } from '../controllers/stockController.js';
const router = express.Router();

// GET /api/stocks
router.get('/', getAllStocks);

// GET /api/stocks/:symbol
router.get('/:symbol', getStockBySymbol);

export default router;
