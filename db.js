const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка открытия базы данных', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      telegram_id TEXT,
      telegram_username TEXT,
      vpn_key TEXT
    )
  `);

  db.all('PRAGMA table_info(users)', (err, rows) => {
    if (err) {
      console.error('Ошибка проверки структуры базы данных', err.message);
      return;
    }
    const hasVpnKey = rows.some((row) => row.name === 'vpn_key');
    if (!hasVpnKey) {
      db.run('ALTER TABLE users ADD COLUMN vpn_key TEXT');
    }
  });
});

module.exports = db;
