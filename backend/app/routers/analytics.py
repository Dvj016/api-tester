"""
Analytics router for visitor tracking with Supabase PostgreSQL
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)

Uses Supabase free tier for permanent storage that never resets.
"""
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from datetime import datetime

# Try Supabase first, fallback to SQLite
try:
    from app.supabase_db import get_visitor_stats, increment_visitor, reset_visitor_stats, is_supabase_configured
    USE_SUPABASE = True
except ImportError:
    from app.database import get_visitor_stats, increment_visitor, reset_visitor_stats
    USE_SUPABASE = False
    def is_supabase_configured():
        return False

router = APIRouter()


def get_client_ip(request: Request) -> str:
    """Extract client IP from request"""
    # Check for forwarded IP (when behind proxy/load balancer)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    # Check for real IP header
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fall back to direct client IP
    return request.client.host if request.client else "unknown"


@router.get("/visitors/count")
async def get_visitor_count(request: Request):
    """Get current visitor count from permanent storage"""
    try:
        total, unique = get_visitor_stats()
        storage_type = "Supabase" if (USE_SUPABASE and is_supabase_configured()) else "SQLite"
        
        return JSONResponse({
            "total": total,
            "unique": unique,
            "storage": storage_type,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        print(f"[Analytics] Error getting visitor count: {e}")
        return JSONResponse({
            "total": 1000,
            "unique": 0,
            "storage": "fallback",
            "timestamp": datetime.now().isoformat()
        })


@router.post("/visitors/increment")
async def increment_visitor_count(request: Request):
    """Increment visitor count with permanent storage"""
    try:
        client_ip = get_client_ip(request)
        
        # Increment visitor count in database
        total, unique, is_new_visitor = increment_visitor(client_ip)
        storage_type = "Supabase" if (USE_SUPABASE and is_supabase_configured()) else "SQLite"
        
        print(f"[Analytics] Visitor count: {total} total, {unique} unique (Storage: {storage_type})")
        
        return JSONResponse({
            "total": total,
            "unique": unique,
            "is_new_visitor": is_new_visitor,
            "storage": storage_type,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        print(f"[Analytics] Error incrementing visitor: {e}")
        # Return fallback values
        return JSONResponse({
            "total": 1000,
            "unique": 0,
            "is_new_visitor": False,
            "storage": "fallback",
            "timestamp": datetime.now().isoformat()
        })


@router.post("/visitors/reset")
async def reset_visitor_count_endpoint(request: Request):
    """Reset visitor count (admin only - add authentication in production)"""
    try:
        reset_visitor_stats()
        total, unique = get_visitor_stats()
        
        return JSONResponse({
            "message": "Visitor count reset successfully",
            "total": total,
            "unique": unique,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        print(f"[Analytics] Error resetting visitor count: {e}")
        return JSONResponse({
            "error": "Failed to reset visitor count",
            "message": str(e)
        }, status_code=500)

# Made with Bob
