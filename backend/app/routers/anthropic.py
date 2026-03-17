from fastapi import APIRouter
from anthropic import Anthropic, APIError
import time
from app.models import TestRequest, TestResponse
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key, validate_api_key_format, sanitize_error_message
from app.config import settings

router = APIRouter(prefix="/anthropic", tags=["Anthropic"])
logger = setup_logger(__name__)

# Available Anthropic models
ANTHROPIC_MODELS = [
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
    "claude-2.1",
    "claude-2.0",
]


@router.get("/models")
async def get_models():
    """Get list of available Anthropic models"""
    return {"models": ANTHROPIC_MODELS}


@router.post("/test", response_model=TestResponse)
async def test_anthropic_key(request: TestRequest):
    """
    Test an Anthropic API key
    
    Args:
        request: TestRequest containing api_key and model
        
    Returns:
        TestResponse with validation results
    """
    masked_key = mask_api_key(request.api_key)
    logger.info(f"Testing Anthropic API key: {masked_key} with model: {request.model}")
    
    # Validate key format
    is_valid, error_msg = validate_api_key_format(request.api_key, "anthropic")
    if not is_valid:
        logger.warning(f"Invalid key format for {masked_key}: {error_msg}")
        return TestResponse(
            valid=False,
            provider="anthropic",
            model=request.model,
            message="Invalid API key format",
            error=error_msg
        )
    
    try:
        # Initialize Anthropic client
        client = Anthropic(
            api_key=request.api_key,
            timeout=settings.api_timeout
        )
        
        # Start timing
        start_time = time.time()
        
        # Make a minimal test request
        response = client.messages.create(
            model=request.model,
            max_tokens=10,
            messages=[
                {"role": "user", "content": "Say 'API key valid' in 3 words"}
            ]
        )
        
        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000
        
        # Extract response
        response_text = response.content[0].text.strip() if response.content else ""
        
        logger.info(f"Anthropic key {masked_key} is valid. Latency: {latency_ms:.2f}ms")
        
        return TestResponse(
            valid=True,
            provider="anthropic",
            model=request.model,
            latency_ms=round(latency_ms, 2),
            message="API key is valid and working",
            response_preview=response_text
        )
        
    except APIError as e:
        error_message = sanitize_error_message(str(e))
        logger.error(f"Anthropic API error for key {masked_key}: {error_message}")
        
        # Determine if it's an auth error or other error
        if "authentication" in error_message.lower() or "api key" in error_message.lower() or "401" in error_message:
            return TestResponse(
                valid=False,
                provider="anthropic",
                model=request.model,
                message="Invalid API key",
                error="Authentication failed. Please check your API key."
            )
        else:
            return TestResponse(
                valid=False,
                provider="anthropic",
                model=request.model,
                message="API request failed",
                error=error_message
            )
    
    except Exception as e:
        error_message = sanitize_error_message(str(e))
        logger.error(f"Unexpected error testing Anthropic key {masked_key}: {error_message}")
        
        return TestResponse(
            valid=False,
            provider="anthropic",
            model=request.model,
            message="Unexpected error occurred",
            error=error_message
        )

# Made with Bob
