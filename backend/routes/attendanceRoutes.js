import express from "express";
import {
  getAttendanceSummary,
  getAllAttendanceController,
  getAttendanceByIdController,
  getAttendanceByTeacherIdController

} from "../controllers/AttendanceController.js";

const router = express.Router();

router.get("/", getAllAttendanceController);
router.get("/summary", getAttendanceSummary);
router.get("/:id", getAttendanceByIdController);
router.get("/teacher/:teacherId", getAttendanceByTeacherIdController);


export default router;
