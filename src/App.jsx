import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Homepage } from "./pages/Homepage";
import { Register } from "./pages/Register";
import { Report } from "./pages/Report";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/homepage" element={<Homepage />}></Route>
      <Route path="/report" element={<Report />}></Route>
    </Routes>
  );
}

export default App;
