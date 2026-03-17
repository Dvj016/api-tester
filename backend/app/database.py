"""
SQLite Database for Persistent Storage
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
"""
import sqlite3
import os
from pathlib import Path
from datetime import datetime
from typing import Optional, Tuple
import threading

# Database file location
DB_DIR = Path("/tmp/api_tester_data")
DB_FILE = DB_DIR / "analytics.db"

# Thread-local storage for database connections
_thread_local = threading.local()


def get_db_connection():
    """Get a thread-local database connection"""
    if not hasattr(_thread_local, 'connection'):
        ensure_db_dir()
        _thread_local.connection = sqlite3.connect(str(DB_FILE), check_same_thread=False)
        _thread_local.connection.row_factory = sqlite3.Row
    return _thread_local.connection


def ensure_db_dir():
    """Ensure database directory exists"""
    DB_DIR.mkdir(parents=True, exist_ok=True)


def init_database():
    """Initialize database tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create visitors table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            visit_count INTEGER DEFAULT 1
        )
    ''')
    
    # Create visitor_stats table for global counters
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS visitor_stats (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            total_visits INTEGER DEFAULT 1000,
            unique_visitors INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create index on IP address for faster lookups
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_ip_address ON visitors(ip_address)
    ''')
    
    # Initialize visitor_stats if empty
    cursor.execute('SELECT COUNT(*) FROM visitor_stats')
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO visitor_stats (id, total_visits, unique_visitors, last_updated)
            VALUES (1, 1000, 0, ?)
        ''', (datetime.now().isoformat(),))
    
    conn.commit()
    print("[Database] Initialized successfully")


def get_visitor_stats() -> Tuple[int, int]:
    """Get total visits and unique visitors"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT total_visits, unique_visitors FROM visitor_stats WHERE id = 1')
    row = cursor.fetchone()
    
    if row:
        return row[0], row[1]
    return 1000, 0


def increment_visitor(ip_address: str) -> Tuple[int, int, bool]:
    """
    Increment visitor count
    Returns: (total_visits, unique_visitors, is_new_visitor)
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if IP exists
    cursor.execute('SELECT id, visit_count FROM visitors WHERE ip_address = ?', (ip_address,))
    existing = cursor.fetchone()
    
    is_new_visitor = existing is None
    
    if existing:
        # Update existing visitor
        cursor.execute('''
            UPDATE visitors 
            SET last_visit = ?, visit_count = visit_count + 1
            WHERE ip_address = ?
        ''', (datetime.now().isoformat(), ip_address))
    else:
        # Insert new visitor
        cursor.execute('''
            INSERT INTO visitors (ip_address, first_visit, last_visit, visit_count)
            VALUES (?, ?, ?, 1)
        ''', (ip_address, datetime.now().isoformat(), datetime.now().isoformat()))
    
    # Update global stats
    cursor.execute('''
        UPDATE visitor_stats 
        SET total_visits = total_visits + 1,
            unique_visitors = (SELECT COUNT(DISTINCT ip_address) FROM visitors),
            last_updated = ?
        WHERE id = 1
    ''', (datetime.now().isoformat(),))
    
    conn.commit()
    
    # Get updated stats
    total, unique = get_visitor_stats()
    
    return total, unique, is_new_visitor


def reset_visitor_stats():
    """Reset visitor statistics (admin function)"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM visitors')
    cursor.execute('''
        UPDATE visitor_stats 
        SET total_visits = 1000, unique_visitors = 0, last_updated = ?
        WHERE id = 1
    ''', (datetime.now().isoformat(),))
    
    conn.commit()
    print("[Database] Visitor stats reset")


# Initialize database on module import
try:
    init_database()
except Exception as e:
    print(f"[Database] Error initializing: {e}")

# Made with Bob
