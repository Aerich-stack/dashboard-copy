import db from "../config/db.js";

// Run safe schema updates: add missing columns if they don't exist
export const ensureSchema = (req, res) => {
  const queries = [];

  // Attendance: hours_taught, status
  queries.push(
    `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='attendance' AND COLUMN_NAME='hours_taught'`
  );
  queries.push(
    `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='attendance' AND COLUMN_NAME='status'`
  );

  // Salary: ensure key columns exist
  const salaryCols = [
    'teacher_id','period_start','period_end','verified_hours','hourly_rate','basic_pay','allowances','deductions','total_salary','status'
  ];
  salaryCols.forEach((col) => {
    queries.push(`SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='salary' AND COLUMN_NAME='${col}'`);
  });

  // Execute checks one-by-one (no multipleStatements required)
  const results = [];
  const runCheck = (i) => {
    if (i >= queries.length) return afterChecks();
    db.query(queries[i], (cErr, cRes) => {
      if (cErr) {
        console.error('Error checking schema (query):', cErr, queries[i]);
        return res.status(500).json({ success: false, error: cErr.message, query: queries[i] });
      }
      results.push(cRes);
      runCheck(i + 1);
    });
  };

  const afterChecks = () => {
    const alterations = [];
    const hasHours = results[0] && results[0][0] && results[0][0].cnt > 0;
    if (!hasHours) alterations.push(`ALTER TABLE attendance ADD COLUMN hours_taught DECIMAL(5,2) NOT NULL DEFAULT 0`);

    const hasStatus = results[1] && results[1][0] && results[1][0].cnt > 0;
    if (!hasStatus) alterations.push(`ALTER TABLE attendance ADD COLUMN status ENUM('Submitted','Verified','Pending') DEFAULT 'Pending'`);

    const salaryChecksOffset = 2;
    const salaryAlterMap = {
      teacher_id: `ALTER TABLE salary ADD COLUMN teacher_id INT`,
      period_start: `ALTER TABLE salary ADD COLUMN period_start DATE`,
      period_end: `ALTER TABLE salary ADD COLUMN period_end DATE`,
      verified_hours: `ALTER TABLE salary ADD COLUMN verified_hours DECIMAL(10,2) DEFAULT 0`,
      hourly_rate: `ALTER TABLE salary ADD COLUMN hourly_rate DECIMAL(10,2) DEFAULT 0`,
      basic_pay: `ALTER TABLE salary ADD COLUMN basic_pay DECIMAL(10,2) DEFAULT 0`,
      allowances: `ALTER TABLE salary ADD COLUMN allowances DECIMAL(10,2) DEFAULT 0`,
      deductions: `ALTER TABLE salary ADD COLUMN deductions DECIMAL(10,2) DEFAULT 0`,
      total_salary: `ALTER TABLE salary ADD COLUMN total_salary DECIMAL(10,2) DEFAULT 0`,
      status: `ALTER TABLE salary ADD COLUMN status ENUM('Draft','Generated','Finalized') DEFAULT 'Draft'`
    };

    salaryCols.forEach((col, idx) => {
      const r = results[salaryChecksOffset + idx];
      const exists = r && r[0] && r[0].cnt > 0;
      if (!exists && salaryAlterMap[col]) alterations.push(salaryAlterMap[col]);
    });

    if (alterations.length === 0) {
      return res.status(200).json({ success: true, message: 'Schema already up-to-date' });
    }

    const runAlter = (j) => {
      if (j >= alterations.length) return res.status(200).json({ success: true, message: 'Schema updated', alterations });
      db.query(alterations[j], (aErr) => {
        if (aErr) {
          console.error('Error running ALTER:', aErr, alterations[j]);
          return res.status(500).json({ success: false, error: aErr.message, statement: alterations[j] });
        }
        runAlter(j + 1);
      });
    };

    runAlter(0);
  };

  runCheck(0);
};

export const showTableCreate = (req, res) => {
  const { table } = req.params;
  const safeTables = ['attendance','salary','teachers','notifications'];
  if (!safeTables.includes(table)) return res.status(400).json({ success: false, message: 'Table not allowed' });
  db.query(`SHOW CREATE TABLE \`${table}\``, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, create: result[0]['Create Table'] });
  });
};

export default { ensureSchema, showTableCreate };
