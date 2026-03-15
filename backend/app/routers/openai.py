from fastapi import APIRouter, HTTPException
from openai import OpenAI, OpenAIError
import time
from app.models import TestRequest, TestResponse
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key, validate_api_key_format
from app.config import settings

router = APIRouter(prefix="/openai", tags=["OpenAI"])
logger = setup_logger(__name__)

# Available OpenAI models
OPENAI_MODELS = [
    "gpt-4",
    "gpt-4-turbo-preview",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k",
]


@router.get("/models")
async def get_models():
    """Get list of available OpenAI models"""
    return {"models": OPENAI_MODELS}


@router.post("/test", response_model=TestResponse)
async def test_openai_key(request: TestRequest):
    """
    Test an OpenAI API key
    
    Args:
        request: TestRequest containing api_key and model
        
    Returns:
        TestResponse with validation results
    """
    masked_key = mask_api_key(request.api_key)
    logger.info(f"Testing OpenAI API key: {masked_key} with model: {request.model}")
    
    # Validate key format
    is_valid, error_msg = validate_api_key_format(request.api_key, "openai")
    if not is_valid:
        logger.warning(f"Invalid key format for {masked_key}: {error_msg}")
        return TestResponse(
            valid=False,
            provider="openai",
            model=request.model,
            message="Invalid API key format",
            error=error_msg
        )
    
    try:
        # Initialize OpenAI client
        client = OpenAI(
            api_key=request.api_key,
            timeout=settings.api_timeout
        )
        
        # Start timing
        start_time = time.time()
        
        # Make a minimal test request
        response = client.chat.completions.create(
            model=request.model,
            messages=[
                {"role": "user", "content": "Say 'API key is valid' in 3 words"}
            ],
            max_tokens=10,
            temperature=0
        )
        
        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000
        
        # Extract response
        response_text = response.choices[0].message.content.strip()
        
        logger.info(f"OpenAI key {masked_key} is valid. Latency: {latency_ms:.2f}ms")
        
        return TestResponse(
            valid=True,
            provider="openai",
            model=request.model,
            latency_ms=round(latency_ms, 2),
            message="API key is valid and working",
            response_preview=response_text
        )
        
    except OpenAIError as e:
        error_message = str(e)
        logger.error(f"OpenAI API error for key {masked_key}: {error_message}")
        
        # Determine if it's an auth error or other error
        if "authentication" in error_message.lower() or "api key" in error_message.lower():
            return TestResponse(
                valid=False,
                provider="openai",
                model=request.model,
                message="Invalid API key",
                error="Authentication failed. Please check your API key."
            )
        else:
            return TestResponse(
                valid=False,
                provider="openai",
                model=request.model,
                message="API request failed",
                error=error_message
            )
    
    except Exception as e:
        error_message = str(e)
        logger.error(f"Unexpected error testing OpenAI key {masked_key}: {error_message}")
        
        return TestResponse(
            valid=False,
            provider="openai",
            model=request.model,
            message="Unexpected error occurred",
            error=error_message
        )

# Made with Bob
