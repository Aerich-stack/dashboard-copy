// ===============================
// ✅ IMPORTS
// ===============================
import {
  getAllSalaryModel,
  getSalaryByIdModel,
  getSalaryByTeacherIdModel,
  createSalary,
  updateSalary,
  finalizeSalary,
  deleteSalary,
  getSalarySummaryByPeriod
} from "../models/Salary.js";


// ===============================
// ✅ DASHBOARD SUMMARY
// ===============================
export const getSalarySummary = (req, res) => {
  getAllSalaryModel((err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};


// ===============================
// ✅ BASIC SALARY QUERIES
// ===============================
export const getAllSalaryController = (req, res) => {
  getAllSalaryModel((err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({ success: true, data: rows || [] });
  });
};

export const getSalaryByIdController = (req, res) => {
  const { id } = req.params;

  getSalaryByIdModel(id, (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({ success: true, data: rows?.[0] || {} });
  });
};


// ===============================
// ✅ SALARY BY TEACHER
// ===============================
export const getSalaryByTeacherIdController = (req, res) => {
  const { teacherId } = req.params;

  getSalaryByTeacherIdModel(teacherId, (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};


// ===============================
// ✅ CREATE SALARY
// ===============================
export const createSalaryController = (req, res) => {
  createSalary(req.body, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      message: "Salary created successfully",
      data: result
    });
  });
};


// ===============================
// ✅ UPDATE SALARY
// ===============================
export const updateSalaryController = (req, res) => {
  const { id } = req.params;

  updateSalary(id, req.body, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      message: "Salary updated successfully",
      data: result
    });
  });
};


// ===============================
// ✅ FINALIZE SALARY
// ===============================
export const finalizeSalaryController = (req, res) => {
  const { id } = req.params;

  finalizeSalary(id, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      message: "Salary finalized successfully",
      data: result
    });
  });
};


// ===============================
// ✅ DELETE SALARY
// ===============================
export const deleteSalaryController = (req, res) => {
  const { id } = req.params;

  deleteSalary(id, (err, result) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      message: "Salary deleted successfully",
      data: result
    });
  });
};


// ===============================
// ✅ SUMMARY BY PERIOD
// ===============================
export const getSalarySummaryByPeriodController = (req, res) => {
  const { periodStart, periodEnd } = req.params;

  getSalarySummaryByPeriod(periodStart, periodEnd, (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};
