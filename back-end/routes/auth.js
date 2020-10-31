const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Admin = require("./../models/Admin");
const {
  registerValidation,
  loginValidation,
} = require("./../controllers/admin-controller");

dotenv.config();

const router = express.Router();

router.get("/admin", authenticateToken, async (req, res) => {
  const { email } = req.user;
  const admin = await Admin.findOne({ email: email });
  res.json(admin);
});

router.post("/register", async (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExists = await Admin.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).send("Email already exists");
  }

  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

  const admin = new Admin({
    name: name,
    email: email,
    password: hashedPassword,
  });

  try {
    const savedAdmin = await admin.save();
    res.send(savedAdmin);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: email });

  if (!admin) {
    return res.status(400).send("Email or password is wrong");
  }

  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  const user = { email };

  const accessToken = jwt.sign(user, process.env.SECRET_KEY_TO_ACCESS, {
    expiresIn: "9000s",
  });

  res.json({ accessToken, message: "Logged in Successfully" });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader

  if (token === null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_KEY_TO_ACCESS, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;

    next();
  });
}

module.exports = router;
