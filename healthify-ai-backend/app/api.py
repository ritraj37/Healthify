from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from .schemas import ChatMessage, ChatResponse, HealthQuery, HealthResponse, ErrorResponse, ImageAnalysisRequest, ImageAnalysisResponse
from .ai_client import HealthifyAI
from .image_analyzer import MedicalImageAnalyzer
from .config import Config
import time
from collections import defaultdict
from datetime import datetime, timedelta

router = APIRouter(prefix="/api")

# Rate limiting storage
request_counts = defaultdict(list)
ai_client = HealthifyAI()
image_analyzer = MedicalImageAnalyzer()

def rate_limit_check(client_ip: str = None):
    """Simple rate limiting"""
    if not client_ip:
        return True
    
    now = datetime.now()
    minute_ago = now - timedelta(minutes=1)
    
    # Clean old requests
    request_counts[client_ip] = [
        req_time for req_time in request_counts[client_ip] 
        if req_time > minute_ago
    ]
    
    # Check rate limit
    if len(request_counts[client_ip]) >= Config.RATE_LIMIT_PER_MINUTE:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    
    request_counts[client_ip].append(now)
    return True

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(message: ChatMessage, _: bool = Depends(rate_limit_check)):
    """Main chat endpoint for AI health assistant"""
    try:
        response_text, confidence, is_emergency = ai_client.generate_response(
            message.message, 
            message.user_id
        )
        
        return ChatResponse(
            response=response_text,
            confidence=confidence,
            session_id=message.session_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing error: {str(e)}")

@router.post("/health-query", response_model=HealthResponse)
async def health_query(query: HealthQuery, _: bool = Depends(rate_limit_check)):
    """Specialized health query endpoint"""
    try:
        response_text, confidence, is_emergency = ai_client.generate_response(query.query)
        
        # Generate recommendations based on query
        recommendations = []
        if "appointment" in query.query.lower():
            recommendations = ["Book an appointment with our specialists", "Call (555) 123-4567"]
        elif "emergency" in query.query.lower():
            recommendations = ["Call 911 immediately", "Visit nearest emergency room"]
        else:
            recommendations = ["Consult with a healthcare professional", "Monitor symptoms"]
        
        return HealthResponse(
            answer=response_text,
            category=query.category or "general",
            confidence=confidence,
            recommendations=recommendations,
            emergency_alert=is_emergency
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health query processing error: {str(e)}")

@router.get("/health")
async def health_check():
    """API health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "service": "Healthify AI Backend"
    }

@router.post("/analyze-image", response_model=ImageAnalysisResponse)
async def analyze_medical_image(request: ImageAnalysisRequest, _: bool = Depends(rate_limit_check)):
    """Analyze medical images for health assessment"""
    try:
        analysis, recommendations, urgency, requires_doctor = image_analyzer.analyze_image(
            request.image_data,
            request.description or "",
            request.body_part or ""
        )
        
        return ImageAnalysisResponse(
            analysis=analysis,
            recommendations=recommendations,
            urgency_level=urgency,
            requires_doctor=requires_doctor
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis error: {str(e)}")

@router.get("/stats")
async def get_stats():
    """Get API usage statistics"""
    total_requests = sum(len(requests) for requests in request_counts.values())
    active_sessions = len([ip for ip, requests in request_counts.items() if requests])
    
    return {
        "total_requests": total_requests,
        "active_sessions": active_sessions,
        "uptime": "Available",
        "rate_limit": f"{Config.RATE_LIMIT_PER_MINUTE} requests/minute"
    }