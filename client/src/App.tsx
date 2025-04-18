import { Routes, Route } from "react-router";

import Header from "./components/Header";
import Home from "./pages/home";
import About from "./pages/about";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
