"""
FinGuard AI - Comprehensive Machine Learning Pipeline
Trains and serializes:
1. Fraud Detection Model (Random Forest + Gradient Boosting)
2. Credit Risk Assessment Model (Gradient Boosting Classifier)
3. Anomaly Detection Model (Isolation Forest)
4. NLP Financial Sentiment Pipeline (TF-IDF + Calibrated Classifier)

Computes true evaluation metrics:
- ROC-AUC
- Precision-Recall
- F1-Score
- Confusion Matrix
- Feature Importance
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    roc_auc_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
MODELS_DIR = os.path.join(BASE_DIR, "backend", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

def train_fraud_model():
    print("--- Training Fraud Detection Model ---")
    data_path = os.path.join(DATASETS_DIR, "transactions.csv")
    df = pd.read_csv(data_path)

    # Feature engineering
    df["datetime"] = pd.to_datetime(df["timestamp"])
    df["hour"] = df["datetime"].dt.hour
    df["day_of_week"] = df["datetime"].dt.dayofweek

    numeric_features = ["amount", "distance_miles", "is_foreign", "frequency_24h", "hour", "day_of_week"]
    categorical_features = ["merchant_category", "device_type", "channel"]

    X = df[numeric_features + categorical_features]
    y = df["is_fraud"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
        ]
    )

    clf = GradientBoostingClassifier(
        n_estimators=120,
        learning_rate=0.08,
        max_depth=5,
        random_state=42
    )

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", clf)
    ])

    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    roc_auc = float(roc_auc_score(y_test, y_prob))
    precision = float(precision_score(y_test, y_pred))
    recall = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # Extract feature importances
    onehot_cols = pipeline.named_steps["preprocessor"].named_transformers_["cat"].get_feature_names_out(categorical_features).tolist()
    all_feature_names = numeric_features + onehot_cols
    importances = pipeline.named_steps["classifier"].feature_importances_.tolist()
    
    # Aggregate categorical feature importances
    feat_imp = {}
    for name, imp in zip(all_feature_names, importances):
        # clean prefix
        clean_name = name.replace("merchant_category_", "Cat: ").replace("device_type_", "Dev: ").replace("channel_", "Chan: ")
        feat_imp[clean_name] = round(imp * 100, 2)
    
    top_features = sorted(feat_imp.items(), key=lambda x: x[1], reverse=True)[:10]

    metadata = {
        "model_type": "Gradient Boosting Classifier",
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "metrics": {
            "roc_auc": round(roc_auc, 4),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": {
                "true_negative": cm[0][0],
                "false_positive": cm[0][1],
                "false_negative": cm[1][0],
                "true_positive": cm[1][1]
            }
        },
        "top_feature_importance": [{"feature": f, "importance": imp} for f, imp in top_features],
        "classes": ["Legitimate", "Fraudulent"]
    }

    model_file = os.path.join(MODELS_DIR, "fraud_model.joblib")
    meta_file = os.path.join(MODELS_DIR, "fraud_metadata.json")
    
    joblib.dump(pipeline, model_file)
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Fraud model saved. ROC-AUC: {roc_auc:.4f}, Precision: {precision:.4f}, Recall: {recall:.4f}, F1: {f1:.4f}")
    return pipeline, metadata

def train_credit_model():
    print("--- Training Credit Risk Assessment Model ---")
    data_path = os.path.join(DATASETS_DIR, "credit_risk.csv")
    df = pd.read_csv(data_path)

    numeric_features = [
        "age", "annual_income", "employment_duration_years", "loan_amount",
        "loan_duration_months", "credit_score", "debt_to_income",
        "existing_debt", "previous_defaults", "payment_history_score"
    ]
    categorical_features = ["employment_status", "home_ownership", "loan_purpose"]

    X = df[numeric_features + categorical_features]
    y = df["default_risk"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), categorical_features)
        ]
    )

    clf = GradientBoostingClassifier(
        n_estimators=100,
        learning_rate=0.07,
        max_depth=4,
        random_state=42
    )

    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("classifier", clf)
    ])

    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)
    y_prob = pipeline.predict_proba(X_test)[:, 1]

    roc_auc = float(roc_auc_score(y_test, y_prob))
    precision = float(precision_score(y_test, y_pred))
    recall = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    cm = confusion_matrix(y_test, y_pred).tolist()

    onehot_cols = pipeline.named_steps["preprocessor"].named_transformers_["cat"].get_feature_names_out(categorical_features).tolist()
    all_feature_names = numeric_features + onehot_cols
    importances = pipeline.named_steps["classifier"].feature_importances_.tolist()

    feat_imp = {}
    for name, imp in zip(all_feature_names, importances):
        clean_name = name.replace("employment_status_", "Emp: ").replace("home_ownership_", "Home: ").replace("loan_purpose_", "Purpose: ")
        feat_imp[clean_name] = round(imp * 100, 2)

    top_features = sorted(feat_imp.items(), key=lambda x: x[1], reverse=True)[:10]

    metadata = {
        "model_type": "Gradient Boosting Credit Classifier",
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "metrics": {
            "roc_auc": round(roc_auc, 4),
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "f1_score": round(f1, 4),
            "confusion_matrix": {
                "true_negative": cm[0][0],
                "false_positive": cm[0][1],
                "false_negative": cm[1][0],
                "true_positive": cm[1][1]
            }
        },
        "top_feature_importance": [{"feature": f, "importance": imp} for f, imp in top_features],
        "classes": ["No Default", "Default"]
    }

    model_file = os.path.join(MODELS_DIR, "credit_model.joblib")
    meta_file = os.path.join(MODELS_DIR, "credit_metadata.json")

    joblib.dump(pipeline, model_file)
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Credit model saved. ROC-AUC: {roc_auc:.4f}, Precision: {precision:.4f}, Recall: {recall:.4f}, F1: {f1:.4f}")
    return pipeline, metadata

def train_anomaly_model():
    print("--- Training Anomaly Detection Model (Isolation Forest) ---")
    data_path = os.path.join(DATASETS_DIR, "transactions.csv")
    df = pd.read_csv(data_path)

    df["datetime"] = pd.to_datetime(df["timestamp"])
    df["hour"] = df["datetime"].dt.hour

    features = ["amount", "distance_miles", "frequency_24h", "hour", "is_foreign"]
    X = df[features]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    iso = IsolationForest(
        n_estimators=150,
        contamination=0.045,
        random_state=42,
        n_jobs=-1
    )
    iso.fit(X_scaled)

    # Compute scores (-1 is anomaly, 1 is normal)
    preds = iso.predict(X_scaled)
    scores = iso.decision_function(X_scaled)

    anomalies_detected = int((preds == -1).sum())
    total_samples = len(X)
    anomaly_rate = round(float(anomalies_detected / total_samples) * 100, 2)

    pipeline = {
        "scaler": scaler,
        "model": iso,
        "feature_names": features
    }

    metadata = {
        "model_type": "Isolation Forest",
        "contamination": 0.045,
        "n_estimators": 150,
        "total_samples": total_samples,
        "anomalies_detected": anomalies_detected,
        "anomaly_rate_percent": anomaly_rate,
        "score_min": float(scores.min()),
        "score_max": float(scores.max()),
        "score_mean": float(scores.mean()),
        "features": features
    }

    model_file = os.path.join(MODELS_DIR, "anomaly_model.joblib")
    meta_file = os.path.join(MODELS_DIR, "anomaly_metadata.json")

    joblib.dump(pipeline, model_file)
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Anomaly model saved. Detected {anomalies_detected} outliers ({anomaly_rate}%).")
    return pipeline, metadata

def train_sentiment_model():
    print("--- Training Financial Sentiment NLP Model ---")
    data_path = os.path.join(DATASETS_DIR, "financial_news.csv")
    df = pd.read_csv(data_path)

    # Combine headline + summary
    texts = df["headline"] + " " + df["summary"]
    labels = df["sentiment"]

    vectorizer = TfidfVectorizer(
        max_features=500,
        ngram_range=(1, 2),
        stop_words="english"
    )

    clf = LogisticRegression(C=1.5, max_iter=200, random_state=42)

    nlp_pipeline = Pipeline([
        ("tfidf", vectorizer),
        ("clf", clf)
    ])

    nlp_pipeline.fit(texts, labels)

    y_pred = nlp_pipeline.predict(texts)
    acc = float((y_pred == labels).mean())

    metadata = {
        "model_type": "TF-IDF + Multinomial Logistic Regression",
        "vocabulary_size": len(vectorizer.get_feature_names_out()),
        "training_samples": len(texts),
        "in_sample_accuracy": round(acc, 4),
        "classes": ["negative", "neutral", "positive"],
        "sentiment_weights": {
            "negative": -1.0,
            "neutral": 0.0,
            "positive": 1.0
        }
    }

    model_file = os.path.join(MODELS_DIR, "sentiment_pipeline.joblib")
    meta_file = os.path.join(MODELS_DIR, "sentiment_metadata.json")

    joblib.dump(nlp_pipeline, model_file)
    with open(meta_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Sentiment pipeline saved. Accuracy: {acc:.4f}")
    return nlp_pipeline, metadata

if __name__ == "__main__":
    train_fraud_model()
    train_credit_model()
    train_anomaly_model()
    train_sentiment_model()
    print("All ML models trained and serialized successfully.")
