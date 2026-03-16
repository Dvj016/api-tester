"""
Analytics router for visitor tracking
"""
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Set
import asyncio

router = APIRouter()

# In-memory visitor counter (resets on server restart)
# For production, use Redis or database
visitor_count = 0
unique_ips: Set[str] = set()
visitor_lock = asyncio.Lock()


@router.get("/visitors/count")
async def get_visitor_count(request: Request):
    """Get current visitor count"""
    async with visitor_lock:
        return JSONResponse({
            "total": visitor_count,
            "unique": len(unique_ips)
        })


@router.post("/visitors/increment")
async def increment_visitor(request: Request):
    """Increment visitor count"""
    global visitor_count
    
    async with visitor_lock:
        # Get client IP
        client_ip = request.client.host if request.client else "unknown"
        
        # Increment total visits
        visitor_count += 1
        
        # Track unique IPs
        unique_ips.add(client_ip)
        
        return JSONResponse({
            "total": visitor_count,
            "unique": len(unique_ips),
            "timestamp": datetime.now().isoformat()
        })

# Made with Bob
