import React, { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    setLoading(true);
    try {
      await onCreate({ title, description, dueDate: dueDate || null });
      setTitle(""); setDescription(""); setDueDate("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <h3 className="font-medium mb-2">Create Task</h3>
      <div className="grid grid-cols-1 gap-2">
        <input className="p-2 border rounded" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="p-2 border rounded" placeholder="Description (optional)" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="p-2 border rounded" type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        <button className="bg-sky-600 text-white p-2 rounded" disabled={loading}>{loading ? "Creating..." : "Create Task"}</button>
      </div>
    </form>
  );
}
