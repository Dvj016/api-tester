from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import httpx
import time
from app.utils.logger import setup_logger
from app.utils.security import mask_api_key

router = APIRouter(tags=["elevenlabs"])
logger = setup_logger(__name__)


class ElevenLabsTestRequest(BaseModel):
    """Request model for ElevenLabs API key testing"""
    api_key: str = Field(..., description="ElevenLabs API key")
    model: Optional[str] = Field("eleven_monolingual_v1", description="Model ID")


class ElevenLabsTestResponse(BaseModel):
    """Response model for ElevenLabs API key testing"""
    valid: bool
    message: str
    response_time: Optional[float] = None
    voice_count: Optional[int] = None
    quota_remaining: Optional[str] = None


@router.get("/elevenlabs/models")
async def get_elevenlabs_models():
    """Get available ElevenLabs models"""
    return {
        "models": [
            "eleven_monolingual_v1",
            "eleven_multilingual_v1",
            "eleven_multilingual_v2",
            "eleven_turbo_v2"
        ]
    }


@router.post("/elevenlabs/test", response_model=ElevenLabsTestResponse)
async def test_elevenlabs_key(request: ElevenLabsTestRequest):
    """
    Test ElevenLabs API key validity
    
    This endpoint validates the API key by:
    1. Fetching available voices
    2. Checking quota information
    3. Measuring response time
    """
    start_time = time.time()
    
    try:
        logger.info(f"Testing ElevenLabs API key: {mask_api_key(request.api_key)}")
        
        # Test API key by fetching voices
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                "https://api.elevenlabs.io/v1/voices",
                headers={
                    "xi-api-key": request.api_key,
                }
            )
            
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                voices = data.get("voices", [])
                voice_count = len(voices)
                
                # Try to get user info for quota
                quota_info = "Available"
                try:
                    user_response = await client.get(
                        "https://api.elevenlabs.io/v1/user",
                        headers={"xi-api-key": request.api_key}
                    )
                    if user_response.status_code == 200:
                        user_data = user_response.json()
                        subscription = user_data.get("subscription", {})
                        character_count = subscription.get("character_count", 0)
                        character_limit = subscription.get("character_limit", 0)
                        quota_info = f"{character_count}/{character_limit} characters used"
                except Exception as e:
                    logger.warning(f"Could not fetch quota info: {str(e)}")
                
                logger.info(f"ElevenLabs API key valid. Voices: {voice_count}, Response time: {response_time:.2f}s")
                
                return ElevenLabsTestResponse(
                    valid=True,
                    message=f"API key is valid! Found {voice_count} voices available.",
                    response_time=response_time,
                    voice_count=voice_count,
                    quota_remaining=quota_info
                )
            
            elif response.status_code == 401:
                logger.warning(f"Invalid ElevenLabs API key: {mask_api_key(request.api_key)}")
                return ElevenLabsTestResponse(
                    valid=False,
                    message="Invalid API key. Please check your key and try again.",
                    response_time=response_time
                )
            
            elif response.status_code == 429:
                logger.warning(f"ElevenLabs quota exceeded for key: {mask_api_key(request.api_key)}")
                return ElevenLabsTestResponse(
                    valid=False,
                    message="Quota exceeded. You've used all your credits for this month.",
                    response_time=response_time
                )
            
            else:
                error_text = response.text
                logger.error(f"ElevenLabs API error: {response.status_code} - {error_text}")
                return ElevenLabsTestResponse(
                    valid=False,
                    message=f"API error: {response.status_code}. {error_text[:100]}",
                    response_time=response_time
                )
    
    except httpx.TimeoutException:
        response_time = time.time() - start_time
        logger.error("ElevenLabs API request timeout")
        return ElevenLabsTestResponse(
            valid=False,
            message="Request timeout. Please try again.",
            response_time=response_time
        )
    
    except Exception as e:
        response_time = time.time() - start_time
        logger.error(f"Error testing ElevenLabs API key: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error testing API key: {str(e)}"
        )

# Made with Bob
