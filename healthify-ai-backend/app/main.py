from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from .api import router as api_router
from .static_files import router as static_router
from .config import Config

# Create FastAPI app
app = FastAPI(
    title="Healthify AI Backend",
    description="AI-powered health assistant for Healthify healthcare platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router)
app.include_router(static_router)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "code": 500
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    print("[HEALTHIFY] AI Backend starting up...")
    print(f"[SERVER] Running on http://{Config.HOST}:{Config.PORT}")
    print("[AI] Health Assistant ready!")

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=Config.HOST,
        port=Config.PORT,
        reload=Config.DEBUG
    )