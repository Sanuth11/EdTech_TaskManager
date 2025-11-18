const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner/creator
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date, default: null },
  progress: {
    type: String,
    enum: ["not-started", "in-progress", "completed"],
    default: "not-started"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);
