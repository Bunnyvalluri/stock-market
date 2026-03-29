# NeuralTrade — Full-Stack Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                       │
│  src/                                                            │
│  ├── pages/          # Route-level components                    │
│  ├── components/     # Shared UI components                      │
│  ├── hooks/          # useSocket, useAuth, useQuery hooks        │
│  ├── context/        # AuthContext (Firebase + Socket wiring)    │
│  ├── socket/         # socketClient.js — Socket.io singleton     │
│  ├── services/       # apiClient.js — Axios → backend           │
│  └── firebase.js     # Firebase app init + auth providers        │
└─────────────────┬───────────────────────────────────────────────┘
                  │  REST (Axios / JWT)     Socket.io (WS)
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│               BACKEND (Node.js + Express + Socket.io)            │
│  backend/src/                                                    │
│  ├── index.js              # HTTP + Socket.io server             │
│  ├── routes/               # stocks, predict, portfolio, alerts │
│  ├── controllers/          # Business logic per route            │
│  ├── middleware/auth.js    # Firebase Admin JWT verification     │
│  ├── socket/socketManager  # Rooms: stock:SYMBOL, user:UID      │
│  └── services/             # Alpha Vantage, poller, etc.        │
└────────┬─────────────────────────────────┬──────────────────────┘
         │  Firebase Admin SDK              │  HTTP Proxy
         ▼                                  ▼
┌────────────────────┐      ┌───────────────────────────────────┐
│  DATABASE          │      │  ML SERVICE (Python FastAPI)       │
│  Firebase          │      │  ml-service/                      │
│  ├── Firestore     │      │  ├── main.py        # FastAPI app  │
│  │   ├── portfolios│      │  ├── app/routes/    # /predict     │
│  │   └── alerts    │      │  ├── app/services/  # Predictor   │
│  └── Auth          │      │  │   └── predictor.py # RF model  │
│      ├── Email     │      │  └── requirements.txt             │
│      ├── Google    │      └───────────────────────────────────┘
│      └── GitHub    │
└────────────────────┘

## Request Flow

User Action → React Component
    → apiClient.js (Axios + Bearer JWT)
    → Node.js Backend (verifyFirebaseToken middleware)
    → [For predictions] → ML Service FastAPI → RandomForest → Response
    → [For data] → Alpha Vantage / Firestore
    → JSON response → React state update → UI render

## Real-time Flow (Socket.io)

1. User logs in → AuthContext calls connectSocket()
2. Component mounts → useStockSocket('AAPL') subscribes to room
3. Backend stock poller fetches price → emitPriceUpdate('AAPL', data)
4. All subscribers receive 'price:update' event
5. UI updates live without page refresh

## Technology Stack

| Layer         | Technology                    | Port |
|---------------|-------------------------------|------|
| Frontend      | React 19 + Vite               | 5173 |
| Backend       | Node.js + Express + Socket.io | 5000 |
| Database      | Firebase Firestore + Auth     | —    |
| ML Service    | Python FastAPI + scikit-learn | 8000 |

## Running Locally

### Frontend
```bash
cd stock-market
npm run dev
```

### Backend
```bash
cd stock-market/backend
cp .env.example .env      # Fill in your Firebase service account
npm install
npm run dev
```

### ML Service
```bash
cd stock-market/ml-service
pip install -r requirements.txt
python main.py
```

## Socket.io Event Reference

| Event               | Direction        | Payload                                      |
|---------------------|------------------|----------------------------------------------|
| `subscribe:stock`   | Client → Server  | `"AAPL"`                                     |
| `unsubscribe:stock` | Client → Server  | `"AAPL"`                                     |
| `price:update`      | Server → Client  | `{ symbol, price, change, volume, timestamp }`|
| `prediction:update` | Server → Client  | `{ symbol, predictedPrice, confidence, trend }`|
| `alert:triggered`   | Server → Client  | `{ symbol, condition, threshold, triggeredAt }`|
