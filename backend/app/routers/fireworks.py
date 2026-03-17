from fastapi import APIRouter
import httpx
import time
from app.models import TestRequest, TestResponse
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key, sanitize_error_message
from app.config import settings

router = APIRouter(prefix="/fireworks", tags=["Fireworks AI"])
logger = setup_logger(__name__)

# Available Fireworks AI models
FIREWORKS_MODELS = [
    "accounts/fireworks/models/llama-v3p1-70b-instruct",
    "accounts/fireworks/models/llama-v3p1-8b-instruct",
    "accounts/fireworks/models/mixtral-8x7b-instruct",
    "accounts/fireworks/models/qwen2p5-72b-instruct",
]

FIREWORKS_API_BASE = "https://api.fireworks.ai/inference/v1"


@router.get("/models")
async def get_models():
    """Get list of available Fireworks AI models"""
    return {"models": FIREWORKS_MODELS}


@router.post("/test", response_model=TestResponse)
async def test_fireworks_key(request: TestRequest):
    """
    Test a Fireworks AI API key
    
    Args:
        request: TestRequest containing api_key and model
        
    Returns:
        TestResponse with validation results
    """
    masked_key = mask_api_key(request.api_key)
    logger.info(f"Testing Fireworks AI API key: {masked_key} with model: {request.model}")
    
    if not request.api_key or len(request.api_key) < 10:
        logger.warning(f"Invalid key format for {masked_key}")
        return TestResponse(
            valid=False,
            provider="fireworks",
            model=request.model,
            message="Invalid API key format",
            error="API key appears to be too short or empty"
        )
    
    try:
        # Start timing
        start_time = time.time()
        
        # Make a minimal test request using httpx
        async with httpx.AsyncClient(timeout=settings.api_timeout) as client:
            response = await client.post(
                f"{FIREWORKS_API_BASE}/chat/completions",
                headers={
                    "Authorization": f"Bearer {request.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": request.model,
                    "messages": [
                        {"role": "user", "content": "Say 'API key valid' in 3 words"}
                    ],
                    "max_tokens": 10,
                    "temperature": 0
                }
            )
        
        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000
        
        # Check response status
        if response.status_code == 200:
            data = response.json()
            response_text = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
            
            logger.info(f"Fireworks AI key {masked_key} is valid. Latency: {latency_ms:.2f}ms")
            
            return TestResponse(
                valid=True,
                provider="fireworks",
                model=request.model,
                latency_ms=round(latency_ms, 2),
                message="API key is valid and working",
                response_preview=response_text
            )
        elif response.status_code in [401, 403]:
            logger.warning(f"Fireworks AI key {masked_key} authentication failed")
            return TestResponse(
                valid=False,
                provider="fireworks",
                model=request.model,
                message="Invalid API key",
                error="Authentication failed. Please check your API key."
            )
        else:
            error_data = response.json() if response.text else {}
            error_message = sanitize_error_message(error_data.get("error", {}).get("message", response.text))
            
            logger.error(f"Fireworks AI API error for key {masked_key}: {error_message}")
            return TestResponse(
                valid=False,
                provider="fireworks",
                model=request.model,
                message="API request failed",
                error=error_message
            )
    
    except httpx.TimeoutException:
        logger.error(f"Timeout testing Fireworks AI key {masked_key}")
        return TestResponse(
            valid=False,
            provider="fireworks",
            model=request.model,
            message="Request timeout",
            error="The request took too long to complete. Please try again."
        )
    
    except Exception as e:
        error_message = sanitize_error_message(str(e))
        logger.error(f"Unexpected error testing Fireworks AI key {masked_key}: {error_message}")
        
        return TestResponse(
            valid=False,
            provider="fireworks",
            model=request.model,
            message="Unexpected error occurred",
            error=error_message
        )

# Made with Bob