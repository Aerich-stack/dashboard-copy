import express from "express";
import * as TeacherController from "../controllers/TeacherController.js";

const router = express.Router();

// Initialize tables
router.post("/init", TeacherController.initializeTables);

// Teacher CRUD routes
router.post("/", TeacherController.createTeacher);
router.get("/", TeacherController.getAllTeachers);
router.post("/login", TeacherController.loginTeacher);
router.post("/forgot-password", TeacherController.forgotPassword);
router.put("/reset-password", TeacherController.resetPassword);
router.get("/:id", TeacherController.getTeacherById);
router.put("/:id", TeacherController.updateTeacher);
router.put("/:id/change-password", TeacherController.changePassword);
router.delete("/:id", TeacherController.deleteTeacher);

export default router;
