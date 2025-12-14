import express from "express";
import {
  getAllSalary,
  getSalaryById,
  getSalaryByTeacherId,
  getSalarySummary
} from "../controllers/SalaryController.js";

const router = express.Router();

router.get("/", getAllSalary);
router.get("/summary", getSalarySummary);   // ✅ REQUIRED BY FRONTEND
router.get("/:id", getSalaryById);
router.get("/teacher/:teacherId", getSalaryByTeacherId);

export default router;
