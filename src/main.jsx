import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import User from "./Pages/User.jsx";
import Edit from "./Pages/Edit.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/user" element={<User />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </Router>
  </StrictMode>
);
