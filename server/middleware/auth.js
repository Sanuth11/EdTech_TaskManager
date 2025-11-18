const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const header = req.header("Authorization");
    const token = header && header.replace("Bearer ", "");
    if (!token) return res.status(401).json({ success: false, message: "Access denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "Invalid token" });

    req.user = user; // attach mongoose doc
    next();
  } catch (err) {
    // JWT verification error or other
    return next(err);
  }
};
