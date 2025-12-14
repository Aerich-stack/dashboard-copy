import express from "express";
import db from "../config/db.js";



// ✅ Dashboard Stats Route
router.get("/stats", async (req, res) => {
  try {
    const [teachers] = await db.query("SELECT COUNT(*) AS total FROM teachers");
    const [attendance] = await db.query("SELECT COUNT(*) AS total FROM attendance");
    const [salary] = await db.query("SELECT COUNT(*) AS total FROM salary");
    const [loads] = await db.query("SELECT COUNT(*) AS total FROM teaching_load");

    res.json({
      success: true,
      data: {
        teachers: teachers[0].total,
        attendance: attendance[0].total,
        salary: salary[0].total,
        teaching_loads: loads[0].total
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
const express = require("express");
const router = express.Router();
const { Attendance, Salary } = require("../models");
const { sequelize } = require("../models");

// ✅ Dashboard Stats
router.get("/stats", async (req, res) => {
  try {
    const totalSubmissions = await Attendance.count();
    const pendingAttendance = await Attendance.count({
      where: { status: "pending" },
    });
    const verifiedHours = await Attendance.sum("hours", {
      where: { status: "approved" },
    });

    res.json({
      success: true,
      data: {
        totalSubmissions,
        pendingAttendance,
        verifiedHours: verifiedHours || 0,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({
      success: false,
      message: "Dashboard stats error",
    });
  }
});

// ✅ Salary Summary (Bar Chart)
router.get("/salary-summary", async (req, res) => {
  try {
    const rows = await Salary.findAll({
      attributes: [
        "teacher_name",
        [sequelize.fn("SUM", sequelize.col("net_salary")), "total"],
      ],
      group: ["teacher_name"],
    });

    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Salary summary error:", err);
    res.status(500).json({
      success: false,
      message: "Salary summary error",
    });
  }
});

// ✅ Attendance Summary (Pie Chart)
router.get("/attendance-summary", async (req, res) => {
  try {
    const approved = await Attendance.count({
      where: { status: "approved" },
    });
    const pending = await Attendance.count({
      where: { status: "pending" },
    });

    res.json({
      success: true,
      data: [
        { name: "Approved", value: approved },
        { name: "Pending", value: pending },
      ],
    });
  } catch (err) {
    console.error("Attendance summary error:", err);
    res.status(500).json({
      success: false,
      message: "Attendance summary error",
    });
  }
});

module.exports = router;
