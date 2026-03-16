from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import Optional
import httpx
import time
import os
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


class VoiceGenerateRequest(BaseModel):
    """Request model for voice generation"""
    text: str = Field(..., description="Text to convert to speech")
    voice_id: Optional[str] = Field("21m00Tcm4TlvDq8ikWAM", description="Voice ID")
    model_id: Optional[str] = Field("eleven_monolingual_v1", description="Model ID")


@router.post("/elevenlabs/generate-voice")
async def generate_voice(request: VoiceGenerateRequest):
    """
    Generate voice audio using ElevenLabs API
    
    This endpoint proxies the request to ElevenLabs to avoid exposing API keys on frontend.
    The API key is stored securely in backend environment variables.
    """
    try:
        # Get API key from environment
        api_key = os.getenv("ELEVENLABS_API_KEY")
        
        if not api_key:
            logger.error("ELEVENLABS_API_KEY not found in environment variables")
            raise HTTPException(
                status_code=500,
                detail="ElevenLabs API key not configured on server"
            )
        
        logger.info(f"Generating voice for text: {request.text[:50]}...")
        
        # Call ElevenLabs API
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{request.voice_id}",
                headers={
                    "Accept": "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": api_key,
                },
                json={
                    "text": request.text,
                    "model_id": request.model_id,
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.75,
                    }
                }
            )
            
            if response.status_code == 200:
                logger.info("Voice generated successfully")
                # Return audio as response
                return Response(
                    content=response.content,
                    media_type="audio/mpeg",
                    headers={
                        "Content-Disposition": "inline; filename=voice.mp3"
                    }
                )
            
            elif response.status_code == 401:
                error_detail = response.text
                logger.error(f"Invalid ElevenLabs API key. Response: {error_detail}")
                logger.error(f"API key used: {mask_api_key(api_key)}")
                raise HTTPException(
                    status_code=401,
                    detail=f"Invalid API key: {error_detail}"
                )
            
            elif response.status_code == 429:
                logger.warning("ElevenLabs quota exceeded")
                raise HTTPException(
                    status_code=429,
                    detail="Quota exceeded. Please try again later."
                )
            
            else:
                error_text = response.text
                logger.error(f"ElevenLabs API error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"API error: {error_text[:100]}"
                )
    
    except httpx.TimeoutException:
        logger.error("ElevenLabs API request timeout")
        raise HTTPException(
            status_code=504,
            detail="Request timeout. Please try again."
        )
    
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"Error generating voice: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating voice: {str(e)}"
        )

# Made with Bob
