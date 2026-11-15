from fastapi import APIRouter, Query, HTTPException
from typing import Optional, Dict, Any
from backend.services.data_service import data_service

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.get("")
def list_transactions(
    search: Optional[str] = Query(None, description="Search transaction ID, account ID, location, or merchant"),
    risk_level: Optional[str] = Query(None, description="all, low, medium, high, critical"),
    category: Optional[str] = Query(None, description="Merchant category"),
    min_amount: Optional[float] = Query(None),
    max_amount: Optional[float] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort_by: str = Query("timestamp"),
    sort_order: str = Query("desc")
):
    return data_service.query_transactions(
        search=search,
        risk_level=risk_level,
        category=category,
        min_amount=min_amount,
        max_amount=max_amount,
        status=status,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )

@router.get("/stream")
def get_live_stream_batch(count: int = Query(5, ge=1, le=20)):
    """Provides a batch of simulated live incoming transactions for real-time monitoring."""
    return data_service.get_live_stream_batch(count=count)

@router.get("/{txn_id}")
def get_transaction_details(txn_id: str):
    res = data_service.get_transaction_by_id(txn_id)
    if not res:
        raise HTTPException(status_code=404, detail=f"Transaction {txn_id} not found")
    return res
