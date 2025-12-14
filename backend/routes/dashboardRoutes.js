import express from "express";
import db from "../config/db.js";

const router = express.Router();

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
