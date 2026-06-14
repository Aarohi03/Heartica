from fastapi import File, UploadFile
from pdf_extractor import extract_biomarkers
import shutil
import os

from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from pydantic import BaseModel
from risk_engine import run_risk_engine
from db import save_assessment

app = FastAPI(title="Heartica API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.post("/analyze-pdf")
def analyze_pdf(
    file: UploadFile = File(...),
    age: int = 50,
    sex: str = "Male",
    smoking: str = "No",
    family_history: str = "No"
):
    # Save uploaded PDF temporarily
    temp_path = f"uploads/{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract biomarker values from the PDF
    extracted = extract_biomarkers(temp_path)

    # Combine extracted values with patient info (age, sex, etc.)
    patient_dict = {
        "age": age,
        "sex": sex,
        "smoking": smoking,
        "family_history": family_history,
        **extracted
    }

    # Run risk engine (same as /analyze)
    result = run_risk_engine(patient_dict)
    result["xgboost_risk"] = float(result["xgboost_risk"])
    result["framingham_risk"] = float(result["framingham_risk"])
    result["final_risk"] = float(result["final_risk"])

    record = {**patient_dict, **result}
    new_id = save_assessment(record)

    os.remove(temp_path)  # cleanup temp file

    return {"id": new_id, "extracted": extracted, **result}