from fastapi import FastAPI
from pydantic import BaseModel
from risk_engine import run_risk_engine
from db import save_assessment

app = FastAPI(title="Heartica API")

class PatientData(BaseModel):
    age: int
    sex: str
    smoking: str
    family_history: str
    total_cholesterol: float
    ldl: float
    hdl: float
    triglycerides: float
    systolic_bp: float
    diastolic_bp: float
    glucose: float
    hba1c: float
    bmi: float

@app.get("/")
def home():
    return {"message": "Heartica API is running"}

@app.post("/analyze")
def analyze(patient: PatientData):
    patient_dict = patient.model_dump()
    result = run_risk_engine(patient_dict)

    # Convert numpy types to plain Python types (fixes JSON error)
    result["xgboost_risk"] = float(result["xgboost_risk"])
    result["framingham_risk"] = float(result["framingham_risk"])
    result["final_risk"] = float(result["final_risk"])

    record = {**patient_dict, **result}
    new_id = save_assessment(record)
    return {"id": new_id, **result}