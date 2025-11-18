const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/*
 GET /users?role=teacher
 - Public endpoint (no auth required) but can be restricted. For simplicity, keep public.
 - Returns list of teachers (id + email)
*/
router.get("/", async (req, res, next) => {
  try {
    const { role } = req.query;
    const q = {};
    if (role) q.role = role;
    const users = await User.find(q).select("_id email role teacherId");
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
