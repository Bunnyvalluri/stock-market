from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import predictions, health

app = FastAPI(
    title="NeuralTrade ML Service",
    description="LSTM + Random Forest stock prediction engine",
    version="1.0.0",
)

# CORS — allow only the Node.js backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "https://stock-market-backend.onrender.com"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(predictions.router, prefix="/predict")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
