import { BrowserRouter, Routes, Route } from "react-router-dom";
import EntryScreen from "./screens/EntryScreen";
import AboutScreen from "./screens/AboutScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EntryScreen />} />
        <Route path="/about" element={<AboutScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;