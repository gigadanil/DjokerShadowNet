const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'users.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
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

  db.run(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      code TEXT,
      expires_at INTEGER
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
