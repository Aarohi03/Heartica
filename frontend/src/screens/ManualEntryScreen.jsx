import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Info, ShieldCheck, Lightbulb, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";

function WaveBackground() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ height: "120px" }}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <path d="M0,60 C240,20 480,100 720,70 C960,40 1200,90 1440,50 L1440,120 L0,120 Z"
          fill="#E0E7FF" opacity="0.6"/>
      </svg>
    </div>
  );
}

function ClipboardIllustration() {
  return (
    <svg width="100" height="78" viewBox="0 0 140 110" fill="none">
      <ellipse cx="75" cy="100" rx="45" ry="8" fill="#C7D2FE" opacity="0.3"/>
      <rect x="20" y="18" width="90" height="82" rx="8" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5"/>
      <rect x="50" y="10" width="40" height="16" rx="6" fill="#C7D2FE" stroke="#A5B4FC" strokeWidth="1.2"/>
      <rect x="58" y="14" width="24" height="8" rx="4" fill="#EEF2FF"/>
      <rect x="32" y="38" width="55" height="4" rx="2" fill="#C7D2FE"/>
      <rect x="32" y="48" width="45" height="4" rx="2" fill="#C7D2FE"/>
      <rect x="32" y="58" width="50" height="4" rx="2" fill="#C7D2FE"/>
      <rect x="32" y="68" width="38" height="4" rx="2" fill="#C7D2FE"/>
      <rect x="32" y="78" width="48" height="4" rx="2" fill="#C7D2FE"/>
      <g transform="rotate(-35, 105, 75)">
        <rect x="96" y="42" width="14" height="46" rx="3" fill="#6366F1"/>
        <polygon points="96,88 110,88 103,100" fill="#F5D0A9"/>
        <rect x="96" y="42" width="14" height="8" rx="2" fill="#A5B4FC"/>
      </g>
    </svg>
  );
}

const STEPS = ["Basic Info", "Lipid Profile", "Blood Sugar", "Blood Pressure"];

function StepBar({ current }) {
  return (
    <div className="flex items-center mb-3">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: active || done ? "#6366F1" : "white",
                  border: active || done ? "none" : "1.5px solid #D1D5DB",
                  color: active || done ? "white" : "#9CA3AF",
                }}>
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : num}
              </div>
              <span className="text-xs mt-0.5 text-center w-16 leading-tight"
                style={{ color: active ? "#6366F1" : "#9CA3AF", fontWeight: active ? 600 : 400, fontSize: "10px" }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1 mb-4" style={{ background: done ? "#6366F1" : "#E5E7EB" }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

function FieldLabel({ children }) {
  return <p className="text-xs font-semibold text-gray-800 mb-1">{children}</p>;
}

function TextInput({ value, onChange, suffix, placeholder = "", type = "number" }) {
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 text-xs text-gray-800 outline-none bg-white"/>
      {suffix && (
        <span className="px-2 flex items-center text-xs text-gray-400 bg-gray-50 border-l border-gray-200">
          {suffix}
        </span>
      )}
    </div>
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border text-xs font-medium transition-all"
          style={{
            background: value === opt.value ? "#EEF2FF" : "white",
            borderColor: value === opt.value ? "#6366F1" : "#E5E7EB",
            color: value === opt.value ? "#6366F1" : "#6B7280",
          }}>
          {opt.icon && <span style={{ fontSize: 12 }}>{opt.icon}</span>}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 text-xs text-gray-800 bg-white border border-gray-200 rounded-lg outline-none appearance-none">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ArrowRight size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none"/>
    </div>
  );
}

const WHY_ITEMS = [
  { color: "#6366F1", bg: "#EEF2FF", title: "Age & Gender", desc: "Risk increases with age and varies between males and females." },
  { color: "#3B82F6", bg: "#EEF8FF", title: "Cholesterol Levels", desc: "High cholesterol can lead to plaque buildup in arteries." },
  { color: "#EF4444", bg: "#FFF1F2", title: "Blood Pressure", desc: "High blood pressure increases strain on your heart." },
  { color: "#3B82F6", bg: "#EEF8FF", title: "Blood Sugar", desc: "High blood sugar can damage blood vessels and the heart." },
  { color: "#F59E0B", bg: "#FFFBEB", title: "Lifestyle Factors", desc: "Smoking, activity level and family history matter." },
];

const DEFAULTS = {
  totalCholesterol: 180,
  ldl: 90,
  hdl: 55,
  triglycerides: 120,
  glucose: 90,
  hba1c: 5.4,
  systolic: 115,
  diastolic: 75,
  bmi: 23,
};

