import { Routes, Route } from "react-router";
import Home from "./pages/home";
import Priorities from "./pages/priorities";
import GamePreferences from "./pages/gamePreferences";
import ReviewBuild from "./pages/reviewBuild";
import PCRecommendation from "./pages/pcRecc";
import Sidebar from "./components/Sidebar";

// Here is where the backend is hosted
export const uri = "http://127.0.0.1:8000";

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/priorities" element={<Priorities />} />
            <Route path="/game-preferences" element={<GamePreferences />} />
            <Route path="/review" element={<ReviewBuild />} />
            <Route path="/results" element={<PCRecommendation />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
