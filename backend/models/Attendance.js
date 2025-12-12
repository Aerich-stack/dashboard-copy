import db from "../config/db.js";

// Create Attendance table if not exists
export const createAttendanceTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS attendance (
      id INT PRIMARY KEY AUTO_INCREMENT,
      teacher_id INT NOT NULL,
      subject VARCHAR(255) NOT NULL,
      class_section VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      hours_taught DECIMAL(5, 2) NOT NULL,
      status ENUM('Submitted', 'Verified', 'Pending') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
    )
  `;
  db.query(sql, (err) => {
    if (err) console.error("Error creating attendance table:", err);
    else console.log("Attendance table ready");
  });
};

// Create attendance record
export const createAttendance = (attendanceData, callback) => {
  const sql = `
    INSERT INTO attendance (teacher_id, subject, class_section, date, hours_taught, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    attendanceData.teacher_id,
    attendanceData.subject,
    attendanceData.class_section,
    attendanceData.date,
    attendanceData.hours_taught,
    'Submitted'
  ];
  
  db.query(sql, values, callback);
};

// Get attendance by teacher ID
export const getAttendanceByTeacherId = (teacher_id, callback) => {
  const sql = "SELECT * FROM attendance WHERE teacher_id = ? ORDER BY date DESC";
  db.query(sql, [teacher_id], callback);
};

// Get all attendance records
export const getAllAttendance = (callback) => {
  const sql = `
    SELECT a.*, t.name as teacher_name FROM attendance a
    JOIN teachers t ON a.teacher_id = t.id
    ORDER BY a.date DESC
  `;
  db.query(sql, callback);
};

// Get attendance by ID
export const getAttendanceById = (id, callback) => {
  const sql = "SELECT * FROM attendance WHERE id = ?";
  db.query(sql, [id], callback);
};

// Update attendance
export const updateAttendance = (id, attendanceData, callback) => {
  const sql = `
    UPDATE attendance 
    SET subject = ?, class_section = ?, date = ?, hours_taught = ?, status = ?
    WHERE id = ?
  `;
  const values = [
    attendanceData.subject,
    attendanceData.class_section,
    attendanceData.date,
    attendanceData.hours_taught,
    attendanceData.status,
    id
  ];
  
  db.query(sql, values, callback);
};

// Approve attendance
export const approveAttendance = (id, callback) => {
  const sql = "UPDATE attendance SET status = 'Verified' WHERE id = ?";
  db.query(sql, [id], callback);
};

// Delete attendance
export const deleteAttendance = (id, callback) => {
  const sql = "DELETE FROM attendance WHERE id = ?";
  db.query(sql, [id], callback);
};

// Get total hours for teacher in a period
export const getTotalHoursByTeacher = (teacher_id, startDate, endDate, callback) => {
  const sql = `
    SELECT SUM(hours_taught) as total_hours 
    FROM attendance 
    WHERE teacher_id = ? AND status = 'Verified' AND date BETWEEN ? AND ?
  `;
  db.query(sql, [teacher_id, startDate, endDate], callback);
};
