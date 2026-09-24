import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Info, Plus, Download, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
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

function getRiskConfig(score) {
  if (score < 30) return {
    color: "#059669", trackColor: "#D1FAE5", label: "Low Risk",
    textColor: "#065F46", bgAlert: "#ECFDF5", borderAlert: "#6EE7B7",
    summary: "Your heart health indicators are within a healthy range. Keep maintaining your lifestyle.",
    percentile: "Lower than 70% of people in your age group."
  };
  if (score < 60) return {
    color: "#F59E0B", trackColor: "#FEF3C7", label: "Moderate Risk",
    textColor: "#92400E", bgAlert: "#FFFBEB", borderAlert: "#FDE68A",
    summary: "Some indicators need attention. Lifestyle changes and regular check-ups are advised.",
    percentile: "Higher than 55% of people in your age group."
  };
  if (score < 80) return {
    color: "#DC2626", trackColor: "#FEE2E2", label: "High Risk",
    textColor: "#991B1B", bgAlert: "#FEF2F2", borderAlert: "#FECACA",
    summary: "Your indicators show significant cardiovascular risk. Please consult a cardiologist soon.",
    percentile: "Higher than 80% of people in your age group."
  };
  return {
    color: "#7F1D1D", trackColor: "#FEE2E2", label: "Critical Risk",
    textColor: "#7F1D1D", bgAlert: "#FEF2F2", borderAlert: "#FCA5A5",
    summary: "This indicates a very high risk of cardiovascular disease. Timely action and medical consultation are strongly recommended.",
    percentile: "Above 95% of people in your age group."
  };
}

function CircularGauge({ score }) {
  const cfg = getRiskConfig(score);
  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={cfg.trackColor} strokeWidth={strokeWidth}/>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={cfg.color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 1.2s ease" }}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill={cfg.color} style={{ marginBottom: 2 }}>
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.742 4.068 2 6.281 2c1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447C20.266 2 23 3.775 23 7.191c0 4.105-5.571 8.864-11 14.402z"/>
          </svg>
          <span className="font-extrabold leading-none" style={{ fontSize: 38, color: cfg.color }}>{Math.round(score)}</span>
          <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>% Risk</span>
        </div>
      </div>
      <div className="mt-2 px-5 py-1.5 rounded-full text-sm font-bold"
        style={{ background: cfg.bgAlert, color: cfg.color, border: `1.5px solid ${cfg.borderAlert}` }}>
        {cfg.label}
      </div>
      <p className="text-xs text-gray-500 mt-1 text-center">Probability of Heart Disease</p>
      <div className="mt-3 rounded-xl p-3 w-full flex items-start gap-2"
        style={{ background: cfg.bgAlert, border: `1px solid ${cfg.borderAlert}` }}>
        <AlertTriangle size={14} color={cfg.color} className="flex-shrink-0 mt-0.5"/>
        <p className="text-xs leading-relaxed font-medium" style={{ color: cfg.textColor }}>{cfg.summary}</p>
      </div>
      <div className="mt-2 w-full flex items-center gap-2">
        <span className="text-xs text-gray-500">Risk Category</span>
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: cfg.bgAlert, color: cfg.color }}>{cfg.label.split(" ")[0]}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1 w-full">{cfg.percentile}</p>
    </div>
  );
}

function HeartAgeCard({ actualAge, finalRisk }) {
  const riskPenalty = finalRisk >= 80 ? 14 : finalRisk >= 60 ? 8 : finalRisk >= 30 ? 4 : 0;
  const heartAge = Math.round(Number(actualAge || 45) + riskPenalty);
  const diff = heartAge - Number(actualAge || 45);
  const diffColor = diff > 0 ? "#DC2626" : "#059669";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <Info size={14} color="#6366F1"/>
        <span className="text-xs font-bold text-gray-800">Heart Age &amp; Comparison</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#DC2626">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.742 4.068 2 6.281 2c1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447C20.266 2 23 3.775 23 7.191c0 4.105-5.571 8.864-11 14.402z"/>
          </svg>
          <span className="text-2xl font-extrabold" style={{ color: "#DC2626" }}>{heartAge}</span>
          <span className="text-xs text-gray-400">years</span>
          <span className="text-xs text-gray-500">Your Heart Age</span>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Actual Age</span>
            <span className="px-3 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
              {actualAge ? `${actualAge} yrs` : "— yrs"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Age Difference</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: diff > 0 ? "#FEF2F2" : "#ECFDF5", color: diffColor }}>
              {diff > 0 ? `+${diff}` : diff} years
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 leading-relaxed flex items-center gap-1">
        <Info size={10}/> Reducing risk factors can help lower your heart age.
      </p>
    </div>
  );
}

