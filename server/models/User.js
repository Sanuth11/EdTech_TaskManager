const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null } // required for students at signup validation level
}, { timestamps: true });

// remove passwordHash when converting to JSON
userSchema.methods.toClient = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
