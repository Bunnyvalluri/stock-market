import express from 'express';
import { getPortfolio, addTrade } from '../controllers/portfolioController.js';
const router = express.Router();

// GET  /api/portfolio
router.get('/', getPortfolio);

// POST /api/portfolio
router.post('/', addTrade);

export default router;
