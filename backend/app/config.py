from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    environment: str = "development"
    log_level: str = "INFO"
    
    # CORS
    allowed_origins: str = "http://localhost:3000"
    
    # API Settings
    api_timeout: int = 30
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

# Made with Bob
