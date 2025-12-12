import db from '../config/db.js';

const alterations = [
  "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS teacher_id INT",
  "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS subject VARCHAR(255)",
  "ALTER TABLE attendance ADD COLUMN IF NOT EXISTS class_section VARCHAR(100)"
];

const run = async () => {
  try {
    // Note: MySQL may not support IF NOT EXISTS for ADD COLUMN. We'll check columns first.
    const colsRes = await db.promise().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='attendance'");
    const cols = (colsRes[0] || []).map(r => r.COLUMN_NAME);

    if (!cols.includes('teacher_id')) {
      console.log('Adding teacher_id column');
      await db.promise().query("ALTER TABLE attendance ADD COLUMN teacher_id INT");
    } else console.log('teacher_id exists');

    if (!cols.includes('subject')) {
      console.log('Adding subject column');
      await db.promise().query("ALTER TABLE attendance ADD COLUMN subject VARCHAR(255)");
    } else console.log('subject exists');

    if (!cols.includes('class_section')) {
      console.log('Adding class_section column');
      await db.promise().query("ALTER TABLE attendance ADD COLUMN class_section VARCHAR(100)");
    } else console.log('class_section exists');

    // Populate teacher_id from teacherName
    console.log('Populating teacher_id from teacherName if possible');
    await db.promise().query(`UPDATE attendance a JOIN teachers t ON a.teacherName = t.name SET a.teacher_id = t.id WHERE (a.teacher_id IS NULL OR a.teacher_id = 0) AND a.teacherName IS NOT NULL`);

    // Populate class_section from className
    console.log('Populating class_section from className');
    await db.promise().query(`UPDATE attendance SET class_section = className WHERE (class_section IS NULL OR class_section = '') AND className IS NOT NULL`);

    // If hours column exists and hours_taught missing or zero, try to copy
    const hasHoursTaught = cols.includes('hours_taught');
    if (cols.includes('hours') && hasHoursTaught) {
      console.log('Copying numeric hours -> hours_taught');
      await db.promise().query(`UPDATE attendance SET hours_taught = hours WHERE (hours_taught IS NULL OR hours_taught = 0) AND hours IS NOT NULL`);
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Error migrating attendance schema:', err);
    process.exit(1);
  }
};

run();
