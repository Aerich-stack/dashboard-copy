import db from '../config/db.js';

const run = async () => {
  try {
    const alterations = [];

    // Check for teacher profile columns
    const profileCols = ['bio', 'phone', 'address', 'profile_image'];
    for (const col of profileCols) {
      const [rows] = await db.promise().query(
        `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='teachers' AND COLUMN_NAME='${col}'`
      );
      const exists = rows[0] && rows[0].cnt > 0;
      if (!exists) {
        if (col === 'bio') alterations.push(`ALTER TABLE teachers ADD COLUMN bio LONGTEXT`);
        else if (col === 'phone') alterations.push(`ALTER TABLE teachers ADD COLUMN phone VARCHAR(20)`);
        else if (col === 'address') alterations.push(`ALTER TABLE teachers ADD COLUMN address VARCHAR(255)`);
        else if (col === 'profile_image') alterations.push(`ALTER TABLE teachers ADD COLUMN profile_image LONGTEXT`);
      }
    }

    if (alterations.length === 0) {
      console.log('Schema already up-to-date');
      process.exit(0);
    }

    for (const a of alterations) {
      console.log('Running:', a);
      await db.promise().query(a);
    }

    console.log('Schema updated:', alterations);
    process.exit(0);
  } catch (err) {
    console.error('Error ensuring schema:', err);
    process.exit(1);
  }
};

run();
