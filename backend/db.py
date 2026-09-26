import os
import pymysql
from dotenv import load_dotenv
load_dotenv()
def get_connection():
 return pymysql.connect(
 host=os.getenv("DB_HOST", "127.0.0.1"),
 port=int(os.getenv("DB_PORT", "3306")),
 user=os.getenv("DB_USER", "root"),
 password=os.getenv("DB_PASSWORD", ""),
 database=os.getenv("DB_NAME", "heartica"),
 cursorclass=pymysql.cursors.DictCursor
 )


def save_assessment(data):
    conn = get_connection()
    cursor = conn.cursor()

    sql = """
        INSERT INTO assessments (
            age, sex, smoking, family_history,
            total_cholesterol, ldl, hdl, triglycerides,
            systolic_bp, diastolic_bp, glucose, hba1c, bmi,
            xgboost_risk, framingham_risk, final_risk,
            insights, recommendations
        ) VALUES (
            %s, %s, %s, %s,
            %s, %s, %s, %s,
            %s, %s, %s, %s, %s,
            %s, %s, %s,
            %s, %s
        )
    """

    values = (
    data.get("age"), data.get("sex"), data.get("smoking"), data.get("family_history"),
    data.get("total_cholesterol"), data.get("ldl"), data.get("hdl"), data.get("triglycerides"),
    data.get("systolic_bp"), data.get("diastolic_bp"), data.get("glucose"), data.get("hba1c"), data.get("bmi"),
    data.get("xgboost_risk"), data.get("framingham_risk"), data.get("final_risk"),
    "\n".join(data.get("insights", [])), "\n".join(data.get("recommendations", []))
)

    cursor.execute(sql, values)
    conn.commit()
    inserted_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return inserted_id