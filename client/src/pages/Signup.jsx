// src/pages/Signup.jsx
import React, { useState, useEffect } from "react";
import { authSignup, getUsers } from "../api";

export default function Signup({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [teacherId, setTeacherId] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch teachers for dropdown (robust: try getUsers() then fallback to direct fetch)
  useEffect(() => {
    let mounted = true;

    async function fetchTeachers() {
      try {
        // Try API helper first (if present)
        if (typeof getUsers === "function") {
          const res = await getUsers("role=teacher"); // expecting { users: [...] } or { teachers: [...] }
          const list = res?.users || res?.teachers || [];
          if (mounted) setTeachers(list);
          return;
        }

        // Fallback: direct fetch to /auth/teachers
        const base = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const r = await fetch(`${base}/auth/teachers`);
        const data = await r.json();
        const list = data?.teachers || data?.users || [];
        if (mounted) setTeachers(list);
      } catch (e) {
        console.error("Failed to load teachers", e);
        if (mounted) setTeachers([]);
      }
    }

    fetchTeachers();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (role === "teacher") setTeacherId("");
  }, [role]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const payload = { email, password, role };
      if (role === "student") payload.teacherId = teacherId;

      await authSignup(payload);
      alert("Signup successful! Please login.");
      onSwitch();
    } catch (e) {
      // backend error object may vary — handle common shapes
      const message = e?.message || e?.error || e?.msg || "Signup failed";
      setErr(message);
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

        <h1 className="text-2xl font-semibold mb-4">Sign up</h1>

        {err && <div className="text-red-600 mb-3">{err}</div>}

        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />

          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {/* Role Selection */}
          <div>
            <label className="mr-3">
              <input
                type="radio"
                checked={role === "student"}
                onChange={() => setRole("student")}
              />{" "}
              Student
            </label>

            <label className="ml-3">
              <input
                type="radio"
                checked={role === "teacher"}
                onChange={() => setRole("teacher")}
              />{" "}
              Teacher
            </label>
          </div>

          {/* Teacher Dropdown */}
          {role === "student" && (
            <select
              className="w-full p-2 border rounded"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
            >
              <option value="">Select Teacher</option>
              {teachers.length === 0 && <option value="">No teachers available</option>}
              {teachers.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.email}
                </option>
              ))}
            </select>
          )}

          <button
            className="w-full bg-green-600 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button className="text-sky-600" onClick={onSwitch}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
