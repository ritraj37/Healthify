from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=500, description="User message")
    user_id: Optional[str] = Field(None, description="Optional user identifier")
    session_id: Optional[str] = Field(None, description="Chat session identifier")
    image_data: Optional[str] = Field(None, description="Base64 encoded image data")

class ImageAnalysisRequest(BaseModel):
    image_data: str = Field(..., description="Base64 encoded image data")
    description: Optional[str] = Field(None, description="Optional description of the issue")
    body_part: Optional[str] = Field(None, description="Body part in the image")

class ImageAnalysisResponse(BaseModel):
    analysis: str = Field(..., description="AI analysis of the image")
    recommendations: List[str] = []
    urgency_level: str = Field("normal", description="Urgency level: normal, moderate, urgent")
    requires_doctor: bool = False

class ChatResponse(BaseModel):
    response: str = Field(..., description="AI response message")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Response confidence score")
    timestamp: datetime = Field(default_factory=datetime.now)
    session_id: Optional[str] = Field(None, description="Chat session identifier")

class HealthQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    category: Optional[str] = Field(None, description="Health category")
    urgency: Optional[str] = Field("normal", description="Query urgency level")

class HealthResponse(BaseModel):
    answer: str
    category: str
    confidence: float
    recommendations: List[str] = []
    emergency_alert: bool = False

class ErrorResponse(BaseModel):
    error: str
    code: int
    message: str