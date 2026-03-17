from fastapi import APIRouter
import httpx
import time
from app.models import TestRequest, TestResponse
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key, sanitize_error_message
from app.config import settings

router = APIRouter(prefix="/ai21", tags=["AI21 Labs"])
logger = setup_logger(__name__)

# Available AI21 Labs models
AI21_MODELS = [
    "jamba-1.5-large",
    "jamba-1.5-mini",
    "jamba-instruct",
    "j2-ultra",
    "j2-mid",
]

AI21_API_BASE = "https://api.ai21.com/studio/v1"


@router.get("/models")
async def get_models():
    """Get list of available AI21 Labs models"""
    return {"models": AI21_MODELS}


@router.post("/test", response_model=TestResponse)
async def test_ai21_key(request: TestRequest):
    """
    Test an AI21 Labs API key
    
    Args:
        request: TestRequest containing api_key and model
        
    Returns:
        TestResponse with validation results
    """
    masked_key = mask_api_key(request.api_key)
    logger.info(f"Testing AI21 Labs API key: {masked_key} with model: {request.model}")
    
    if not request.api_key or len(request.api_key) < 10:
        logger.warning(f"Invalid key format for {masked_key}")
        return TestResponse(
            valid=False,
            provider="ai21",
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
                f"{AI21_API_BASE}/chat/completions",
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
            
            logger.info(f"AI21 Labs key {masked_key} is valid. Latency: {latency_ms:.2f}ms")
            
            return TestResponse(
                valid=True,
                provider="ai21",
                model=request.model,
                latency_ms=round(latency_ms, 2),
                message="API key is valid and working",
                response_preview=response_text
            )
        elif response.status_code in [401, 403]:
            logger.warning(f"AI21 Labs key {masked_key} authentication failed")
            return TestResponse(
                valid=False,
                provider="ai21",
                model=request.model,
                message="Invalid API key",
                error="Authentication failed. Please check your API key."
            )
        else:
            error_data = response.json() if response.text else {}
            error_message = sanitize_error_message(error_data.get("detail", error_data.get("message", response.text)))
            
            logger.error(f"AI21 Labs API error for key {masked_key}: {error_message}")
            return TestResponse(
                valid=False,
                provider="ai21",
                model=request.model,
                message="API request failed",
                error=error_message
            )
    
    except httpx.TimeoutException:
        logger.error(f"Timeout testing AI21 Labs key {masked_key}")
        return TestResponse(
            valid=False,
            provider="ai21",
            model=request.model,
            message="Request timeout",
            error="The request took too long to complete. Please try again."
        )
    
    except Exception as e:
        error_message = sanitize_error_message(str(e))
        logger.error(f"Unexpected error testing AI21 Labs key {masked_key}: {error_message}")
        
        return TestResponse(
            valid=False,
            provider="ai21",
            model=request.model,
            message="Unexpected error occurred",
            error=error_message
        )

# Made with Bob