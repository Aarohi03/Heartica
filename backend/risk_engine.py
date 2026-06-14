# risk_engine.py
# This module takes biomarker values and produces:
# 1. XGBoost risk probability
# 2. Framingham risk score
# 3. Clinical insights for each biomarker
# 4. Personalised recommendations

import pickle
import numpy as np
import os

# ── 1. Load the trained model ─────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.pkl")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# ── 2. XGBoost Risk Prediction ────────────────────────────────────────
def predict_risk_xgboost(data: dict) -> float:
    """
    Takes a dictionary of patient values.
    Returns risk probability as a percentage (0 to 100).
    """
    # Order must match exactly how the model was trained
    features = [
        data.get("age", 0),
        1 if str(data.get("sex", "")).upper() in ["M", "MALE", "1"] else 0,
        1 if str(data.get("smoking", "")).upper() in ["YES", "Y", "1"] else 0,
        data.get("total_cholesterol", 0),
        data.get("ldl", 0),
        data.get("hdl", 0),
        data.get("triglycerides", 0),
        data.get("systolic_bp", 0),
        data.get("diastolic_bp", 0),
        data.get("glucose", 0),
        data.get("hba1c", 0),
        data.get("bmi", 0),
        1 if str(data.get("family_history", "")).upper() in ["YES", "Y", "1"] else 0,
    ]

    features_array = np.array(features).reshape(1, -1)
    probability = model.predict_proba(features_array)[0][1]
    return round(probability * 100, 2)


# ── 3. Framingham Risk Score ──────────────────────────────────────────
def calculate_framingham(data: dict) -> float:
    """
    Calculates 10-year cardiovascular risk using
    a simplified Framingham Risk Score formula.
    Returns risk as a percentage (0 to 100).
    """
    age = data.get("age", 45)
    sex = str(data.get("sex", "")).upper()
    total_chol = data.get("total_cholesterol", 200)
    hdl = data.get("hdl", 50)
    systolic = data.get("systolic_bp", 120)
    smoking = str(data.get("smoking", "")).upper() in ["YES", "Y", "1"]

    # Simplified point-based Framingham calculation
    score = 0

    # Age points
    if sex in ["M", "MALE"]:
        if age < 35: score += 0
        elif age < 40: score += 2
        elif age < 45: score += 5
        elif age < 50: score += 6
        elif age < 55: score += 8
        elif age < 60: score += 10
        elif age < 65: score += 11
        elif age < 70: score += 12
        else: score += 13
    else:
        if age < 35: score += 0
        elif age < 40: score += 2
        elif age < 45: score += 4
        elif age < 50: score += 5
        elif age < 55: score += 7
        elif age < 60: score += 8
        elif age < 65: score += 9
        elif age < 70: score += 10
        else: score += 11

    # Total cholesterol points
    if total_chol < 160: score += 0
    elif total_chol < 200: score += 1
    elif total_chol < 240: score += 2
    elif total_chol < 280: score += 3
    else: score += 4

    # HDL points (lower HDL = more risk)
    if hdl >= 60: score -= 1
    elif hdl >= 50: score += 0
    elif hdl >= 40: score += 1
    else: score += 2

    # Systolic BP points
    if systolic < 120: score += 0
    elif systolic < 130: score += 1
    elif systolic < 140: score += 2
    elif systolic < 160: score += 3
    else: score += 4

    # Smoking
    if smoking:
        score += 2

    # Convert score to approximate percentage
    risk_percent = min(max(score * 3.5, 1), 99)
    return round(risk_percent, 2)


