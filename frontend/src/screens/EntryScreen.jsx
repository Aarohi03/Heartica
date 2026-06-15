import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload, ShieldCheck, Info } from "lucide-react";

// Heart + ECG pulse logo SVG (placeholder until real logo provided)
function HeartLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="12" fill="#EEF2FF"/>
      <path
        d="M22 32s-9-6.5-9-13a6 6 0 0 1 9-5.2A6 6 0 0 1 31 19c0 6.5-9 13-9 13z"
        fill="#6366F1" opacity="0.15"
        stroke="#6366F1" strokeWidth="1.5"
      />
      <polyline
        points="13,22 16,22 18,17 20,27 22,22 24,22 26,19 28,22 31,22"
        fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// Single smooth wave band at bottom
function WaveBackground() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{height: '120px'}}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
        <path
          d="M0,60 C240,20 480,100 720,70 C960,40 1200,90 1440,50 L1440,120 L0,120 Z"
          fill="#E0E7FF" opacity="0.6"
        />
      </svg>
    </div>
  );
}

// Document + Upload illustration
function UploadIllustration() {
  return (
    <div className="relative flex items-end justify-center" style={{height:'64px', width:'72px'}}>
      <div className="absolute" style={{bottom:'12px', left:'0px'}}>
        <svg width="42" height="50" viewBox="0 0 60 72" fill="none">
          <rect x="2" y="2" width="52" height="68" rx="6" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5"/>
          <rect x="10" y="18" width="32" height="3" rx="1.5" fill="#C7D2FE"/>
          <rect x="10" y="26" width="24" height="3" rx="1.5" fill="#C7D2FE"/>
          <rect x="10" y="34" width="28" height="3" rx="1.5" fill="#C7D2FE"/>
        </svg>
      </div>
      <div className="absolute" style={{bottom:'10px', left:'10px'}}>
        <svg width="39" height="46" viewBox="0 0 55 66" fill="none">
          <rect x="2" y="2" width="50" height="62" rx="6" fill="white" stroke="#C7D2FE" strokeWidth="1.5"/>
          <rect x="9" y="16" width="30" height="3" rx="1.5" fill="#E0E7FF"/>
          <rect x="9" y="24" width="22" height="3" rx="1.5" fill="#E0E7FF"/>
          <rect x="9" y="32" width="26" height="3" rx="1.5" fill="#E0E7FF"/>
        </svg>
      </div>
      <div className="absolute" style={{bottom:'0px', right:'0px'}}>
        <div className="bg-indigo-600 rounded-full flex items-center justify-center shadow-lg" style={{width:'28px', height:'28px'}}>
          <Upload size={13} color="white" strokeWidth={2.5}/>
        </div>
      </div>
    </div>
  );
}

// Clipboard + Pencil illustration
function ClipboardIllustration() {
  return (
    <div className="relative flex items-end justify-center" style={{height:'64px', width:'72px'}}>
      <div className="absolute" style={{bottom:'8px', left:'7px'}}>
        <svg width="45" height="53" viewBox="0 0 62 74" fill="none">
          <rect x="2" y="8" width="56" height="64" rx="7" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5"/>
          <rect x="20" y="2" width="22" height="12" rx="4" fill="#6EE7B7" stroke="#A7F3D0" strokeWidth="1.5"/>
          <circle cx="14" cy="30" r="3" fill="#34D399"/>
          <rect x="22" y="28" width="26" height="3" rx="1.5" fill="#A7F3D0"/>
          <circle cx="14" cy="42" r="3" fill="#34D399"/>
          <rect x="22" y="40" width="20" height="3" rx="1.5" fill="#A7F3D0"/>
          <circle cx="14" cy="54" r="3" fill="#34D399"/>
          <rect x="22" y="52" width="23" height="3" rx="1.5" fill="#A7F3D0"/>
        </svg>
      </div>
      <div className="absolute" style={{bottom:'0px', right:'2px'}}>
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#059669"/>
          <path d="M10 22l2-6 10-10 4 4-10 10-6 2z" fill="white" opacity="0.9"/>
          <path d="M20 6l4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function EntryScreen() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen relative overflow-hidden flex flex-col"
      style={{ background: '#F8F9FF', fontFamily: 'Inter, sans-serif' }}
    >
      <WaveBackground />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <HeartLogo />
          <div>
            <div className="font-bold text-gray-900 text-base leading-tight">Heartica</div>
            <div className="text-xs text-gray-500 leading-tight">AI Heart Risk Assessment</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/about')}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Info size={16}/>
          <span>About Heartica</span>
        </button>
      </nav>

      {/* Main content - flex-grow to fill remaining space, justify-center to balance */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 min-h-0">

        {/* Eyebrow badge */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-2 bg-white border border-indigo-100 text-indigo-600 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
            <ShieldCheck size={12}/>
            AI-Powered Heart Risk Assessment
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2 text-center">
          Understand Your Heart.<br/>
          Take{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Control
          </span>
          {' '}of Your Health.
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-3 text-center">
          AI-powered analysis of your health data to assess cardiovascular risk and provide personalized insights.
        </p>

        {/* Divider with label */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px bg-gray-200 w-12 md:w-20"/>
          <span className="text-xs md:text-sm font-semibold text-gray-700">How would you like to provide your health data?</span>
          <div className="h-px bg-gray-200 w-12 md:w-20"/>
        </div>

        {/* Two cards */}
        <div className="max-w-3xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Upload Card */}
          <div className="bg-white rounded-2xl p-5 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <UploadIllustration />
            <h3 className="text-base font-bold text-indigo-600 mt-3 mb-1.5">Upload Medical Reports</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-3">
              Upload up to 3 PDF reports. Our AI will automatically extract values and analyze your risk.
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {['Lipid Profile', 'Blood Sugar', 'Blood Pressure'].map(tag => (
                <span key={tag} className="text-xs text-indigo-500 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate('/upload')}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 text-sm"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}
            >
              <Upload size={15}/>
              Upload Reports
              <ArrowRight size={15}/>
            </button>
          </div>

          {/* Manual Entry Card */}
          <div className="bg-white rounded-2xl p-5 flex flex-col items-center text-center shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
            <ClipboardIllustration />
            <h3 className="text-base font-bold text-emerald-600 mt-3 mb-1.5">Enter Values Manually</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-3">
              Don't have PDFs? Enter the values manually from your printed reports.
            </p>
            <div className="flex-grow"/>
            <button
              onClick={() => navigate('/manual')}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 mt-4 text-sm"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}
            >
              Enter Manually
              <ArrowRight size={15}/>
            </button>
          </div>

        </div>
      </div>

      {/* Footer area */}
      <div className="relative z-10 flex-shrink-0 pb-4">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mb-2">
          <ShieldCheck size={14}/>
          <span>Your data is secure and confidential. It is used only for risk assessment.</span>
        </div>
        <p className="text-gray-400 text-xs text-center mb-1">© 2026 Heartica. All rights reserved.</p>
        <div className="flex items-center justify-center gap-3 text-xs text-indigo-400">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span className="text-gray-300">·</span>
          <a href="#" className="hover:underline">Terms of Use</a>
          <span className="text-gray-300">·</span>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>

    </div>
  );
}