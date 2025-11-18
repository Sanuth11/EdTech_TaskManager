// server/routes/taskRoutes.js
const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");

const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");

const router = express.Router();

/*
  Schemas
*/
const createSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.date().optional().allow(null)
});

const updateSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.date().optional().allow(null),
  progress: Joi.string().valid("not-started", "in-progress", "completed").optional()
});

/*
  POST /tasks
  - Auth required
  - Server enforces userId = req.user._id (owner = logged-in user)
*/
router.post("/", auth, validateBody(createSchema), async (req, res, next) => {
  try {
    const payload = req.validatedBody;
    const task = await Task.create({
      ...payload,
      userId: req.user._id
    });
    // populate owner info for consistency with GET responses
    await task.populate("userId", "email role").execPopulate?.(); // execPopulate for older mongoose; safe if undefined
    const fresh = await Task.findById(task._id).populate("userId", "email role");
    res.json({ success: true, task: fresh });
  } catch (err) {
    next(err);
  }
});

/*
  GET /tasks
  - Auth required
  - Students: only tasks where userId === student._id
  - Teachers: tasks where userId === teacher._id OR userId in assigned students
  - Response: tasks populated with userId { _id, email, role }
  - Supports optional query params page & limit for pagination
*/
router.get("/", auth, async (req, res, next) => {
  try {
    const user = req.user;
    const { page = 1, limit = 50 } = req.query;

    const p = Math.max(parseInt(page, 10) || 1, 1);
    const l = Math.max(parseInt(limit, 10) || 50, 1);

    if (user.role === "student") {
      const tasks = await Task.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .populate("userId", "email role");
      return res.json({ success: true, tasks });
    }

    // teacher: find assigned students
    const students = await User.find({ teacherId: user._id }).select("_id");
    const studentIds = students.map(s => s._id);

    const query = {
      $or: [
        { userId: user._id }, // teacher's own tasks
        { userId: { $in: studentIds } } // assigned students' tasks
      ]
    };

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .populate("userId", "email role");

    return res.json({ success: true, tasks });
  } catch (err) {
    next(err);
  }
});

/*
  PUT /tasks/:id
  - Auth required
  - Only the owner (task.userId === req.user._id) can update
*/
router.put("/:id", auth, validateBody(updateSchema), async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed to update this task" });
    }

    Object.assign(task, req.validatedBody);
    await task.save();

    const updated = await Task.findById(task._id).populate("userId", "email role");
    return res.json({ success: true, task: updated });
  } catch (err) {
    next(err);
  }
});

/*
  DELETE /tasks/:id
  - Auth required
  - Only the owner (task.userId === req.user._id) can delete
*/
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed to delete this task" });
    }

    await task.deleteOne();
    return res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