# ── 4. Clinical Insights ──────────────────────────────────────────────
def generate_insights(data: dict) -> list:
    """
    Looks at each biomarker value and generates
    a plain-language clinical insight for the patient.
    Returns a list of insight strings.
    """
    insights = []

    ldl = data.get("ldl")
    hdl = data.get("hdl")
    total_chol = data.get("total_cholesterol")
    trig = data.get("triglycerides")
    sys_bp = data.get("systolic_bp")
    dia_bp = data.get("diastolic_bp")
    glucose = data.get("glucose")
    hba1c = data.get("hba1c")
    bmi = data.get("bmi")
    smoking = str(data.get("smoking", "")).upper() in ["YES", "Y", "1"]

    if ldl is not None:
        if ldl >= 160:
            insights.append("Your LDL (bad cholesterol) is critically high. This means excess fat is actively building up inside your arteries, significantly increasing heart attack risk.")
        elif ldl >= 130:
            insights.append("Your LDL (bad cholesterol) is elevated. This is above the safe range and needs dietary changes and medical attention.")
        elif ldl < 70:
            insights.append("Your LDL (bad cholesterol) is very well controlled and within the optimal range.")
        else:
            insights.append("Your LDL (bad cholesterol) is within the acceptable range.")

    if hdl is not None:
        if hdl < 40:
            insights.append("Your HDL (good cholesterol) is dangerously low. Low HDL means your body has less protection against arterial plaque buildup.")
        elif hdl < 50:
            insights.append("Your HDL (good cholesterol) is below the protective range. Increasing physical activity can help raise it.")
        else:
            insights.append("Your HDL (good cholesterol) is at a healthy level, which provides good cardiovascular protection.")

    if total_chol is not None:
        if total_chol >= 240:
            insights.append("Your total cholesterol is high. This significantly increases your risk of heart disease and stroke.")
        elif total_chol >= 200:
            insights.append("Your total cholesterol is borderline high. Lifestyle changes are recommended.")
        else:
            insights.append("Your total cholesterol is within the desirable range.")

    if trig is not None:
        if trig >= 500:
            insights.append("Your triglycerides are severely elevated. This is a medical emergency level that requires immediate attention.")
        elif trig >= 200:
            insights.append("Your triglycerides are high. This is linked to increased risk of heart disease and pancreatitis.")
        elif trig >= 150:
            insights.append("Your triglycerides are borderline high. Reducing sugar and refined carbohydrate intake is recommended.")
        else:
            insights.append("Your triglycerides are within the normal range.")

    if sys_bp is not None and dia_bp is not None:
        if sys_bp >= 180 or dia_bp >= 120:
            insights.append("Your blood pressure is at a hypertensive crisis level. Seek immediate medical attention.")
        elif sys_bp >= 140 or dia_bp >= 90:
            insights.append("Your blood pressure indicates Stage 2 Hypertension. This puts significant strain on your heart and arteries.")
        elif sys_bp >= 130 or dia_bp >= 80:
            insights.append("Your blood pressure indicates Stage 1 Hypertension. Lifestyle changes and possible medication are recommended.")
        else:
            insights.append("Your blood pressure is within the normal range.")

    if glucose is not None:
        if glucose >= 126:
            insights.append("Your fasting glucose indicates Diabetes. High blood sugar damages blood vessels and nerves over time.")
        elif glucose >= 100:
            insights.append("Your fasting glucose indicates Pre-Diabetes. Without intervention this is likely to progress to Type 2 Diabetes.")
        else:
            insights.append("Your fasting glucose is within the normal range.")

    if hba1c is not None:
        if hba1c >= 6.5:
            insights.append("Your HbA1c confirms Diabetes. This means your blood sugar has been consistently high over the past 3 months.")
        elif hba1c >= 5.7:
            insights.append("Your HbA1c indicates Pre-Diabetes. Your average blood sugar over 3 months is above normal.")
        else:
            insights.append("Your HbA1c indicates good long-term blood sugar control.")

    if bmi is not None:
        if bmi >= 35:
            insights.append("Your BMI indicates severe obesity, which significantly increases cardiovascular and metabolic risk.")
        elif bmi >= 30:
            insights.append("Your BMI indicates obesity. Weight reduction will significantly reduce your cardiovascular risk.")
        elif bmi >= 25:
            insights.append("Your BMI indicates you are overweight. Even modest weight loss can improve heart health.")
        else:
            insights.append("Your BMI is within the healthy range.")

    if smoking:
        insights.append("You are a smoker. Smoking is one of the most significant and modifiable risk factors for heart disease.")

    return insights


