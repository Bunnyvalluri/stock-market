import { useEffect, useState } from 'react';
import { socket, subscribeToStock, unsubscribeFromStock } from '../socket/socketClient';

/**
 * useStockSocket — React hook for real-time stock price updates
 *
 * @param {string} symbol - e.g. 'AAPL'
 * @returns {{ price, change, volume, timestamp, connected }}
 *
 * Usage:
 *   const { price, change, connected } = useStockSocket('AAPL');
 */
export const useStockSocket = (symbol) => {
  const [data, setData] = useState({
    price: null,
    change: null,
    volume: null,
    timestamp: null,
  });
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    if (!symbol) return;

    const onConnect    = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onPriceUpdate = (payload) => {
      if (payload.symbol === symbol.toUpperCase()) {
        setData({
          price:     payload.price,
          change:    payload.change,
          volume:    payload.volume,
          timestamp: payload.timestamp || new Date().toISOString(),
        });
      }
    };

    socket.on('connect',      onConnect);
    socket.on('disconnect',   onDisconnect);
    socket.on('price:update', onPriceUpdate);

    // Subscribe to the room for this symbol
    subscribeToStock(symbol);

    return () => {
      socket.off('connect',      onConnect);
      socket.off('disconnect',   onDisconnect);
      socket.off('price:update', onPriceUpdate);
      unsubscribeFromStock(symbol);
    };
  }, [symbol]);

  return { ...data, connected };
};

/**
 * usePredictionSocket — React hook for real-time ML prediction updates
 *
 * @param {string} symbol
 * @returns {{ prediction, connected }}
 */
export const usePredictionSocket = (symbol) => {
  const [prediction, setPrediction] = useState(null);
  const [connected, setConnected]   = useState(socket.connected);

  useEffect(() => {
    if (!symbol) return;

    const onConnect    = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    const onPrediction = (payload) => {
      if (payload.symbol === symbol.toUpperCase()) {
        setPrediction(payload);
      }
    };

    socket.on('connect',            onConnect);
    socket.on('disconnect',         onDisconnect);
    socket.on('prediction:update',  onPrediction);

    subscribeToStock(symbol);

    return () => {
      socket.off('connect',           onConnect);
      socket.off('disconnect',        onDisconnect);
      socket.off('prediction:update', onPrediction);
      unsubscribeFromStock(symbol);
    };
  }, [symbol]);

  return { prediction, connected };
};
