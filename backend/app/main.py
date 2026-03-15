from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models import HealthResponse
from app.routers import openai, anthropic, gemini, nvidia, cohere, mistral, huggingface, replicate, together, perplexity
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

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiting middleware
# 10 requests per minute, 100 requests per hour per IP
app.add_middleware(
    RateLimitMiddleware,
    requests_per_minute=10,
    requests_per_hour=100
)

# Include routers
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
