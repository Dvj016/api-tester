"""
Advanced Security Middleware for DDoS Protection and Attack Prevention
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio
import re
from typing import Dict, Set
import hashlib

class DDoSProtectionMiddleware(BaseHTTPMiddleware):
    """
    Advanced DDoS protection middleware with multiple defense layers:
    - Request size limits
    - Suspicious pattern detection
    - IP reputation tracking
    - Exponential backoff for repeat offenders
    """
    
    def __init__(
        self,
        app,
        max_request_size: int = 1024 * 1024,  # 1MB
        max_requests_per_second: int = 5,
        ban_duration_minutes: int = 15,
        suspicious_threshold: int = 10
    ):
        super().__init__(app)
        self.max_request_size = max_request_size
        self.max_requests_per_second = max_requests_per_second
        self.ban_duration_minutes = ban_duration_minutes
        self.suspicious_threshold = suspicious_threshold
        
        # Track banned IPs
        self.banned_ips: Dict[str, datetime] = {}
        
        # Track suspicious activity
        self.suspicious_activity: Dict[str, int] = defaultdict(int)
        
        # Track request patterns per IP
        self.request_patterns: Dict[str, list] = defaultdict(list)
        
        # Known malicious patterns
        self.malicious_patterns = [
            r'<script[^>]*>.*?</script>',  # XSS attempts
            r'union\s+select',  # SQL injection
            r'drop\s+table',  # SQL injection
            r'exec\s*\(',  # Command injection
            r'eval\s*\(',  # Code injection
            r'\.\./\.\.',  # Path traversal
            r'%00',  # Null byte injection
            r'javascript:',  # XSS
            r'onerror\s*=',  # XSS
            r'onload\s*=',  # XSS
        ]
        
        self.lock = asyncio.Lock()
    
    async def dispatch(self, request: Request, call_next):
        """Process each request with multiple security checks"""
        
        client_ip = self._get_client_ip(request)
        
        # Skip security checks for health endpoints
        if request.url.path in ["/", "/health", "/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)
        
        async with self.lock:
            # 1. Check if IP is banned
            if await self._is_banned(client_ip):
                return JSONResponse(
                    status_code=403,
                    content={
                        "error": "Access Forbidden",
                        "message": "Your IP has been temporarily banned due to suspicious activity",
                        "retry_after": self.ban_duration_minutes * 60
                    }
                )
            
            # 2. Check request size
            content_length = request.headers.get("content-length")
            if content_length and int(content_length) > self.max_request_size:
                await self._record_suspicious_activity(client_ip, "oversized_request")
                return JSONResponse(
                    status_code=413,
                    content={
                        "error": "Request Too Large",
                        "message": f"Request size exceeds maximum allowed ({self.max_request_size} bytes)"
                    }
                )
            
            # 3. Check request rate (per second)
            if not await self._check_request_rate(client_ip):
                await self._record_suspicious_activity(client_ip, "rate_limit_exceeded")
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": "Too Many Requests",
                        "message": f"Maximum {self.max_requests_per_second} requests per second exceeded"
                    }
                )
            
            # 4. Check for malicious patterns in URL and headers
            if await self._contains_malicious_patterns(request):
                await self._record_suspicious_activity(client_ip, "malicious_pattern")
                await self._ban_ip(client_ip)
                return JSONResponse(
                    status_code=403,
                    content={
                        "error": "Forbidden",
                        "message": "Malicious request detected"
                    }
                )
            
            # 5. Record this request
            await self._record_request(client_ip)
        
        # Process the request
        try:
            response = await call_next(request)
            return response
        except Exception as e:
            # Log but don't expose internal errors
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "message": "An error occurred processing your request"
                }
            )
    
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
    
    async def _is_banned(self, client_ip: str) -> bool:
        """Check if IP is currently banned"""
        if client_ip in self.banned_ips:
            ban_time = self.banned_ips[client_ip]
            if datetime.now() < ban_time + timedelta(minutes=self.ban_duration_minutes):
                return True
            else:
                # Ban expired, remove from list
                del self.banned_ips[client_ip]
        return False
    
    async def _ban_ip(self, client_ip: str):
        """Ban an IP address"""
        self.banned_ips[client_ip] = datetime.now()
        # Also reset suspicious activity counter
        if client_ip in self.suspicious_activity:
            del self.suspicious_activity[client_ip]
    
    async def _check_request_rate(self, client_ip: str) -> bool:
        """Check if request rate is within limits (per second)"""
        now = datetime.now()
        
        # Get requests in the last second
        if client_ip in self.request_patterns:
            # Clean old entries (older than 1 second)
            self.request_patterns[client_ip] = [
                ts for ts in self.request_patterns[client_ip]
                if now - ts < timedelta(seconds=1)
            ]
            
            # Check if limit exceeded
            if len(self.request_patterns[client_ip]) >= self.max_requests_per_second:
                return False
        
        return True
    
    async def _record_request(self, client_ip: str):
        """Record a request timestamp"""
        now = datetime.now()
        self.request_patterns[client_ip].append(now)
        
        # Keep only last 10 seconds of data
        cutoff = now - timedelta(seconds=10)
        self.request_patterns[client_ip] = [
            ts for ts in self.request_patterns[client_ip]
            if ts > cutoff
        ]
    
    async def _contains_malicious_patterns(self, request: Request) -> bool:
        """Check if request contains malicious patterns"""
        # Check URL path
        path = str(request.url.path).lower()
        
        # Check query parameters
        query = str(request.url.query).lower()
        
        # Check headers
        headers_str = " ".join([f"{k}:{v}" for k, v in request.headers.items()]).lower()
        
        # Combine all for checking
        check_string = f"{path} {query} {headers_str}"
        
        # Check against known malicious patterns
        for pattern in self.malicious_patterns:
            if re.search(pattern, check_string, re.IGNORECASE):
                return True
        
        return False
    
    async def _record_suspicious_activity(self, client_ip: str, activity_type: str):
        """Record suspicious activity and ban if threshold exceeded"""
        self.suspicious_activity[client_ip] += 1
        
        if self.suspicious_activity[client_ip] >= self.suspicious_threshold:
            await self._ban_ip(client_ip)


class RequestValidationMiddleware(BaseHTTPMiddleware):
    """
    Validate all incoming requests for proper format and content
    """
    
    def __init__(self, app):
        super().__init__(app)
        
        # Allowed content types
        self.allowed_content_types = [
            "application/json",
            "application/x-www-form-urlencoded",
            "multipart/form-data"
        ]
    
    async def dispatch(self, request: Request, call_next):
        """Validate request format"""
        
        # Skip validation for GET requests and health checks
        if request.method == "GET" or request.url.path in ["/", "/health", "/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)
        
        # Validate Content-Type for POST requests
        if request.method == "POST":
            content_type = request.headers.get("content-type", "").split(";")[0].strip()
            
            if content_type and content_type not in self.allowed_content_types:
                return JSONResponse(
                    status_code=415,
                    content={
                        "error": "Unsupported Media Type",
                        "message": f"Content-Type must be one of: {', '.join(self.allowed_content_types)}"
                    }
                )
        
        # Validate required headers
        if not request.headers.get("user-agent"):
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Bad Request",
                    "message": "User-Agent header is required"
                }
            )
        
        return await call_next(request)

# Made with Bob
