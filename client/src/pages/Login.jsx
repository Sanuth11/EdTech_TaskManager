import React, { useState } from "react";
import { authLogin } from "../api";

export default function Login({ onSwitch, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const data = await authLogin({ email, password });
      onLogin(data);
    } catch (e) {
      setErr(e?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

        {/* Project Title */}
        <div className="w-full flex justify-center mb-6">
          <div className="text-3xl font-bold flex items-center gap-2 text-slate-800">
            <span style={{ fontSize: "34px" }}>📘</span>
            <span>EdTech Task Manager</span>
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        {err && <div className="text-red-600 mb-3">{err}</div>}

        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-sky-600 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          New user?{" "}
          <button className="text-green-600" onClick={onSwitch}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
