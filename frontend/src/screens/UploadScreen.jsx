import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, ArrowRight, ArrowLeft, ShieldCheck, Info,
  CheckCircle, AlertCircle, X, Lightbulb,
  FileSearch, Brain, BarChart3,
} from "lucide-react";
import Navbar from "../components/Navbar";

// ─── Multi-file FIX ──────────────────────────────────────────────────────────
// Store all 3 File objects here before navigating.
// React Router serializes location.state to JSON — File objects don't survive
// that serialization. Module-level variables bypass this entirely.
// ProcessingScreen imports pendingFiles directly.
export let pendingFiles = { lipid: null, sugar: null, pressure: null };
// ─────────────────────────────────────────────────────────────────────────────


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

const REPORT_SLOTS = [
  { id: "lipid",    label: "Lipid Profile Report",   number: 1 },
  { id: "sugar",    label: "Blood Sugar Report",      number: 2 },
  { id: "pressure", label: "Blood Pressure Report",   number: 3 },
];

const NEXT_STEPS = [
  { icon: Upload,    bg: "#EEF2FF", color: "#6366F1", label: "Upload Reports",  desc: "Upload your medical reports in PDF format." },
  { icon: FileSearch,bg: "#ECFDF5", color: "#059669", label: "Extract Data",    desc: "Our AI extracts key biomarker values from your reports." },
  { icon: Brain,     bg: "#F5F3FF", color: "#7C3AED", label: "AI Analysis",     desc: "Advanced AI analyzes your data and calculates risk scores." },
  { icon: BarChart3, bg: "#FFF7ED", color: "#EA580C", label: "Get Results",     desc: "View your risk assessment, insights and recommendations." },
];

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className="flex-1 py-2 rounded-lg border text-xs font-medium transition-all"
          style={{
            background:   value === opt.value ? "#EEF2FF" : "white",
            borderColor:  value === opt.value ? "#6366F1" : "#E5E7EB",
            color:        value === opt.value ? "#6366F1" : "#6B7280",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function UploadScreen() {
  const navigate = useNavigate();
  const [files, setFiles] = useState({ lipid: null, sugar: null, pressure: null });
  const [dragging, setDragging] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    age: "", sex: "Male", smoking: "No", familyHistory: "No",
  });

  const lipidRef    = useRef();
  const sugarRef    = useRef();
  const pressureRef = useRef();
  const inputRefs   = { lipid: lipidRef, sugar: sugarRef, pressure: pressureRef };

  const hasAtLeastOne = Object.values(files).some(Boolean);
  const canAnalyze    = hasAtLeastOne && patientInfo.age.trim() !== "";

  function handleFile(id, file) {
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Please upload a PDF file only."); return; }
    if (file.size > 20 * 1024 * 1024)   { alert("File size must be under 20MB."); return; }
    setFiles(prev => ({ ...prev, [id]: file }));
  }

  function removeFile(id) {
    setFiles(prev => ({ ...prev, [id]: null }));
    if (inputRefs[id].current) inputRefs[id].current.value = "";
  }

  function handleDrop(e, id) {
    e.preventDefault();
    setDragging(null);
    handleFile(id, e.dataTransfer.files[0]);
  }

  function handleAnalyze() {
    if (!canAnalyze) return;

    // Store ALL 3 real File objects in the module variable BEFORE navigating.
    // Only non-null files will be sent. ProcessingScreen reads this directly.
    pendingFiles = {
      lipid:    files.lipid    || null,
      sugar:    files.sugar    || null,
      pressure: files.pressure || null,
    };

    sessionStorage.setItem("analysisSource", "upload");
    navigate("/processing", {
      state: {
        mode:           "upload",
        age:            patientInfo.age,
        sex:            patientInfo.sex,
        smoking:        patientInfo.smoking,
        family_history: patientInfo.familyHistory,
      },
    });
  }

  return (
    <div className="h-screen relative overflow-hidden flex flex-col"
      style={{ background: "#F8F9FF", fontFamily: "Inter, sans-serif" }}>
      <WaveBackground />

      {/* Navbar */}
      <Navbar />

      <div className="relative z-10 flex-1 flex px-6 md:px-12 gap-6 min-h-0 pb-4">
        {/* LEFT COLUMN */}
        <div className="flex-1 flex flex-col min-w-0">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded-full shadow-sm w-fit hover:text-indigo-600 transition-colors">
            <ArrowLeft size={12}/> Back to Home
          </button>

          <div className="flex items-start justify-between mt-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">Upload Medical Reports</h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                Upload up to 3 medical reports. Our AI will extract values automatically and analyze your heart risk.
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0 ml-4">
              <svg width="90" height="80" viewBox="0 0 110 96" fill="none">
                <rect x="4" y="4" width="62" height="78" rx="8" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5"/>
                <rect x="13" y="18" width="36" height="3" rx="1.5" fill="#C7D2FE"/>
                <rect x="13" y="26" width="26" height="3" rx="1.5" fill="#C7D2FE"/>
                <rect x="13" y="34" width="30" height="3" rx="1.5" fill="#C7D2FE"/>
                <rect x="13" y="42" width="20" height="3" rx="1.5" fill="#C7D2FE"/>
                <rect x="13" y="56" width="7"  height="16" rx="2" fill="#C7D2FE"/>
                <rect x="24" y="49" width="7"  height="23" rx="2" fill="#A5B4FC"/>
                <rect x="35" y="53" width="7"  height="19" rx="2" fill="#C7D2FE"/>
                <circle cx="85" cy="62" r="20" fill="#6366F1"/>
                <polyline points="77,62 84,55 93,64" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="84" y1="55" x2="84" y2="70" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="78" y1="70" x2="91" y2="70" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Upload slots */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {REPORT_SLOTS.map(slot => (
              <div key={slot.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {slot.number}
                  </span>
                  <span className="text-xs font-semibold text-gray-800">{slot.label}</span>
                  <Info size={12} className="text-gray-300 ml-auto flex-shrink-0"/>
                </div>
                <div
                  onClick={() => !files[slot.id] && inputRefs[slot.id].current.click()}
                  onDragOver={e => { e.preventDefault(); setDragging(slot.id); }}
                  onDragLeave={() => setDragging(null)}
                  onDrop={e => handleDrop(e, slot.id)}
                  className="flex-1 flex flex-col items-center justify-center rounded-xl transition-all duration-200 cursor-pointer p-4"
                  style={{
                    minHeight: "112px",
                    border:     files[slot.id] ? "1.5px solid #86efac" : dragging === slot.id ? "1.5px dashed #818cf8" : "1.5px dashed #C7D2FE",
                    background: files[slot.id] ? "#f0fdf4"              : dragging === slot.id ? "#eef2ff"              : "#FAFBFF",
                    cursor:     files[slot.id] ? "default" : "pointer",
                  }}
                >
                  {files[slot.id] ? (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <CheckCircle size={24} color="#22c55e"/>
                      <span className="text-xs font-semibold text-green-700 break-all leading-tight px-1">{files[slot.id].name}</span>
                      <span className="text-xs text-gray-400">{(files[slot.id].size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <Upload size={15} color="#818cf8"/>
                      </div>
                      <span className="text-xs text-gray-500 font-medium leading-relaxed">Click to upload<br/>or drag and drop</span>
                      <span className="text-xs text-gray-400">PDF only (Max 20MB)</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  {files[slot.id] ? (
                    <>
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <CheckCircle size={11}/> File uploaded
                      </span>
                      <button onClick={() => removeFile(slot.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors bg-none border-none cursor-pointer">
                        <X size={11}/> Remove
                      </button>
                    </>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <AlertCircle size={11}/> No file uploaded yet
                    </span>
                  )}
                </div>
                <input
                  ref={inputRefs[slot.id]}
                  type="file"
                  accept=".pdf"
                  onChange={e => handleFile(slot.id, e.target.files[0])}
                  style={{ position: "fixed", top: "-9999px", left: "-9999px", opacity: 0, pointerEvents: "none" }}
                />
              </div>
            ))}
          </div>

          {/* Patient info */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-4">
            <p className="text-xs font-semibold text-gray-800 mb-3">A few details about you</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Age</p>
                <input
                  type="number"
                  value={patientInfo.age}
                  onChange={e => setPatientInfo(p => ({ ...p, age: e.target.value }))}
                  placeholder="e.g. 45"
                  className="w-full px-3 py-2 text-xs text-gray-800 border border-gray-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Sex</p>
                <ToggleGroup value={patientInfo.sex} onChange={v => setPatientInfo(p => ({ ...p, sex: v }))}
                  options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]}/>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Smoking</p>
                <ToggleGroup value={patientInfo.smoking} onChange={v => setPatientInfo(p => ({ ...p, smoking: v }))}
                  options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}/>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Family History</p>
                <ToggleGroup value={patientInfo.familyHistory} onChange={v => setPatientInfo(p => ({ ...p, familyHistory: v }))}
                  options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}/>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white border border-indigo-100 rounded-2xl p-3 flex items-start gap-3 shadow-sm mt-4">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={15} className="text-indigo-500"/>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Tips for best results</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Upload clear and recent reports. Ensure all pages are visible and not blurred for accurate data extraction.
              </p>
            </div>
          </div>

          {/* Analyze button */}
          <div className="mt-auto flex flex-col items-center gap-2 pt-4">
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm"
              style={{
                width: "100%", maxWidth: "420px",
                background: canAnalyze ? "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" : "#C7D2FE",
                cursor:     canAnalyze ? "pointer" : "not-allowed",
                boxShadow:  canAnalyze ? "0 4px 14px rgba(99,102,241,0.35)" : "none",
              }}
            >
              Analyze Health Metrics <ArrowRight size={15}/>
            </button>
            {!canAnalyze && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <AlertCircle size={11}/>
                {!hasAtLeastOne ? "Please upload at least one report to continue" : "Please enter your age to continue"}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-64 flex-shrink-0 flex flex-col gap-4 pt-1">

          {/* Card 1 — What happens next? */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm font-bold text-gray-900 mb-4">What happens next?</p>
            <div className="flex flex-col gap-4">
              {NEXT_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: step.bg }}>
                      <Icon size={15} color={step.color}/>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: step.color }}>{i + 1}. {step.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2 — Your data is safe */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={15} color="#6366F1"/>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Your data is safe</p>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">All reports are processed securely. We never store your files.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}