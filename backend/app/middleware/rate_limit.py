"""
Rate limiting middleware for API protection
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio
from typing import Dict, Tuple

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware to prevent API abuse
    
    Implements a sliding window rate limiter with configurable limits
    """
    
    def __init__(self, app, requests_per_minute: int = 10, requests_per_hour: int = 100):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        
        # Store request timestamps per IP
        # Format: {ip: [(timestamp, 'minute'|'hour'), ...]}
        self.request_history: Dict[str, list] = defaultdict(list)
        
        # Lock for thread-safe operations
        self.lock = asyncio.Lock()
        
    async def dispatch(self, request: Request, call_next):
        """Process each request and apply rate limiting"""
        
        # Get client IP
        client_ip = self._get_client_ip(request)
        
        # Skip rate limiting for health check endpoints
        if request.url.path in ["/", "/health", "/docs", "/openapi.json"]:
            return await call_next(request)
        
        # Check rate limits
        async with self.lock:
            if not await self._check_rate_limit(client_ip):
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": "Rate limit exceeded",
                        "message": f"Too many requests. Limit: {self.requests_per_minute} per minute, {self.requests_per_hour} per hour",
                        "retry_after": 60
                    }
                )
            
            # Record this request
            await self._record_request(client_ip)
        
        # Process the request
        response = await call_next(request)
        
        # Add rate limit headers
        response.headers["X-RateLimit-Limit-Minute"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Limit-Hour"] = str(self.requests_per_hour)
        
        return response
    
    def _get_client_ip(self, request: Request) -> str:
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
    
    async def _check_rate_limit(self, client_ip: str) -> bool:
        """Check if client has exceeded rate limits"""
        now = datetime.now()
        
        # Clean old entries
        await self._cleanup_old_entries(client_ip, now)
        
        # Get request history for this IP
        history = self.request_history[client_ip]
        
        # Count requests in the last minute
        minute_ago = now - timedelta(minutes=1)
        requests_last_minute = sum(1 for ts, _ in history if ts > minute_ago)
        
        # Count requests in the last hour
        hour_ago = now - timedelta(hours=1)
        requests_last_hour = sum(1 for ts, _ in history if ts > hour_ago)
        
        # Check limits
        if requests_last_minute >= self.requests_per_minute:
            return False
        
        if requests_last_hour >= self.requests_per_hour:
            return False
        
        return True
    
    async def _record_request(self, client_ip: str):
        """Record a new request for the client"""
        now = datetime.now()
        self.request_history[client_ip].append((now, 'request'))
    
    async def _cleanup_old_entries(self, client_ip: str, now: datetime):
        """Remove entries older than 1 hour"""
        hour_ago = now - timedelta(hours=1)
        
        if client_ip in self.request_history:
            self.request_history[client_ip] = [
                (ts, req_type) for ts, req_type in self.request_history[client_ip]
                if ts > hour_ago
            ]
            
            # Remove IP if no recent requests
            if not self.request_history[client_ip]:
                del self.request_history[client_ip]


class IPBasedRateLimiter:
    """
    Simple IP-based rate limiter for specific endpoints
    Can be used as a dependency in route handlers
    """
    
    def __init__(self, requests_per_minute: int = 5):
        self.requests_per_minute = requests_per_minute
        self.request_counts: Dict[str, Tuple[datetime, int]] = {}
    
    async def __call__(self, request: Request):
        """Check rate limit for this request"""
        client_ip = self._get_client_ip(request)
        now = datetime.now()
        
        # Get or initialize count for this IP
        if client_ip in self.request_counts:
            last_reset, count = self.request_counts[client_ip]
            
            # Reset if more than a minute has passed
            if now - last_reset > timedelta(minutes=1):
                self.request_counts[client_ip] = (now, 1)
            else:
                # Check if limit exceeded
                if count >= self.requests_per_minute:
                    raise HTTPException(
                        status_code=429,
                        detail=f"Rate limit exceeded. Maximum {self.requests_per_minute} requests per minute."
                    )
                
                # Increment count
                self.request_counts[client_ip] = (last_reset, count + 1)
        else:
            # First request from this IP
            self.request_counts[client_ip] = (now, 1)
        
        return True
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        return request.client.host if request.client else "unknown"

# Made with Bob
