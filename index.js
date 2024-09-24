const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const allRoutes = require("./routes/allRoutes");
const addUserRoute = require("./routes/AddUser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000; // Default Vercel port 3000
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

// Create a livereload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch([
  path.join(__dirname, "public"),
  path.join(__dirname, "views"),
]);

// Middleware to inject livereload script
app.use(connectLivereload());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Explicitly set the views folder
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

// Routes
app.use(allRoutes);
app.use("/user/add.html", addUserRoute);

// Start the server
const startServer = () => {
  connectDB(); // Ensures MongoDB connection before starting the server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
  });
};

// Notify browser of changes
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

startServer();
