import { Routes, Route } from "react-router";
import Home from "./pages/home";

// Here is where the backend is hosted
export const uri = "http://127.0.0.1:8000";

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
    </Routes>
  );
}

export default App;
