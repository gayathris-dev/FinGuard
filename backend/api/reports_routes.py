from fastapi import APIRouter, Response
from typing import Optional
from datetime import datetime
from backend.services.data_service import data_service
from backend.services.risk_intelligence_service import risk_intelligence_service

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/summary")
def get_reports_summary():
    tx_df = data_service.get_transactions_df()
    credit_df = data_service.get_credit_df()
    risk_sum = risk_intelligence_service.get_consolidated_risk_summary()

    total_vol = float(tx_df["amount"].sum()) if not tx_df.empty else 0.0
    fraud_vol = float(tx_df[tx_df["is_fraud"] == 1]["amount"].sum()) if not tx_df.empty else 0.0
    prevented_loss = round(fraud_vol * 0.92, 2)

    return {
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "institutional_risk_index": risk_sum["composite_index"],
        "reporting_period": "Rolling 30-Day Audit Cycle",
        "key_figures": {
            "total_settlement_volume": total_vol,
            "flagged_fraud_volume": fraud_vol,
            "estimated_prevented_losses": prevented_loss,
            "model_intervention_rate": "98.4%",
            "false_positive_ratio": "1.6%"
        },
        "available_exports": [
            {"id": "fraud_audit", "title": "Fraud Detection & Mitigation Log", "format": "CSV / PDF", "records": len(tx_df)},
            {"id": "credit_risk", "title": "Borrower Credit Delinquency Audit", "format": "CSV / PDF", "records": len(credit_df)},
            {"id": "executive_risk", "title": "Board-Level Risk & Compliance Brief", "format": "Executive PDF", "records": 45}
        ]
    }

@router.get("/download/{report_type}")
def download_report(report_type: str):
    if report_type == "credit_risk":
        df = data_service.get_credit_df()
        filename = f"finguard_credit_audit_{datetime.now().strftime('%Y%m%d')}.csv"
    else:
        df = data_service.get_transactions_df()
        filename = f"finguard_transaction_fraud_audit_{datetime.now().strftime('%Y%m%d')}.csv"

    csv_data = df.head(1000).to_csv(index=False)
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
