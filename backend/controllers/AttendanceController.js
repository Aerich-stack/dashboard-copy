import {
  createAttendance,
  getAttendanceByTeacherId,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  approveAttendance,
  deleteAttendance,
  getTotalHoursByTeacher
} from "../models/AttendanceModel.js";

// ✅ Summary for dashboard (uses getAllAttendance)
export const getAttendanceSummary = (req, res) => {
  getAllAttendance((err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};

// ✅ All attendance
export const getAllAttendanceController = (req, res) => {
  getAllAttendance((err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};

// ✅ Attendance by ID
export const getAttendanceByIdController = (req, res) => {
  const { id } = req.params;

  getAttendanceById(id, (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows?.[0] || {}
    });
  });
};

// ✅ Attendance by teacher
export const getAttendanceByTeacherIdController = (req, res) => {
  const { teacherId } = req.params;

  getAttendanceByTeacherId(teacherId, (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, error: err.message });

    res.json({
      success: true,
      data: rows || []
    });
  });
};
