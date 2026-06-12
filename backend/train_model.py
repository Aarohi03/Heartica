# train_model.py
# This script trains the XGBoost heart disease risk model for Heartica
# Run this once to generate model.pkl

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import xgboost as xgb
import pickle
import os

# ── 1. Load the dataset ───────────────────────────────────────────────
print("Loading dataset...")
df = pd.read_csv("heartica_dataset.csv")
print(f"Dataset shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print(f"\nFirst 3 rows:\n{df.head(3)}")

# ── 2. Handle missing values ──────────────────────────────────────────
print("\nChecking for missing values...")
print(df.isnull().sum())

numeric_cols = df.select_dtypes(include=[np.number]).columns
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    df[col] = df[col].fillna(df[col].mode()[0])

print("Missing values handled.")

# ── 3. Encode categorical columns ─────────────────────────────────────
print("\nEncoding categorical columns...")
le = LabelEncoder()
for col in categorical_cols:
    df[col] = le.fit_transform(df[col])
    print(f"  Encoded: {col}")

# ── 4. Separate features and target ──────────────────────────────────
X = df.drop("heart_disease", axis=1)
y = df["heart_disease"]

print(f"\nFeatures: {list(X.columns)}")
print(f"Target distribution:\n{y.value_counts()}")

# ── 5. Split into train and test ──────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\nTraining samples: {len(X_train)}")
print(f"Testing samples:  {len(X_test)}")

# ── 6. Train the XGBoost model ────────────────────────────────────────
print("\nTraining XGBoost model...")
model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    eval_metric="logloss",
    random_state=42
)
model.fit(X_train, y_train)
print("Training complete.")

# ── 7. Evaluate the model ─────────────────────────────────────────────
print("\nEvaluating model...")
y_pred       = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
f1       = f1_score(y_test, y_pred)
auc      = roc_auc_score(y_test, y_pred_proba)
cm       = confusion_matrix(y_test, y_pred)

print(f"\n{'='*40}")
print(f"  Accuracy  : {accuracy:.4f}  ({accuracy*100:.1f}%)")
print(f"  F1 Score  : {f1:.4f}")
print(f"  AUC-ROC   : {auc:.4f}")
print(f"{'='*40}")
print(f"\nConfusion Matrix:")
print(f"  True Negatives  : {cm[0][0]}")
print(f"  False Positives : {cm[0][1]}")
print(f"  False Negatives : {cm[1][0]}")
print(f"  True Positives  : {cm[1][1]}")

# ── 8. Save the model ─────────────────────────────────────────────────
os.makedirs("models", exist_ok=True)
model_path = "models/model.pkl"

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print(f"\nModel saved to: {model_path}")
print("\nPhase 3 complete. model.pkl is ready.")