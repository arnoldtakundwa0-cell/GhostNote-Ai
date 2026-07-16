"""
FastAPI Application Entry Point
Main application factory and configuration
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZIPMiddleware
import uvicorn

from app.api.routes import audio, transform, beats, projects, payments, convert
from app.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """
    Manages application startup and shutdown events
    """
    logger.info("Starting GhostNote-Ai application...")
    
    # Startup
    logger.info("Application startup complete")
    yield
    
    # Shutdown
    logger.info("Shutting down GhostNote-Ai application...")


# Create FastAPI application
app = FastAPI(
    title="GhostNote-Ai",
    description="Voice recording and transformation with beat synchronization",
    version="0.1.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZIP compression middleware
app.add_middleware(GZIPMiddleware, minimum_size=1000)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "0.1.0",
        "service": "ghostnote-api"
    }


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "GhostNote-Ai API",
        "version": "0.1.0",
        "description": "Voice recording and transformation application",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc",
        }
    }


# Include API routes
app.include_router(audio.router, prefix="/api/audio", tags=["audio"])
app.include_router(transform.router, prefix="/api/transform", tags=["transform"])
app.include_router(beats.router, prefix="/api/beats", tags=["beats"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])
app.include_router(convert.router, prefix="/api/transform", tags=["transform"])


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True,
        log_level=settings.LOG_LEVEL.lower(),
    )
