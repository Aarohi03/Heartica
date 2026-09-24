import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck, CheckCircle2, Heart, Info, AlertTriangle } from "lucide-react";
import Navbar from "../components/Navbar";
import { pendingFiles } from "./UploadScreen";

const steps = [
  { title: "Reviewing your health details",      desc: "Looking through the information you provided carefully" },
  { title: "Understanding your health markers",  desc: "Checking important values related to your heart health" },
  { title: "Calculating your heart risk",        desc: "Analyzing your data to estimate your current risk level" },
  { title: "Preparing your health insights",     desc: "Creating your personalized heart health report" },
];

const API_BASE =
 import.meta.env.VITE_API_BASE ||
 (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
 ? "http://127.0.0.1:8000"
 : `http://${window.location.hostname}:8000`
);
const STEP_DURATION_MS = 2000;

export default function ProcessingScreen() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const requestData = location.state;

  const [currentStage, setCurrentStage] = useState(0);
  const [animationDone, setAnimationDone] = useState(false);
  const [apiResult,     setApiResult]     = useState(null);
  const [apiError,      setApiError]      = useState(null);
  const navigatedRef = useRef(false);

  // Cosmetic step-by-step animation
  useEffect(() => {
    if (!requestData) return;
    let stage = 0;
    setCurrentStage(0);
    const interval = setInterval(() => {
      stage += 1;
      if (stage > steps.length - 1) {
        clearInterval(interval);
        setAnimationDone(true);
        return;
      }
      setCurrentStage(stage);
    }, STEP_DURATION_MS);
    return () => clearInterval(interval);
  }, [requestData]);

  // Real API call
  useEffect(() => {
    if (!requestData) return;

    async function runAnalysis() {
      try {
        let response;

        if (requestData.mode === "manual") {
          response = await fetch(`${API_BASE}/analyze`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(requestData.formData),
          });

        } else if (requestData.mode === "upload") {
          if (!pendingFiles.lipid && !pendingFiles.sugar && !pendingFiles.pressure) {
            throw new Error("No files found. Please go back and upload your reports again.");
          }

          const { age, sex, smoking, family_history } = requestData;
          const params = new URLSearchParams({
            age: String(age), sex, smoking, family_history,
          });

          const body = new FormData();
          if (pendingFiles.lipid)    body.append("lipid_file",    pendingFiles.lipid);
          if (pendingFiles.sugar)    body.append("sugar_file",    pendingFiles.sugar);
          if (pendingFiles.pressure) body.append("pressure_file", pendingFiles.pressure);

          response = await fetch(`${API_BASE}/analyze-pdf?${params.toString()}`, {
            method: "POST",
            body,
          });

        } else {
          throw new Error("Unknown analysis mode.");
        }

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Server responded with ${response.status}: ${text}`);
        }

        const data = await response.json();
        setApiResult(data);
        // Clear any transient error once we have a real result
        setApiError(null);

      } catch (err) {
        console.error("Analysis request failed:", err);
        // Only show error if we don't already have a result
        setApiError(prev => prev === null ? (err.message || "Something went wrong.") : prev);
      }
    }

    runAnalysis();
  }, [requestData]);

  // Navigate once BOTH animation AND API are done
  useEffect(() => {
    if (navigatedRef.current) return;
    if (animationDone && apiResult) {
      navigatedRef.current = true;
      setTimeout(() => {
        navigate("/results", {
          state: {
            results:  apiResult,
            mode:     requestData?.mode,
            age:      requestData?.age,          // ← pass age through for dashboard
            formData: requestData?.formData || {},
          },
        });
      }, 500);
    }
  }, [animationDone, apiResult, navigate, requestData]);

  // If API result already arrived but animation is still running — keep waiting silently.
  // Only show error if animation is done AND we still have no result.
  const showError = apiError && animationDone && !apiResult;

  const progress = requestData
    ? Math.round(((currentStage + (animationDone ? 1 : 0)) / steps.length) * 100)
    : 0;

  const getStatus = (index) => {
    if (animationDone)          return "completed";
    if (index < currentStage)   return "completed";
    if (index === currentStage) return "in-progress";
    return "pending";
  };

  function handleBack() {
    const source = sessionStorage.getItem("analysisSource");
    navigate(source === "manual" ? "/manual" : "/upload");
  }

  if (!requestData) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-[#F8FAFF] px-6 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-500" />
        <h2 className="text-lg font-bold text-gray-900">No analysis data found</h2>
        <p className="text-sm text-gray-500 max-w-sm">
          It looks like you navigated here directly. Please start from the upload or manual entry screen.
        </p>
        <button onClick={() => navigate("/")}
          className="mt-2 px-5 py-2 rounded-xl text-white text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" }}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8FAFF] overflow-hidden relative flex flex-col">
      <div className="absolute bottom-0 left-0 w-full h-[130px] bg-[#EEF2FF] rounded-t-[100%] z-0" />

      <Navbar />

      <div className="relative z-10 flex-1 flex flex-col px-6 md:px-12 min-h-0">
        <div className="mb-3">
          <button onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm w-fit">
            <ArrowLeft size={12} /> Back
          </button>
        </div>

        <div className="text-center mt-1">
          <h2 className="text-[30px] font-bold text-[#0F172A] leading-tight">
            Preparing Your Heart Health Report
          </h2>
          <p className="mt-3 text-[15px] text-[#667085] leading-7">
            We're reviewing your health information and preparing your personalized heart risk report.<br/>
            This will only take a few moments.
          </p>
        </div>

        <div className="h-[10px]" />

        <div className="bg-white rounded-[26px] mt-3 border border-[#EAECF0] shadow-sm px-8 py-4 min-h-[335px] max-w-4xl mx-auto w-full flex-shrink-0">
          <h3 className="text-center text-[16px] font-semibold text-[#111827]">
            {showError ? "Something went wrong" : "Almost ready... Please wait"}
          </h3>

          {showError ? (
            <div className="mt-4 flex flex-col items-center gap-3 text-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <p className="text-sm text-gray-600 max-w-md">{apiError}</p>
              <button onClick={handleBack}
                className="mt-2 px-5 py-2 rounded-xl text-white text-xs font-semibold"
                style={{ background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)" }}>
                Go Back and Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="mt-4 flex items-center gap-5">
                <div className="flex-1 h-[9px] rounded-full bg-[#ECEBFF] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#4C1DFF] to-[#6D28FF] transition-all duration-500"
                    style={{ width: `${progress}%` }}/>
                </div>
                <span className="text-[16px] font-semibold text-[#5B4BFF] min-w-[48px]">{progress}%</span>
              </div>

              <div className="mt-4 space-y-3 px-2">
                {steps.map((step, index) => {
                  const status = getStatus(index);
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <Heart className={`w-6 h-6 ${
                            status === "completed" || status === "in-progress"
                              ? "text-[#FF295E] fill-[#FF295E]" : "text-[#98A2B3]"
                          }`}/>
                          {status === "completed" && (
                            <CheckCircle2 className="absolute -bottom-1 -right-1 w-3 h-3 text-[#FF295E] bg-white rounded-full"/>
                          )}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-medium text-[#101828]">{step.title}</h4>
                          <p className="text-[11px] text-[#667085] mt-1">{step.desc}</p>
                        </div>
                      </div>
                      <div>
                        {status === "completed" && (
                          <span className="px-4 py-1.5 rounded-full bg-[#DDF8E8] text-[#039855] text-[12px] font-medium">Completed</span>
                        )}
                        {status === "in-progress" && (
                          <span className="px-4 py-1.5 rounded-full bg-[#FFE4EC] text-[#E11D48] text-[12px] font-medium">In Progress</span>
                        )}
                        {status === "pending" && (
                          <span className="px-4 py-1.5 rounded-full bg-[#F2F4F7] text-[#667085] text-[12px] font-medium">Pending</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="mt-3 mb-3 bg-white rounded-[18px] border border-[#EAECF0] px-5 py-3 flex items-center gap-4 shadow-sm max-w-4xl mx-auto w-full">
          <div className="w-9 h-9 rounded-full bg-[#F4F3FF] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#5B4BFF]" />
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-[#111827]">Your data is safe and secure</h4>
            <p className="text-[11px] text-[#667085] mt-1">
              All information is encrypted and processed securely. We never store your files or personal data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}