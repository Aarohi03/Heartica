from risk_engine import run_risk_engine
from db import save_assessment

test_patient = {
    "age": 58,
    "sex": "Male",
    "smoking": "Yes",
    "family_history": "Yes",
    "total_cholesterol": 265,
    "ldl": 178,
    "hdl": 36,
    "triglycerides": 242,
    "systolic_bp": 152,
    "diastolic_bp": 96,
    "glucose": 132,
    "hba1c": 7.1,
    "bmi": 31.4
}

result = run_risk_engine(test_patient)

# merge inputs + results into one dict
record = {**test_patient, **result}

new_id = save_assessment(record)
print(f"Saved successfully! New row ID = {new_id}")