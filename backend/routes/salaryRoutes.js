import express from "express";
import {
  getAllSalaryController,
  getSalaryByIdController,
  getSalaryByTeacherIdController,
  createSalaryController,
  updateSalaryController,
  finalizeSalaryController,
  deleteSalaryController,
  getSalarySummaryByPeriodController
} from "../controllers/SalaryController.js";

const router = express.Router();

// ✅ Specific routes FIRST
router.get("/teacher/:teacherId", getSalaryByTeacherIdController);
router.get("/period/:periodStart/:periodEnd", getSalarySummaryByPeriodController);

// ✅ General routes AFTER
router.get("/", getAllSalaryController);
router.get("/:id", getSalaryByIdController);
router.post("/", createSalaryController);
router.put("/:id", updateSalaryController);
router.patch("/:id/finalize", finalizeSalaryController);
router.delete("/:id", deleteSalaryController);

export default router;
