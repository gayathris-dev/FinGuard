import os
import json
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any, List

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "backend", "models")

class FraudService:
    def __init__(self):
        self.model = None
        self.metadata = None
        self.load_model()

    def load_model(self):
        model_path = os.path.join(MODELS_DIR, "fraud_model.joblib")
        meta_path = os.path.join(MODELS_DIR, "fraud_metadata.json")

        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.metadata = json.load(f)

    def predict_single(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if self.model is None:
            self.load_model()

        # Format input DataFrame matching training columns
        input_dict = {
            "amount": [float(data.get("amount", 100.0))],
            "distance_miles": [float(data.get("distance_miles", 5.0))],
            "is_foreign": [int(data.get("is_foreign", 0))],
            "frequency_24h": [int(data.get("frequency_24h", 1))],
            "hour": [int(data.get("hour", 14))],
            "day_of_week": [int(data.get("day_of_week", 2))],
            "merchant_category": [str(data.get("merchant_category", "Groceries & Food"))],
            "device_type": [str(data.get("device_type", "Mobile App (iOS)"))],
            "channel": [str(data.get("channel", "In-store Chip/NFC"))]
        }
        df_input = pd.DataFrame(input_dict)

        # Run pipeline inference
        prob = float(self.model.predict_proba(df_input)[0, 1])
        risk_score = round(prob * 100, 1)

        # Risk Classification
        if risk_score >= 80:
            classification = "CRITICAL RISK"
            rec_action = "Immediate account lock & trigger step-up biometric multi-factor challenge."
        elif risk_score >= 55:
            classification = "HIGH RISK"
            rec_action = "Temporarily hold settlement and flag for tier-2 AML fraud review."
        elif risk_score >= 30:
            classification = "MEDIUM RISK"
            rec_action = "Approve with behavioral telemetry monitoring and verify cardholder notification."
        else:
            classification = "LOW RISK"
            rec_action = "Authorize and settle immediately under standard clearing protocols."

        # Model confidence: distance from decision boundary (0.5)
        confidence = round(0.5 + abs(prob - 0.5), 3)

        # Contributing factor analysis
        factors = []
        amount = float(data.get("amount", 100.0))
        dist = float(data.get("distance_miles", 5.0))
        freq = int(data.get("frequency_24h", 1))
        cat = str(data.get("merchant_category", ""))
        is_foreign = int(data.get("is_foreign", 0))

        if amount > 2500:
            factors.append({
                "factor": "Transaction Velocity & Capital Size",
                "impact": "negative",
                "weight": 0.35,
                "description": f"High transaction amount (${amount:,.2f}) deviates from median user baseline."
            })
        else:
            factors.append({
                "factor": "Transaction Capital Size",
                "impact": "positive",
                "weight": 0.20,
                "description": f"Amount (${amount:,.2f}) within standard authorization range."
            })

        if dist > 500 or is_foreign == 1:
            factors.append({
                "factor": "Geographical Discrepancy",
                "impact": "negative",
                "weight": 0.30,
                "description": f"Physical distance ({dist:.1f} mi) and cross-border indicator signal anomaly."
            })
        else:
            factors.append({
                "factor": "Geographical Proximity",
                "impact": "positive",
                "weight": 0.15,
                "description": "Origin coordinates align with primary registered residence."
            })

        if freq > 4:
            factors.append({
                "factor": "24-Hour Velocity Surge",
                "impact": "negative",
                "weight": 0.25,
                "description": f"Rapid burst of {freq} transactions initiated within rolling 24-hour cycle."
            })
        else:
            factors.append({
                "factor": "Velocity Consistency",
                "impact": "positive",
                "weight": 0.15,
                "description": "Transaction interval complies with normal consumer activity pacing."
            })

        if cat in ["Crypto & Digital Assets", "Wire Transfer / Remittance", "Online Gaming & Gambling"]:
            factors.append({
                "factor": "Merchant MCC Risk Profile",
                "impact": "negative",
                "weight": 0.20,
                "description": f"High-risk Merchant Category Code: {cat}."
            })

        return {
            "fraud_probability": round(prob, 4),
            "risk_score": risk_score,
            "risk_classification": classification,
            "prediction_confidence": confidence,
            "contributing_factors": factors,
            "recommended_action": rec_action,
            "inference_mode": "Trained Gradient Boosting Model",
            "evaluated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

    def batch_predict(self, df_upload: pd.DataFrame) -> Dict[str, Any]:
        if self.model is None:
            self.load_model()

        # Check required columns or map them
        required = ["amount", "distance_miles", "is_foreign", "frequency_24h"]
        missing = [col for col in required if col not in df_upload.columns]
        if missing:
            raise ValueError(f"Uploaded CSV is missing required columns: {', '.join(missing)}")

        # Ensure all columns present
        df_clean = df_upload.copy()
        if "hour" not in df_clean.columns:
            df_clean["hour"] = 12
        if "day_of_week" not in df_clean.columns:
            df_clean["day_of_week"] = 2
        if "merchant_category" not in df_clean.columns:
            df_clean["merchant_category"] = "Retail & Shopping"
        if "device_type" not in df_clean.columns:
            df_clean["device_type"] = "Mobile App (iOS)"
        if "channel" not in df_clean.columns:
            df_clean["channel"] = "E-Commerce Web"

        # Handle NaNs
        df_clean["amount"] = pd.to_numeric(df_clean["amount"], errors="coerce").fillna(50.0)
        df_clean["distance_miles"] = pd.to_numeric(df_clean["distance_miles"], errors="coerce").fillna(5.0)
        df_clean["is_foreign"] = pd.to_numeric(df_clean["is_foreign"], errors="coerce").fillna(0).astype(int)
        df_clean["frequency_24h"] = pd.to_numeric(df_clean["frequency_24h"], errors="coerce").fillna(1).astype(int)
        df_clean["hour"] = pd.to_numeric(df_clean["hour"], errors="coerce").fillna(12).astype(int)
        df_clean["day_of_week"] = pd.to_numeric(df_clean["day_of_week"], errors="coerce").fillna(2).astype(int)

        cols = ["amount", "distance_miles", "is_foreign", "frequency_24h", "hour", "day_of_week", "merchant_category", "device_type", "channel"]
        probs = self.model.predict_proba(df_clean[cols])[:, 1]
        
        df_upload["fraud_probability"] = np.round(probs, 4)
        df_upload["risk_score"] = np.round(probs * 100, 1)
        df_upload["risk_category"] = np.where(
            df_upload["risk_score"] >= 80, "CRITICAL RISK",
            np.where(df_upload["risk_score"] >= 55, "HIGH RISK",
            np.where(df_upload["risk_score"] >= 30, "MEDIUM RISK", "LOW RISK"))
        )

        total_analyzed = len(df_upload)
        flagged_count = int((df_upload["risk_score"] >= 55).sum())
        critical_count = int((df_upload["risk_score"] >= 80).sum())
        avg_score = round(float(df_upload["risk_score"].mean()), 1)

        return {
            "total_analyzed": total_analyzed,
            "flagged_count": flagged_count,
            "critical_count": critical_count,
            "average_risk_score": avg_score,
            "records": df_upload.head(100).to_dict(orient="records")
        }

    def get_model_metadata(self) -> Dict[str, Any]:
        if self.metadata is None:
            self.load_model()
        return self.metadata or {}

fraud_service = FraudService()
