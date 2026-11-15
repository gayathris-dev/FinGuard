"""
FinGuard AI - High Fidelity Synthetic Financial Dataset Generator
Generates realistic datasets for:
1. transactions.csv (with fraud labels and behavioral patterns)
2. credit_risk.csv (borrower profiles, debt-to-income, default labels)
3. financial_news.csv (financial news headlines with NLP sentiment and market impact)
"""

import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Ensure reproducibility
np.random.seed(42)
random.seed(42)

DATASETS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets")
os.makedirs(DATASETS_DIR, exist_ok=True)

def generate_transactions(n=12000):
    print(f"Generating {n} synthetic transactions with realistic risk patterns...")
    
    locations = [
        ("New York, US", 0.28, 40.7128, -74.0060),
        ("San Francisco, US", 0.16, 37.7749, -122.4194),
        ("London, UK", 0.14, 51.5074, -0.1278),
        ("Singapore, SG", 0.09, 1.3521, 103.8198),
        ("Frankfurt, DE", 0.08, 50.1109, 8.6821),
        ("Tokyo, JP", 0.07, 35.6762, 139.6503),
        ("Toronto, CA", 0.06, 43.6532, -79.3832),
        ("Sydney, AU", 0.05, -33.8688, 151.2093),
        ("Lagos, NG", 0.03, 6.5244, 3.3792),
        ("Kyiv, UA", 0.02, 50.4501, 30.5234),
        ("Sao Paulo, BR", 0.02, -23.5505, -46.6333)
    ]
    loc_names, loc_weights, loc_lats, loc_lons = zip(*locations)
    loc_weights = np.array(loc_weights) / sum(loc_weights)

    categories = [
        ("Groceries & Food", 0.22, 15.0, 180.0, 0.005),
        ("Retail & Shopping", 0.20, 25.0, 850.0, 0.015),
        ("Travel & Airlines", 0.10, 120.0, 3200.0, 0.065),
        ("Electronics & Gadgets", 0.09, 80.0, 2400.0, 0.055),
        ("Entertainment & Media", 0.09, 10.0, 150.0, 0.01),
        ("Wire Transfer / Remittance", 0.08, 250.0, 9500.0, 0.095),
        ("Crypto & Digital Assets", 0.07, 100.0, 12000.0, 0.145),
        ("Luxury Goods & Jewelry", 0.06, 350.0, 15000.0, 0.12),
        ("Online Gaming & Gambling", 0.05, 50.0, 3500.0, 0.13),
        ("Healthcare & Pharmacy", 0.04, 20.0, 450.0, 0.008)
    ]
    cat_names, cat_weights, cat_min, cat_max, cat_base_fraud = zip(*categories)
    cat_weights = np.array(cat_weights) / sum(cat_weights)

    devices = ["Mobile App (iOS)", "Mobile App (Android)", "Web Browser (Chrome)", "Web Browser (Safari)", "POS Terminal", "ATM"]
    dev_weights = [0.38, 0.26, 0.18, 0.08, 0.07, 0.03]

    channels = ["In-store Chip/NFC", "E-Commerce Web", "Mobile In-App", "P2P Transfer", "Wire Transfer"]
    chan_weights = [0.35, 0.32, 0.20, 0.08, 0.05]

    now = datetime.now()
    records = []
    
    # 850 distinct account pools
    account_pool = [f"ACC-{100000 + i}" for i in range(850)]
    account_home_loc = {acc: random.choice(loc_names[:6]) for acc in account_pool}

    for i in range(n):
        txn_id = f"TXN-{1000000 + i}"
        account_id = random.choice(account_pool)
        home_loc = account_home_loc[account_id]
        
        # Location assignment
        if random.random() < 0.82:
            location = home_loc
            is_foreign = 0
            distance_miles = max(0.5, round(np.random.exponential(8.5), 1))
        else:
            location = np.random.choice(loc_names, p=loc_weights)
            is_foreign = 1 if location != home_loc else 0
            distance_miles = max(15.0, round(np.random.exponential(1200.0) + 150, 1))

        # Category and amount
        cat_idx = np.random.choice(len(cat_names), p=cat_weights)
        cat_name = cat_names[cat_idx]
        base_fraud_prob = cat_base_fraud[cat_idx]

        # Log normal amounts
        mean_amt = (cat_min[cat_idx] + cat_max[cat_idx]) / 3.0
        amount = round(np.random.lognormal(mean=np.log(mean_amt), sigma=0.85), 2)
        amount = max(cat_min[cat_idx], min(cat_max[cat_idx] * 1.5, amount))

        # Device & Channel
        device = np.random.choice(devices, p=dev_weights)
        channel = np.random.choice(channels, p=chan_weights)

        # Time within last 30 days
        days_ago = np.random.exponential(6.0)
        days_ago = min(30.0, days_ago)
        hours_ago = days_ago * 24 + random.uniform(0, 23)
        txn_time = now - timedelta(hours=hours_ago)

        # Frequency within 24h
        if random.random() < 0.80:
            freq_24h = np.random.poisson(1.8) + 1
        else:
            freq_24h = np.random.poisson(6.5) + 3

        # Suspicious patterns calculation
        risk_factors = 0
        if is_foreign == 1 and distance_miles > 1500:
            risk_factors += 2.5
        if cat_name in ["Crypto & Digital Assets", "Wire Transfer / Remittance", "Online Gaming & Gambling"]:
            risk_factors += 1.8
        if amount > 4000:
            risk_factors += 2.0
        if freq_24h > 6:
            risk_factors += 2.2
        if device in ["ATM"] and amount > 1500:
            risk_factors += 2.0
        if txn_time.hour in [1, 2, 3, 4]:
            risk_factors += 1.2

        fraud_prob = base_fraud_prob + (risk_factors * 0.08)
        # Cap probability
        fraud_prob = min(0.96, max(0.005, fraud_prob))

        is_fraud = 1 if (random.random() < fraud_prob and risk_factors >= 2.0) else 0

        # Calculated risk score (0-100)
        if is_fraud == 1:
            risk_score = round(min(99.4, 70.0 + (risk_factors * 4.5) + random.uniform(2, 10)), 1)
            status = random.choice(["Blocked", "Under Review", "Flagged"])
            reason = random.choice([
                "Sudden international velocity surge",
                "High-value anomalous transfer",
                "New device with rapid consecutive transactions",
                "Unusual merchant category & geographical mismatch",
                "Exceeded historical account spending ceiling"
            ])
        else:
            if risk_factors > 3.0:
                risk_score = round(min(69.0, 35.0 + (risk_factors * 4.0) + random.uniform(-5, 5)), 1)
                status = "Flagged" if risk_score > 55 else "Cleared"
                reason = "Elevated velocity threshold" if risk_score > 55 else "Normal transaction"
            else:
                risk_score = round(max(1.2, 5.0 + random.uniform(0, 18.0)), 1)
                status = "Cleared"
                reason = "Normal transaction pattern"

        records.append({
            "transaction_id": txn_id,
            "account_id": account_id,
            "timestamp": txn_time.strftime("%Y-%m-%d %H:%M:%S"),
            "amount": amount,
            "currency": "USD",
            "merchant_category": cat_name,
            "location": location,
            "distance_miles": distance_miles,
            "is_foreign": is_foreign,
            "device_type": device,
            "channel": channel,
            "frequency_24h": int(freq_24h),
            "risk_score": risk_score,
            "is_fraud": is_fraud,
            "detection_reason": reason,
            "status": status
        })

    df = pd.DataFrame(records)
    # Sort chronologically
    df["dt"] = pd.to_datetime(df["timestamp"])
    df = df.sort_values(by="dt", ascending=False).drop(columns=["dt"])
    
    csv_path = os.path.join(DATASETS_DIR, "transactions.csv")
    df.to_csv(csv_path, index=False)
    print(f"Saved {len(df)} transactions to {csv_path}. Fraud rate: {(df['is_fraud'].sum() / len(df) * 100):.2f}%")
    return df

