# create_test_pdf.py
# This script creates a fake lab report PDF for testing our extractor
# Run this once to generate test_report.pdf

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import os

def create_test_pdf():
    filename = "test_report.pdf"
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4

    # Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 50, "CITY DIAGNOSTIC LABORATORY")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 70, "Patient Lab Report")
    c.drawString(50, height - 90, "Patient: Test Patient | Age: 58 | Sex: Male")

    # Divider
    c.line(50, height - 100, width - 50, height - 100)

    # Lipid Profile
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, height - 130, "LIPID PROFILE")
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 155, "Total Cholesterol        :  265 mg/dL")
    c.drawString(50, height - 175, "LDL Cholesterol          :  178 mg/dL")
    c.drawString(50, height - 195, "HDL Cholesterol          :  36 mg/dL")
    c.drawString(50, height - 215, "Triglycerides            :  242 mg/dL")

    # Blood Sugar
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, height - 250, "BLOOD SUGAR")
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 275, "Fasting Blood Glucose    :  132 mg/dL")
    c.drawString(50, height - 295, "HbA1c                    :  7.1 %")

    # Blood Pressure
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, height - 330, "BLOOD PRESSURE")
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 355, "Systolic                 :  152 mmHg")
    c.drawString(50, height - 375, "Diastolic                :  96 mmHg")

    # BMI
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, height - 410, "ANTHROPOMETRIC MEASUREMENTS")
    c.setFont("Helvetica", 11)
    c.drawString(50, height - 435, "BMI                      :  31.4 kg/m2")

    c.save()
    print(f"Test PDF created: {filename}")

create_test_pdf()