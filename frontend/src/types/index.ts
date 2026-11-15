export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  securityLevel: string;
  avatarUrl?: string;
}

export interface KPI {
  id: string;
  title: string;
  value: string;
  numeric_value: number;
  change_percentage: number;
  trend: 'up' | 'down' | 'neutral';
  comparison_period: string;
  status: 'positive' | 'warning' | 'critical' | 'neutral';
  sparkline: number[];
}

export interface Transaction {
  transaction_id: string;
  account_id: string;
  timestamp: string;
  amount: number;
  currency: string;
  merchant_category: string;
  location: string;
  distance_miles: number;
  is_foreign: number;
  device_type: string;
  channel: string;
  frequency_24h: number;
  risk_score: number;
  is_fraud: number;
  detection_reason: string;
  status: string;
  timeline?: Array<{
    timestamp: string;
    event: string;
    detail: string;
  }>;
}

export interface ContributingFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface FraudPredictionResult {
  fraud_probability: number;
  risk_score: number;
  risk_classification: string;
  prediction_confidence: number;
  contributing_factors: ContributingFactor[];
  recommended_action: string;
  inference_mode: string;
  evaluated_at: string;
}

export interface CreditPredictionResult {
  applicant_id: string;
  default_probability: number;
  risk_category: string;
  credit_rating: string;
  risk_score: number;
  creditworthiness_assessment: string;
  main_contributing_factors: ContributingFactor[];
  suggested_risk_mitigation: string[];
  model_confidence: number;
  inference_mode: string;
}

export interface NewsItem {
  news_id: string;
  headline: string;
  summary: string;
  source: string;
  published_at: string;
  related_symbol: string;
  sector: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentiment_score: number;
  risk_impact_level: string;
  market_risk_rationale: string;
}

export interface AlertNotification {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  affected_entities?: string;
  timestamp: string;
  metric?: string;
  action?: string;
  read?: boolean;
}

export interface SystemHealth {
  api_status: string;
  database_latency_ms: number;
  model_inference_latency_ms: number;
  active_stream_workers: number;
  last_health_check: string;
  uptime: string;
}
