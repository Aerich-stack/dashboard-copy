import express from "express";
import * as AttendanceController from "../controllers/AttendanceController.js";

const router = express.Router();

// Initialize tables
router.post("/init", AttendanceController.initializeTables);

// Attendance CRUD routes
router.post("/", AttendanceController.submitAttendance);
router.get("/", AttendanceController.getAllAttendance);
router.get("/teacher/:teacherId", AttendanceController.getTeacherAttendance);
router.get("/:id", AttendanceController.getAttendanceById);
router.put("/:id", AttendanceController.updateAttendance);
router.patch("/:id/approve", AttendanceController.approveAttendance);
router.delete("/:id", AttendanceController.deleteAttendance);

export default router;
