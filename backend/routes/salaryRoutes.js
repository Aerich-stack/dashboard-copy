import express from "express";
import * as SalaryController from "../controllers/SalaryController.js";

const router = express.Router();

// Initialize tables
router.post("/init", SalaryController.initializeTables);

// Salary CRUD routes
router.post("/compute", SalaryController.computeSalary);
router.post("/:id/send", SalaryController.sendPayslip);
router.get("/", SalaryController.getAllSalary);
router.get("/teacher/:teacherId", SalaryController.getTeacherSalary);
router.get("/period/:periodStart/:periodEnd", SalaryController.getSalarySummaryByPeriod);
router.get("/:id", SalaryController.getSalaryById);
router.put("/:id", SalaryController.updateSalary);
router.patch("/:id/finalize", SalaryController.finalizeSalary);
router.delete("/:id", SalaryController.deleteSalary);

export default router;
