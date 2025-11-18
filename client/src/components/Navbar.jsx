import React from "react";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="w-full bg-white shadow p-4 mb-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        
        {/* Project Title */}
        <div className="text-2xl font-bold flex items-center gap-2">
          <span style={{ fontSize: "28px" }}>📘</span>
          <span>EdTech Task Manager</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <span className="text-slate-600">{user?.email}</span>

          <button
  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
  onClick={onLogout}
>
  Logout
</button>
        </div>
      </div>
    </nav>
  );
}
