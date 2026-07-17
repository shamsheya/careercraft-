import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'careercraft.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    _init_tables(conn)
    return conn


def _init_tables(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
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
        );

        CREATE TABLE IF NOT EXISTS password_resets (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            token TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            used INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS progress (
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
        );
    """)
    conn.commit()
