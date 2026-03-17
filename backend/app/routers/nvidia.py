from fastapi import APIRouter
import httpx
import time
from app.models import TestRequest, TestResponse
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key, validate_api_key_format, sanitize_error_message
from app.config import settings

router = APIRouter(prefix="/nvidia", tags=["NVIDIA NIM"])
logger = setup_logger(__name__)

# Available NVIDIA NIM models
NVIDIA_MODELS = [
    "meta/llama-3.1-8b-instruct",
    "meta/llama-3.1-70b-instruct",
    "mistralai/mixtral-8x7b-instruct-v0.1",
    "microsoft/phi-3-mini-128k-instruct",
]

# NVIDIA NIM API endpoint
NVIDIA_API_BASE = "https://integrate.api.nvidia.com/v1"


@router.get("/models")
async def get_models():
    """Get list of available NVIDIA NIM models"""
    return {"models": NVIDIA_MODELS}


@router.post("/test", response_model=TestResponse)
async def test_nvidia_key(request: TestRequest):
    """
    Test an NVIDIA NIM API key
    
    Args:
        request: TestRequest containing api_key and model
        
    Returns:
        TestResponse with validation results
    """
    masked_key = mask_api_key(request.api_key)
    logger.info(f"Testing NVIDIA API key: {masked_key} with model: {request.model}")
    
    # Validate key format
    is_valid, error_msg = validate_api_key_format(request.api_key, "nvidia")
    if not is_valid:
        logger.warning(f"Invalid key format for {masked_key}: {error_msg}")
        return TestResponse(
            valid=False,
            provider="nvidia",
            model=request.model,
            message="Invalid API key format",
            error=error_msg
        )
    
    try:
        # Start timing
        start_time = time.time()
        
        # Make a minimal test request using httpx
        async with httpx.AsyncClient(timeout=settings.api_timeout) as client:
            response = await client.post(
                f"{NVIDIA_API_BASE}/chat/completions",
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
            
            logger.info(f"NVIDIA key {masked_key} is valid. Latency: {latency_ms:.2f}ms")
            
            return TestResponse(
                valid=True,
                provider="nvidia",
                model=request.model,
                latency_ms=round(latency_ms, 2),
                message="API key is valid and working",
                response_preview=response_text
            )
        elif response.status_code in [401, 403]:
            logger.warning(f"NVIDIA key {masked_key} authentication failed")
            return TestResponse(
                valid=False,
                provider="nvidia",
                model=request.model,
                message="Invalid API key",
                error="Authentication failed. Please check your API key."
            )
        else:
            error_data = response.json() if response.text else {}
            error_message = sanitize_error_message(error_data.get("error", {}).get("message", response.text))
            
            logger.error(f"NVIDIA API error for key {masked_key}: {error_message}")
            return TestResponse(
                valid=False,
                provider="nvidia",
                model=request.model,
                message="API request failed",
                error=error_message
            )
    
    except httpx.TimeoutException:
        logger.error(f"Timeout testing NVIDIA key {masked_key}")
        return TestResponse(
            valid=False,
            provider="nvidia",
            model=request.model,
            message="Request timeout",
            error="The request timed out. Please try again."
        )
    
    except Exception as e:
        error_message = str(e)
        logger.error(f"Unexpected error testing NVIDIA key {masked_key}: {error_message}")
        
        return TestResponse(
            valid=False,
            provider="nvidia",
            model=request.model,
            message="Unexpected error occurred",
            error=error_message
        )

# Made with Bob
