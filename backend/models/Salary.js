import db from "../config/db.js";

// Create Salary table if not exists
export const createSalaryTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS salary (
      id INT PRIMARY KEY AUTO_INCREMENT,
      teacher_id INT NOT NULL,
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      verified_hours DECIMAL(10, 2) DEFAULT 0,
      hourly_rate DECIMAL(10, 2) DEFAULT 0,
      basic_pay DECIMAL(10, 2) DEFAULT 0,
      allowances DECIMAL(10, 2) DEFAULT 0,
      deductions DECIMAL(10, 2) DEFAULT 0,
      total_salary DECIMAL(10, 2) DEFAULT 0,
      status ENUM('Draft', 'Generated', 'Finalized') DEFAULT 'Draft',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
    )
  `;
  db.query(sql, (err) => {
    if (err) console.error("Error creating salary table:", err);
    else console.log("Salary table ready");
  });
};

// Create salary record
export const createSalary = (salaryData, callback) => {
  const sql = `
    INSERT INTO salary (teacher_id, period_start, period_end, verified_hours, hourly_rate, basic_pay, allowances, deductions, total_salary, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    salaryData.teacher_id,
    salaryData.period_start,
    salaryData.period_end,
    salaryData.verified_hours,
    salaryData.hourly_rate,
    salaryData.basic_pay,
    salaryData.allowances,
    salaryData.deductions,
    salaryData.total_salary,
    "Draft",
  ];

  db.query(sql, values, callback);
};

// Get salary by teacher ID
export const getSalaryByTeacherId = (teacher_id, callback) => {
  const sql = "SELECT * FROM salary WHERE teacher_id = ? ORDER BY period_start DESC";
  db.query(sql, [teacher_id], callback);
};

// Get all salary records
export const getAllSalary = (callback) => {
  const sql = `
    SELECT s.*, t.name as teacher_name FROM salary s
    JOIN teachers t ON s.teacher_id = t.id
    ORDER BY s.period_start DESC
  `;
  db.query(sql, callback);
};

// Get salary by ID
export const getSalaryById = (id, callback) => {
  const sql = "SELECT * FROM salary WHERE id = ?";
  db.query(sql, [id], callback);
};

// Update salary
export const updateSalary = (id, salaryData, callback) => {
  const sql = `
    UPDATE salary 
    SET verified_hours = ?, hourly_rate = ?, basic_pay = ?, allowances = ?, deductions = ?, total_salary = ?, status = ?
    WHERE id = ?
  `;
  const values = [
    salaryData.verified_hours,
    salaryData.hourly_rate,
    salaryData.basic_pay,
    salaryData.allowances,
    salaryData.deductions,
    salaryData.total_salary,
    salaryData.status,
    id,
  ];

  db.query(sql, values, callback);
};

// Finalize salary
export const finalizeSalary = (id, callback) => {
  const sql = "UPDATE salary SET status = 'Finalized' WHERE id = ?";
  db.query(sql, [id], callback);
};

// Delete salary
export const deleteSalary = (id, callback) => {
  const sql = "DELETE FROM salary WHERE id = ?";
  db.query(sql, [id], callback);
};

// Summary by period
export const getSalarySummaryByPeriod = (periodStart, periodEnd, callback) => {
  const sql = `
    SELECT 
      t.name as teacher_name, 
      s.basic_pay, 
      s.allowances, 
      s.deductions, 
      s.total_salary,
      s.verified_hours,
      s.period_start,
      s.period_end
    FROM salary s
    JOIN teachers t ON s.teacher_id = t.id
    WHERE s.period_start >= ? AND s.period_end <= ?
    ORDER BY t.name
  `;
  db.query(sql, [periodStart, periodEnd], callback);
};
