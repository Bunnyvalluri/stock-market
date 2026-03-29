/**
 * Portfolio Controller
 * Uses Firebase Firestore to persist trades per user (keyed by Firebase UID)
 */
import admin from 'firebase-admin';

const getDb = () => admin.firestore();

// GET /api/portfolio
export const getPortfolio = async (req, res) => {
  const uid = req.user.uid;
  try {
    const doc = await getDb().collection('portfolios').doc(uid).get();
    return res.json(doc.exists ? doc.data() : { holdings: [], totalValue: 0 });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/portfolio
export const addTrade = async (req, res) => {
  const uid = req.user.uid;
  const { symbol, shares, buyPrice } = req.body;

  if (!symbol || !shares || !buyPrice) {
    return res.status(400).json({ error: 'symbol, shares, and buyPrice are required' });
  }

  try {
    const ref = getDb().collection('portfolios').doc(uid);
    await ref.set(
      {
        holdings: admin.firestore.FieldValue.arrayUnion({
          symbol: symbol.toUpperCase(),
          shares: Number(shares),
          buyPrice: Number(buyPrice),
          addedAt: new Date().toISOString(),
        }),
      },
      { merge: true }
    );
    return res.status(201).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