def generate_credit_risk(n=5000):
    print(f"Generating {n} synthetic credit borrower profiles...")
    
    records = []
    purposes = ["Debt Consolidation", "Home Improvement", "Business Expansion", "Medical Expenses", "Major Purchase", "Auto / Vehicle", "Education"]
    employment_statuses = ["Full-Time Corporate", "Self-Employed / Founder", "Contract / Gig", "Public Sector / Gov", "Retired", "Unemployed"]
    emp_weights = [0.55, 0.18, 0.12, 0.08, 0.04, 0.03]
    home_statuses = ["MORTGAGE", "RENT", "OWN", "OTHER"]

    for i in range(n):
        applicant_id = f"APP-{200000 + i}"
        age = int(np.clip(np.random.normal(39, 11), 21, 74))
        emp_status = np.random.choice(employment_statuses, p=emp_weights)
        
        if emp_status == "Unemployed":
            annual_income = round(random.uniform(12000, 32000), 2)
            emp_years = 0.0
        elif emp_status == "Retired":
            annual_income = round(random.uniform(28000, 85000), 2)
            emp_years = round(random.uniform(15, 38), 1)
        else:
            annual_income = round(np.clip(np.random.lognormal(mean=11.1, sigma=0.65), 24000, 380000), 2)
            emp_years = round(min(age - 20, max(0.5, np.random.exponential(5.5))), 1)

        loan_amount = round(np.clip(np.random.lognormal(mean=9.9, sigma=0.75), 2500, 160000), -2)
        loan_duration = random.choice([12, 24, 36, 48, 60, 84])
        
        # Credit score correlates with income and employment
        base_fico = 670 + (np.log(max(10000, annual_income)) - 11.0) * 45
        if emp_status == "Unemployed":
            base_fico -= 85
        credit_score = int(np.clip(base_fico + np.random.normal(0, 50), 380, 850))

        # Existing debt and debt-to-income (DTI)
        dti_raw = np.clip(np.random.beta(a=2.5, b=5.0) * 0.75 + (0.2 if credit_score < 600 else 0), 0.05, 0.88)
        debt_to_income = round(float(dti_raw), 3)
        existing_debt = round(annual_income * debt_to_income * random.uniform(0.6, 1.4), 2)

        # Defaults history
        if credit_score < 580:
            prev_defaults = np.random.choice([1, 2, 3, 4], p=[0.45, 0.32, 0.15, 0.08])
        elif credit_score < 670:
            prev_defaults = np.random.choice([0, 1, 2], p=[0.68, 0.24, 0.08])
        else:
            prev_defaults = np.random.choice([0, 1], p=[0.96, 0.04])

        payment_history = round(np.clip((credit_score - 350) / 5.0 - (prev_defaults * 12.0) + np.random.normal(0, 4), 10.0, 99.5), 1)

        # Default probability calculation
        z = -2.8 \
            - 0.006 * (credit_score - 650) \
            + 3.2 * (debt_to_income - 0.35) \
            + 0.65 * prev_defaults \
            + 0.000008 * (loan_amount - 20000) \
            - 0.000004 * (annual_income - 65000) \
            - 0.03 * emp_years

        default_prob = 1.0 / (1.0 + np.exp(-z))
        default_prob = round(float(np.clip(default_prob, 0.015, 0.94)), 4)

        default_risk = 1 if (random.random() < default_prob) else 0

        if default_prob >= 0.65:
            risk_category = "Critical Risk"
            rating = "D"
        elif default_prob >= 0.40:
            risk_category = "High Risk"
            rating = "C"
        elif default_prob >= 0.18:
            risk_category = "Medium Risk"
            rating = "B"
        else:
            risk_category = "Low Risk"
            rating = "A"

        records.append({
            "applicant_id": applicant_id,
            "age": age,
            "annual_income": annual_income,
            "employment_status": emp_status,
            "employment_duration_years": emp_years,
            "loan_amount": loan_amount,
            "loan_duration_months": loan_duration,
            "loan_purpose": random.choice(purposes),
            "home_ownership": random.choice(home_statuses),
            "credit_score": credit_score,
            "debt_to_income": debt_to_income,
            "existing_debt": existing_debt,
            "previous_defaults": int(prev_defaults),
            "payment_history_score": payment_history,
            "default_probability": default_prob,
            "default_risk": default_risk,
            "risk_category": risk_category,
            "credit_rating": rating
        })

    df = pd.DataFrame(records)
    csv_path = os.path.join(DATASETS_DIR, "credit_risk.csv")
    df.to_csv(csv_path, index=False)
    print(f"Saved {len(df)} credit records to {csv_path}. Default rate: {(df['default_risk'].sum() / len(df) * 100):.2f}%")
    return df

