import { Routes, Route } from "react-router";

import Header from "./components/Header";
import Home from "./pages/home";
import Users from "./pages/users";

// Here is where the backend is hosted
// No useState here for the variable because uri never changes. Th
export const uri = "http://127.0.0.1:5000";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="users" element={<Users />} />
      </Routes>
    </>
  );
}

export default App;