const BIOMARKER_META = {
  total_cholesterol: {
    label: "Total Cholesterol",
    unit: "mg/dL",
    normal: "<200 mg/dL",
    iconColor: "#DC2626",
    iconBg: "#FEF2F2",
    getStatus: v =>
      v < 200 ? "Healthy" :
      v < 240 ? "Needs Attention" :
      "High Risk"
  },
  ldl: {
    label: "LDL Cholesterol",
    unit: "mg/dL",
    normal: "<100 mg/dL",
    iconColor: "#DC2626",
    iconBg: "#FEF2F2",
    getStatus: v =>
      v < 100 ? "Healthy" :
      v < 130 ? "A Little High" : // Updated label
      v < 160 ? "Needs Attention" :
      "High Risk"
  },
  hdl: {
    label: "HDL Cholesterol",
    unit: "mg/dL",
    normal: ">40 mg/dL",
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    getStatus: v =>
      v >= 60 ? "Healthy" :
      v >= 40 ? "Needs Improvement" :
      "High Risk"
  },
  triglycerides: {
    label: "Triglycerides",
    unit: "mg/dL",
    normal: "<150 mg/dL",
    iconColor: "#DC2626",
    iconBg: "#FEF2F2",
    getStatus: v =>
      v < 150 ? "Healthy" :
      v < 200 ? "Needs Attention" :
      "High Risk"
  },
  systolic_bp: {
    label: "Systolic BP",
    unit: "mmHg",
    normal: "<120 mmHg",
    iconColor: "#6366F1",
    iconBg: "#EEF2FF",
    getStatus: v =>
      v < 120 ? "Healthy" :
      v < 140 ? "A Little High" : // Updated label
      "High Risk"
  },
  diastolic_bp: {
    label: "Diastolic BP",
    unit: "mmHg",
    normal: "<80 mmHg",
    iconColor: "#6366F1",
    iconBg: "#EEF2FF",
    getStatus: v =>
      v < 80 ? "Healthy" :
      v < 90 ? "A Little High" : // Updated label
      "High Risk"
  },
  glucose: {
    label: "Fasting Glucose",
    unit: "mg/dL",
    normal: "70–99 mg/dL",
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    getStatus: v =>
      v < 100 ? "Healthy" :
      v < 126 ? "Needs Attention" :
      "High Risk"
  },
  hba1c: {
    label: "HbA1c",
    unit: "%",
    normal: "<5.7%",
    iconColor: "#DC2626",
    iconBg: "#FEF2F2",
    getStatus: v =>
      v < 5.7 ? "Healthy" :
      v < 6.5 ? "Needs Attention" :
      "High Risk"
  },
  bmi: {
    label: "BMI",
    unit: "kg/m²",
    normal: "18.5–24.9",
    iconColor: "#F59E0B",
    iconBg: "#FFFBEB",
    getStatus: v =>
      v < 18.5 ? "Needs Attention" :
      v < 25 ? "Healthy" :
      v < 30 ? "A Little High" : // Updated label
      "High Risk"
  }
};

const STATUS_STYLE = {
  Healthy: {
    bg: "#ECFDF5",
    color: "#059669"
  },
  "A Little High": { // Consolidated matching key
    bg: "#FFF7ED",
    color: "#EA580C"
  },
  "Needs Attention": {
    bg: "#FFFBEB",
    color: "#D97706"
  },
  "Needs Improvement": {
    bg: "#FEFCE8",
    color: "#CA8A04"
  },
  "High Risk": {
    bg: "#FEF2F2",
    color: "#DC2626"
  }
};

function BioIcon({ color, bg }) {
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.742 4.068 2 6.281 2c1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447C20.266 2 23 3.775 23 7.191c0 4.105-5.571 8.864-11 14.402z"/>
      </svg>
    </div>
  );
}

