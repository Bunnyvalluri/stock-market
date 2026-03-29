import express from 'express';
import { getNewsBySymbol } from '../controllers/newsController.js';
const router = express.Router();

// GET /api/news/:symbol
router.get('/:symbol', getNewsBySymbol);

export default router;
