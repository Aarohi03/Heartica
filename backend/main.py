from fastapi import File, UploadFile, Form
from typing import Optional
from pdf_extractor import extract_biomarkers
import shutil
import os
import uuid
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel, Field
from risk_engine import run_risk_engine
from db import save_assessment

app = FastAPI(title="Heartica API")

_origins_env = os.getenv("FRONTEND_ORIGINS", "*")
_allow_origins = ["*"] if _origins_env.strip() == "*" else [
 o.strip() for o in _origins_env.split(",") if o.strip()
]
app.add_middleware(
 CORSMiddleware,
 allow_origins=_allow_origins,
 allow_methods=["*"],
 allow_headers=["*"],
)


class PatientData(BaseModel):
 age: int = Field(..., gt=0, lt=120)
 sex: str
 smoking: str
 family_history: str
 total_cholesterol: float = Field(..., gt=0, lt=1000)
 ldl: float = Field(..., gt=0, lt=1000)
 hdl: float = Field(..., gt=0, lt=1000)
 triglycerides: float = Field(..., gt=0, lt=2000)
 systolic_bp: float = Field(..., gt=0, lt=300)
 diastolic_bp: float = Field(..., gt=0, lt=200)
 glucose: float = Field(..., gt=0, lt=1000)
 hba1c: float = Field(..., gt=0, lt=20)
 bmi: float = Field(..., gt=0, lt=100)


@app.get("/")
def home():
    return {"message": "Heartica API is running"}

@app.post("/analyze")
def analyze(patient: PatientData):
    patient_dict = patient.model_dump()
    result = run_risk_engine(patient_dict)
    result["xgboost_risk"] = float(result["xgboost_risk"])
    result["framingham_risk"] = float(result["framingham_risk"])
    result["final_risk"] = float(result["final_risk"])
    record = {**patient_dict, **result}
    new_id = save_assessment(record)
    return {"id": new_id, **result}


# ─── HELPER: save one uploaded file temporarily, extract, then delete ────────
def _extract_from_upload(upload_file: UploadFile) -> dict:
    safe_name = f"{uuid.uuid4().hex}.pdf"
    temp_path = os.path.join(UPLOAD_DIR, safe_name)
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        upload_file.file.close()  # ← ADD THIS LINE
        extracted = extract_biomarkers(temp_path)
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except PermissionError:
                pass  # Windows sometimes still holds it — skip, not critical
    return extracted



# ─── HELPER: merge 3 biomarker dicts with priority rules ────────────────────
def _merge_biomarkers(lipid: dict, sugar: dict, pressure: dict) -> dict:
    """
    Merge extracted biomarkers from 3 reports.

    Priority per biomarker:
      - total_cholesterol, ldl, hdl, triglycerides  → lipid first
      - glucose, hba1c                               → sugar first
      - systolic_bp, diastolic_bp                   → pressure first
      - bmi                                          → any report that has it

    For each key, we walk the priority order and take the first non-None value.
    If all 3 are None for a key, it stays None (defaults handled downstream).
    """

    # Define priority order per biomarker key
    PRIORITY = {
        "total_cholesterol": [lipid, sugar, pressure],
        "ldl":               [lipid, sugar, pressure],
        "hdl":               [lipid, sugar, pressure],
        "triglycerides":     [lipid, sugar, pressure],
        "glucose":           [sugar, lipid, pressure],
        "hba1c":             [sugar, lipid, pressure],
        "systolic_bp":       [pressure, lipid, sugar],
        "diastolic_bp":      [pressure, lipid, sugar],
        "bmi":               [lipid, sugar, pressure],
    }

    merged = {}
    for key, order in PRIORITY.items():
        merged[key] = None
        for source in order:
            if source and source.get(key) is not None:
                merged[key] = source[key]
                break

    return merged


@app.post("/analyze-pdf")
def analyze_pdf(
    # ── NEW: 3 optional file fields (one per report type) ──────────────────
    lipid_file:    Optional[UploadFile] = File(None),
    sugar_file:    Optional[UploadFile] = File(None),
    pressure_file: Optional[UploadFile] = File(None),
    # ── LEGACY FALLBACK: old single-file field still works ─────────────────
    file:          Optional[UploadFile] = File(None),
    # ── Patient info (same as before) ──────────────────────────────────────
    age:           int = 50,
    sex:           str = "Male",
    smoking:       str = "No",
    family_history: str = "No",
):
    """
    Accept up to 3 PDF reports (Lipid, Blood Sugar, Blood Pressure).
    Extract biomarkers from each, merge with priority rules, run risk engine.
    Also accepts the old single 'file' field as a fallback.
    """

    lipid_data    = {}
    sugar_data    = {}
    pressure_data = {}

    # Extract from each uploaded file (skip if not provided)
    if lipid_file and lipid_file.filename:
        lipid_data = _extract_from_upload(lipid_file)

    if sugar_file and sugar_file.filename:
        sugar_data = _extract_from_upload(sugar_file)

    if pressure_file and pressure_file.filename:
        pressure_data = _extract_from_upload(pressure_file)

    # Legacy single-file fallback: treat it as a generic report
    if file and file.filename and not any([
        lipid_file and lipid_file.filename,
        sugar_file and sugar_file.filename,
        pressure_file and pressure_file.filename,
    ]):
        lipid_data = _extract_from_upload(file)

    # Merge all extracted values with priority rules
    merged = _merge_biomarkers(lipid_data, sugar_data, pressure_data)

    # Build full patient dict (None values will use defaults in risk engine)
    patient_dict = {
        "age":            age,
        "sex":            sex,
        "smoking":        smoking,
        "family_history": family_history,
        **merged,
    }

    # Run the risk engine
    result = run_risk_engine(patient_dict)
    result["xgboost_risk"]   = float(result["xgboost_risk"])
    result["framingham_risk"] = float(result["framingham_risk"])
    result["final_risk"]     = float(result["final_risk"])

    record = {**patient_dict, **result}
    new_id = save_assessment(record)

    # Return merged extracted values so frontend can show what was found
    return {"id": new_id, "extracted": merged, **result}