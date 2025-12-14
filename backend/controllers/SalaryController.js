import {
  getAllSalaryModel,
  getSalaryByIdModel,
  getSalaryByTeacherIdModel
} from "../models/SalaryModel.js";

// ✅ Summary for dashboard
export const getSalarySummary = (req, res) => {
  getAllSalaryModel((err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};

// ✅ All salary
export const getAllSalary = (req, res) => {
  getAllSalaryModel((err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};

// ✅ Salary by ID
export const getSalaryById = (req, res) => {
  const { id } = req.params;

  getSalaryByIdModel(id, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows?.[0] || {}
    });
  });
};

// ✅ Salary by teacher
export const getSalaryByTeacherId = (req, res) => {
  const { teacherId } = req.params;

  getSalaryByTeacherIdModel(teacherId, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};
