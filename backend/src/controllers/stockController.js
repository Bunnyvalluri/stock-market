import axios from 'axios';

const ALPHA_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
const ALPHA_BASE = 'https://www.alphavantage.co/query';

/**
 * GET /api/stocks
 * Returns metadata for a set of predefined market tickers
 */
export const getAllStocks = async (_req, res) => {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META'];
  try {
    const results = await Promise.allSettled(
      symbols.map(sym =>
        axios.get(ALPHA_BASE, {
          params: { function: 'GLOBAL_QUOTE', symbol: sym, apikey: ALPHA_KEY },
        })
      )
    );

    const stocks = results
      .filter(r => r.status === 'fulfilled')
      .map(r => {
        const q = r.value.data?.['Global Quote'] || {};
        return {
          symbol: q['01. symbol'],
          price: parseFloat(q['05. price']) || 0,
          change: parseFloat((q['10. change percent'] || '0%').replace('%', '')),
          volume: parseInt(q['06. volume'], 10) || 0,
        };
      })
      .filter(s => s.symbol);

    return res.json(stocks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/stocks/:symbol
 * Returns 30-day historical OHLCV for charting
 */
export const getStockBySymbol = async (req, res) => {
  const { symbol } = req.params;
  try {
    const [quoteResp, seriesResp] = await Promise.all([
      axios.get(ALPHA_BASE, { params: { function: 'GLOBAL_QUOTE', symbol, apikey: ALPHA_KEY } }),
      axios.get(ALPHA_BASE, { params: { function: 'TIME_SERIES_DAILY', symbol, apikey: ALPHA_KEY } }),
    ]);

    const quote = quoteResp.data?.['Global Quote'] || {};
    const timeSeries = seriesResp.data?.['Time Series (Daily)'] || {};

    const history = Object.entries(timeSeries)
      .slice(0, 30)
      .map(([date, d]) => ({
        date,
        open: parseFloat(d['1. open']),
        high: parseFloat(d['2. high']),
        low: parseFloat(d['3. low']),
        close: parseFloat(d['4. close']),
        volume: parseInt(d['5. volume'], 10),
      }))
      .reverse();

    return res.json({
      symbol: quote['01. symbol'] || symbol,
      price: parseFloat(quote['05. price']) || 0,
      change: parseFloat((quote['10. change percent'] || '0%').replace('%', '')),
      history,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