function Step1({ data, setData }) {
  const bmi =
    data.height && data.weight
      ? (data.weight / ((data.height / 100) ** 2)).toFixed(1)
      : data.bmi || "";

  const MaleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="5"/><line x1="21" y1="3" x2="15" y2="9"/>
      <line x1="15" y1="3" x2="21" y2="3"/><line x1="21" y1="3" x2="21" y2="9"/>
    </svg>
  );
  const FemaleIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5"/><line x1="12" y1="13" x2="12" y2="21"/>
      <line x1="9" y1="18" x2="15" y2="18"/>
    </svg>
  );

  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
      <div>
        <FieldLabel>Age</FieldLabel>
        <TextInput value={data.age} onChange={v => setData(p => ({ ...p, age: v }))} suffix="Yrs" placeholder="e.g. 45"/>
      </div>
      <div>
        <FieldLabel>Gender</FieldLabel>
        <ToggleGroup value={data.gender} onChange={v => setData(p => ({ ...p, gender: v }))}
          options={[
            { value: "Male", label: "Male", icon: <MaleIcon/> },
            { value: "Female", label: "Female", icon: <FemaleIcon/> },
          ]}/>
      </div>
      <div>
        <FieldLabel>Height</FieldLabel>
        <TextInput value={data.height} onChange={v => setData(p => ({ ...p, height: v }))} suffix="cm" placeholder="e.g. 165"/>
      </div>
      <div>
        <FieldLabel>Weight</FieldLabel>
        <TextInput value={data.weight} onChange={v => setData(p => ({ ...p, weight: v }))} suffix="kg" placeholder="e.g. 70"/>
      </div>
      <div>
        <FieldLabel>BMI</FieldLabel>
        <TextInput value={bmi} onChange={v => setData(p => ({ ...p, bmi: v }))} placeholder="e.g. 25.7"/>
      </div>
      <div>
        <FieldLabel>Smoking Status</FieldLabel>
        <ToggleGroup value={data.smoking} onChange={v => setData(p => ({ ...p, smoking: v }))}
          options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}/>
      </div>
      <div>
        <FieldLabel>Diabetes</FieldLabel>
        <ToggleGroup value={data.diabetes} onChange={v => setData(p => ({ ...p, diabetes: v }))}
          options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}/>
      </div>
      <div>
        <FieldLabel>Family History</FieldLabel>
        <ToggleGroup value={data.familyHistory} onChange={v => setData(p => ({ ...p, familyHistory: v }))}
          options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}/>
      </div>
      <div>
        <FieldLabel>Activity Level</FieldLabel>
        <SelectInput value={data.activity} onChange={v => setData(p => ({ ...p, activity: v }))}
          options={["Sedentary", "Light", "Moderate", "Active", "Very Active"]}/>
      </div>
    </div>
  );
}

function Step2({ data, setData }) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
      <div><FieldLabel>Total Cholesterol</FieldLabel>
        <TextInput value={data.totalCholesterol} onChange={v => setData(p => ({ ...p, totalCholesterol: v }))} suffix="mg/dL" placeholder="e.g. 180"/></div>
      <div><FieldLabel>LDL Cholesterol</FieldLabel>
        <TextInput value={data.ldl} onChange={v => setData(p => ({ ...p, ldl: v }))} suffix="mg/dL" placeholder="e.g. 100"/></div>
      <div><FieldLabel>HDL Cholesterol</FieldLabel>
        <TextInput value={data.hdl} onChange={v => setData(p => ({ ...p, hdl: v }))} suffix="mg/dL" placeholder="e.g. 55"/></div>
      <div><FieldLabel>Triglycerides</FieldLabel>
        <TextInput value={data.triglycerides} onChange={v => setData(p => ({ ...p, triglycerides: v }))} suffix="mg/dL" placeholder="e.g. 120"/></div>
    </div>
  );
}

function Step3({ data, setData }) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
      <div>
        <FieldLabel>Blood Glucose (Random/Fasting)</FieldLabel>
        <TextInput value={data.glucose} onChange={v => setData(p => ({ ...p, glucose: v }))} suffix="mg/dL" placeholder="e.g. 95"/>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">Enter Random Glucose or Fasting Glucose from your report. Do not enter eAG.</p>
      </div>
      <div>
        <FieldLabel>HbA1c</FieldLabel>
        <TextInput value={data.hba1c} onChange={v => setData(p => ({ ...p, hba1c: v }))} suffix="%" placeholder="e.g. 5.5"/>
      </div>
    </div>
  );
}

