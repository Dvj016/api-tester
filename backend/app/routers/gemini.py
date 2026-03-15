from fastapi import APIRouter
import google.generativeai as genai
import time
from app.models import TestRequest, TestResponse
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key, validate_api_key_format
from app.config import settings

router = APIRouter(prefix="/gemini", tags=["Google Gemini"])
logger = setup_logger(__name__)

# Available Gemini models
GEMINI_MODELS = [
    "gemini-pro",
    "gemini-pro-vision",
]


@router.get("/models")
async def get_models():
    """Get list of available Gemini models"""
    return {"models": GEMINI_MODELS}


@router.post("/test", response_model=TestResponse)
async def test_gemini_key(request: TestRequest):
    """
    Test a Google Gemini API key
    
    Args:
        request: TestRequest containing api_key and model
        
    Returns:
        TestResponse with validation results
    """
    masked_key = mask_api_key(request.api_key)
    logger.info(f"Testing Gemini API key: {masked_key} with model: {request.model}")
    
    # Validate key format
    is_valid, error_msg = validate_api_key_format(request.api_key, "gemini")
    if not is_valid:
        logger.warning(f"Invalid key format for {masked_key}: {error_msg}")
        return TestResponse(
            valid=False,
            provider="gemini",
            model=request.model,
            message="Invalid API key format",
            error=error_msg
        )
    
    try:
        # Configure Gemini
        genai.configure(api_key=request.api_key)
        
        # Initialize model
        model = genai.GenerativeModel(request.model)
        
        # Start timing
        start_time = time.time()
        
        # Make a minimal test request
        response = model.generate_content(
            "Say 'API key valid' in 3 words",
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=10,
                temperature=0,
            )
        )
        
        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000
        
        # Extract response
        response_text = response.text.strip() if response.text else ""
        
        logger.info(f"Gemini key {masked_key} is valid. Latency: {latency_ms:.2f}ms")
        
        return TestResponse(
            valid=True,
            provider="gemini",
            model=request.model,
            latency_ms=round(latency_ms, 2),
            message="API key is valid and working",
            response_preview=response_text
        )
        
    except Exception as e:
        error_message = str(e)
        logger.error(f"Gemini API error for key {masked_key}: {error_message}")
        
        # Determine if it's an auth error or other error
        if "api key" in error_message.lower() or "authentication" in error_message.lower() or "401" in error_message or "403" in error_message:
            return TestResponse(
                valid=False,
                provider="gemini",
                model=request.model,
                message="Invalid API key",
                error="Authentication failed. Please check your API key."
            )
        else:
            return TestResponse(
                valid=False,
                provider="gemini",
                model=request.model,
                message="API request failed",
                error=error_message
            )

# Made with Bob
