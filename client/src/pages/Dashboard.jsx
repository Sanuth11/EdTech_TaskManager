import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { getTasks, createTask, updateTask, deleteTask } from "../api";

function getOwnerId(task) {
  // handles both populated and raw ObjectId
  if (!task || !task.userId) return "";
  if (typeof task.userId === "string") return task.userId;
  return task.userId._id;
}

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasks();
      setTasks(res.tasks || []);
    } catch (err) {
      alert(err?.message || "Failed to load tasks");
      if (err?.message === "Access denied") onLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (payload) => {
    try {
      const res = await createTask(payload);
      setTasks(prev => [res.task, ...prev]);
    } catch (e) {
      alert(e?.message || "Create failed");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const res = await updateTask(id, payload);
      setTasks(prev => prev.map(t => (t._id === id ? res.task : t)));
    } catch (e) {
      alert(e?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete task?")) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (e) {
      alert(e?.message || "Delete failed");
    }
  };

  // ------------------------
  // FILTERING
  // ------------------------
  const filtered = tasks.filter(t => (filter === "all" ? true : t.progress === filter));

  // ------------------------
  // TASK SEPARATION FOR TEACHER
  // ------------------------
  let myTasks = filtered;
  let studentTasks = [];

  if (user.role === "teacher") {
    myTasks = filtered.filter(t => getOwnerId(t) === user._id);
    studentTasks = filtered.filter(t => getOwnerId(t) !== user._id);
  }

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white p-4 rounded shadow mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Welcome — {user.email}</h2>
              <p className="text-sm text-slate-600">Role: {user.role}</p>
            </div>

            <div>
              <label className="mr-2">Filter</label>
              <select
                className="p-1 border rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <TaskForm onCreate={handleCreate} />

        {/* -------------------------------------------------- */}
        {/* Teacher View: Separate My Tasks / Student Tasks     */}
        {/* -------------------------------------------------- */}
        {user.role === "teacher" ? (
          <div className="mt-4 space-y-6">

            <section>
              <h3 className="text-xl font-semibold mb-2">My Tasks</h3>
              <TaskList
                tasks={myTasks}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-2">Student's Tasks</h3>
              <TaskList
                tasks={studentTasks}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </section>

          </div>
        ) : (
          // ------------------------
          // Student view (unchanged)
          // ------------------------
          <div className="mt-4">
            <TaskList
              tasks={filtered}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>
    </div>
  );
}
