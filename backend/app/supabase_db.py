"""
Supabase PostgreSQL Database for Permanent Visitor Counter
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)

This uses Supabase free tier PostgreSQL for permanent storage that never resets.
"""
import os
from datetime import datetime
from typing import Tuple, Optional
import requests
import json

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")

# Fallback to in-memory if Supabase not configured
_memory_counter = {"total": 1000, "unique_ips": set()}


def get_headers():
    """Get Supabase API headers"""
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }


def init_supabase_table():
    """
    Initialize Supabase table (run this once manually via Supabase SQL editor):
    
    CREATE TABLE IF NOT EXISTS visitor_stats (
        id INTEGER PRIMARY KEY DEFAULT 1,
        total_visits INTEGER DEFAULT 1000,
        unique_visitors INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT NOW(),
        CONSTRAINT single_row CHECK (id = 1)
    );
    
    CREATE TABLE IF NOT EXISTS visitors (
        id SERIAL PRIMARY KEY,
        ip_address TEXT UNIQUE NOT NULL,
        first_visit TIMESTAMP DEFAULT NOW(),
        last_visit TIMESTAMP DEFAULT NOW(),
        visit_count INTEGER DEFAULT 1
    );
    
    CREATE INDEX IF NOT EXISTS idx_ip_address ON visitors(ip_address);
    
    -- Insert initial row
    INSERT INTO visitor_stats (id, total_visits, unique_visitors, last_updated)
    VALUES (1, 1000, 0, NOW())
    ON CONFLICT (id) DO NOTHING;
    """
    pass


def is_supabase_configured() -> bool:
    """Check if Supabase is configured"""
    return bool(SUPABASE_URL and SUPABASE_KEY)


def get_visitor_stats() -> Tuple[int, int]:
    """Get total visits and unique visitors"""
    if not is_supabase_configured():
        return _memory_counter["total"], len(_memory_counter["unique_ips"])
    
    try:
        url = f"{SUPABASE_URL}/rest/v1/visitor_stats?id=eq.1&select=total_visits,unique_visitors"
        response = requests.get(url, headers=get_headers(), timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                return data[0]["total_visits"], data[0]["unique_visitors"]
        
        # If no data, return baseline
        return 1000, 0
    except Exception as e:
        print(f"[Supabase] Error getting stats: {e}")
        return _memory_counter["total"], len(_memory_counter["unique_ips"])


def increment_visitor(ip_address: str) -> Tuple[int, int, bool]:
    """
    Increment visitor count permanently
    Returns: (total_visits, unique_visitors, is_new_visitor)
    """
    if not is_supabase_configured():
        # Fallback to memory
        is_new = ip_address not in _memory_counter["unique_ips"]
        _memory_counter["total"] += 1
        _memory_counter["unique_ips"].add(ip_address)
        return _memory_counter["total"], len(_memory_counter["unique_ips"]), is_new
    
    try:
        # Check if IP exists
        check_url = f"{SUPABASE_URL}/rest/v1/visitors?ip_address=eq.{ip_address}&select=id,visit_count"
        check_response = requests.get(check_url, headers=get_headers(), timeout=5)
        
        is_new_visitor = False
        
        if check_response.status_code == 200:
            existing = check_response.json()
            
            if existing and len(existing) > 0:
                # Update existing visitor
                visitor_id = existing[0]["id"]
                update_url = f"{SUPABASE_URL}/rest/v1/visitors?id=eq.{visitor_id}"
                update_data = {
                    "last_visit": datetime.now().isoformat(),
                    "visit_count": existing[0]["visit_count"] + 1
                }
                requests.patch(update_url, headers=get_headers(), json=update_data, timeout=5)
            else:
                # Insert new visitor
                is_new_visitor = True
                insert_url = f"{SUPABASE_URL}/rest/v1/visitors"
                insert_data = {
                    "ip_address": ip_address,
                    "first_visit": datetime.now().isoformat(),
                    "last_visit": datetime.now().isoformat(),
                    "visit_count": 1
                }
                requests.post(insert_url, headers=get_headers(), json=insert_data, timeout=5)
        
        # Update global stats
        # First, get current unique count
        count_url = f"{SUPABASE_URL}/rest/v1/visitors?select=count"
        count_response = requests.get(count_url, headers=get_headers(), timeout=5)
        unique_count = 0
        
        if count_response.status_code == 200:
            # Supabase returns count in headers
            count_header = count_response.headers.get("Content-Range", "")
            if count_header:
                unique_count = int(count_header.split("/")[-1])
        
        # Update visitor_stats
        stats_url = f"{SUPABASE_URL}/rest/v1/visitor_stats?id=eq.1"
        
        # Get current total
        current_stats = requests.get(f"{stats_url}&select=total_visits", headers=get_headers(), timeout=5)
        current_total = 1000
        
        if current_stats.status_code == 200:
            stats_data = current_stats.json()
            if stats_data and len(stats_data) > 0:
                current_total = stats_data[0]["total_visits"]
        
        # Increment total
        new_total = current_total + 1
        
        update_stats = {
            "total_visits": new_total,
            "unique_visitors": unique_count,
            "last_updated": datetime.now().isoformat()
        }
        
        requests.patch(stats_url, headers=get_headers(), json=update_stats, timeout=5)
        
        return new_total, unique_count, is_new_visitor
        
    except Exception as e:
        print(f"[Supabase] Error incrementing visitor: {e}")
        # Fallback to memory
        is_new = ip_address not in _memory_counter["unique_ips"]
        _memory_counter["total"] += 1
        _memory_counter["unique_ips"].add(ip_address)
        return _memory_counter["total"], len(_memory_counter["unique_ips"]), is_new


def reset_visitor_stats():
    """Reset visitor statistics (admin function)"""
    if not is_supabase_configured():
        _memory_counter["total"] = 1000
        _memory_counter["unique_ips"].clear()
        return
    
    try:
        # Delete all visitors
        delete_url = f"{SUPABASE_URL}/rest/v1/visitors?id=gte.0"
        requests.delete(delete_url, headers=get_headers(), timeout=5)
        
        # Reset stats
        stats_url = f"{SUPABASE_URL}/rest/v1/visitor_stats?id=eq.1"
        reset_data = {
            "total_visits": 1000,
            "unique_visitors": 0,
            "last_updated": datetime.now().isoformat()
        }
        requests.patch(stats_url, headers=get_headers(), json=reset_data, timeout=5)
        
        print("[Supabase] Visitor stats reset successfully")
    except Exception as e:
        print(f"[Supabase] Error resetting stats: {e}")

# Made with Bob
