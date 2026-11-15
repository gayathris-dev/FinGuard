import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from backend.services.data_service import data_service

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "backend", "models")

class SentimentService:
    def __init__(self):
        self.pipeline = None
        self.metadata = None
        self.load_model()

    def load_model(self):
        model_path = os.path.join(MODELS_DIR, "sentiment_pipeline.joblib")
        meta_path = os.path.join(MODELS_DIR, "sentiment_metadata.json")

        if os.path.exists(model_path):
            self.pipeline = joblib.load(model_path)
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.metadata = json.load(f)

    def analyze_text(self, text: str) -> Dict[str, Any]:
        if self.pipeline is None:
            self.load_model()

        # Run NLP TF-IDF + Classifier
        pred_label = self.pipeline.predict([text])[0]
        probs = self.pipeline.predict_proba([text])[0]
        classes = list(self.pipeline.classes_)
        class_prob_map = dict(zip(classes, probs))

        confidence = round(float(np.max(probs)), 3)

        # Compute sentiment score between -1.0 and 1.0
        pos_p = class_prob_map.get("positive", 0.0)
        neg_p = class_prob_map.get("negative", 0.0)
        score = round(float(pos_p - neg_p), 3)

        # Risk relevance & analysis
        lower_text = text.lower()
        if score < -0.4:
            risk_relevance = "Critical" if any(w in lower_text for w in ["hack", "exploit", "breach", "default", "subprime", "fraud"]) else "High"
            impact = "Adverse financial climate likely to elevate credit delinquency rates and spur counterparty liquidity tightness."
            action = "Tighten real-time credit underwriting parameters and elevate transaction velocity threshold triggers."
        elif score > 0.4:
            risk_relevance = "Low"
            impact = "Constructive market macro liquidity and benign credit conditions supportive of portfolio stability."
            action = "Maintain standard underwriting buffers; capitalize on prime borrower acquisition corridors."
        else:
            risk_relevance = "Medium"
            impact = "Balanced market conditions with localized sector volatility; monitoring recommended."
            action = "Sustain routine surveillance and automated alert monitoring."

        return {
            "text": text,
            "sentiment": pred_label,
            "sentiment_score": score,
            "confidence": confidence,
            "class_probabilities": {k: round(float(v), 3) for k, v in class_prob_map.items()},
            "risk_relevance": risk_relevance,
            "market_impact_analysis": impact,
            "recommended_portfolio_action": action
        }

    def get_sentiment_overview(self) -> Dict[str, Any]:
        df = data_service.get_news_df().copy()
        if df.empty:
            return {}

        # 1. Overall sentiment score (-100 to +100 gauge)
        avg_score = float(df["sentiment_score"].mean())
        gauge_val = round(avg_score * 100, 1)

        # 2. Sentiment distribution
        counts = df["sentiment"].value_counts().to_dict()
        total = len(df)
        dist = [
            {"label": "Positive", "count": counts.get("positive", 0), "percentage": round((counts.get("positive", 0)/total)*100, 1), "color": "#00D6A3"},
            {"label": "Neutral", "count": counts.get("neutral", 0), "percentage": round((counts.get("neutral", 0)/total)*100, 1), "color": "#3B82F6"},
            {"label": "Negative", "count": counts.get("negative", 0), "percentage": round((counts.get("negative", 0)/total)*100, 1), "color": "#F05252"},
        ]

        # 3. Sector-wise sentiment
        sector_grp = df.groupby("sector", observed=False).agg(
            avg_score=("sentiment_score", "mean"),
            article_count=("news_id", "count")
        ).reset_index()

        sectors = []
        for _, row in sector_grp.iterrows():
            sc = round(float(row["avg_score"]), 2)
            sectors.append({
                "sector": row["sector"],
                "sentiment_score": sc,
                "sentiment_label": "Bullish / Positive" if sc > 0.2 else ("Bearish / Negative" if sc < -0.2 else "Neutral"),
                "article_count": int(row["article_count"]),
                "risk_status": "High Risk" if sc < -0.3 else ("Low Risk" if sc > 0.2 else "Moderate Risk")
            })

        # 4. Sentiment Trend over chronological batches
        df["dt"] = pd.to_datetime(df["published_at"])
        df_sorted = df.sort_values(by="dt", ascending=True)
        # Group by day
        df_sorted["date_day"] = df_sorted["dt"].dt.strftime("%b %d")
        day_grp = df_sorted.groupby("date_day", sort=False).agg(
            avg_sentiment=("sentiment_score", "mean"),
            articles=("news_id", "count")
        ).reset_index()

        trend = [
            {"date": row["date_day"], "sentiment_score": round(float(row["avg_sentiment"]), 2), "articles": int(row["articles"])}
            for _, row in day_grp.iterrows()
        ]

        # 5. News items with full details
        items = df.head(30).to_dict(orient="records")

        # 6. AI Market Intelligence synthesis
        ai_summary = {
            "title": "Macro Sentiment & Liquidity Risk Transmission",
            "executive_takeaway": (
                "Market sentiment over the recent observation window indicates elevated pressure in commercial credit and synthetic identity exposure, "
                "offset by strong tech corporate earnings and stabilized central bank discount windows. "
                "The net composite sentiment index sits at " + ("mildly negative territory." if gauge_val < 0 else "moderately constructive territory.")
            ),
            "transmission_channels": [
                {
                    "channel": "Fintech & ACH Clearing Rails",
                    "exposure": "High",
                    "detail": "Credential harvesting and synthetic account botnets increase fraud mitigation overhead."
                },
                {
                    "channel": "Consumer Debt & Revolving Credit",
                    "exposure": "Moderate",
                    "detail": "Subprime auto delinquencies show marginal contagion, while prime consumer revolving lines remain resilient."
                },
                {
                    "channel": "Interbank Liquidity & Repos",
                    "exposure": "Low",
                    "detail": "Central bank facilities maintain ample overnight reserve cushions."
                }
            ]
        }

        return {
            "gauge_score": gauge_val,
            "distribution": dist,
            "sector_sentiment": sectors,
            "trend": trend,
            "news_items": items,
            "ai_market_intelligence": ai_summary
        }

sentiment_service = SentimentService()
