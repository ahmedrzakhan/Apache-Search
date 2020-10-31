const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { body } = require("express-validator");
const Student = require("./../models/Student");
const {
  getStudents,
  addStudent,
  updateStudentDetails,
  deleteStudent,
} = require("./../controllers/student-controller");

router.get("/", paginatedResults(Student), getStudents);

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.prev = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      results.current = await model.find().limit(limit).skip(startIndex).exec();
      results.totalCount = await model.countDocuments().exec();
      res.pagination = results;
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post(
  "/add",
  upload.single("studentImage"),
  [body("email").isEmail(), body("name").isLength({ min: 2 })],
  addStudent
);

router.post("/update/:id", updateStudentDetails);

router.delete("/delete/:id", deleteStudent);

module.exports = router;
