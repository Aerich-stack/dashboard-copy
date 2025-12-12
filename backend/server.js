import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import teacherRoutes from "./routes/teacherRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import teachingLoadRoutes from "./routes/teachingLoadRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import dbRoutes from "./routes/dbRoutes.js";

// Import models to initialize tables
import * as Teacher from "./models/Teacher.js";
import * as Attendance from "./models/Attendance.js";
import * as TeachingLoad from "./models/TeachingLoad.js";
import * as Salary from "./models/Salary.js";
import * as Notification from "./models/Notification.js";
import * as Message from "./models/Message.js";

// Import email service
import { sendPasswordResetEmail, verifyEmailConnection } from "./utils/emailService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize all database tables on startup
const initializeDatabaseTables = () => {
  console.log("Initializing database tables...");
  Teacher.createTeacherTable();
  Attendance.createAttendanceTable();
  TeachingLoad.createTeachingLoadTable();
  Salary.createSalaryTable();
  Notification.createNotificationsTable();
  Message.createMessagesTable();
};

// Call initialization on server start
initializeDatabaseTables();

// Routes
app.use("/api/teachers", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/teaching-load", teachingLoadRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/db", dbRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Admin forgot-password endpoint with email
app.post("/api/admin/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
  
  // Demo admin email check - in production, check against admin DB
  if (email === 'admin@school.com') {
    try {
      const token = 'temp-reset-token-' + Date.now();
      const adminName = 'Administrator';
      await sendPasswordResetEmail(email, token, adminName);
      res.status(200).json({ success: true, message: 'Check your email for reset instructions' });
    } catch (error) {
      console.error('Error sending password reset email to admin:', error);
      res.status(500).json({ success: false, message: 'Error sending email' });
    }
  } else {
    // Security: return success even if email doesn't exist
    res.status(200).json({ success: true, message: 'If the account exists, reset instructions have been sent' });
  }
});

// Admin change-password endpoint
app.put("/api/admin/:id/change-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Current and new password are required' });
  }
  
  // Simple demo admin password check - in production use hashing
  if (currentPassword === 'admin123') {
    // In production, store the hashed password
    console.log('Admin password changed');
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
