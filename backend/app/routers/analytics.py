"""
Analytics router for visitor tracking with persistent storage
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
"""
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Set
import asyncio
import json
import os
from pathlib import Path

router = APIRouter()

# File path for persistent storage
STORAGE_DIR = Path("/tmp/api_tester_data")
VISITOR_FILE = STORAGE_DIR / "visitors.json"

# In-memory cache
visitor_count = 0
unique_ips: Set[str] = set()
visitor_lock = asyncio.Lock()
initialized = False


def ensure_storage_dir():
    """Ensure storage directory exists"""
    STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def load_visitor_data():
    """Load visitor data from file"""
    global visitor_count, unique_ips
    
    try:
        ensure_storage_dir()
        if VISITOR_FILE.exists():
            with open(VISITOR_FILE, 'r') as f:
                data = json.load(f)
                visitor_count = data.get('total', 0)
                unique_ips = set(data.get('unique_ips', []))
                print(f"[Analytics] Loaded visitor data: {visitor_count} total visits, {len(unique_ips)} unique IPs")
        else:
            # Initialize with default values
            visitor_count = 0
            unique_ips = set()
            save_visitor_data()
            print("[Analytics] Initialized new visitor data file")
    except Exception as e:
        print(f"[Analytics] Error loading visitor data: {e}")
        visitor_count = 0
        unique_ips = set()


def save_visitor_data():
    """Save visitor data to file"""
    try:
        ensure_storage_dir()
        data = {
            'total': visitor_count,
            'unique_ips': list(unique_ips),
            'last_updated': datetime.now().isoformat()
        }
        
        # Write to temporary file first, then rename (atomic operation)
        temp_file = VISITOR_FILE.with_suffix('.tmp')
        with open(temp_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        # Atomic rename
        temp_file.replace(VISITOR_FILE)
        
    except Exception as e:
        print(f"[Analytics] Error saving visitor data: {e}")


async def initialize_analytics():
    """Initialize analytics on first request"""
    global initialized
    if not initialized:
        async with visitor_lock:
            if not initialized:  # Double-check after acquiring lock
                load_visitor_data()
                initialized = True


@router.get("/visitors/count")
async def get_visitor_count(request: Request):
    """Get current visitor count"""
    await initialize_analytics()
    
    async with visitor_lock:
        return JSONResponse({
            "total": visitor_count,
            "unique": len(unique_ips)
        })


@router.post("/visitors/increment")
async def increment_visitor(request: Request):
    """Increment visitor count with persistent storage"""
    global visitor_count
    
    await initialize_analytics()
    
    async with visitor_lock:
        # Get client IP (handle proxy headers)
        client_ip = request.headers.get("X-Forwarded-For")
        if client_ip:
            client_ip = client_ip.split(",")[0].strip()
        else:
            client_ip = request.headers.get("X-Real-IP")
            if not client_ip:
                client_ip = request.client.host if request.client else "unknown"
        
        # Check if this is a new unique visitor
        is_new_visitor = client_ip not in unique_ips
        
        # Increment total visits
        visitor_count += 1
        
        # Track unique IPs
        unique_ips.add(client_ip)
        
        # Save to persistent storage
        save_visitor_data()
        
        return JSONResponse({
            "total": visitor_count,
            "unique": len(unique_ips),
            "is_new_visitor": is_new_visitor,
            "timestamp": datetime.now().isoformat()
        })


@router.post("/visitors/reset")
async def reset_visitor_count(request: Request):
    """Reset visitor count (admin only - add authentication in production)"""
    global visitor_count
    
    async with visitor_lock:
        visitor_count = 0
        unique_ips.clear()
        save_visitor_data()
        
        return JSONResponse({
            "message": "Visitor count reset successfully",
            "total": visitor_count,
            "unique": len(unique_ips)
        })

# Made with Bob
