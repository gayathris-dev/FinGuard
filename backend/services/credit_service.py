import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from backend.services.data_service import data_service

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "backend", "models")

class CreditService:
    def __init__(self):
        self.model = None
        self.metadata = None
        self.load_model()

    def load_model(self):
        model_path = os.path.join(MODELS_DIR, "credit_model.joblib")
        meta_path = os.path.join(MODELS_DIR, "credit_metadata.json")

        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.metadata = json.load(f)

    def predict_credit(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if self.model is None:
            self.load_model()

        numeric_features = [
            "age", "annual_income", "employment_duration_years", "loan_amount",
            "loan_duration_months", "credit_score", "debt_to_income",
            "existing_debt", "previous_defaults", "payment_history_score"
        ]
        categorical_features = ["employment_status", "home_ownership", "loan_purpose"]

        input_data = {}
        for col in numeric_features:
            input_data[col] = [float(data.get(col, 0))]
        for col in categorical_features:
            input_data[col] = [str(data.get(col, "Other"))]

        df_input = pd.DataFrame(input_data)
        prob = float(self.model.predict_proba(df_input)[0, 1])

        # Risk Category & Credit Rating
        if prob >= 0.60:
            category = "Critical Risk"
            rating = "Tier D (Subprime High Risk)"
            assessment = "Severe credit impairment profile with high default likelihood."
        elif prob >= 0.35:
            category = "High Risk"
            rating = "Tier C (Near Prime Cautionary)"
            assessment = "Elevated leverage or adverse credit signals requiring risk mitigation covenants."
        elif prob >= 0.15:
            category = "Medium Risk"
            rating = "Tier B (Standard Prime Eligible)"
            assessment = "Satisfactory borrower credit history with moderate leverage indicators."
        else:
            category = "Low Risk"
            rating = "Tier A (Super Prime Excellent)"
            assessment = "Robust debt-service capacity and exemplary repayment reliability."

        risk_score = round(prob * 100, 1)

        # Main contributing factors
        factors = []
        dti = float(data.get("debt_to_income", 0.3))
        cs = int(data.get("credit_score", 700))
        income = float(data.get("annual_income", 60000))
        loan = float(data.get("loan_amount", 20000))
        defaults = int(data.get("previous_defaults", 0))

        if dti > 0.43:
            factors.append({
                "factor": "Debt-to-Income (DTI) Leverage",
                "impact": "negative",
                "weight": 0.35,
                "description": f"DTI of {dti:.1%} exceeds standard prudential threshold of 43%."
            })
        else:
            factors.append({
                "factor": "Debt-to-Income (DTI) Sustainability",
                "impact": "positive",
                "weight": 0.25,
                "description": f"DTI of {dti:.1%} confirms adequate debt-servicing headroom."
            })

        if cs < 620:
            factors.append({
                "factor": "Credit Bureau Scoring (FICO)",
                "impact": "negative",
                "weight": 0.30,
                "description": f"Credit bureau score ({cs}) indicates historical delinquent tendencies."
            })
        else:
            factors.append({
                "factor": "Credit Bureau Scoring (FICO)",
                "impact": "positive",
                "weight": 0.30,
                "description": f"Credit bureau score ({cs}) reflects disciplined credit history."
            })

        if defaults > 0:
            factors.append({
                "factor": "Historical Derogatory Defaults",
                "impact": "negative",
                "weight": 0.25,
                "description": f"Identified {defaults} prior default event(s) in credit history."
            })

        if loan > (income * 0.45):
            factors.append({
                "factor": "Loan Principal-to-Income Burden",
                "impact": "negative",
                "weight": 0.20,
                "description": f"Requested loan amount (${loan:,.0f}) is high relative to annual income (${income:,.0f})."
            })

        mitigations = []
        if prob >= 0.35:
            mitigations.append("Require a creditworthy co-signatory or qualified institutional guarantor.")
            mitigations.append("Reduce loan principal or cap loan-to-income at 30%.")
            mitigations.append("Establish automated escrow debt-service reserve account (DSRA).")
            mitigations.append("Request pledge of verified liquid collateral assets.")
        elif prob >= 0.15:
            mitigations.append("Enroll borrower in automated ACH autopay for preferential rate discount.")
            mitigations.append("Conduct semi-annual income and bureau refresh verification.")
        else:
            mitigations.append("Borrower eligible for expedited underwriting and standard prime pricing.")

        return {
            "applicant_id": str(data.get("applicant_id", "APP-MANUAL")),
            "default_probability": round(prob, 4),
            "risk_category": category,
            "credit_rating": rating,
            "risk_score": risk_score,
            "creditworthiness_assessment": assessment,
            "main_contributing_factors": factors,
            "suggested_risk_mitigation": mitigations,
            "model_confidence": round(0.5 + abs(prob - 0.5), 3),
            "inference_mode": "Trained Gradient Boosting Credit Classifier"
        }

    def get_credit_visual_metrics(self) -> Dict[str, Any]:
        df = data_service.get_credit_df().copy()
        if df.empty:
            return {}

        # 1. Distribution of risk categories
        cat_counts = df["risk_category"].value_counts().to_dict()
        risk_dist = [
            {"category": "Low Risk", "count": cat_counts.get("Low Risk", 0), "color": "#00D6A3"},
            {"category": "Medium Risk", "count": cat_counts.get("Medium Risk", 0), "color": "#3B82F6"},
            {"category": "High Risk", "count": cat_counts.get("High Risk", 0), "color": "#F5B942"},
            {"category": "Critical Risk", "count": cat_counts.get("Critical Risk", 0), "color": "#F05252"},
        ]

        # 2. Default prob by Income Bracket
        df["income_bracket"] = pd.cut(
            df["annual_income"],
            bins=[0, 40000, 75000, 120000, 200000, 1000000],
            labels=["<$40k", "$40k-$75k", "$75k-$120k", "$120k-$200k", "$200k+"]
        )
        income_grp = df.groupby("income_bracket", observed=False)["default_probability"].mean().reset_index()
        income_metrics = [
            {"bracket": str(row["income_bracket"]), "avg_default_prob": round(float(row["default_probability"]) * 100, 1)}
            for _, row in income_grp.iterrows()
        ]

        # 3. Credit Risk by Employment
        emp_grp = df.groupby("employment_status", observed=False).agg(
            avg_default=("default_probability", "mean"),
            avg_fico=("credit_score", "mean"),
            count=("applicant_id", "count")
        ).reset_index()
        emp_metrics = [
            {
                "employment": row["employment_status"],
                "default_prob": round(float(row["avg_default"]) * 100, 1),
                "avg_fico": round(float(row["avg_fico"])),
                "count": int(row["count"])
            }
            for _, row in emp_grp.iterrows()
        ]

        # 4. Loan Amount vs Default Risk scatter samples
        scatter_sample = df.sample(min(180, len(df)))[[
            "applicant_id", "loan_amount", "annual_income", "credit_score", "default_probability", "risk_category"
        ]].to_dict(orient="records")

        return {
            "model_metadata": self.metadata or {},
            "risk_distribution": risk_dist,
            "income_metrics": income_metrics,
            "employment_metrics": emp_metrics,
            "scatter_sample": scatter_sample
        }

credit_service = CreditService()
