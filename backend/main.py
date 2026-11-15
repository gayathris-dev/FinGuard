import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.dashboard_routes import router as dashboard_router
from backend.api.transaction_routes import router as transaction_router
from backend.api.fraud_routes import router as fraud_router
from backend.api.credit_routes import router as credit_router
from backend.api.anomaly_routes import router as anomaly_router
from backend.api.sentiment_routes import router as sentiment_router
from backend.api.risk_routes import router as risk_router
from backend.api.reports_routes import router as reports_router
from backend.api.settings_routes import router as settings_router

app = FastAPI(
    title="FinGuard AI — Enterprise Financial Risk Intelligence API",
    description="Production-grade AI backend for financial fraud detection, borrower credit risk modeling, NLP market sentiment, and anomaly surveillance.",
    version="2.0.0"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(dashboard_router)
app.include_router(transaction_router)
app.include_router(fraud_router)
app.include_router(credit_router)
app.include_router(anomaly_router)
app.include_router(sentiment_router)
app.include_router(risk_router)
app.include_router(reports_router)
app.include_router(settings_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "FinGuard AI Intelligence Engine",
        "version": "2.0.0",
        "models_loaded": {
            "fraud_detection": True,
            "credit_risk": True,
            "anomaly_isolation_forest": True,
            "nlp_sentiment": True
        }
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
