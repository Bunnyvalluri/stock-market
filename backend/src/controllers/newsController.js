import axios from 'axios';

/**
 * GET /api/news/:symbol
 * Fetches news from Alpha Vantage NEWS_SENTIMENT endpoint
 */
export const getNewsBySymbol = async (req, res) => {
  const { symbol } = req.params;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'NEWS_SENTIMENT',
        tickers: symbol.toUpperCase(),
        limit: 10,
        apikey: apiKey,
      },
    });

    const feed = response.data?.feed || [];
    const articles = feed.map(item => ({
      title: item.title,
      url: item.url,
      source: item.source,
      publishedAt: item.time_published,
      summary: item.summary,
      overallSentiment: item.overall_sentiment_label,
      sentimentScore: item.overall_sentiment_score,
    }));

    return res.json(articles);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
