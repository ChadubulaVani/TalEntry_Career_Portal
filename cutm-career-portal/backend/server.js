// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Existing route
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// New routes for Student Dashboard
import dashboardRoutes from "./routes/dashboard.js";
import jobsRoutes from "./routes/jobs.js";
import applicationsRoutes from "./routes/applications.js";
import resumeRoutes from "./routes/resume.js";
import notificationsRoutes from "./routes/notifications.js";


dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-vercel-app.vercel.app"
    ],
    credentials: true
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded resume files
app.use("/api/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🎉 CUTM Career Portal Backend is running!");
});

// API Routes
app.use("/api/users", userRoutes); // existing
app.use("/api/dashboard", dashboardRoutes); // profile summary + stats
app.use("/api/jobs", jobsRoutes); // job listings + apply
app.use("/api/applications", applicationsRoutes); // applications tracker
app.use("/api/resume", resumeRoutes); // resume upload/download
app.use("/api/notifications", notificationsRoutes); // notifications

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully!");
    console.log("Connected DB Name:", mongoose.connection.name);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
