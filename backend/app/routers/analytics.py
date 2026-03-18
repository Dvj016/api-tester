"""
Analytics router for visitor tracking with Enterprise Security
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)

Uses MongoDB Atlas for persistent storage that survives deployments and restarts.
Tracks BOTH total visits AND unique visitors separately with zero PII.
"""
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from datetime import datetime
import os

# Try MongoDB first, fallback to JSON if not available
try:
    from app.mongodb_storage import get_visitor_stats, increment_visitor, reset_visitor_stats
    from app.unique_visitor_storage import check_and_add_unique_visitor, get_unique_visitor_count
    STORAGE_TYPE = "MongoDB Atlas"
    print("[Analytics] Using MongoDB Atlas for persistent storage")
except Exception as e:
    print(f"[Analytics] MongoDB not available ({e}), using JSON fallback")
    from app.simple_storage import get_visitor_stats, increment_visitor, reset_visitor_stats
    from app.unique_visitor_storage import check_and_add_unique_visitor, get_unique_visitor_count
    STORAGE_TYPE = "JSON (Ephemeral)"

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
    """Get current visitor count from persistent storage"""
    try:
        total, unique = get_visitor_stats()
        
        return JSONResponse(
            {
                "total": total,
                "unique": unique,
                "storage": STORAGE_TYPE,
                "timestamp": datetime.now().isoformat()
            },
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
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
    """Increment total visit counter AND track unique visitors"""
    try:
        # Get client IP for unique visitor tracking
        client_ip = get_client_ip(request)
        
        # Increment total visits (always increments)
        total, _, _ = increment_visitor()
        
        # Track unique visitors separately (uses secure hashing, no PII)
        unique_count, is_new_unique = check_and_add_unique_visitor(client_ip)
        
        print(f"[Analytics] Total visits: {total}, Unique visitors: {unique_count}")
        
        return JSONResponse(
            {
                "total": total,
                "unique": unique_count,
                "is_new_visitor": is_new_unique,
                "storage": STORAGE_TYPE,
                "timestamp": datetime.now().isoformat()
            },
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        )
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
