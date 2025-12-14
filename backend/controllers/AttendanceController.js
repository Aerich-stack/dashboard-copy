import {
  getAllAttendanceModel,
  getAttendanceByIdModel,
  getAttendanceByTeacherIdModel
} from "../models/AttendanceModel.js";

// ✅ Summary for dashboard
export const getAttendanceSummary = (req, res) => {
  getAllAttendanceModel((err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};

// ✅ All attendance
export const getAllAttendance = (req, res) => {
  getAllAttendanceModel((err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};

// ✅ Attendance by ID
export const getAttendanceById = (req, res) => {
  const { id } = req.params;

  getAttendanceByIdModel(id, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows?.[0] || {}
    });
  });
};

// ✅ Attendance by teacher
export const getAttendanceByTeacherId = (req, res) => {
  const { teacherId } = req.params;

  getAttendanceByTeacherIdModel(teacherId, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};
