// server/routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose"); // <- ensure mongoose is defined

const User = require("../models/User");
const { validateBody } = require("../middleware/validate");

const router = express.Router();

/*
  Signup validation:
  - email, password, role required
  - teacherId required only when role === "student"
*/
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("student", "teacher").required(),
  teacherId: Joi.when("role", { is: "student", then: Joi.string().required(), otherwise: Joi.forbidden() })
});

// POST /auth/signup
router.post("/signup", validateBody(signupSchema), async (req, res, next) => {
  try {
    const { email, password, role, teacherId } = req.validatedBody;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    // If student, resolve teacher by ObjectId OR by email
    let teacherObjId = null;
    if (role === "student") {
      if (!teacherId) {
        return res.status(400).json({ success: false, message: "teacherId required for student" });
      }

      let teacher = null;

      // First try treating teacherId as ObjectId
      if (mongoose.Types.ObjectId.isValid(teacherId)) {
        teacher = await User.findById(teacherId);
      }

      // If not found by id, try searching by email (fallback)
      if (!teacher) {
        teacher = await User.findOne({ email: teacherId });
      }

      if (!teacher || teacher.role !== "teacher") {
        return res.status(400).json({ success: false, message: "Invalid teacher identifier (provide teacher _id or teacher email)" });
      }

      teacherObjId = teacher._id;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      role,
      teacherId: role === "student" ? teacherObjId : null
    });

    return res.json({ success: true, user: user.toClient() });
  } catch (err) {
    next(err);
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// POST /auth/login
router.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ success: true, token, user: user.toClient() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
