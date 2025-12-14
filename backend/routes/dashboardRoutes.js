import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ DB config
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

// ✅ 1. Dashboard Stats
router.get("/stats", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);

    const [total] = await db.execute("SELECT COUNT(*) AS total FROM attendance");
    const [pending] = await db.execute(
      "SELECT COUNT(*) AS pending FROM attendance WHERE status = 'pending'"
    );
    const [hours] = await db.execute(
      "SELECT SUM(hours) AS verifiedHours FROM attendance WHERE status = 'approved'"
    );

    res.json({
      success: true,
      data: {
        totalSubmissions: total[0].total,
        pendingAttendance: pending[0].pending,
        verifiedHours: hours[0].verifiedHours || 0,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false, message: "Dashboard stats error" });
  }
});

// ✅ 2. Attendance Summary
router.get("/attendance-summary", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);

    const [approved] = await db.execute(
      "SELECT COUNT(*) AS approved FROM attendance WHERE status = 'approved'"
    );
    const [pending] = await db.execute(
      "SELECT COUNT(*) AS pending FROM attendance WHERE status = 'pending'"
    );

    res.json({
      success: true,
      data: [
        { name: "Approved", value: approved[0].approved },
        { name: "Pending", value: pending[0].pending },
      ],
    });
  } catch (err) {
    console.error("Attendance summary error:", err);
    res.status(500).json({ success: false, message: "Attendance summary error" });
  }
});

// ✅ 3. Salary Summary
router.get("/salary-summary", async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);

    const [rows] = await db.execute(
      "SELECT teacher_name, SUM(net_salary) AS total FROM salary GROUP BY teacher_name"
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Salary summary error:", err);
    res.status(500).json({ success: false, message: "Salary summary error" });
  }
});

export default router;