function Step4({ data, setData }) {
  const handleBPChange = (value) => {
    const parts = value.split("/");
    setData(p => ({
      ...p,
      bp: value,
      systolic: parts[0] || "",
      diastolic: parts[1] || ""
    }));
  };
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
      <div>
        <FieldLabel>Blood Pressure</FieldLabel>
        <TextInput type="text" value={data.bp} onChange={handleBPChange} placeholder="120/80"/>
      </div>
      <div>
        <FieldLabel>Systolic Pressure</FieldLabel>
        <TextInput value={data.systolic} onChange={() => {}} suffix="mmHg" placeholder="e.g. 120"/>
      </div>
      <div>
        <FieldLabel>Diastolic Pressure</FieldLabel>
        <TextInput value={data.diastolic} onChange={() => {}} suffix="mmHg" placeholder="e.g. 80"/>
      </div>
    </div>
  );
}

const STEP_LABELS = ["Basic Information", "Lipid Profile", "Blood Sugar", "Blood Pressure"];
const NEXT_LABELS = ["Next: Lipid Profile", "Next: Blood Sugar", "Next: Blood Pressure", "Analyze My Risk"];
const STEP_HINTS = [
  "Please provide your basic health details.",
  "Enter your lipid panel values from your blood test report. If your report is missing one or two, that's okay — fill in what you have.",
  "Enter your blood glucose values. Only have one of these? That's fine.",
  "Enter your most recent blood pressure reading.",
];

