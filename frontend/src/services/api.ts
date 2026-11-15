const API_BASE = 'http://127.0.0.1:8000/api';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Dashboard Overview
  async getDashboardOverview() {
    const res = await fetch(`${API_BASE}/dashboard/overview`);
    if (!res.ok) throw new Error('Failed to fetch dashboard overview');
    return res.json();
  },

  // Transactions
  async getTransactions(params: Record<string, any> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const res = await fetch(`${API_BASE}/transactions?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  async getTransactionDetails(id: string) {
    const res = await fetch(`${API_BASE}/transactions/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch transaction ${id}`);
    return res.json();
  },

  async getLiveStreamBatch(count = 5) {
    const res = await fetch(`${API_BASE}/transactions/stream?count=${count}`);
    if (!res.ok) throw new Error('Failed to fetch stream batch');
    return res.json();
  },

  // Fraud Detection
  async predictFraud(data: Record<string, any>) {
    const res = await fetch(`${API_BASE}/fraud/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Prediction error' }));
      throw new Error(err.detail || 'Prediction failed');
    }
    return res.json();
  },

  async uploadFraudBatch(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/fraud/batch-predict`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Batch upload failed' }));
      throw new Error(err.detail || 'Batch prediction failed');
    }
    return res.json();
  },

  async getFraudMetrics() {
    const res = await fetch(`${API_BASE}/fraud/metrics`);
    return res.json();
  },

  // Credit Risk
  async predictCredit(data: Record<string, any>) {
    const res = await fetch(`${API_BASE}/credit/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Credit prediction failed' }));
      throw new Error(err.detail || 'Credit risk evaluation failed');
    }
    return res.json();
  },

  async getCreditMetrics() {
    const res = await fetch(`${API_BASE}/credit/metrics`);
    if (!res.ok) throw new Error('Failed to fetch credit metrics');
    return res.json();
  },

  async uploadCreditBatch(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/credit/batch-predict`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Credit batch upload failed' }));
      throw new Error(err.detail || 'Credit batch failed');
    }
    return res.json();
  },

  // Anomaly Detection
  async getAnomalyDetection(sampleSize = 500) {
    const res = await fetch(`${API_BASE}/anomaly/detect?sample_size=${sampleSize}`);
    if (!res.ok) throw new Error('Failed to run anomaly detection');
    return res.json();
  },

  // Market Sentiment
  async getSentimentOverview() {
    const res = await fetch(`${API_BASE}/sentiment/overview`);
    if (!res.ok) throw new Error('Failed to fetch sentiment overview');
    return res.json();
  },

  async analyzeSentiment(text: string) {
    const res = await fetch(`${API_BASE}/sentiment/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Sentiment analysis failed');
    return res.json();
  },

  // Risk Intelligence
  async getRiskSummary() {
    const res = await fetch(`${API_BASE}/risk-intelligence/summary`);
    if (!res.ok) throw new Error('Failed to fetch risk intelligence summary');
    return res.json();
  },

  // Reports
  async getReportsSummary() {
    const res = await fetch(`${API_BASE}/reports/summary`);
    if (!res.ok) throw new Error('Failed to fetch reports summary');
    return res.json();
  },

  getReportDownloadUrl(type: string) {
    return `${API_BASE}/reports/download/${type}`;
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateThresholds(data: Record<string, any>) {
    const res = await fetch(`${API_BASE}/settings/thresholds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update thresholds');
    return res.json();
  }
};
