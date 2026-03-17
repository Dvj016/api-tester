from fastapi import APIRouter
import httpx
import time
from app.models import TestRequest, TestResponse
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key, sanitize_error_message
from app.config import settings

router = APIRouter(prefix="/replicate", tags=["Replicate"])
logger = setup_logger(__name__)

# Popular Replicate models
REPLICATE_MODELS = [
    "meta/llama-2-70b-chat",
    "mistralai/mistral-7b-instruct-v0.2",
    "stability-ai/sdxl",
    "meta/meta-llama-3-70b-instruct",
]

REPLICATE_API_BASE = "https://api.replicate.com/v1"


@router.get("/models")
async def get_models():
    """Get list of popular Replicate models"""
    return {"models": REPLICATE_MODELS}


@router.post("/test", response_model=TestResponse)
async def test_replicate_key(request: TestRequest):
    """
    Test a Replicate API key
    
    Args:
        request: TestRequest containing api_key and model
        
    Returns:
        TestResponse with validation results
    """
    masked_key = mask_api_key(request.api_key)
    logger.info(f"Testing Replicate API key: {masked_key} with model: {request.model}")
    
    if not request.api_key or len(request.api_key) < 10:
        logger.warning(f"Invalid key format for {masked_key}")
        return TestResponse(
            valid=False,
            provider="replicate",
            model=request.model,
            message="Invalid API key format",
            error="API key appears to be too short or empty"
        )
    
    try:
        start_time = time.time()
        
        # Test by listing models (lightweight operation)
        async with httpx.AsyncClient(timeout=settings.api_timeout) as client:
            response = await client.get(
                f"{REPLICATE_API_BASE}/models",
                headers={
                    "Authorization": f"Token {request.api_key}",
                    "Content-Type": "application/json"
                }
            )
        
        latency_ms = (time.time() - start_time) * 1000
        
        if response.status_code == 200:
            logger.info(f"Replicate key {masked_key} is valid. Latency: {latency_ms:.2f}ms")
            
            return TestResponse(
                valid=True,
                provider="replicate",
                model=request.model,
                latency_ms=round(latency_ms, 2),
                message="API key is valid and working",
                response_preview="Successfully authenticated with Replicate API"
            )
        elif response.status_code in [401, 403]:
            logger.warning(f"Replicate key {masked_key} authentication failed")
            return TestResponse(
                valid=False,
                provider="replicate",
                model=request.model,
                message="Invalid API key",
                error="Authentication failed. Please check your API key."
            )
        else:
            error_data = response.json() if response.text else {}
            error_message = sanitize_error_message(error_data.get("detail", response.text))
            
            logger.error(f"Replicate API error for key {masked_key}: {error_message}")
            return TestResponse(
                valid=False,
                provider="replicate",
                model=request.model,
                message="API request failed",
                error=error_message
            )
    
    except httpx.TimeoutException:
        logger.error(f"Timeout testing Replicate key {masked_key}")
        return TestResponse(
            valid=False,
            provider="replicate",
            model=request.model,
            message="Request timeout",
            error="The request timed out. Please try again."
        )
    
    except Exception as e:
        error_message = sanitize_error_message(str(e))
        logger.error(f"Unexpected error testing Replicate key {masked_key}: {error_message}")
        
        return TestResponse(
            valid=False,
            provider="replicate",
            model=request.model,
            message="Unexpected error occurred",
            error=error_message
        )

# Made with Bob