export default function ManualEntryScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // ─── FIX: All pre-filled values cleared to empty strings ─────────────────
  // Previously age:"58", height:"170", weight:"78" were hardcoded here
  // as test data during development. Now all fields start empty so the
  // patient must enter their own values fresh every time.
  const [step1, setStep1] = useState({
    age: "", gender: "Male", height: "", weight: "", bmi: "",
    smoking: "No", diabetes: "No", familyHistory: "No", activity: "Moderate",
  });
  // ─────────────────────────────────────────────────────────────────────────

  const [step2, setStep2] = useState({ totalCholesterol: "", ldl: "", hdl: "", triglycerides: "" });
  const [step3, setStep3] = useState({ glucose: "", hba1c: "" });
  const [step4, setStep4] = useState({ bp: "", systolic: "", diastolic: "" });

  function isStepComplete(stepNum) {
    if (stepNum === 1) {
      return (
        step1.age !== "" &&
        step1.gender !== "" &&
        step1.height !== "" &&
        step1.weight !== "" &&
        step1.smoking !== "" &&
        step1.familyHistory !== ""
      );
    }
    if (stepNum === 2) {
      return [step2.totalCholesterol, step2.ldl, step2.hdl, step2.triglycerides].some(v => v !== "");
    }
    if (stepNum === 3) {
      return step3.glucose !== "" || step3.hba1c !== "";
    }
    if (stepNum === 4) {
      return step4.systolic !== "" || step4.diastolic !== "";
    }
    return false;
  }

  function getMissingFieldsForStep(stepNum) {
    if (stepNum === 2) {
      const map = { totalCholesterol: "Total Cholesterol", ldl: "LDL", hdl: "HDL", triglycerides: "Triglycerides" };
      return Object.entries(map).filter(([key]) => step2[key] === "").map(([key, label]) => ({ label, fallback: DEFAULTS[key] }));
    }
    if (stepNum === 3) {
      const map = { glucose: "Glucose (Random/Fasting)", hba1c: "HbA1c" };
      return Object.entries(map).filter(([key]) => step3[key] === "").map(([key, label]) => ({ label, fallback: DEFAULTS[key] }));
    }
    if (stepNum === 4) {
      const map = { systolic: "Systolic", diastolic: "Diastolic" };
      return Object.entries(map).filter(([key]) => step4[key] === "").map(([key, label]) => ({ label, fallback: DEFAULTS[key] }));
    }
    return [];
  }

  const currentStepComplete = isStepComplete(step);
  const allStepsComplete = [1, 2, 3, 4].every(isStepComplete);
  const missingThisStep = getMissingFieldsForStep(step);

  function buildPayload() {
    const computedBmi =
      step1.height && step1.weight
        ? parseFloat((step1.weight / ((step1.height / 100) ** 2)).toFixed(1))
        : parseFloat(step1.bmi) || DEFAULTS.bmi;

    const valueOrDefault = (raw, key) => (raw !== "" ? parseFloat(raw) : DEFAULTS[key]);

    return {
      age: parseInt(step1.age, 10),
      sex: step1.gender,
      smoking: step1.smoking,
      family_history: step1.familyHistory,
      bmi: computedBmi,
      total_cholesterol: valueOrDefault(step2.totalCholesterol, "totalCholesterol"),
      ldl: valueOrDefault(step2.ldl, "ldl"),
      hdl: valueOrDefault(step2.hdl, "hdl"),
      triglycerides: valueOrDefault(step2.triglycerides, "triglycerides"),
      glucose: valueOrDefault(step3.glucose, "glucose"),
      hba1c: valueOrDefault(step3.hba1c, "hba1c"),
      systolic_bp: valueOrDefault(step4.systolic, "systolic"),
      diastolic_bp: valueOrDefault(step4.diastolic, "diastolic"),
    };
  }

  const handleNext = () => {
    if (!currentStepComplete) return;
    if (step < 4) {
      setStep(s => s + 1);
    } else if (allStepsComplete) {
      sessionStorage.setItem("analysisSource", "manual");
      navigate("/processing", {
        state: {
          mode: "manual",
          formData: buildPayload(),
        },
      });
    }
  };

  const handleBack = () => { if (step > 1) setStep(s => s - 1); else navigate("/"); };

  return (
    <div className="h-screen relative overflow-hidden flex flex-col"
      style={{ background: "#F8F9FF", fontFamily: "Inter, sans-serif" }}>
      <WaveBackground />
<Navbar />


      <div className="relative z-10 flex-1 flex px-6 md:px-12 gap-5 min-h-0 pb-3">
        <div className="flex-1 flex flex-col min-w-0 gap-2">
          <div className="flex justify-between">
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-xs text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm w-fit">
                <ArrowLeft size={12}/> Back to Home
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">Enter Health Values Manually</h1>
                <p className="text-gray-500 text-xs mt-0.5">
                  Provide your health information step-by-step. All fields are important for accurate risk assessment.
                </p>
              </div>
            </div>
            <ClipboardIllustration />
          </div>

          <StepBar current={step} />

          <div className="bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm flex-1 flex flex-col min-h-0">
            <p className="text-xs font-semibold text-indigo-600 mb-0.5">Step {step} of 4</p>
            <h2 className="text-base font-bold text-gray-900 mb-0.5">{STEP_LABELS[step - 1]}</h2>
            <p className="text-xs text-gray-500 mb-3">{STEP_HINTS[step - 1]}</p>

            {step === 1 && <Step1 data={step1} setData={setStep1}/>}
            {step === 2 && <Step2 data={step2} setData={setStep2}/>}
            {step === 3 && <Step3 data={step3} setData={setStep3}/>}
            {step === 4 && <Step4 data={step4} setData={setStep4}/>}

            <div className="flex-1"/>

            {step > 1 && currentStepComplete && missingThisStep.length > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2 leading-relaxed">
                <span className="font-semibold">Note: </span>
                {missingThisStep.map(f => `${f.label} (defaulting to ${f.fallback})`).join(", ")} will use a typical normal value since left blank. For a more accurate result, fill these in if you have them.
              </p>
            )}

            {!currentStepComplete && (
              <p className="text-xs text-red-400 flex items-center gap-1 mb-2">
                <AlertCircle size={11}/> Please fill in at least one value on this step before continuing.
              </p>
            )}

            <div className="flex justify-between items-center">
              <button onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 bg-white hover:bg-gray-50 transition">
                <ArrowLeft size={13}/> Back
              </button>
              <button
                onClick={handleNext}
                disabled={!currentStepComplete}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-semibold transition hover:opacity-90 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
                  opacity: !currentStepComplete ? 0.5 : 1,
                  cursor: !currentStepComplete ? "not-allowed" : "pointer",
                }}>
                {NEXT_LABELS[step - 1]} <ArrowRight size={13}/>
              </button>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-xl px-4 py-2.5 flex gap-2.5 shadow-sm flex-shrink-0">
            <Lightbulb size={14} className="text-indigo-500 mt-0.5 flex-shrink-0"/>
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-800">Tips: </span>
              Enter values exactly as they appear in your reports. Use the same units provided in your lab results.
            </p>
          </div>
        </div>

        <div className="w-[300px] flex-shrink-0 flex flex-col gap-3 pt-1">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 mb-3">
              <Info size={14} className="text-indigo-500"/>
              <h3 className="font-bold text-gray-900 text-xs">Why these values matter</h3>
            </div>
            <div className="flex flex-col justify-between flex-1 overflow-y-auto pb-1">
              {WHY_ITEMS.map((item, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                    <span style={{ width: 14, height: 14, borderRadius: "50%", background: item.color, display: "block", opacity: 0.7 }}/>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{i + 1}. {item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm flex gap-2.5 flex-shrink-0">
            <ShieldCheck size={16} className="text-indigo-600 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="text-xs font-semibold text-gray-900">Your data is safe</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                All information is encrypted and processed securely. Never stored. Used only for risk assessment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}