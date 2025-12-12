import * as Attendance from "../models/Attendance.js";

export const submitAttendance = (req, res) => {
  const attendanceData = {
    teacher_id: req.body.teacher_id,
    subject: req.body.subject,
    class_section: req.body.class_section,
    date: req.body.date,
    hours_taught: req.body.hours_taught
  };

  Attendance.createAttendance(attendanceData, (err, result) => {
    if (err) {
      console.error("Error submitting attendance:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(201).json({ 
      success: true, 
      message: "Attendance submitted successfully", 
      attendanceId: result.insertId 
    });
  });
};

export const getTeacherAttendance = (req, res) => {
  const { teacherId } = req.params;

  Attendance.getAttendanceByTeacherId(teacherId, (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const getAllAttendance = (req, res) => {
  Attendance.getAllAttendance((err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, data: results });
  });
};

export const getAttendanceById = (req, res) => {
  const { id } = req.params;

  Attendance.getAttendanceById(id, (err, results) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Attendance record not found" });
    }
    res.status(200).json({ success: true, data: results[0] });
  });
};

export const updateAttendance = (req, res) => {
  const { id } = req.params;
  const attendanceData = {
    subject: req.body.subject,
    class_section: req.body.class_section,
    date: req.body.date,
    hours_taught: req.body.hours_taught,
    status: req.body.status || 'Submitted'
  };

  Attendance.updateAttendance(id, attendanceData, (err) => {
    if (err) {
      console.error("Error updating attendance:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Attendance updated successfully" });
  });
};

export const approveAttendance = (req, res) => {
  const { id } = req.params;

  Attendance.approveAttendance(id, (err) => {
    if (err) {
      console.error("Error approving attendance:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Attendance approved successfully" });
  });
};

export const deleteAttendance = (req, res) => {
  const { id } = req.params;

  Attendance.deleteAttendance(id, (err) => {
    if (err) {
      console.error("Error deleting attendance:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    res.status(200).json({ success: true, message: "Attendance deleted successfully" });
  });
};

// Initialize tables
export const initializeTables = (req, res) => {
  Attendance.createAttendanceTable();
  res.status(200).json({ success: true, message: "Attendance table initialized" });
};
