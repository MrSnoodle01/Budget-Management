import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";

type tokenPayload = {
  exp: number;
}

function App() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const decoded = jwtDecode<tokenPayload>(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        localStorage.removeItem("token");
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    } catch {
      localStorage.removeItem("token");
      setLoggedIn(false);
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem("token");
    setLoggedIn(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={loggedIn ? <DashboardPage API_URL={API_URL} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={loggedIn ? <Navigate to="/" replace /> : <LoginPage API_URL={API_URL} setLoggedIn={setLoggedIn} />} />
        <Route path="/signup" element={loggedIn ? <Navigate to="/" replace /> : <SignupPage API_URL={API_URL} setLoggedIn={setLoggedIn} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;