from fastapi import APIRouter
from backend.schemas import SentimentAnalysisRequest, SentimentAnalysisResponse
from backend.services.sentiment_service import sentiment_service

router = APIRouter(prefix="/api/sentiment", tags=["Market Sentiment"])

@router.get("/overview")
def get_sentiment_overview():
    return sentiment_service.get_sentiment_overview()

@router.post("/analyze", response_model=SentimentAnalysisResponse)
def analyze_custom_news(req: SentimentAnalysisRequest):
    return sentiment_service.analyze_text(req.text)
