import db from "../config/db.js";

// Create Teacher table if not exists
export const createTeacherTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS teachers (
      id INT PRIMARY KEY AUTO_INCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      department VARCHAR(255),
      basic_pay DECIMAL(10, 2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      password VARCHAR(255),
      bio TEXT,
      phone VARCHAR(20),
      address TEXT,
      profile_image LONGTEXT,
      reset_token VARCHAR(255),
      reset_token_expiry TIMESTAMP
    )
  `;
  db.query(sql, (err) => {
    if (err) console.error("Error creating teachers table:", err);
    else console.log("Teachers table ready");
  });
};

// Create a new teacher
export const createTeacher = (teacherData, callback) => {
  const sql = "INSERT INTO teachers (email, name, department, basic_pay, password) VALUES (?, ?, ?, ?, ?)";
  const values = [teacherData.email, teacherData.name, teacherData.department, teacherData.basic_pay, teacherData.password];
  
  db.query(sql, values, callback);
};

// Get all teachers
export const getAllTeachers = (callback) => {
  const sql = "SELECT * FROM teachers";
  db.query(sql, callback);
};

// Get teacher by email and password (plain-text match - consider hashing)
export const getTeacherByEmailAndPassword = (email, password, callback) => {
  const sql = "SELECT * FROM teachers WHERE email = ? AND password = ? LIMIT 1";
  db.query(sql, [email, password], callback);
};

// Change teacher password
export const changeTeacherPassword = (id, newPassword, callback) => {
  const sql = "UPDATE teachers SET password = ? WHERE id = ?";
  db.query(sql, [newPassword, id], callback);
};

// Get teacher by ID
export const getTeacherById = (id, callback) => {
  const sql = "SELECT * FROM teachers WHERE id = ?";
  db.query(sql, [id], callback);
};

// Update teacher
export const updateTeacher = (id, teacherData, callback) => {
  const sql = "UPDATE teachers SET email = ?, name = ?, department = ?, basic_pay = ?, bio = ?, phone = ?, address = ?, profile_image = ? WHERE id = ?";
  const values = [teacherData.email, teacherData.name, teacherData.department, teacherData.basic_pay, teacherData.bio, teacherData.phone, teacherData.address, teacherData.profile_image || null, id];
  
  db.query(sql, values, callback);
};

// Delete teacher
export const deleteTeacher = (id, callback) => {
  const sql = "DELETE FROM teachers WHERE id = ?";
  db.query(sql, [id], callback);
};

// Get teacher by email
export const getTeacherByEmail = (email, callback) => {
  const sql = "SELECT id, email, name FROM teachers WHERE email = ? LIMIT 1";
  db.query(sql, [email], callback);
};

// Store reset token
export const storeResetToken = (email, token, callback) => {
  const sql = "UPDATE teachers SET reset_token = ?, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?";
  db.query(sql, [token, email], callback);
};

// Get teacher by reset token
export const getTeacherByResetToken = (token, callback) => {
  const sql = "SELECT * FROM teachers WHERE reset_token = ? AND reset_token_expiry > NOW() LIMIT 1";
  db.query(sql, [token], callback);
};

// Reset password by token
export const resetPasswordByToken = (token, email, newPassword, callback) => {
  const sql = "UPDATE teachers SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ? AND email = ? AND reset_token_expiry > NOW()";
  db.query(sql, [newPassword, token, email], callback);
};
