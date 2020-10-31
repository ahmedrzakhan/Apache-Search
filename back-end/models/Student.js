const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    blood_group: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Student", studentSchema);
