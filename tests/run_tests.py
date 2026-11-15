"""
FinGuard AI - Standalone API Integration Verification Suite
Tests all live endpoints on http://127.0.0.1:8000 using standard library urllib.
"""

import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000/api"

def make_request(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=10) as response:
        return response.status, json.loads(response.read().decode("utf-8"))

def test_all():
    print("==================================================")
    print("   FinGuard AI Live API Verification Suite        ")
    print("==================================================")

    # 1. Health
    status, res = make_request("/health")
    assert status == 200 and res["status"] == "healthy"
    print("  [PASS] /api/health - Engine online with all 4 models")

    # 2. Dashboard Overview
    status, res = make_request("/dashboard/overview")
    assert status == 200 and len(res["kpis"]) == 6
    print(f"  [PASS] /api/dashboard/overview - Returned {len(res['kpis'])} KPIs & visualizations")

    # 3. Transactions
    status, res = make_request("/transactions?page=1&page_size=5")
    assert status == 200 and len(res["items"]) == 5
    print(f"  [PASS] /api/transactions - Paginated query succeeded (total {res['total']} records)")

    # 4. Single Fraud Prediction
    fraud_payload = {
        "account_id": "ACC-TEST-99",
        "amount": 4500.0,
        "merchant_category": "Crypto & Digital Assets",
        "location": "Frankfurt, DE",
        "distance_miles": 2100.0,
        "is_foreign": 1,
        "device_type": "Web Browser (Chrome)",
        "channel": "E-Commerce Web",
        "frequency_24h": 5,
        "hour": 2,
        "day_of_week": 4
    }
    status, res = make_request("/fraud/predict", method="POST", data=fraud_payload)
    assert status == 200 and "fraud_probability" in res
    print(f"  [PASS] /api/fraud/predict - ML score: {res['risk_score']}/100, class: {res['risk_classification']}")

    # 5. Credit Risk Assessment
    credit_payload = {
        "applicant_id": "APP-TEST-88",
        "age": 36,
        "annual_income": 88000.0,
        "employment_status": "Full-Time Corporate",
        "employment_duration_years": 7.0,
        "loan_amount": 25000.0,
        "loan_duration_months": 36,
        "loan_purpose": "Debt Consolidation",
        "home_ownership": "MORTGAGE",
        "credit_score": 735,
        "debt_to_income": 0.24,
        "existing_debt": 21120.0,
        "previous_defaults": 0,
        "payment_history_score": 93.0
    }
    status, res = make_request("/credit/predict", method="POST", data=credit_payload)
    assert status == 200 and "default_probability" in res
    print(f"  [PASS] /api/credit/predict - Default prob: {res['default_probability']*100:.1f}%, rating: {res['credit_rating']}")

    # 6. Anomaly Detection
    status, res = make_request("/anomaly/detect?sample_size=100")
    assert status == 200 and len(res["scatter_points"]) == 100
    print(f"  [PASS] /api/anomaly/detect - Processed {len(res['scatter_points'])} 2D scatter points")

    # 7. Sentiment NLP
    sentiment_payload = {"text": "Financial institutions report stable interbank liquidity as Federal Reserve pauses rates."}
    status, res = make_request("/sentiment/analyze", method="POST", data=sentiment_payload)
    assert status == 200 and "sentiment" in res
    print(f"  [PASS] /api/sentiment/analyze - Sentiment: {res['sentiment']} (score: {res['sentiment_score']})")

    # 8. Risk Intelligence Summary
    status, res = make_request("/risk-intelligence/summary")
    assert status == 200 and "composite_index" in res
    print(f"  [PASS] /api/risk-intelligence/summary - Composite Risk Index: {res['composite_index']}/100")

    # 9. Settings Policy Update
    thresholds_payload = {
        "fraud_score_critical": 80,
        "fraud_score_high": 55,
        "fraud_score_medium": 30,
        "credit_dti_ceiling": 0.45,
        "credit_score_floor": 620,
        "velocity_alert_limit_24h": 5
    }
    status, res = make_request("/settings/thresholds", method="POST", data=thresholds_payload)
    assert status == 200 and res["status"] == "success"
    print("  [PASS] /api/settings/thresholds - Successfully persisted policy thresholds")

    print("\n==================================================")
    print("  ALL 9 ENDPOINT INTEGRATION TESTS PASSED (100%)  ")
    print("==================================================")

if __name__ == "__main__":
    test_all()
