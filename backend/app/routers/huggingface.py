from fastapi import APIRouter
import httpx
import time
from app.models import TestRequest, TestResponse
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key, sanitize_error_message
from app.config import settings

router = APIRouter(prefix="/huggingface", tags=["Hugging Face"])
logger = setup_logger(__name__)

# Popular Hugging Face models for inference
HUGGINGFACE_MODELS = [
    "gpt2",
    "meta-llama/Llama-2-7b-chat-hf",
    "mistralai/Mistral-7B-Instruct-v0.2",
    "google/flan-t5-base",
    "facebook/opt-1.3b",
]

HUGGINGFACE_API_BASE = "https://api-inference.huggingface.co/models"


@router.get("/models")
async def get_models():
    """Get list of popular Hugging Face models"""
    return {"models": HUGGINGFACE_MODELS}


@router.post("/test", response_model=TestResponse)
async def test_huggingface_key(request: TestRequest):
    """
    Test a Hugging Face API key
    
    Args:
        request: TestRequest containing api_key and model
        
    Returns:
        TestResponse with validation results
    """
    masked_key = mask_api_key(request.api_key)
    logger.info(f"Testing Hugging Face API key: {masked_key} with model: {request.model}")
    
    if not request.api_key or len(request.api_key) < 10:
        logger.warning(f"Invalid key format for {masked_key}")
        return TestResponse(
            valid=False,
            provider="huggingface",
            model=request.model,
            message="Invalid API key format",
            error="API key appears to be too short or empty"
        )
    
    try:
        start_time = time.time()
        
        async with httpx.AsyncClient(timeout=settings.api_timeout) as client:
            response = await client.post(
                f"{HUGGINGFACE_API_BASE}/{request.model}",
                headers={
                    "Authorization": f"Bearer {request.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "inputs": "Say 'API key valid' in 3 words",
                    "parameters": {
                        "max_new_tokens": 10,
                        "temperature": 0.1
                    }
                }
            )
        
        latency_ms = (time.time() - start_time) * 1000
        
        if response.status_code == 200:
            data = response.json()
            # Handle different response formats
            if isinstance(data, list) and len(data) > 0:
                response_text = data[0].get("generated_text", "").strip()
            elif isinstance(data, dict):
                response_text = data.get("generated_text", str(data))
            else:
                response_text = str(data)
            
            logger.info(f"Hugging Face key {masked_key} is valid. Latency: {latency_ms:.2f}ms")
            
            return TestResponse(
                valid=True,
                provider="huggingface",
                model=request.model,
                latency_ms=round(latency_ms, 2),
                message="API key is valid and working",
                response_preview=response_text[:200]  # Limit preview length
            )
        elif response.status_code in [401, 403]:
            logger.warning(f"Hugging Face key {masked_key} authentication failed")
            return TestResponse(
                valid=False,
                provider="huggingface",
                model=request.model,
                message="Invalid API key",
                error="Authentication failed. Please check your API key."
            )
        else:
            error_data = response.json() if response.text else {}
            error_message = sanitize_error_message(error_data.get("error", response.text))
            
            logger.error(f"Hugging Face API error for key {masked_key}: {error_message}")
            return TestResponse(
                valid=False,
                provider="huggingface",
                model=request.model,
                message="API request failed",
                error=error_message
            )
    
    except httpx.TimeoutException:
        logger.error(f"Timeout testing Hugging Face key {masked_key}")
        return TestResponse(
            valid=False,
            provider="huggingface",
            model=request.model,
            message="Request timeout",
            error="The request timed out. Model may be loading. Please try again."
        )
    
    except Exception as e:
        error_message = sanitize_error_message(str(e))
        logger.error(f"Unexpected error testing Hugging Face key {masked_key}: {error_message}")
        
        return TestResponse(
            valid=False,
            provider="huggingface",
            model=request.model,
            message="Unexpected error occurred",
            error=error_message
        )

# Made with Bob
