import { BrowserRouter, Routes, Route } from "react-router-dom";
import EntryScreen from "./screens/EntryScreen";
import AboutScreen from "./screens/AboutScreen";
import UploadScreen from "./screens/UploadScreen";
import ManualEntryScreen from "./screens/ManualEntryScreen";
import ProcessingScreen from "./screens/ProcessingScreen";
import DashboardScreen from "./screens/DashboardScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/upload" element={<UploadScreen />} />
        <Route path="/manual" element={<ManualEntryScreen />} />
        <Route path="/processing" element={<ProcessingScreen />} />
        <Route path="/results" element={<DashboardScreen />} />
      </Routes>
    </BrowserRouter>
  );
}