module.exports = (err, req, res, next) => {
  console.error(err);
  // If Joi validation error
  if (err && err.isJoi) {
    return res.status(400).json({ success: false, message: err.details?.[0]?.message || err.message });
  }
  // JWT errors
  if (err && err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
  // Mongoose validation / cast errors
  if (err && err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  // Catch all
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
};
