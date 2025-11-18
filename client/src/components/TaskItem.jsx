import React, { useState } from "react";

function formatDate(d) {
  if (!d) return "No due date";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? task.dueDate.slice(0, 10) : ""
  ); // YYYY-MM-DD
  const [saving, setSaving] = useState(false);

  const owner =
    task.userId && typeof task.userId === "object"
      ? `${task.userId.email} (${task.userId.role})`
      : null;

  const save = async () => {
    setSaving(true);
    try {
      await onUpdate(task._id, {
        title,
        description,
        dueDate: dueDate || null,
      });
      setEditing(false);
    } catch (e) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const changeProgress = async (p) => {
    try {
      await onUpdate(task._id, { progress: p });
    } catch (e) {
      alert(e?.message || "Progress update failed");
    }
  };

  return (
    <div className="task-card">
      <div className="task-content">
        {/* ================= VIEW MODE ================= */}
        {!editing ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h4 className="font-semibold">{task.title}</h4>

                {owner && (
                  <div className="text-sm text-slate-500 mt-1">Owner: {owner}</div>
                )}
              </div>

              <div className="text-sm text-slate-500">
                {formatDate(task.dueDate)}
              </div>
            </div>

            <p className="text-slate-600 mt-1">{task.description}</p>
          </>
        ) : (
          <>
            {/* ================= EDIT MODE ================= */}
            <div className="space-y-2">
              <input
                className="w-full p-2 border rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="w-full p-2 border rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* ---- DUE DATE EDIT ---- */}
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </>
        )}

        {/* ================= Progress Dropdown ================= */}
        <div
          className="mt-2"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.9rem",
          }}
        >
          <div>Progress:</div>
          <select
            value={task.progress}
            onChange={(e) => changeProgress(e.target.value)}
            className="p-1 border rounded"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.5rem",
        }}
      >
        {!editing ? (
          <>
            <button
              className="text-sky-600"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>

            <button
              className="text-red-600"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              className="text-green-600"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              className="text-slate-600"
              onClick={() => {
                setEditing(false);
                setTitle(task.title);
                setDescription(task.description || "");
                setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
