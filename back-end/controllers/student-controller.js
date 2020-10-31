const { validationResult } = require("express-validator");
const Student = require("./../models/Student");
// GET Students
const getStudents = (req, res) => {
  res.json(res.pagination);
};

// ADD Student
const addStudent = (req, res) => {
  const { name, blood_group, city, email, gender } = req.body;
  const { path: studentImage } = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newStudent = new Student({
    name,
    blood_group,
    city,
    email,
    image: studentImage,
    gender,
  });
  newStudent
    .save()
    .then((student) =>
      res.json({ student, message: "Student added successfully" })
    )
    .catch((err) => console.log(err));
};

// UPDATE Student
const updateStudentDetails = (req, res) => {
  Student.findById(req.params.id)
    .then((student) => {
      (student.name = req.body.name),
        (student.email = req.body.email),
        (student.blood_group = req.body.blood_group),
        (student.city = req.body.city),
        (student.gender = req.body.gender);
      student.image = req.body.image;
      student
        .save()
        .then((student) =>
          res.json({ student, message: "Student details updated successfully" })
        )
        .catch((err) => console.log("Error in finding student details", err));
    })
    .catch((err) =>
      res.status(400).json("Error in updating student details: ", err)
    );
};

// DELETE Student
const deleteStudent = (req, res) => {
  Student.findByIdAndDelete(req.params.id)
    .then((student) => {
      res.json({ student, message: "Student Successfully deleted" });
    })
    .catch((err) => res.status(400).json("Error in Deleting Student", err));
};

module.exports = {
  getStudents,
  addStudent,
  updateStudentDetails,
  deleteStudent,
};
