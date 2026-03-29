import express from 'express';
import { getAlerts, createAlert } from '../controllers/alertController.js';
const router = express.Router();

// GET  /api/alerts
router.get('/', getAlerts);

// POST /api/alerts
router.post('/', createAlert);

export default router;
