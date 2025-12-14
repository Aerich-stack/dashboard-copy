import express from "express";
import {
  getAllAttendance,
  getAttendanceById,
  getAttendanceByTeacherId,
  getAttendanceSummary
} from "../controllers/AttendanceController.js";

const router = express.Router();

router.get("/", getAllAttendance);
router.get("/summary", getAttendanceSummary);   // ✅ REQUIRED BY FRONTEND
router.get("/:id", getAttendanceById);
router.get("/teacher/:teacherId", getAttendanceByTeacherId);

export default router;
