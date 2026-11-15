from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Transaction schemas
class TransactionBase(BaseModel):
    transaction_id: str
    account_id: str
    timestamp: str
    amount: float
    currency: str = "USD"
    merchant_category: str
    location: str
    distance_miles: float
    is_foreign: int
    device_type: str
    channel: str
    frequency_24h: int
    risk_score: float
    is_fraud: int
    detection_reason: str
    status: str

class TransactionFilterParams(BaseModel):
    search: Optional[str] = None
    risk_level: Optional[str] = None  # all, low, medium, high, critical
    category: Optional[str] = None
    min_amount: Optional[float] = None
    max_amount: Optional[float] = None
    status: Optional[str] = None
    page: int = 1
    page_size: int = 20
    sort_by: str = "timestamp"
    sort_order: str = "desc"

class FraudPredictionRequest(BaseModel):
    account_id: str = "ACC-992144"
    amount: float = Field(..., gt=0, description="Transaction amount in USD")
    merchant_category: str = "Electronics & Gadgets"
    location: str = "London, UK"
    distance_miles: float = Field(..., ge=0)
    is_foreign: int = Field(0, ge=0, le=1)
    device_type: str = "Web Browser (Chrome)"
    channel: str = "E-Commerce Web"
    frequency_24h: int = Field(2, ge=0)
    hour: int = Field(14, ge=0, le=23)
    day_of_week: int = Field(2, ge=0, le=6)

class ContributingFactor(BaseModel):
    factor: str
    impact: str  # positive, negative, neutral
    weight: float
    description: str

class FraudPredictionResponse(BaseModel):
    fraud_probability: float
    risk_score: float
    risk_classification: str  # LOW RISK, MEDIUM RISK, HIGH RISK, CRITICAL RISK
    prediction_confidence: float
    contributing_factors: List[ContributingFactor]
    recommended_action: str
    inference_mode: str = "Trained Gradient Boosting Model"
    evaluated_at: str

# Credit Risk Schemas
class CreditApplicantRequest(BaseModel):
    applicant_id: Optional[str] = "APP-MANUAL"
    age: int = Field(35, ge=18, le=100)
    annual_income: float = Field(75000.0, gt=0)
    employment_status: str = "Full-Time Corporate"
    employment_duration_years: float = Field(5.0, ge=0)
    loan_amount: float = Field(25000.0, gt=0)
    loan_duration_months: int = Field(36, ge=6, le=120)
    loan_purpose: str = "Debt Consolidation"
    home_ownership: str = "MORTGAGE"
    credit_score: int = Field(710, ge=300, le=850)
    debt_to_income: float = Field(0.28, ge=0.0, le=1.5)
    existing_debt: float = Field(21000.0, ge=0)
    previous_defaults: int = Field(0, ge=0)
    payment_history_score: float = Field(88.0, ge=0, le=100)

class CreditPredictionResponse(BaseModel):
    applicant_id: str
    default_probability: float
    risk_category: str
    credit_rating: str
    risk_score: float
    creditworthiness_assessment: str
    main_contributing_factors: List[ContributingFactor]
    suggested_risk_mitigation: List[str]
    model_confidence: float
    inference_mode: str = "Trained Gradient Boosting Credit Classifier"

# Anomaly Schemas
class AnomalyDetectionRequest(BaseModel):
    contamination: Optional[float] = 0.045
    sample_size: Optional[int] = 500

class AnomalyItem(BaseModel):
    transaction_id: str
    account_id: str
    amount: float
    timestamp: str
    anomaly_score: float
    is_anomaly: bool
    deviation_metrics: Dict[str, float]
    pattern_explanation: str

# Sentiment Schemas
class SentimentAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=5)

class SentimentAnalysisResponse(BaseModel):
    text: str
    sentiment: str  # positive, neutral, negative
    sentiment_score: float  # -1.0 to 1.0
    confidence: float
    risk_relevance: str  # Low, Medium, High, Critical
    market_impact_analysis: str
    recommended_portfolio_action: str

# Dashboard Schemas
class DashboardKPI(BaseModel):
    title: str
    value: str
    numeric_value: float
    change_percentage: float
    trend: str  # up, down, neutral
    comparison_period: str
    status: str  # positive, warning, critical, neutral
    sparkline: List[float]

class AIInsight(BaseModel):
    id: str
    severity: str  # Critical, High, Medium, Low
    title: str
    description: str
    supporting_metric: str
    timestamp: str
    recommended_action: str
    source_module: str
