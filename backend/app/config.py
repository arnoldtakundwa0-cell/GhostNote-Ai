"""
Application Configuration
Loads and validates environment settings
"""

from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    # API Configuration
    API_HOST: str = Field(default="0.0.0.0", env="API_HOST")
    API_PORT: int = Field(default=8000, env="API_PORT")
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:3000"], env="CORS_ORIGINS")
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Database
    DATABASE_URL: str = Field(default="sqlite:///./ghostnote.db", env="DATABASE_URL")
    
    # Payment (Stripe)
    STRIPE_PUBLIC_KEY: str = Field(default="", env="STRIPE_PUBLIC_KEY")
    STRIPE_SECRET_KEY: str = Field(default="", env="STRIPE_SECRET_KEY")
    STRIPE_WEBHOOK_SECRET: str = Field(default="", env="STRIPE_WEBHOOK_SECRET")
    
    # File Upload
    MAX_UPLOAD_SIZE: int = Field(default=52428800, env="MAX_UPLOAD_SIZE")  # 50MB
    SUPPORTED_FORMATS: List[str] = Field(
        default=["mp3", "wav", "m4a", "flac", "ogg"],
        env="SUPPORTED_FORMATS"
    )
    UPLOAD_DIR: str = Field(default="/app/uploads", env="UPLOAD_DIR")
    CACHE_DIR: str = Field(default="/app/cache", env="CACHE_DIR")
    
    # Audio Processing
    DEFAULT_SAMPLE_RATE: int = Field(default=44100, env="DEFAULT_SAMPLE_RATE")
    DEFAULT_CHANNELS: int = Field(default=2, env="DEFAULT_CHANNELS")
    CHUNK_SIZE: int = Field(default=2048, env="CHUNK_SIZE")
    
    # ML/AI Configuration
    MODEL_PATH: str = Field(default="/app/models", env="MODEL_PATH")
    CUDA_ENABLED: bool = Field(default=False, env="CUDA_ENABLED")
    DEVICE: str = Field(default="cpu", env="DEVICE")
    
    # Autotune Parameters
    AUTOTUNE_SPEED: float = Field(default=0.5, env="AUTOTUNE_SPEED")
    AUTOTUNE_SCALE: float = Field(default=1.0, env="AUTOTUNE_SCALE")
    AUTOTUNE_VIBRATO: float = Field(default=0.0, env="AUTOTUNE_VIBRATO")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()
