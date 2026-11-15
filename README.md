# FinGuard AI — Intelligent Financial Risk Detection & Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg)](https://tailwindcss.com)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5+-F7931E.svg)](https://scikit-learn.org)

**FinGuard AI** is a production-inspired, enterprise-grade financial intelligence platform that unifies supervised fraud detection, predictive credit default underwriting, unsupervised anomaly surveillance, and NLP-driven financial news sentiment analysis into a cohesive, high-performance command center.

Inspired by top-tier fintech platforms such as **Stripe Dashboard**, **Bloomberg Terminal**, **Linear**, and **Ramp**, FinGuard AI provides sub-millisecond risk evaluation, explainable machine learning feature attribution, real-time transaction event streaming, and regulatory audit compliance reporting.

---

## Key Capabilities & Modules

### 1. Executive Risk Overview Dashboard
- **Top-Level KPI Ribbon**: Real-time aggregation of Total Transactions, Flagged Fraud, Fraud Interception Rate, High-Risk Accounts, Mean Risk Index, and Gross Clearing Settlement with sparkline trendlines.
- **Interactive Multi-Timeframe Charts**:
  - *Transaction Activity Overview*: Area chart contrasting legitimate clearing volume against ML-flagged threats.
  - *Fraud Detection Distribution*: Donut chart stratifying verified, suspicious, and cleared tranches.
  - *Risk Tier Stratification*: Horizontal bar chart classifying active account portfolios.
  - *Historical Risk Score Progression*: Multi-series temporal correlation between risk scores and fraud velocity.
- **AI Risk Intelligence Feed**: Autonomous risk synthesis highlighting emerging cross-border threats and actionable defensive recommendations.
- **Recent Suspicious Transactions Table**: Filterable, sortable forensic table with transaction telemetry drawer.

### 2. AI-Powered Fraud Detection Engine
- **Direct Gradient Boosting Inference**: Evaluates single transactions across amounts, MCC codes, device fingerprints, geographical distance, and velocity counters.
- **Calibrated Probability & Explainable AI**: Outputs fraud probability, risk category (LOW, MEDIUM, HIGH, CRITICAL), calibration confidence, and directional feature contribution vectors (+/- risk score points).
- **Bulk CSV Batch Ingestion**: Upload custom transaction CSV files to run parallelized batch inference with summary statistics.
- **Model Validation Dashboard**: Transparent display of true evaluation metrics on unseen holdouts: **ROC-AUC (0.904)**, **Precision**, **Recall**, **F1-Score**, and **Confusion Matrix**.

### 3. Intelligent Credit Risk Assessment
- **Borrower Solvency Profiling**: Underwrites loan applications incorporating annual income, FICO credit scores, debt-to-income (DTI) ratio, existing debt, prior derogatory defaults, and payment history.
- **Credit Tiering & Mitigation Covenants**: Assigns borrower credit ratings (Tier A Super Prime to Tier D Subprime) with tailored risk mitigation actions (escrow reserve, collateral requirements, co-signatories).
- **Portfolio Visualizations**: Default probabilities by income brackets, credit risk by employment category, and risk tier distribution.
- **Regulatory Decision-Support Notice**: Clearly adheres to Fair Lending principles with advisory decision-support notices.

### 4. Real-Time Transaction Monitoring
- **Simulated ISO 20022 Stream**: Configurable streaming event rail (toggle pause/resume, adjustable speed: 1s, 3s, 5s).
- **Dynamic Surveillance Filters**: Filter by risk level, transaction status, merchant category, and amount bounds.
- **Audit Chronology Drawer**: Sliding drawer detailing transaction device telemetry and chronological authorization milestones.

### 5. NLP Financial Market Sentiment
- **Financial Headline Intelligence**: Monitors news items tagged with tickers (`SPY`, `JPM`, `BTC`, `FED`), source bureaus, and sentiment classifications.
- **Interactive NLP Analyzer**: Input breaking news headlines to generate TF-IDF sentiment scores (-1.0 to +1.0) and market risk transmission explanations.
- **Sector Sentiment Matrix**: Bullish/bearish stance across asset verticals (Banking & Credit, Fintech & Payments, Macroeconomics, Crypto).

### 6. Unsupervised Anomaly Detection Engine
- **Isolation Forest Algorithm**: Identifies multivariate spatial-temporal outliers across 12,000 transactions using randomized recursive partitioning.
- **Interactive 2D Projection Scatter Plot**: Amount vs Geographical Distance separating normal clusters from high-contamination anomalies.
- **Temporal & Score Distributions**: Hourly diurnal distribution and normalized outlier score histograms.
- **Forensic Investigation Drawer**: Granular dimensional divergence explanations.

