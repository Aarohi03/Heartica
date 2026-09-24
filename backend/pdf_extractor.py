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


def extract_bp(text):
    """
    Dedicated BP extractor.
    Handles ALL common formats found in real Indian lab reports:

      120/80 mmHg
      BP: 120/80
      Blood Pressure: 120 / 80
      Systolic: 120  Diastolic: 80
      BP Reading 120/80mmHg
      120/80 (no unit)

    Returns (systolic, diastolic) as floats, or (None, None) if not found.
    """

    # ── Strategy 1: explicit systolic + diastolic labels (most reliable) ──
    sys_match = re.search(
        r"systolic\s*(?:bp|blood\s*pressure)?\s*[:\-=]?\s*(\d{2,3})",
        text, re.IGNORECASE
    )
    dia_match = re.search(
        r"diastolic\s*(?:bp|blood\s*pressure)?\s*[:\-=]?\s*(\d{2,3})",
        text, re.IGNORECASE
    )
    if sys_match and dia_match:
        return float(sys_match.group(1)), float(dia_match.group(1))

    # ── Strategy 2: BP/Blood Pressure label followed by NNN/NNN ──
    # e.g. "Blood Pressure: 120/80 mmHg" or "BP - 120/80"
    bp_slash = re.search(
        r"(?:blood\s*pressure|b\.?p\.?)\s*[:\-=]?\s*(\d{2,3})\s*/\s*(\d{2,3})",
        text, re.IGNORECASE
    )
    if bp_slash:
        return float(bp_slash.group(1)), float(bp_slash.group(2))

    # ── Strategy 3: any NNN/NN or NNN/NNN followed by mmHg ──
    # e.g. "120/80 mmHg" or "130/90mmHg"
    mmhg = re.search(
        r"(\d{2,3})\s*/\s*(\d{2,3})\s*mm\s*hg",
        text, re.IGNORECASE
    )
    if mmhg:
        return float(mmhg.group(1)), float(mmhg.group(2))

    # ── Strategy 4: bare NNN/NN anywhere (last resort, no unit required) ──
    # Guards: systolic 80-200, diastolic 40-130, systolic > diastolic
    bare = re.search(
        r"\b(\d{2,3})\s*/\s*(\d{2,3})\b",
        text, re.IGNORECASE
    )
    if bare:
        s, d = float(bare.group(1)), float(bare.group(2))
        if 80 <= s <= 200 and 40 <= d <= 130 and s > d:
            return s, d

    return None, None


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

    # ── Extract BP first using the dedicated multi-strategy extractor ──────
    systolic_bp, diastolic_bp = extract_bp(text)

    biomarkers = {

        "total_cholesterol": find_value(text, [
            r"total\s*cholesterol[\s:=\-]*(\d+\.?\d*)",
            r"cholesterol[\s,]*total[\s:=\-]*(\d+\.?\d*)",
            r"t\.?\s*chol[\s:=\-]*(\d+\.?\d*)",
            r"serum\s*cholesterol[\s:=\-]*(\d+\.?\d*)",
        ]),

        "ldl": find_value(text, [
            r"ldl[\s\-]*c(?:holesterol)?[\s:=\-]*(\d+\.?\d*)",
            r"low\s*density\s*lipoprotein[\s:=\-]*(\d+\.?\d*)",
            r"ldl[\s:=\-]*(\d+\.?\d*)",
            r"l\.?d\.?l[\s:=\-]*(\d+\.?\d*)",
        ]),

        "hdl": find_value(text, [
            r"hdl[\s\-]*c(?:holesterol)?[\s:=\-]*(\d+\.?\d*)",
            r"high\s*density\s*lipoprotein[\s:=\-]*(\d+\.?\d*)",
            r"hdl[\s:=\-]*(\d+\.?\d*)",
            r"h\.?d\.?l[\s:=\-]*(\d+\.?\d*)",
        ]),

        "triglycerides": find_value(text, [
            r"triglycerides?[\s:=\-]*(\d+\.?\d*)",
            r"trig(?:s)?[\s:=\-]*(\d+\.?\d*)",
            r"serum\s*triglycerides?[\s:=\-]*(\d+\.?\d*)",
            r"triacylglycerol[\s:=\-]*(\d+\.?\d*)",
        ]),

        # BP values come from the dedicated extract_bp() above
        "systolic_bp":  systolic_bp,
        "diastolic_bp": diastolic_bp,

        "glucose": find_value(text, [
            r"fasting\s*(?:blood\s*)?glucose[\s:=\-]*(\d+\.?\d*)",
            r"glucose[\s,]*fasting[\s:=\-]*(\d+\.?\d*)",
            r"blood\s*glucose[\s:=\-]*(\d+\.?\d*)",
            r"fasting\s*blood\s*sugar[\s:=\-]*(\d+\.?\d*)",
            r"fbs[\s:=\-]*(\d+\.?\d*)",
            r"glucose[\s:=\-]*(\d+\.?\d*)",
            r"random\s*blood\s*sugar[\s:=\-]*(\d+\.?\d*)",
            r"rbs[\s:=\-]*(\d+\.?\d*)",
        ]),

        "hba1c": find_value(text, [
            r"hba1c[\s:=\-]*(\d+\.?\d*)",
            r"hb\s*a1c[\s:=\-]*(\d+\.?\d*)",
            r"glycated\s*h(?:a|e)moglobin[\s:=\-]*(\d+\.?\d*)",
            r"glycosylated\s*h(?:a|e)mo(?:globin)?[\s:=\-]*(\d+\.?\d*)",
            r"a1c[\s:=\-]*(\d+\.?\d*)",
            r"hb\s*a\s*1\s*c[\s:=\-]*(\d+\.?\d*)",
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


# ── Quick test — run this file directly to test ───────────────────────────────
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