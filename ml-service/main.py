from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predictions, health, sentiment

app = FastAPI(
    title="NeuralTrade ML Service",
    description="LSTM + Random Forest stock prediction engine",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173", "https://stock-market-backend.onrender.com"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(predictions.router, prefix="/predict")
app.include_router(sentiment.router, prefix="/sentiment")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
