const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const allRoutes = require("./routes/allRoutes"); // Correct path
const addUserRoute = require("./routes/AddUser"); // Correct path

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
const fs = require("fs");

console.log(fs.readdirSync(path.join(__dirname, "routes"))); // Log the content of the routes folder

// Routes
app.use(allRoutes);
app.use("/user/add.html", addUserRoute);

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

// Export the app as a Vercel function
module.exports = async (req, res) => {
  await connectDB(); // Ensure DB connection before handling requests
  return app(req, res); // Handle the request using the Express app
};
