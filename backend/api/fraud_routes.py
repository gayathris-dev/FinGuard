from fastapi import APIRouter, UploadFile, File, HTTPException
import io
import pandas as pd
from backend.schemas import FraudPredictionRequest, FraudPredictionResponse
from backend.services.fraud_service import fraud_service

router = APIRouter(prefix="/api/fraud", tags=["Fraud Detection"])

@router.post("/predict", response_model=FraudPredictionResponse)
def predict_fraud(req: FraudPredictionRequest):
    return fraud_service.predict_single(req.model_dump())

@router.post("/batch-predict")
async def batch_predict_fraud(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    content = await file.read()
    try:
        df = pd.read_csv(io.StringIO(content.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="Uploaded CSV file contains no data rows")

    try:
        results = fraud_service.batch_predict(df)
        return results
    except ValueError as ve:
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")

@router.get("/metrics")
def get_fraud_model_metrics():
    return fraud_service.get_model_metadata()
