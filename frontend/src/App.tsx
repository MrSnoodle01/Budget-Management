import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("token") !== null);

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        {loggedIn ? (
          <Route path="/" element={<DashboardPage API_URL={API_URL} onLogout={handleLogout} />} />
        ) : (
          <>
            <Route path="/login" element={<LoginPage API_URL={API_URL} setLoggedIn={setLoggedIn} />} />
            <Route path="/signup" element={<SignupPage API_URL={API_URL} setLoggedIn={setLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App;