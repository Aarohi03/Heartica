import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar({ compact = false, printHidden = false }) {
  const navigate = useNavigate();

  return (
    <nav
      className={`${printHidden ? "no-print " : ""}relative z-10 flex items-center justify-between px-6 md:px-12 ${compact ? "py-3" : "py-4"} flex-shrink-0`}
    >
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="Heartica logo" className="h-10 w-auto" />
        <div>
          <div className="font-bold text-gray-900 text-base leading-tight">Heartica</div>
          <div className="text-xs text-gray-500 leading-tight">AI Heart Risk Assessment</div>
        </div>
      </div>
      <button
        onClick={() => navigate("/about")}
        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <Info size={16} />
        <span>About Heartica</span>
      </button>
    </nav>
  );
}