import admin from 'firebase-admin';
import { emitAlert } from '../socket/socketManager.js';

const getDb = () => admin.firestore();

// GET /api/alerts
export const getAlerts = async (req, res) => {
  const uid = req.user.uid;
  try {
    const snap = await getDb().collection('alerts').where('uid', '==', uid).get();
    const alerts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(alerts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/alerts
export const createAlert = async (req, res) => {
  const uid = req.user.uid;
  const { symbol, condition, threshold } = req.body;

  if (!symbol || !condition || threshold === undefined) {
    return res.status(400).json({ error: 'symbol, condition, and threshold are required' });
  }

  try {
    const ref = await getDb().collection('alerts').add({
      uid,
      symbol: symbol.toUpperCase(),
      condition, // 'above' | 'below'
      threshold: Number(threshold),
      active: true,
      createdAt: new Date().toISOString(),
    });

    // Optionally push to Socket.io for immediate UI update
    emitAlert(uid, { id: ref.id, symbol, condition, threshold });

    return res.status(201).json({ id: ref.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
