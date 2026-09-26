import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Brain, Activity, ShieldCheck, Mail} from "lucide-react";
import Navbar from "../components/Navbar";
export default function AboutScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FF]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft size={16}/>
          Back to Home
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">About Heartica</h1>
        <p className="text-gray-500 leading-relaxed mb-10">
          Heartica is an AI-based heart disease risk assessment system. It combines
          machine learning with established medical formulas to give you a clear,
          personalized picture of your cardiovascular health — using reports you
          already have.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Brain className="text-indigo-600" size={22}/>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Prediction</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              A machine learning model trained on clinical data predicts your heart disease risk probability.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Activity className="text-emerald-600" size={22}/>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Framingham Risk Score</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              A trusted medical formula runs alongside the AI as a second opinion, for added reliability.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Heart className="text-rose-500" size={22}/>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Personalized Insights</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Get plain-language explanations for each biomarker and actionable recommendations tailored to you.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="bg-sky-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="text-sky-600" size={22}/>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Uploaded reports are processed temporarily and deleted after analysis. We don't store your files.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-sm text-amber-800 mb-8">
  <strong>Disclaimer:</strong> Heartica is an academic project and provides AI-generated
  estimates only. It is not a substitute for professional medical advice, diagnosis, or treatment.
</div>

{/* Data & Privacy */}
<div className="mb-8">
  <h2 className="text-xl font-bold text-gray-900 mb-4">
    Your Privacy & Data
  </h2>

  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="bg-indigo-50 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="text-indigo-600" size={21} />
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">
          Privacy First
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed">
          Heartica is designed to minimize the collection of personal
          information. Uploaded medical reports are processed temporarily
          for analysis and are deleted after processing. Health information
          is used to generate your cardiovascular risk assessment.
        </p>
      </div>
    </div>
  </div>
</div>

{/* Terms of Use */}
<div className="mb-8">
  <h2 className="text-xl font-bold text-gray-900 mb-4">
    Terms of Use
  </h2>

  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <p className="text-sm text-gray-500 leading-relaxed">
      Heartica is an AI-based cardiovascular risk estimation tool developed
      as a final year academic project. It is not a certified medical device
      and does not provide medical diagnosis. Risk scores are estimates based
      on statistical models and should not be used as a substitute for
      professional medical advice. Always consult a qualified healthcare
      professional before making decisions about your health.
    </p>
  </div>
</div>

{/* Contact */}
<div className="mb-6">
  <h2 className="text-xl font-bold text-gray-900 mb-4">
    Contact & Feedback
  </h2>

  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
    <p className="text-sm text-gray-500 leading-relaxed mb-5">
      Have feedback, found a bug, or have a question about Heartica?
      Feel free to get in touch.
    </p>

    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href="mailto:aarohi03mathur@gmail.com"
        className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors"
      >
        <Mail size={16} />
        Email Us
      </a>

      <a
  href="https://github.com/Aarohi03/Heartica"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
>
  GitHub
</a>
    </div>

    <p className="text-xs text-gray-400 mt-5">
      Built by Aarohi Mathur with ❤️ as a final year academic project. This tool is intended for educational purposes only and is not a certified medical device. Always consult a qualified healthcare professional for medical advice.
    </p>
  </div>
</div>

      </div>
    </div>
  );
}