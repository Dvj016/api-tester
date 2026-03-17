"""
AI API Key Tester - Backend API
Copyright (c) 2024-2026 Digvijay Singh Baghel (Dvj016)
Licensed under MIT License - See LICENSE file for details
Repository: https://github.com/Dvj016/api-tester
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models import HealthResponse
from app.routers import openai, anthropic, gemini, nvidia, cohere, mistral, huggingface, replicate, together, perplexity, analytics, groq, fireworks, ai21
from app.utils.logger import setup_logger
from app.middleware import RateLimitMiddleware

# Setup logger
logger = setup_logger(__name__)

# Create FastAPI app
app = FastAPI(
    title="AI API Key Tester",
    description="Test API keys for various AI providers",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS with tighter restrictions
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Only allow needed methods
    allow_headers=["Content-Type", "Accept", "Authorization"],  # Specific headers only
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Add security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    
    # Prevent MIME type sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"
    
    # Prevent clickjacking
    response.headers["X-Frame-Options"] = "DENY"
    
    # Enable XSS protection
    response.headers["X-XSS-Protection"] = "1; mode=block"
    
    # Control referrer information
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    
    # Permissions policy (formerly Feature-Policy)
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    
    # Content Security Policy
    csp_directives = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  # Required for Next.js
        "style-src 'self' 'unsafe-inline'",  # Required for Tailwind
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        f"connect-src 'self' {' '.join(settings.cors_origins)}",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ]
    response.headers["Content-Security-Policy"] = "; ".join(csp_directives)
    
    # HSTS header (only in production, Render/Vercel handle this but adding for defense in depth)
    if settings.environment == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    return response

# Add rate limiting middleware
# 10 requests per minute, 100 requests per hour per IP
app.add_middleware(
    RateLimitMiddleware,
    requests_per_minute=10,
    requests_per_hour=100
)

# Include routers
app.include_router(analytics.router, prefix="/api")
app.include_router(openai.router, prefix="/api")
app.include_router(anthropic.router, prefix="/api")
app.include_router(gemini.router, prefix="/api")
app.include_router(nvidia.router, prefix="/api")
app.include_router(cohere.router, prefix="/api")
app.include_router(mistral.router, prefix="/api")
app.include_router(huggingface.router, prefix="/api")
app.include_router(replicate.router, prefix="/api")
app.include_router(together.router, prefix="/api")
app.include_router(perplexity.router, prefix="/api")
app.include_router(groq.router, prefix="/api")
app.include_router(fireworks.router, prefix="/api")
app.include_router(ai21.router, prefix="/api")


@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - health check"""
    logger.info("Health check requested")
    return HealthResponse(status="healthy")


@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    logger.info("Health check requested")
    return HealthResponse(status="healthy")


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("Starting AI API Key Tester backend")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"CORS origins: {settings.cors_origins}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Shutting down AI API Key Tester backend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development"
    )

# Made with Bob