# ── 5. Recommendations ────────────────────────────────────────────────
def generate_recommendations(data: dict, risk_percent: float) -> list:
    """
    Based on the patient values and risk score,
    generates a list of personalised action recommendations.
    """
    recommendations = []

    if risk_percent >= 70:
        recommendations.append("Consult a Cardiologist as soon as possible for a full cardiac evaluation.")

    ldl = data.get("ldl")
    hdl = data.get("hdl")
    sys_bp = data.get("systolic_bp")
    glucose = data.get("glucose")
    hba1c = data.get("hba1c")
    bmi = data.get("bmi")
    smoking = str(data.get("smoking", "")).upper() in ["YES", "Y", "1"]
    trig = data.get("triglycerides")

    if ldl and ldl >= 130:
        recommendations.append("Reduce saturated fat intake — avoid red meat, butter, and fried foods to lower LDL.")
    if hdl and hdl < 50:
        recommendations.append("Engage in at least 30 minutes of aerobic exercise 5 days a week to raise HDL.")
    if sys_bp and sys_bp >= 130:
        recommendations.append("Monitor blood pressure daily and reduce sodium intake to below 2300mg per day.")
    if glucose and glucose >= 100:
        recommendations.append("Follow up with a physician for diabetes screening and glucose management.")
    if hba1c and hba1c >= 5.7:
        recommendations.append("Improve glycemic control through diet — reduce sugar, white rice, and refined carbohydrates.")
    if bmi and bmi >= 25:
        recommendations.append("Work towards a healthy weight through a combination of diet and regular physical activity.")
    if smoking:
        recommendations.append("Quit smoking immediately — this single change can reduce heart disease risk by up to 50% within one year.")
    if trig and trig >= 150:
        recommendations.append("Reduce alcohol consumption and sugary drinks to lower triglyceride levels.")

    recommendations.append("Follow a heart-healthy Mediterranean diet rich in vegetables, fruits, whole grains, and healthy fats.")
    recommendations.append("Schedule a follow-up with your doctor in 3 months to reassess your risk profile.")

    return recommendations


# ── 6. Main function — combines everything ────────────────────────────
def run_risk_engine(data: dict) -> dict:
    """
    Master function. Takes all patient data.
    Returns complete risk assessment result.
    """
    xgboost_risk = predict_risk_xgboost(data)
    framingham_risk = calculate_framingham(data)

    # Final risk is weighted average — XGBoost gets more weight
    final_risk = round((xgboost_risk * 0.7) + (framingham_risk * 0.3), 2)

    insights = generate_insights(data)
    recommendations = generate_recommendations(data, final_risk)

    return {
        "xgboost_risk": xgboost_risk,
        "framingham_risk": framingham_risk,
        "final_risk": final_risk,
        "insights": insights,
        "recommendations": recommendations
    }


# ── Quick test ────────────────────────────────────────────────────────
if __name__ == "__main__":
    test_patient = {
        "age": 58,
        "sex": "Male",
        "smoking": "Yes",
        "total_cholesterol": 265,
        "ldl": 178,
        "hdl": 36,
        "triglycerides": 242,
        "systolic_bp": 152,
        "diastolic_bp": 96,
        "glucose": 132,
        "hba1c": 7.1,
        "bmi": 31.4,
        "family_history": "Yes"
    }

    result = run_risk_engine(test_patient)

    print("\n" + "="*50)
    print("  HEARTICA RISK ASSESSMENT RESULT")
    print("="*50)
    print(f"  XGBoost Risk     : {result['xgboost_risk']}%")
    print(f"  Framingham Risk  : {result['framingham_risk']}%")
    print(f"  Final Risk Score : {result['final_risk']}%")
    print("\n  Clinical Insights:")
    for i, insight in enumerate(result['insights'], 1):
        print(f"  {i}. {insight}")
    print("\n  Recommendations:")
    for i, rec in enumerate(result['recommendations'], 1):
        print(f"  {i}. {rec}")
    print("="*50)