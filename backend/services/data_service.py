import os
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")

class DataService:
    def __init__(self):
        self._tx_df = None
        self._credit_df = None
        self._news_df = None
        self.load_datasets()

    def load_datasets(self):
        tx_path = os.path.join(DATASETS_DIR, "transactions.csv")
        credit_path = os.path.join(DATASETS_DIR, "credit_risk.csv")
        news_path = os.path.join(DATASETS_DIR, "financial_news.csv")

        if os.path.exists(tx_path):
            self._tx_df = pd.read_csv(tx_path)
        else:
            self._tx_df = pd.DataFrame()

        if os.path.exists(credit_path):
            self._credit_df = pd.read_csv(credit_path)
        else:
            self._credit_df = pd.DataFrame()

        if os.path.exists(news_path):
            self._news_df = pd.read_csv(news_path)
        else:
            self._news_df = pd.DataFrame()

    def get_transactions_df(self) -> pd.DataFrame:
        if self._tx_df is None or self._tx_df.empty:
            self.load_datasets()
        return self._tx_df

    def get_credit_df(self) -> pd.DataFrame:
        if self._credit_df is None or self._credit_df.empty:
            self.load_datasets()
        return self._credit_df

    def get_news_df(self) -> pd.DataFrame:
        if self._news_df is None or self._news_df.empty:
            self.load_datasets()
        return self._news_df

    def query_transactions(
        self,
        search: Optional[str] = None,
        risk_level: Optional[str] = None,
        category: Optional[str] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
        status: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "timestamp",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
        df = self.get_transactions_df().copy()

        if df.empty:
            return {"items": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        if search:
            s = search.lower().strip()
            df = df[
                df["transaction_id"].str.lower().str.contains(s, na=False) |
                df["account_id"].str.lower().str.contains(s, na=False) |
                df["location"].str.lower().str.contains(s, na=False) |
                df["merchant_category"].str.lower().str.contains(s, na=False)
            ]

        if risk_level and risk_level.lower() != "all":
            rl = risk_level.lower()
            if rl == "low":
                df = df[df["risk_score"] < 40]
            elif rl == "medium":
                df = df[(df["risk_score"] >= 40) & (df["risk_score"] < 70)]
            elif rl == "high":
                df = df[(df["risk_score"] >= 70) & (df["risk_score"] < 88)]
            elif rl == "critical":
                df = df[df["risk_score"] >= 88]

        if category and category != "all":
            df = df[df["merchant_category"] == category]

        if min_amount is not None:
            df = df[df["amount"] >= min_amount]

        if max_amount is not None:
            df = df[df["amount"] <= max_amount]

        if status and status.lower() != "all":
            df = df[df["status"].str.lower() == status.lower()]

        # Sorting
        if sort_by in df.columns:
            ascending = (sort_order.lower() == "asc")
            df = df.sort_values(by=sort_by, ascending=ascending)

        total = len(df)
        total_pages = max(1, int(np.ceil(total / page_size)))
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size

        sliced = df.iloc[start_idx:end_idx]
        items = sliced.to_dict(orient="records")

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }

    def get_transaction_by_id(self, txn_id: str) -> Optional[Dict[str, Any]]:
        df = self.get_transactions_df()
        res = df[df["transaction_id"] == txn_id]
        if res.empty:
            return None
        item = res.iloc[0].to_dict()
        
        # Add rich contextual timeline
        dt = datetime.strptime(item["timestamp"], "%Y-%m-%d %H:%M:%S")
        timeline = [
            {
                "timestamp": (dt - timedelta(minutes=4)).strftime("%H:%M:%S"),
                "event": "Device Session Initiated",
                "detail": f"Connected from {item['device_type']} via {item['channel']}"
            },
            {
                "timestamp": (dt - timedelta(minutes=1)).strftime("%H:%M:%S"),
                "event": "Transaction Authorization Request",
                "detail": f"Authorization for ${item['amount']:,.2f} at {item['merchant_category']}"
            },
            {
                "timestamp": dt.strftime("%H:%M:%S"),
                "event": "FinGuard ML Inference Executed",
                "detail": f"Risk Score: {item['risk_score']}/100 - Classification: {item['status']}"
            }
        ]
        if item["is_fraud"] == 1:
            timeline.append({
                "timestamp": (dt + timedelta(seconds=12)).strftime("%H:%M:%S"),
                "event": "Automated Security Alert Fired",
                "detail": item["detection_reason"]
            })
            
        item["timeline"] = timeline
        return item

    def get_live_stream_batch(self, count: int = 5) -> List[Dict[str, Any]]:
        """Simulates incoming transactions for live monitoring."""
        df = self.get_transactions_df()
        if df.empty:
            return []
        
        samples = df.sample(count).to_dict(orient="records")
        now = datetime.now()
        for idx, s in enumerate(samples):
            # assign fresh timestamp
            fresh_time = now - timedelta(seconds=idx * random.randint(3, 12))
            s["timestamp"] = fresh_time.strftime("%Y-%m-%d %H:%M:%S")
            s["transaction_id"] = f"TXN-LIVE-{random.randint(100000, 999999)}"
        return samples

data_service = DataService()
