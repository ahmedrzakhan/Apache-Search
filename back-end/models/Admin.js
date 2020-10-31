const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, min: 6, max: 255 },
    email: { type: String, required: true, trim: true, min: 6, max: 255 },
    password: { type: String, required: true, trim: true, min: 6, max: 255 },
    date: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Admin", adminSchema);
