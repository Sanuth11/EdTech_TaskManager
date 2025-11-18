import React, { useState, useEffect } from "react";
import { authSignup } from "../api";

export default function Signup({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [teacherId, setTeacherId] = useState("");
  const [teacherList, setTeacherList] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch teachers for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/auth/teachers")
      .then((res) => res.json())
      .then((data) => setTeacherList(data.teachers || []));
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
      setErr(e?.message || "Signup failed");
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
          />

          <input
            className="w-full p-2 border rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            >
              <option value="">Select Teacher</option>
              {teacherList.map((t) => (
                <option key={t._id} value={t._id}>
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
