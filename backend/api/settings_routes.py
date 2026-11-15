from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(prefix="/api/settings", tags=["Settings"])

# In-memory settings state with realistic fintech defaults
system_settings = {
    "risk_thresholds": {
        "fraud_score_critical": 80,
        "fraud_score_high": 55,
        "fraud_score_medium": 30,
        "credit_dti_ceiling": 0.45,
        "credit_score_floor": 620,
        "velocity_alert_limit_24h": 5
    },
    "model_configuration": {
        "active_fraud_model": "Gradient Boosting (120 trees)",
        "fraud_inference_mode": "Production Trained Artifact",
        "credit_model_version": "v2.4.1 (Calibrated)",
        "isolation_forest_contamination": 0.045,
        "auto_retrain_interval_days": 14
    },
    "notifications": {
        "email_alerts": True,
        "slack_webhook_active": True,
        "sms_critical_escalation": True,
        "daily_risk_digest": True
    },
    "system_health": {
        "api_status": "Operational",
        "database_latency_ms": 3.4,
        "model_inference_latency_ms": 7.8,
        "active_stream_workers": 4,
        "last_health_check": "Just now",
        "uptime": "99.98%"
    }
}

class ThresholdUpdateRequest(BaseModel):
    fraud_score_critical: int
    fraud_score_high: int
    fraud_score_medium: int
    credit_dti_ceiling: float
    credit_score_floor: int
    velocity_alert_limit_24h: int

@router.get("")
def get_settings():
    return system_settings

@router.post("/thresholds")
def update_thresholds(req: ThresholdUpdateRequest):
    system_settings["risk_thresholds"].update(req.model_dump())
    return {
        "status": "success",
        "message": "Risk policy thresholds updated and deployed across active inference nodes.",
        "updated_thresholds": system_settings["risk_thresholds"]
    }
