import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [route, setRoute] = useState(() => localStorage.getItem("route") || "login");
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    localStorage.setItem("route", route);
  }, [route]);

  const handleLogin = ({ token, user }) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    setRoute("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setRoute("login");
  };

  if (route === "login")
    return <Login onSwitch={() => setRoute("signup")} onLogin={handleLogin} />;

  if (route === "signup")
    return <Signup onSwitch={() => setRoute("login")} onSignup={handleLogin} />;

  return <Dashboard token={token} user={user} onLogout={handleLogout} />;
}