def generate_financial_news():
    print("Generating curated financial news items with NLP sentiment labels...")
    
    curated_items = [
        # Banking & Credit
        {
            "headline": "Federal Reserve Signals Sustained Rate Pause as Interbank Liquidity Normalizes",
            "summary": "Central bank governors emphasized stable balance sheets across Tier-1 institutions, indicating diminished immediate pressure on commercial credit facilities.",
            "source": "Bloomberg Financial",
            "sector": "Banking & Credit",
            "related_symbol": "FED",
            "sentiment": "positive",
            "sentiment_score": 0.68,
            "risk_impact_level": "Low",
            "market_risk_rationale": "Stable liquidity conditions reduce default risks in corporate lending portfolios."
        },
        {
            "headline": "Regional Commercial Real Estate Loan Delinquencies Rise 42 Bps in Q3",
            "summary": "Mid-tier regional lenders report rising non-performing assets tied to downtown office leasing vacancies, prompting higher loan-loss provisioning.",
            "source": "Wall Street Insights",
            "sector": "Banking & Credit",
            "related_symbol": "KRE",
            "sentiment": "negative",
            "sentiment_score": -0.74,
            "risk_impact_level": "High",
            "market_risk_rationale": "Heightened credit default risk for regional banking exposures and refinancing hurdles."
        },
        {
            "headline": "Major Payment Network Launches Real-Time Cross-Border Settlement Rail",
            "summary": "Next-generation ISO 20022 clearing infrastructure promises sub-second settlement and automated AML sanctions screening for tier-one member banks.",
            "source": "Financial Times",
            "sector": "Fintech & Payments",
            "related_symbol": "V",
            "sentiment": "positive",
            "sentiment_score": 0.81,
            "risk_impact_level": "Low",
            "market_risk_rationale": "Automated cross-border verification reduces wire transfer settlement slippage and compliance breach risks."
        },
        {
            "headline": "Dark Web Syndicate Exploits Legacy ACH Batch Gateways in Coordinated Attack",
            "summary": "Cybersecurity advisories warn financial institutions of synthetic credential stuffing campaigns targeting overnight batch clearinghouse windows.",
            "source": "Reuters Markets",
            "sector": "Fintech & Payments",
            "related_symbol": "CYBR",
            "sentiment": "negative",
            "sentiment_score": -0.88,
            "risk_impact_level": "Critical",
            "market_risk_rationale": "Immediate spike in ACH fraudulent originations requiring transaction threshold locks."
        },
        {
            "headline": "SEC Advances Comprehensive Disclosure Mandate for Private Credit Valuation Frameworks",
            "summary": "Regulators unveil stringent quarterly independent appraisal guidelines for non-bank alternative lenders managing institutional credit assets.",
            "source": "SEC Filing Disclosures",
            "sector": "Regulatory & Compliance",
            "related_symbol": "BX",
            "sentiment": "neutral",
            "sentiment_score": -0.05,
            "risk_impact_level": "Medium",
            "market_risk_rationale": "Compliance expenditure rises in private credit funds, but system-wide systemic transparency improves."
        },
        {
            "headline": "Consumer Discretionary Spending Remains Resilient Ahead of Holiday Quarter",
            "summary": "Retail checkout volume demonstrates durable transaction momentum with prime cardholders maintaining sub-2.4% revolving charge-off rates.",
            "source": "Bloomberg Financial",
            "sector": "Equities & Retail",
            "related_symbol": "SPY",
            "sentiment": "positive",
            "sentiment_score": 0.54,
            "risk_impact_level": "Low",
            "market_risk_rationale": "Healthy consumer debt-service ratios lower baseline credit portfolio loss estimates."
        },
        {
            "headline": "Sovereign Debt Yield Curves Invert as Long-Term Fiscal Deficit Projections Expand",
            "summary": "Treasury auction tails trigger bond volatility, driving benchmark 10-year sovereign yields toward multi-month resistance levels.",
            "source": "Financial Times",
            "sector": "Macroeconomics",
            "related_symbol": "US10Y",
            "sentiment": "negative",
            "sentiment_score": -0.62,
            "risk_impact_level": "High",
            "market_risk_rationale": "Higher discount rates elevate corporate borrowing costs and heighten debt refinancing burdens."
        },
        {
            "headline": "Crypto Asset Custodian Receives SOC2 Type II and Institutional License Approval",
            "summary": "Regulatory compliance milestone establishes segregated cold-storage safeguards and insured multi-party computation security for asset managers.",
            "source": "Global Banking Review",
            "sector": "Crypto & Digital Assets",
            "related_symbol": "BTC",
            "sentiment": "positive",
            "sentiment_score": 0.72,
            "risk_impact_level": "Low",
            "market_risk_rationale": "Strengthened custody rails lower counterparty risks for institutional digital finance."
        },
        {
            "headline": "Unusual Spike in Synthetic Identity Creations Detected Across Fintech Onboarding APIs",
            "summary": "Risk intelligence algorithms identify automated botnets combining genuine SSNs with altered names to trigger micro-deposit credit lines.",
            "source": "Reuters Markets",
            "sector": "Fintech & Payments",
            "related_symbol": "PYPL",
            "sentiment": "negative",
            "sentiment_score": -0.83,
            "risk_impact_level": "High",
            "market_risk_rationale": "Direct elevation of new account fraud velocity; requires immediate KYC biometric verification tightening."
        },
        {
            "headline": "European Central Bank Maintains Benchmark Lending Deposit Facility Rate at 3.25%",
            "summary": "Governing Council confirms policy stance balances disinflation progress with ongoing industrial sector stabilization initiatives.",
            "source": "Bloomberg Financial",
            "sector": "Macroeconomics",
            "related_symbol": "EURUSD",
            "sentiment": "neutral",
            "sentiment_score": 0.08,
            "risk_impact_level": "Low",
            "market_risk_rationale": "Predictable monetary policy dampens foreign currency exchange volatility and trade credit spreads."
        },
        {
            "headline": "Leading AI Chipmaker Reports Record Enterprise Cloud Data Center Infrastructure Growth",
            "summary": "Capital expenditures across hyper-scalers accelerate, confirming durable corporate enterprise technology demand and liquidity expansion.",
            "source": "Wall Street Insights",
            "sector": "Equities & Tech",
            "related_symbol": "NVDA",
            "sentiment": "positive",
            "sentiment_score": 0.89,
            "risk_impact_level": "Low",
            "market_risk_rationale": "Strong corporate earnings and tech cash generation bolster equity collateral value."
        },
        {
            "headline": "Subprime Auto Loan Defaults Breach 2008 Benchmark Highs Amid Vehicle Depreciation",
            "summary": "Secondary auto securitizations face credit rating downgrades as negative equity burdens low-income vehicle borrowers.",
            "source": "Financial Times",
            "sector": "Banking & Credit",
            "related_symbol": "ALLT",
            "sentiment": "negative",
            "sentiment_score": -0.79,
            "risk_impact_level": "High",
            "market_risk_rationale": "Collateral loss severities rising sharply in asset-backed automotive debt tranches."
        }
    ]

    # Generate additional realistic items to reach 80+ records across past 2 weeks
    now = datetime.now()
    all_news = []
    
    # Add curated items with dates
    for idx, item in enumerate(curated_items):
        pub_date = now - timedelta(hours=idx * 7 + random.randint(1, 6))
        all_news.append({
            "news_id": f"NEWS-{1000 + idx}",
            "headline": item["headline"],
            "summary": item["summary"],
            "source": item["source"],
            "published_at": pub_date.strftime("%Y-%m-%d %H:%M:%S"),
            "related_symbol": item["related_symbol"],
            "sector": item["sector"],
            "sentiment": item["sentiment"],
            "sentiment_score": item["sentiment_score"],
            "risk_impact_level": item["risk_impact_level"],
            "market_risk_rationale": item["market_risk_rationale"]
        })

    # Expand with template variations
    templates = [
        ("Global Trade Logistics Index Shows Shipping Rate Contraction of {pct}%", "Freight indices drop as port throughput normalizes across trans-Pacific maritime routes.", "neutral", 0.02, "Low", "Macroeconomics", "BDI"),
        ("Cross-Border Wire Rejections Spike Following Stricter {region} Sanctions Screening", "Financial institutions deploy automated regex filters to comply with newly enacted multi-jurisdiction embargo lists.", "negative", -0.58, "Medium", "Regulatory & Compliance", "SWIFT"),
        ("Fintech Challenger Secures ${amount}M Debt Facility to Expand Working Capital Lines", "Institutional debt investor consortium provides syndicated facility to underwrite small business merchant advances.", "positive", 0.65, "Low", "Fintech & Payments", "AFRM"),
        ("Automated Spoofing Ring Targeted in Multi-State Card Skimming Indictment", "Federal task force seizes rogue POS firmware variants designed to siphon NFC token authorizations.", "negative", -0.75, "High", "Fintech & Payments", "SQ"),
        ("Corporate Bond Spread Tightens {bps} Bps Following Investment Grade Debt Offering", "Strong institutional order book demand signals robust corporate balance sheet appetite among credit managers.", "positive", 0.58, "Low", "Banking & Credit", "LQD"),
        ("Commodity Energy Volatility Drives Power Grid Utility Margin Call Expansion", "Extreme weather events prompt natural gas forward price swings, elevating trading house hedging requirements.", "negative", -0.66, "Medium", "Energy & Commodities", "XLE"),
        ("Central Bank Completes Pilot Testing for Programmable Sovereign Digital Asset", "Controlled sandbox testing demonstrates instant atomic settlement of interbank repurchase agreements.", "positive", 0.70, "Low", "Banking & Credit", "CBDC"),
        ("Unsecured Personal Loan Charge-Offs Edge Upward for First-Time Borrowers", "Lending platforms tighten underwriting algorithms in response to early delinquency inflection points.", "negative", -0.71, "High", "Banking & Credit", "UPST")
    ]

    for j in range(len(curated_items), 75):
        t = templates[j % len(templates)]
        pub_date = now - timedelta(hours=j * 8 + random.randint(2, 8))
        h = t[0].replace("{pct}", str(random.randint(4, 18))).replace("{region}", random.choice(["Eurasian", "Eastern Bloc", "Latin America"])).replace("{amount}", str(random.randint(120, 750))).replace("{bps}", str(random.randint(12, 45)))
        s = t[1]
        sent = t[2]
        base_s = t[3] + random.uniform(-0.08, 0.08)
        all_news.append({
            "news_id": f"NEWS-{1000 + j}",
            "headline": h,
            "summary": s,
            "source": random.choice(["Bloomberg Financial", "Reuters Markets", "Wall Street Insights", "Financial Times"]),
            "published_at": pub_date.strftime("%Y-%m-%d %H:%M:%S"),
            "related_symbol": t[6],
            "sector": t[5],
            "sentiment": sent,
            "sentiment_score": round(base_s, 2),
            "risk_impact_level": t[4],
            "market_risk_rationale": "Monitored macro and micro financial indicators impacting volatility and credit provisions."
        })

    df = pd.DataFrame(all_news)
    df["dt"] = pd.to_datetime(df["published_at"])
    df = df.sort_values(by="dt", ascending=False).drop(columns=["dt"])
    csv_path = os.path.join(DATASETS_DIR, "financial_news.csv")
    df.to_csv(csv_path, index=False)
    print(f"Saved {len(df)} financial news articles to {csv_path}")
    return df

if __name__ == "__main__":
    generate_transactions(12000)
    generate_credit_risk(5000)
    generate_financial_news()
    print("All synthetic datasets generated successfully.")
