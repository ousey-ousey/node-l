const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const allRoutes = require("../routes/allRoutes"); // Declared once here
const addUserRoute = require("../routes/AddUser");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Explicitly set the views folder
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));
app.use(cors());

console.log(fs.readdirSync(path.join(__dirname, "routes"))); // Log the content of the routes folder

// MongoDB Connection
let cachedDb = null; // Caching the DB connection

const connectDB = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
    cachedDb = db;
    return db;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

// Routes
app.use(allRoutes);
app.use("/user/add.html", addUserRoute);

// Export the app as a Vercel function
module.exports = async (req, res) => {
  await connectDB(); // Ensure DB connection before handling requests
  return app(req, res); // Handle the request using the Express app
};
