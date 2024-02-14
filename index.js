require("dotenv").config();
const express = require("express");
const app = express();

const serviceConnectMongoDB = require("./src/database/serviceConnectDatabase.js");
const authRoutes = require("./src/routes/auth.js");
const userRoutes = require("./src/routes/user.js");
const activityRoutes = require("./src/routes/activity.js");
const taskRoutes = require("./src/routes/task.js");
const adminRoutes = require("./src/routes/admin.js");
const settingRoutes = require("./src/routes/setting.js");

// CONNECT MONGO
serviceConnectMongoDB();

// CAPTURE REQ BODY
app.use(express.json());

// CORS MANAGEMENT
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.SUPPORTED_ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Max-Age", "3600");
  next();
});

// ROUTES
app.use("/admin", adminRoutes);
app.use("/setting", settingRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/activity", activityRoutes);
app.use("/task", taskRoutes);

// Landing
app.get("/", (req, res) => {
  res.send("<h1>MUSAcolor back end</h1>");
});

module.exports = app;
