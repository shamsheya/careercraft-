import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'careercraft.db');

let db = null;

export async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    year INTEGER NOT NULL DEFAULT 1,
    college TEXT DEFAULT '',
    avatar TEXT DEFAULT '🧑‍🎓',
    streak INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    badges TEXT DEFAULT '[]',
    joined_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS password_resets (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS progress (
    user_id TEXT PRIMARY KEY,
    hr_completed INTEGER DEFAULT 0,
    hr_score REAL DEFAULT 0,
    hr_total INTEGER DEFAULT 30,
    tech_completed INTEGER DEFAULT 0,
    tech_score REAL DEFAULT 0,
    tech_total INTEGER DEFAULT 30,
    gd_completed INTEGER DEFAULT 0,
    gd_score REAL DEFAULT 0,
    gd_total INTEGER DEFAULT 10,
    apt_completed INTEGER DEFAULT 0,
    apt_score REAL DEFAULT 0,
    apt_total INTEGER DEFAULT 30,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  saveDb();
  return db;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}
