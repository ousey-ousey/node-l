const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const allRoutes = require("./routes/allRoutes");
const addUserRoute = require("./routes/AddUser");
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Explicitly set the views folder
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(cors());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://solomineroo:LK1XQv5dqEGAe8cx@node8expess.oda0f.mongodb.net/all-data?retryWrites=true&w=majority&appName=NODE8Expess",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

// Routes
app.use(allRoutes);
app.use("/user/add.html", addUserRoute);

// Start the server
const startServer = async () => {
  await connectDB(); // Ensures MongoDB connection before starting the server
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
  });
};

startServer();
