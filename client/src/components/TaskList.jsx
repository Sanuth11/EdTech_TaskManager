import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onUpdate, onDelete }) {
  if (!tasks?.length) return <div className="text-slate-600">No tasks found.</div>;
  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem key={task._id} task={task} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