function BiomarkerCard({ bioKey, value }) {
  const meta = BIOMARKER_META[bioKey];
  if (!meta) return null;
  const numVal = parseFloat(value);
  const hasValue = value != null && value !== "" && !isNaN(numVal);
  const statusLabel = hasValue ? meta.getStatus(numVal) : "—";
  const style = STATUS_STYLE[statusLabel] || STATUS_STYLE["Healthy"];
  const displayVal = hasValue ? numVal.toFixed(1) : "—";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2.5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <BioIcon color={meta.iconColor} bg={meta.iconBg}/>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium leading-tight">{meta.label}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-extrabold text-gray-900 leading-none">{displayVal}</span>
            <span className="text-xs text-gray-400">{meta.unit}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: style.bg, color: style.color }}>{statusLabel}</span>
        <span className="text-xs text-gray-400">Normal: {meta.normal}</span>
      </div>
    </div>
  );
}

function RadarChart({ bioValues }) {
  const axes = [
    { key: "ldl",            label: "High LDL\nCholesterol",  max: 200 },
    { key: "systolic_bp",   label: "High Blood\nPressure",   max: 180 },
    { key: "glucose",       label: "High Blood\nSugar",      max: 200 },
    { key: "triglycerides", label: "High\nTriglycerides",    max: 300 },
    { key: "hdl",           label: "Low HDL\nCholesterol",   max: 80, invert: true },
    { key: "bmi",           label: "BMI\n(Obesity)",         max: 40 },
  ];
  const cx = 150, cy = 150, r = 95, n = axes.length;
  function getPoint(i, ratio) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) };
  }
  function getLabelPoint(i) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + (r + 34) * Math.cos(angle), y: cy + (r + 34) * Math.sin(angle) };
  }
  function ratiosToPath(ratios) {
    return ratios.map((ratio, i) => {
      const p = getPoint(i, ratio);
      return `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(" ") + " Z";
  }
  const userRatios = axes.map(ax => {
    const val = parseFloat(bioValues[ax.key]);
    if (isNaN(val)) return 0.3;
    return ax.invert
      ? Math.max(0, Math.min(1, (ax.max - val) / ax.max))
      : Math.max(0, Math.min(1, val / ax.max));
  });
  const normalRatios = axes.map(() => 0.45);
  return (
    <div className="flex flex-col items-center">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {[0.25, 0.5, 0.75, 1].map((level, li) => (
          <polygon key={li}
            points={axes.map((_, i) => { const p = getPoint(i, level); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(" ")}
            fill="none" stroke="#E5E7EB" strokeWidth="1"/>
        ))}
        {axes.map((_, i) => {
          const p = getPoint(i, 1);
          return <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#E5E7EB" strokeWidth="1"/>;
        })}
        <path d={ratiosToPath(normalRatios)} fill="#6366F1" fillOpacity="0.08" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 3"/>
        <path d={ratiosToPath(userRatios)} fill="#DC2626" fillOpacity="0.15" stroke="#DC2626" strokeWidth="2"/>
        {userRatios.map((ratio, i) => {
          const p = getPoint(i, ratio);
          return <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="4" fill="#DC2626" stroke="white" strokeWidth="1.5"/>;
        })}
        {axes.map((ax, i) => {
          const lp = getLabelPoint(i);
          const lines = ax.label.split("\n");
          return (
            <text key={i} x={lp.x.toFixed(1)} y={lp.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fill="#6B7280" fontWeight="500" fontFamily="Inter, sans-serif">
              {lines.map((line, li) => (
                <tspan key={li} x={lp.x.toFixed(1)} dy={li === 0 ? (lines.length > 1 ? "-0.5em" : "0") : "1.2em"}>{line}</tspan>
              ))}
            </text>
          );
        })}
      </svg>
      <div className="flex items-center gap-5 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-0.5 bg-red-500 rounded"/>
          <span className="text-xs text-gray-500">Your Values</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 border-t-2 border-dashed border-indigo-400"/>
          <span className="text-xs text-gray-500">Normal Range</span>
        </div>
      </div>
    </div>
  );
}

function AIInterpretation({ finalRisk, insights }) {
  const cfg = getRiskConfig(finalRisk);
  const confidence = finalRisk >= 70 || finalRisk < 20 ? 98 : finalRisk >= 50 ? 85 : 72;
  const filled = Math.round(confidence / 10);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#6366F1">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 16.5 13z"/>
          </svg>
        </div>
        <h3 className="text-sm font-bold text-gray-900">AI Interpretation</h3>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">
        {insights && insights.length > 0
          ? `Your biomarker patterns indicate ${cfg.label.toLowerCase()} of cardiovascular disease. ${insights[0]}`
          : `Your biomarker patterns indicate ${cfg.label.toLowerCase()} of cardiovascular disease. Multiple parameters are outside the normal range and contributing to your overall risk.`}
      </p>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-medium">AI Confidence Score</span>
          <span className="text-xs font-bold text-indigo-600">{confidence}%</span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full" style={{ background: i < filled ? "#6366F1" : "#E5E7EB" }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function PrintReport({ actualAge, finalRisk, xgboostRisk, framinghamRisk, bioValues, insights, recommendations, mode }) {
  const cfg = getRiskConfig(finalRisk);
  const riskPenalty = finalRisk >= 80 ? 14 : finalRisk >= 60 ? 8 : finalRisk >= 30 ? 4 : 0;
  const heartAge = Math.round(Number(actualAge || 45) + riskPenalty);
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

  const bioRows = Object.entries(BIOMARKER_META).map(([key, meta]) => {
    const numVal = parseFloat(bioValues[key]);
    const hasValue = bioValues[key] != null && !isNaN(numVal);
    const statusLabel = hasValue ? meta.getStatus(numVal) : "—";
    const style = STATUS_STYLE[statusLabel] || STATUS_STYLE["Healthy"];
    return { key, meta, displayVal: hasValue ? numVal.toFixed(1) : "—", statusLabel, style };
  });

  return (
    <div className="print-only" style={{ fontFamily: "Inter, Arial, sans-serif", color: "#111827", background: "white" }}>
      <div style={{ background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", color: "white", padding: "24px 32px", borderRadius: "0 0 16px 16px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>❤ Heartica</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>AI-Powered Heart Risk Assessment Report</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, opacity: 0.85 }}>
            <div>Generated: {today}</div>
            <div style={{ marginTop: 2 }}>Source: {mode === "upload" ? "PDF Upload" : "Manual Entry"}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, padding: "0 32px" }}>
        <div style={{ flex: "0 0 180px", border: `2px solid ${cfg.color}`, borderRadius: 12, padding: 16, textAlign: "center", background: cfg.bgAlert }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Overall Risk Score</div>
          <div style={{ fontSize: 52, fontWeight: 900, color: cfg.color, lineHeight: 1 }}>{Math.round(finalRisk)}<span style={{ fontSize: 20 }}>%</span></div>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: cfg.color, background: "white", borderRadius: 20, padding: "3px 12px", display: "inline-block", border: `1.5px solid ${cfg.color}` }}>{cfg.label}</div>
          <div style={{ fontSize: 10, color: cfg.textColor, marginTop: 8, lineHeight: 1.4 }}>{cfg.summary}</div>
        </div>

        <div style={{ flex: "0 0 160px", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>Heart Age</div>
          <div style={{ fontSize: 46, fontWeight: 900, color: "#DC2626", lineHeight: 1 }}>{heartAge}</div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>years</div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "#6B7280" }}>Actual Age</span>
              <span style={{ fontWeight: 700, color: "#6366F1" }}>{actualAge || "—"} yrs</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "#6B7280" }}>Difference</span>
              <span style={{ fontWeight: 700, color: riskPenalty > 0 ? "#DC2626" : "#059669" }}>{riskPenalty > 0 ? `+${riskPenalty}` : "0"} yrs</span>
            </div>
          </div>
        </div>

        <div style={{ flex: "0 0 180px", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 10 }}>AI Model Scores</div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: "#4B5563" }}>XGBoost ML</span>
              <span style={{ fontWeight: 700, color: "#6366F1" }}>{Math.round(xgboostRisk)}%</span>
            </div>
            <div style={{ height: 6, background: "#EEF2FF", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${xgboostRisk}%`, background: "#6366F1", borderRadius: 3 }}/>
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
              <span style={{ color: "#4B5563" }}>Framingham</span>
              <span style={{ fontWeight: 700, color: "#059669" }}>{Math.round(framinghamRisk)}%</span>
            </div>
            <div style={{ height: 6, background: "#ECFDF5", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${framinghamRisk}%`, background: "#059669", borderRadius: 3 }}/>
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 8 }}>Final = XGBoost×70% + Framingham×30%</div>
        </div>

        <div style={{ flex: 1, border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 16, background: "#FAFBFF" }}>
          <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>Risk Interpretation</div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{cfg.percentile}</div>
          <div style={{ marginTop: 10, fontSize: 11, color: "#6B7280" }}>
            <div>⚠ This report is AI-generated and is not a medical diagnosis.</div>
            <div style={{ marginTop: 4 }}>Please consult a qualified healthcare professional.</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 32px", marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 10, borderLeft: "4px solid #6366F1", paddingLeft: 10 }}>
          Key Biomarkers Summary
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#F3F4F6" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: "#374151", borderRadius: "8px 0 0 8px" }}>Biomarker</th>
              <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Your Value</th>
              <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Unit</th>
              <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151" }}>Normal Range</th>
              <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, color: "#374151", borderRadius: "0 8px 8px 0" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bioRows.map(({ key, meta, displayVal, statusLabel, style }, i) => (
              <tr key={key} style={{ background: i % 2 === 0 ? "white" : "#FAFBFF", borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "9px 12px", fontWeight: 600, color: "#111827" }}>{meta.label}</td>
                <td style={{ padding: "9px 12px", textAlign: "center", fontWeight: 700, fontSize: 14, color: style.color }}>{displayVal}</td>
                <td style={{ padding: "9px 12px", textAlign: "center", color: "#6B7280" }}>{meta.unit}</td>
                <td style={{ padding: "9px 12px", textAlign: "center", color: "#6B7280" }}>{meta.normal}</td>
                <td style={{ padding: "9px 12px", textAlign: "center" }}>
                  <span style={{ background: style.bg, color: style.color, borderRadius: 20, padding: "2px 10px", fontWeight: 600, fontSize: 11 }}>
                    {statusLabel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: "0 32px", marginBottom: 20, display: "flex", gap: 16 }}>
        <div style={{ flex: 1, background: "#FEF2F2", border: "1.5px solid #FECACA", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>🔴 Key Clinical Insights</div>
          {insights.length > 0
            ? insights.map((item, i) => <div key={i} style={{ fontSize: 11, color: "#374151", marginBottom: 5, paddingLeft: 12, borderLeft: "2px solid #FCA5A5", lineHeight: 1.5 }}>{item}</div>)
            : <div style={{ fontSize: 11, color: "#6B7280" }}>All biomarkers within normal range.</div>}
        </div>
        <div style={{ flex: 1, background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 8 }}>✅ Recommended Actions</div>
          {recommendations.length > 0
            ? recommendations.map((item, i) => <div key={i} style={{ fontSize: 11, color: "#374151", marginBottom: 5, paddingLeft: 12, borderLeft: "2px solid #6EE7B7", lineHeight: 1.5 }}>{item}</div>)
            : <div style={{ fontSize: 11, color: "#6B7280" }}>Continue maintaining your current healthy lifestyle.</div>}
        </div>
      </div>

      <div style={{ padding: "12px 32px", background: "#F8F9FF", borderTop: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#9CA3AF" }}>
        <div>© 2026 Heartica — AI Heart Risk Assessment</div>
        <div>⚠ Not a substitute for professional medical advice. Consult your doctor.</div>
        <div>heartica.ai</div>
      </div>
    </div>
  );
}

export default function DashboardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state?.results;

  if (!results) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#F8F9FF", fontFamily: "Inter, sans-serif" }}>
        <p className="text-gray-500 text-sm">No results found. Please complete an analysis first.</p>
        <button onClick={() => navigate("/")}
          className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" }}>
          Start New Analysis
        </button>
      </div>
    );
  }

  const { final_risk, xgboost_risk, framingham_risk, insights = [], recommendations = [], extracted = {} } = results;
  const mode = location.state?.mode || "manual";
  const formData = location.state?.formData || {};
  const actualAge = location.state?.age ?? formData?.age ?? extracted?.age ?? null;

  const bioValues = {
    total_cholesterol: extracted?.total_cholesterol ?? formData?.totalCholesterol ?? formData?.total_cholesterol ?? null,
    ldl:               extracted?.ldl               ?? formData?.ldl               ?? null,
    hdl:               extracted?.hdl               ?? formData?.hdl               ?? null,
    triglycerides:     extracted?.triglycerides     ?? formData?.triglycerides     ?? null,
    systolic_bp:       extracted?.systolic_bp       ?? formData?.systolic_bp       ?? formData?.systolic   ?? null,
    diastolic_bp:      extracted?.diastolic_bp      ?? formData?.diastolic_bp      ?? formData?.diastolic  ?? null,
    glucose:           extracted?.glucose           ?? formData?.glucose           ?? null,
    hba1c:             extracted?.hba1c             ?? formData?.hba1c             ?? null,
    bmi:               extracted?.bmi               ?? formData?.bmi               ?? null,
  };

  return (
    <div className="min-h-screen relative" style={{ background: "#F8F9FF", fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .screen-only { display: none !important; }
          .print-only { display: block !important; }
          body { margin: 0 !important; padding: 0 !important; background: white !important; }
          @page { margin: 0; size: A4 portrait; }
        }
        @media screen {
          .print-only { display: none !important; }
        }
      `}</style>

      <PrintReport
        actualAge={actualAge}
        finalRisk={final_risk}
        xgboostRisk={xgboost_risk}
        framinghamRisk={framingham_risk}
        bioValues={bioValues}
        insights={insights}
        recommendations={recommendations}
        mode={mode}
      />

      <div className="screen-only">
        <WaveBackground/>
        <Navbar printHidden />

        <div className="no-print relative z-10 flex items-center justify-between px-6 md:px-12 mb-4 gap-4 flex-wrap">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:text-indigo-600 transition flex-shrink-0">
            <ArrowLeft size={14}/>Back to Home
          </button>
          <div className="text-center flex-1 min-w-[260px]">
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={16} color="#059669"/>
              </div>
              <h1 className="text-xl font-extrabold text-gray-900">Your Health Analysis is Ready!</h1>
            </div>
            <p className="text-sm text-gray-500">Here's your personalized heart risk assessment and insights.</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => window.print()}
              className="flex items-center gap-2 text-sm text-gray-600 font-medium px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-indigo-300 transition">
              <Download size={15}/>Export Summary
            </button>
            <button onClick={() => navigate("/")}
              className="flex items-center gap-2 text-sm text-white font-semibold px-4 py-2 rounded-xl"
              style={{ background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" }}>
              <Plus size={15}/>New Analysis
            </button>
          </div>
        </div>

        <div className="relative z-10 px-6 md:px-12 pb-8">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={14} color="#6366F1"/>
                  <h2 className="text-sm font-bold text-gray-900">Risk Overview</h2>
                </div>
                <CircularGauge score={final_risk}/>
              </div>
              <HeartAgeCard actualAge={actualAge} finalRisk={final_risk}/>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                <p className="text-xs font-bold text-gray-700">Model Scores</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">XGBoost ML</span>
                  <span className="text-xs font-bold text-indigo-600">{Math.round(xgboost_risk)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${xgboost_risk}%` }}/>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Framingham</span>
                  <span className="text-xs font-bold text-emerald-600">{Math.round(framingham_risk)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${framingham_risk}%` }}/>
                </div>
                <p className="text-xs text-gray-400">Final = XGBoost×70% + Framingham×30%</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                <ShieldCheck size={16} color="#6366F1" className="flex-shrink-0 mt-0.5"/>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Your data is safe and secure</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {mode === "upload" ? "Uploaded PDFs are discarded after analysis." : "Manual entry processed securely."}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Info size={14} color="#6366F1"/>
                  <h2 className="text-sm font-bold text-gray-900">Key Biomarkers Summary</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.keys(BIOMARKER_META).map(key => (
                    <BiomarkerCard key={key} bioKey={key} value={bioValues[key]}/>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                    <Info size={13} color="#6366F1"/>
                  </div>
                  <h2 className="text-sm font-bold text-gray-900">Clinical Action Advisory</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-bold text-red-600 mb-2">Key Clinical Insights</p>
                    {insights.length > 0 ? (
                      <ul className="flex flex-col gap-2">
                        {insights.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"/>
                            <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-gray-400">No insights available.</p>}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-600 mb-2">Recommended Actions</p>
                    {recommendations.length > 0 ? (
                      <ul className="flex flex-col gap-2">
                        {recommendations.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle size={13} color="#059669" className="flex-shrink-0 mt-0.5"/>
                            <p className="text-xs text-gray-600 leading-relaxed">{item}</p>
                          </li>
                        ))}
                      </ul>
                    ) : <p className="text-xs text-gray-400">No recommendations available.</p>}
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-2 border-t border-gray-100 pt-3">
                  <AlertTriangle size={13} color="#D97706" className="flex-shrink-0 mt-0.5"/>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    This assessment is not a diagnosis. Please consult your doctor for personalized medical advice.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={14} color="#6366F1"/>
                  <h2 className="text-sm font-bold text-gray-900">Risk Factors Impact</h2>
                </div>
                <RadarChart bioValues={bioValues}/>
              </div>
              <AIInterpretation finalRisk={final_risk} insights={insights}/>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-center gap-3">
            <ShieldCheck size={16} color="#6366F1" className="flex-shrink-0"/>
            <p className="text-xs text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Disclaimer: </span>
              This report is AI-generated and is not a substitute for professional medical advice.
              Please consult a qualified healthcare professional before making any health decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}