### 7. Consolidated Risk Intelligence Center
- **Institutional Risk Index**: Weighted composite formula:
  $$\text{Index} = 0.35 \cdot \text{Fraud} + 0.30 \cdot \text{Credit} + 0.20 \cdot \text{Sentiment} + 0.15 \cdot \text{Anomaly}$$
- **AI Executive Briefing**: Real-time cross-platform narrative synthesizing macro-micro conditions.
- **Multi-Factor Radar Chart**: 6-axis threat vector projection.
- **Empirical Correlation Matrix**: Quantified Pearson correlation coefficients across operational domains.

### 8. Reports & Regulatory Audits
- **Certified Audit Trail Exports**: Downloadable CSV data streams for fraud logs and borrower solvency.
- **Print / PDF View Mode**: Browser print stylesheet optimized for executive PDF briefs.
- **Supervisory Narrative**: Model Risk Management SR 11-7 attestation.

### 9. System Configuration & Policy Controls
- **Dynamic Risk Threshold Sliders**: Adjust critical hold, review, and monitoring thresholds with live API persistence.
- **Incident Escalation Channels**: Configure SOC email, Slack webhook, and SMS escalation switches.
- **Infrastructure Telemetry**: Live monitor API status, model latency (7.8ms), database response time (3.4ms), and uptime.

---

## Architecture & Technology Stack

```
finguard-ai/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/           # Common components, layout, drawers, modals
│   │   ├── context/              # Auth & Notification providers
│   │   ├── pages/                # 9 core institutional views + Login
│   │   ├── services/             # Centralized typed API client
│   │   └── types/                # Domain models & interfaces
│   └── package.json
│
├── backend/                      # Python 3.12 + FastAPI + Scikit-Learn
│   ├── api/                      # REST endpoints for all 9 modules
│   ├── models/                   # Serialized ML joblib artifacts & metadata JSONs
│   ├── schemas/                  # Pydantic validation schemas
│   ├── services/                 # Business logic, inference pipelines & data cache
│   └── main.py                   # FastAPI application & middleware
│
├── datasets/                     # High-fidelity realistic financial CSVs
│   ├── transactions.csv          # 12,000 transactions with fraud labels & coordinates
│   ├── credit_risk.csv           # 5,000 borrower profiles with default indicators
│   └── financial_news.csv        # Curated news items with NLP sentiment labels
│
├── scripts/                      # Data synthesis & ML training pipelines
│   ├── generate_datasets.py      # Synthetic dataset generator
│   └── train_models.py           # Gradient Boosting & Isolation Forest trainer
│
├── tests/                        # Pytest API integration suite
├── requirements.txt              # Backend dependencies
└── README.md                     # Engineering documentation
```

---

## Quick Start & Installation

### Prerequisites
- **Python 3.12+**
- **Node.js 20+ & npm**

### 1. Backend Setup
```bash
# Create and activate virtual environment
python -m venv backend/.venv
# Windows:
backend\.venv\Scripts\activate
# Linux/macOS:
source backend/.venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Generate realistic datasets (if not already generated)
python scripts/generate_datasets.py

# Train and serialize ML models
python scripts/train_models.py

# Launch FastAPI backend (port 8000)
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend API will be live at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend

# Install packages
npm install

# Run Vite dev server (port 5173)
npm run dev
```

Open `http://127.0.0.1:5173` in your browser.

---

## Machine Learning Pipeline Specifications

| Pipeline | Algorithm | Evaluation Metric | Training Dataset | Serialization |
| :--- | :--- | :--- | :--- | :--- |
| **Fraud Detection** | Gradient Boosting Classifier (120 Trees) | **ROC-AUC: 0.9040**, Precision: 49.1%, Recall: 24.3% | 12,000 Transactions | `fraud_model.joblib` |
| **Credit Risk** | Gradient Boosting Classifier (100 Trees) | **ROC-AUC: 0.7683**, Precision: 57.9%, Recall: 13.6% | 5,000 Borrowers | `credit_model.joblib` |
| **Anomaly Detection**| Isolation Forest (150 Trees, contamination=0.045) | **540 Outliers Isolated (4.5%)** | 12,000 Transactions | `anomaly_model.joblib` |
| **Market Sentiment** | TF-IDF (500 features) + Logistic Regression | **Accuracy: 98.7%** | Curated Financial News | `sentiment_pipeline.joblib` |

---

## Automated Test Suite

Run the full integration test suite:
```bash
backend\.venv\Scripts\python.exe -m pytest tests/test_api.py -v
```

All endpoints, schema validations, and inference pipelines are verified against automated unit and integration tests.

---

## License & Intellectual Property
FinGuard AI is developed as an institutional demonstration platform for modern financial technology engineering, artificial intelligence risk modeling, and advanced user interface design.
