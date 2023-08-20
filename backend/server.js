const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

dotenv.config({ path: "./config/config.env" });

app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//mongoose connection

mongoose
  .connect(
    process.env.mongo_connection,
    { useUnifiedTopology: true },
    { useNewUrlParser: true }
  )
  .then((data) => {
    console.log(`Database Connected on ${data.connection.host}`);
  })
  .catch((err) => {
    console.log(err.message);
  });

//model initialization

const usersModel = require("./models/user.models");

//routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/contact.html"));
});

app.get("/blogs", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/blogs.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/signup.html"));
});

app.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  const existingEmail = await usersModel.findOne({
    email: email,
  });

  if (existingEmail) {
    res.send("User already exist.. Please Login");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await usersModel.create({
    username,
    email,
    password: hashedPassword,
    confirmPassword: hashedPassword,
  });

  res.status(200).redirect("/login");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) {
    res.send("User not found. Please register to continue.");
    return;
  }

  const comparePassword = await bcrypt.compare(password, getUser.password);

  if (!comparePassword) {
    res.status(400).send("Email and password do not match!");
    return;
  }

  const token = await jwt.sign(
    {
      _id: getUser._id,
      name: getUser.username,
    },
    process.env.jwt_salt
  );

  res.cookie("token", token).redirect("/profile");
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }

  try {
    const verifyToken = jwt.verify(token, process.env.jwt_salt);
    res.sendFile(path.join(__dirname, "../frontend/profile.html"));
  } catch (error) {
    res.status(401).send("Unauthorized: " + error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
