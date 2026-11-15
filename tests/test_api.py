import pytest
import io
import pandas as pd
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["models_loaded"]["fraud_detection"] is True
    assert data["models_loaded"]["credit_risk"] is True
    assert data["models_loaded"]["anomaly_isolation_forest"] is True
    assert data["models_loaded"]["nlp_sentiment"] is True

def test_dashboard_overview():
    res = client.get("/api/dashboard/overview")
    assert res.status_code == 200
    data = res.json()
    assert "kpis" in data
    assert len(data["kpis"]) == 6
    assert "transaction_activity" in data
    assert "fraud_distribution" in data
    assert "risk_distribution" in data
    assert "risk_trends" in data
    assert "recent_suspicious_transactions" in data
    assert "ai_insights" in data

def test_transactions_list():
    res = client.get("/api/transactions?page=1&page_size=10")
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) == 10
    assert data["total"] > 0

def test_fraud_prediction_single():
    payload = {
        "account_id": "ACC-TEST-01",
        "amount": 4200.0,
        "merchant_category": "Crypto & Digital Assets",
        "location": "London, UK",
        "distance_miles": 3400.0,
        "is_foreign": 1,
        "device_type": "Web Browser (Chrome)",
        "channel": "E-Commerce Web",
        "frequency_24h": 6,
        "hour": 2,
        "day_of_week": 3
    }
    res = client.post("/api/fraud/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "fraud_probability" in data
    assert "risk_score" in data
    assert "risk_classification" in data
    assert "contributing_factors" in data
    assert len(data["contributing_factors"]) > 0

def test_credit_prediction():
    payload = {
        "applicant_id": "APP-TEST-01",
        "age": 42,
        "annual_income": 95000.0,
        "employment_status": "Full-Time Corporate",
        "employment_duration_years": 8.0,
        "loan_amount": 30000.0,
        "loan_duration_months": 36,
        "loan_purpose": "Debt Consolidation",
        "home_ownership": "MORTGAGE",
        "credit_score": 740,
        "debt_to_income": 0.25,
        "existing_debt": 23750.0,
        "previous_defaults": 0,
        "payment_history_score": 94.0
    }
    res = client.post("/api/credit/predict", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "default_probability" in data
    assert "credit_rating" in data
    assert "risk_category" in data
    assert "suggested_risk_mitigation" in data

def test_anomaly_detection():
    res = client.get("/api/anomaly/detect?sample_size=100")
    assert res.status_code == 200
    data = res.json()
    assert "scatter_points" in data
    assert len(data["scatter_points"]) == 100
    assert "score_distribution" in data
    assert "top_anomalies" in data

def test_sentiment_analysis():
    payload = {"text": "Federal Reserve introduces emergency discount window to guarantee interbank solvency."}
    res = client.post("/api/sentiment/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "sentiment" in data
    assert "sentiment_score" in data
    assert "market_impact_analysis" in data

def test_risk_intelligence_summary():
    res = client.get("/api/risk-intelligence/summary")
    assert res.status_code == 200
    data = res.json()
    assert "composite_index" in data
    assert "executive_summary" in data
    assert "indicators" in data
    assert "correlation_matrix" in data
    assert "alerts" in data

def test_settings_thresholds_update():
    payload = {
        "fraud_score_critical": 82,
        "fraud_score_high": 58,
        "fraud_score_medium": 32,
        "credit_dti_ceiling": 0.44,
        "credit_score_floor": 630,
        "velocity_alert_limit_24h": 6
    }
    res = client.post("/api/settings/thresholds", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["updated_thresholds"]["fraud_score_critical"] == 82
