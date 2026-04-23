import os
from typing import Optional

class Config:
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # CORS Configuration
    ALLOWED_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:5500",
        "https://healthify.com"
    ]
    
    # AI Configuration
    MAX_TOKENS: int = 150
    TEMPERATURE: float = 0.7
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 30
    
    # Security
    API_KEY: Optional[str] = os.getenv("API_KEY")
    
    # Health Topics
    HEALTH_TOPICS = [
        "symptoms", "medication", "diet", "exercise", "prevention",
        "emergency", "appointment", "doctor", "treatment", "diagnosis"
    ]