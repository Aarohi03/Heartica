# pdf_extractor.py
# This module reads a PDF lab report and extracts biomarker values
# It uses pdfplumber to read text and Regex to find each value

import pdfplumber
import re

def extract_text_from_pdf(pdf_path):
    """
    Opens a PDF file and extracts all text from every page.
    Returns one big string containing all the text.
    """
    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                full_text += page_text + "\n"
    return full_text


def find_value(text, patterns):
    """
    Takes the full PDF text and a list of regex patterns.
    Tries each pattern one by one until it finds a match.
    Returns the value as a float, or None if nothing found.
    """
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                return float(match.group(1))
            except:
                return None
    return None


def calculate_bmi(height_cm, weight_kg):
    """
    Calculates BMI from height (cm) and weight (kg).
    Formula: BMI = weight(kg) / (height(m))^2
    Returns None if either value is missing.
    """
    if height_cm is None or weight_kg is None:
        return None
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)


def extract_biomarkers(pdf_path):
    """
    Main function. Takes a PDF file path.
    Returns a dictionary of all biomarker values found.
    If a value is not found, it returns None for that key.
    If BMI is not directly found but height + weight are present,
    BMI is calculated automatically.
    """
    text = extract_text_from_pdf(pdf_path)

    biomarkers = {

        "total_cholesterol": find_value(text, [
            r"total\s*cholesterol[\s:=\-]*(\d+\.?\d*)",
            r"cholesterol[\s,]*total[\s:=\-]*(\d+\.?\d*)",
            r"t\.?\s*chol[\s:=\-]*(\d+\.?\d*)",
        ]),

        "ldl": find_value(text, [
            r"ldl[\s\-]*c(?:holesterol)?[\s:=\-]*(\d+\.?\d*)",
            r"low\s*density\s*lipoprotein[\s:=\-]*(\d+\.?\d*)",
            r"ldl[\s:=\-]*(\d+\.?\d*)",
        ]),

        "hdl": find_value(text, [
            r"hdl[\s\-]*c(?:holesterol)?[\s:=\-]*(\d+\.?\d*)",
            r"high\s*density\s*lipoprotein[\s:=\-]*(\d+\.?\d*)",
            r"hdl[\s:=\-]*(\d+\.?\d*)",
        ]),

        "triglycerides": find_value(text, [
            r"triglycerides?[\s:=\-]*(\d+\.?\d*)",
            r"trig(?:s)?[\s:=\-]*(\d+\.?\d*)",
            r"serum\s*triglycerides?[\s:=\-]*(\d+\.?\d*)",
        ]),

        "systolic_bp": find_value(text, [
            r"systolic[\s:=\-]*(\d+\.?\d*)",
            r"blood\s*pressure[\s:=\-]*(\d+\.?\d*)[\s/]",
            r"bp[\s:=\-]*(\d+\.?\d*)[\s/]",
            r"(\d+\.?\d*)\s*/\s*\d+\s*mmhg",
        ]),

        "diastolic_bp": find_value(text, [
            r"diastolic[\s:=\-]*(\d+\.?\d*)",
            r"blood\s*pressure[\s:=\-]*\d+\s*/\s*(\d+\.?\d*)",
            r"bp[\s:=\-]*\d+\s*/\s*(\d+\.?\d*)",
            r"\d+\s*/\s*(\d+\.?\d*)\s*mmhg",
        ]),

        "glucose": find_value(text, [
            r"fasting\s*(?:blood\s*)?glucose[\s:=\-]*(\d+\.?\d*)",
            r"glucose[\s,]*fasting[\s:=\-]*(\d+\.?\d*)",
            r"blood\s*glucose[\s:=\-]*(\d+\.?\d*)",
            r"glucose[\s:=\-]*(\d+\.?\d*)",
            r"fbs[\s:=\-]*(\d+\.?\d*)",
        ]),

        "hba1c": find_value(text, [
            r"hba1c[\s:=\-]*(\d+\.?\d*)",
            r"hb\s*a1c[\s:=\-]*(\d+\.?\d*)",
            r"glycated\s*haemoglobin[\s:=\-]*(\d+\.?\d*)",
            r"glycosylated\s*hemo(?:globin)?[\s:=\-]*(\d+\.?\d*)",
            r"a1c[\s:=\-]*(\d+\.?\d*)",
        ]),

        "bmi": find_value(text, [
            r"bmi[\s:=\-]*(\d+\.?\d*)",
            r"body\s*mass\s*index[\s:=\-]*(\d+\.?\d*)",
        ]),

        "height_cm": find_value(text, [
            r"height[\s:=\-]*(\d+\.?\d*)\s*cm",
            r"ht[\s:=\-]*(\d+\.?\d*)\s*cm",
        ]),

        "weight_kg": find_value(text, [
            r"weight[\s:=\-]*(\d+\.?\d*)\s*kg",
            r"wt[\s:=\-]*(\d+\.?\d*)\s*kg",
        ]),
    }

    # If BMI wasn't found directly, try calculating it from height + weight
    if biomarkers["bmi"] is None:
        biomarkers["bmi"] = calculate_bmi(
            biomarkers["height_cm"], biomarkers["weight_kg"]
        )

    return biomarkers


# ── Quick test — run this file directly to test ───────────────────────
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        result = extract_biomarkers(sys.argv[1])
        print("\nExtracted Biomarkers:")
        print("─" * 35)
        for key, value in result.items():
            status = f"{value}" if value is not None else "NOT FOUND"
            print(f"  {key:<22} : {status}")
    else:
        print("Usage: python pdf_extractor.py <path_to_pdf>")