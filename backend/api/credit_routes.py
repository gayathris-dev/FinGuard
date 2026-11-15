from fastapi import APIRouter, UploadFile, File, HTTPException
import io
import pandas as pd
from backend.schemas import CreditApplicantRequest, CreditPredictionResponse
from backend.services.credit_service import credit_service

router = APIRouter(prefix="/api/credit", tags=["Credit Risk"])

@router.post("/predict", response_model=CreditPredictionResponse)
def predict_credit_risk(req: CreditApplicantRequest):
    return credit_service.predict_credit(req.model_dump())

@router.get("/metrics")
def get_credit_visual_metrics():
    return credit_service.get_credit_visual_metrics()

@router.post("/batch-predict")
async def batch_predict_credit(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.StringIO(content.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="Uploaded CSV file is empty")

    # Run predictions row by row for batch preview
    results = []
    for _, row in df.head(100).iterrows():
        try:
            pred = credit_service.predict_credit(row.to_dict())
            results.append({
                "applicant_id": row.get("applicant_id", f"APP-{len(results)+1}"),
                "annual_income": float(row.get("annual_income", 0)),
                "loan_amount": float(row.get("loan_amount", 0)),
                "credit_score": int(row.get("credit_score", 0)),
                "default_probability": pred["default_probability"],
                "risk_category": pred["risk_category"],
                "credit_rating": pred["credit_rating"]
            })
        except Exception:
            continue

    return {
        "total_analyzed": len(results),
        "records": results
    }
