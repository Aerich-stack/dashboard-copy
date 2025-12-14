import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Import routes
import teacherRoutes from "./routes/teacherRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import teachingLoadRoutes from "./routes/teachingLoadRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dbRoutes from "./routes/dbRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Import models
import * as Teacher from "./models/Teacher.js";
import * as Attendance from "./models/AttendanceModel.js";
import * as TeachingLoad from "./models/TeachingLoad.js";
import * as Salary from "./models/Salary.js";
import * as Notification from "./models/Notification.js";
import * as Message from "./models/Message.js";

// Email service
import { sendPasswordResetEmail } from "./utils/emailService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5601;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ Backend is running!");
});



// Database connection + table initialization
let db;
const initializeDatabase = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log("✅ Connected to database!");

    await Teacher.createTeacherTable(db);
    await Attendance.createAttendanceTable(db);
    await TeachingLoad.createTeachingLoadTable(db);
    await Salary.createSalaryTable(db);
    await Notification.createNotificationsTable(db);
    await Message.createMessagesTable(db);

    console.log("✅ Database tables initialized!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  }
};

initializeDatabase();

// ✅ Correct route mounting
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/teaching-load", teachingLoadRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/db", dbRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Admin forgot-password
app.post("/api/admin/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "Email is required" });

  if (email === "admin@school.com") {
    try {
      const token = "temp-reset-token-" + Date.now();
      const adminName = "Administrator";
      await sendPasswordResetEmail(email, token, adminName);
      res.status(200).json({
        success: true,
        message: "Check your email for reset instructions",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ success: false, message: "Error sending email" });
    }
  } else {
    res.status(200).json({
      success: true,
      message: "If the account exists, reset instructions have been sent",
    });
  }
});

// Admin change-password
app.put("/api/admin/:id/change-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current and new password are required",
    });
  }

  if (currentPassword === "admin123") {
    console.log("Admin password changed");
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

export default app;
    