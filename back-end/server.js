const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const studentRoute = require("./routes/students");
const adminRoute = require("./routes/auth");
const { students } = require("./students");

dotenv.config();

const Student = require("./models/Student");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/students", studentRoute);
app.use("/api/admin", adminRoute);
app.use("/uploads", express.static("uploads"));

mongoose.connect(
  process.env.ATLAS_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log("Connection to database failed");
    } else {
      console.log("Database is successfully connected");
    }
  }
);

const db = mongoose.connection;
db.once("open", async (req, res) => {
  if ((await Student.countDocuments().exec()) > 0) {
    return;
  }

  Student.insertMany(students)
    .then(() => res.json("Students added Successfully"))
    .catch((err) => res.status(400).json("Error in Adding Students", err));
});

app.listen(5000, () => {
  console.log("Server is up and running on 5000");
});
