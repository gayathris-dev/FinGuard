import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from backend.services.data_service import data_service

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "backend", "models")

class AnomalyService:
    def __init__(self):
        self.pipeline = None
        self.metadata = None
        self.load_model()

    def load_model(self):
        model_path = os.path.join(MODELS_DIR, "anomaly_model.joblib")
        meta_path = os.path.join(MODELS_DIR, "anomaly_metadata.json")

        if os.path.exists(model_path):
            self.pipeline = joblib.load(model_path)
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.metadata = json.load(f)

    def detect_anomalies(self, sample_size: int = 500) -> Dict[str, Any]:
        df = data_service.get_transactions_df().copy()
        if df.empty or self.pipeline is None:
            self.load_model()

        # Sample for interactive visual performance
        sample_df = df.sample(min(sample_size, len(df)), random_state=42).copy()
        sample_df["datetime"] = pd.to_datetime(sample_df["timestamp"])
        sample_df["hour"] = sample_df["datetime"].dt.hour

        features = self.pipeline["feature_names"]
        scaler = self.pipeline["scaler"]
        iso = self.pipeline["model"]

        X = sample_df[features]
        X_scaled = scaler.transform(X)

        preds = iso.predict(X_scaled)  # -1 is anomaly, 1 is normal
        scores = iso.decision_function(X_scaled)  # lower = more abnormal

        # Invert score so higher = more anomalous (0 to 1 scale)
        norm_scores = (scores.max() - scores) / (scores.max() - scores.min() + 1e-6)

        sample_df["is_anomaly"] = (preds == -1)
        sample_df["anomaly_score"] = np.round(norm_scores, 4)

        # Separate normal vs anomalous
        anomalies_df = sample_df[sample_df["is_anomaly"] == True]
        normal_df = sample_df[sample_df["is_anomaly"] == False]

        # Scatter plot dataset (Amount vs Distance, with score and category)
        scatter_points = []
        for _, row in sample_df.iterrows():
            scatter_points.append({
                "transaction_id": row["transaction_id"],
                "account_id": row["account_id"],
                "amount": float(row["amount"]),
                "distance_miles": float(row["distance_miles"]),
                "frequency_24h": int(row["frequency_24h"]),
                "merchant_category": row["merchant_category"],
                "anomaly_score": float(row["anomaly_score"]),
                "is_anomaly": bool(row["is_anomaly"]),
                "status": "Anomalous" if row["is_anomaly"] else "Normal"
            })

        # Distribution histogram
        bins = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0]
        binned = pd.cut(sample_df["anomaly_score"], bins=bins, include_lowest=True)
        counts = binned.value_counts().sort_index()
        score_distribution = [
            {"range": "0.0 - 0.2", "count": int(counts.iloc[0]), "severity": "Normal"},
            {"range": "0.2 - 0.4", "count": int(counts.iloc[1]), "severity": "Low Variation"},
            {"range": "0.4 - 0.6", "count": int(counts.iloc[2]), "severity": "Moderate Outlier"},
            {"range": "0.6 - 0.8", "count": int(counts.iloc[3]), "severity": "High Outlier"},
            {"range": "0.8 - 1.0", "count": int(counts.iloc[4]), "severity": "Critical Anomaly"},
        ]

        # Top 15 Anomalies with pattern explanation
        top_anomalies = []
        sorted_anomalies = anomalies_df.sort_values(by="anomaly_score", ascending=False).head(15)
        for _, row in sorted_anomalies.iterrows():
            reasons = []
            if row["amount"] > 3500:
                reasons.append(f"Amount (${row['amount']:,.2f}) > 98th percentile")
            if row["distance_miles"] > 1200:
                reasons.append(f"Origin distance ({row['distance_miles']:,.0f} mi) location outlier")
            if row["frequency_24h"] > 5:
                reasons.append(f"Velocity surge ({row['frequency_24h']} txns/24h)")
            if not reasons:
                reasons.append("Multi-dimensional feature vector divergence")

            top_anomalies.append({
                "transaction_id": row["transaction_id"],
                "account_id": row["account_id"],
                "amount": float(row["amount"]),
                "timestamp": row["timestamp"],
                "location": row["location"],
                "merchant_category": row["merchant_category"],
                "anomaly_score": float(row["anomaly_score"]),
                "pattern_explanation": " | ".join(reasons)
            })

        # Time-based anomaly pattern (by hour of day)
        hourly = sample_df.groupby(["hour", "is_anomaly"], observed=False)["transaction_id"].count().unstack(fill_value=0)
        time_patterns = []
        for h in range(24):
            anom_c = int(hourly.loc[h, True]) if (h in hourly.index and True in hourly.columns) else 0
            norm_c = int(hourly.loc[h, False]) if (h in hourly.index and False in hourly.columns) else 0
            time_patterns.append({
                "hour": f"{h:02d}:00",
                "normal_count": norm_c,
                "anomalous_count": anom_c
            })

        return {
            "summary": {
                "total_analyzed": len(sample_df),
                "anomalies_detected": len(anomalies_df),
                "anomaly_rate_percent": round((len(anomalies_df) / len(sample_df)) * 100, 2),
                "model_type": "Isolation Forest (150 Estimators, Contamination 4.5%)",
                "features_monitored": features
            },
            "scatter_points": scatter_points,
            "score_distribution": score_distribution,
            "top_anomalies": top_anomalies,
            "time_patterns": time_patterns
        }

anomaly_service = AnomalyService()
