from fastapi import APIRouter, HTTPException
from app.services.predictor import run_prediction

router = APIRouter()

@router.get("/{symbol}")
async def predict(symbol: str):
    """
    GET /predict/{symbol}
    
    Flow:
    1. Fetch recent historical OHLCV data via yfinance
    2. Run feature engineering (moving averages, RSI, MACD)
    3. Run RandomForest regression model
    4. Return predicted next-close, confidence, and trend direction
    """
    try:
        result = await run_prediction(symbol.upper())
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
