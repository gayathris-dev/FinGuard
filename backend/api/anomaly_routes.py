from fastapi import APIRouter, Query, UploadFile, File, HTTPException
import io
import pandas as pd
from backend.services.anomaly_service import anomaly_service

router = APIRouter(prefix="/api/anomaly", tags=["Anomaly Detection"])

@router.get("/detect")
def detect_anomalies(sample_size: int = Query(500, ge=50, le=2000)):
    return anomaly_service.detect_anomalies(sample_size=sample_size)

@router.post("/detect")
def detect_anomalies_post(payload: dict = None):
    sample_size = 500
    if payload and "sample_size" in payload:
        sample_size = int(payload["sample_size"])
    return anomaly_service.detect_anomalies(sample_size=sample_size)

@router.post("/upload")
async def upload_anomaly_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files supported")
    content = await file.read()
    try:
        df = pd.read_csv(io.StringIO(content.decode("utf-8")))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid CSV: {str(e)}")

    if df.empty:
        raise HTTPException(status_code=400, detail="CSV contains no records")

    return {
        "status": "success",
        "message": f"Successfully parsed {len(df)} transactions for anomaly detection",
        "columns_identified": list(df.columns),
        "preview": df.head(10).to_dict(orient="records")
    }
