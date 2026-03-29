import axios from 'axios';

const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Gets the API key from local storage (set in Settings page) 
 * or falls back to 'demo' (which only works for IBM/basic endpoints)
 */
const getApiKey = () => {
  return localStorage.getItem('alphaVantageKey') || 'demo';
};

/**
 * Fetch the latest price and volume for a single symbol
 * Endpoint: GLOBAL_QUOTE
 */
export const fetchGlobalQuote = async (symbol) => {
  try {
    const apiKey = getApiKey();
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: apiKey
      }
    });

    const quote = response.data['Global Quote'];
    
    if (quote && Object.keys(quote).length > 0) {
      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume'], 10),
        latestTradingDay: quote['07. latest trading day']
      };
    } else if (response.data.Information || response.data.Note) {
       // Rate limit or invalid key
       console.warn(`AlphaVantage API limit reached or invalid for ${symbol}:`, response.data);
       return null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    return null;
  }
};

/**
 * Fetch historical daily data for charting
 * Endpoint: TIME_SERIES_DAILY
 */
export const fetchDailySeries = async (symbol) => {
  try {
    const apiKey = getApiKey();
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: apiKey
      }
    });

    const timeSeries = response.data['Time Series (Daily)'];
    if (timeSeries) {
       // Convert object to array and slice recent 30 days
       const data = Object.keys(timeSeries).slice(0, 30).map(date => {
          const dayData = timeSeries[date];
          return {
             date: date,
             close: parseFloat(dayData['4. close']),
             volume: parseInt(dayData['5. volume'], 10)
          }
       }).reverse(); // chronological order
       
       return data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching sequence for ${symbol}:`, error);
    return null;
  }
};
