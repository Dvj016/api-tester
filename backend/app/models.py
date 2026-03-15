from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class TestRequest(BaseModel):
    """Request model for API key testing"""
    api_key: str = Field(..., description="API key to test")
    model: str = Field(..., description="Model to test with")


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
