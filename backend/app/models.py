from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import datetime


class TestRequest(BaseModel):
    """Request model for API key testing"""
    api_key: str = Field(..., min_length=10, max_length=500, description="API key to test")
    model: str = Field(..., min_length=1, max_length=200, description="Model to test with")
    
    @validator('api_key')
    def validate_api_key(cls, v):
        """Validate and sanitize API key"""
        if not v or not v.strip():
            raise ValueError('API key cannot be empty or whitespace only')
        # Remove any leading/trailing whitespace
        v = v.strip()
        # Check for obviously invalid patterns
        if v.count(' ') > 2:  # API keys shouldn't have many spaces
            raise ValueError('API key format appears invalid')
        return v
    
    @validator('model')
    def validate_model(cls, v):
        """Validate model name"""
        if not v or not v.strip():
            raise ValueError('Model name cannot be empty')
        return v.strip()


class TestResponse(BaseModel):
    """Response model for API key testing"""
    valid: bool = Field(..., description="Whether the API key is valid")
    provider: str = Field(..., description="AI provider")
    model: str = Field(..., description="Model tested")
    latency_ms: Optional[float] = Field(None, description="Response latency in milliseconds")
    message: str = Field(..., description="Status message")
    error: Optional[str] = Field(None, description="Error message if any")
    response_preview: Optional[str] = Field(None, description="Preview of API response")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = "healthy"
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Made with Bob
