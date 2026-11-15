from fastapi import APIRouter
from backend.services.risk_intelligence_service import risk_intelligence_service

router = APIRouter(prefix="/api/risk-intelligence", tags=["Risk Intelligence"])

@router.get("/summary")
def get_risk_summary():
    return risk_intelligence_service.get_consolidated_risk_summary()
