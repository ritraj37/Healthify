#!/usr/bin/env python3
"""
Healthify AI Backend Startup Script
"""
import sys
import subprocess
import os

def check_python_version():
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_requirements():
    print("📦 Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        sys.exit(1)

def start_server():
    print("🚀 Starting Healthify AI Backend...")
    print("📡 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/api/docs")
    print("🏥 Ready to serve health queries!")
    print("\n" + "="*50)
    
    try:
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        subprocess.run([sys.executable, "-c", "from app.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8000)"])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    print("🏥 Healthify AI Backend Setup")
    print("="*30)
    
    check_python_version()
    
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found")
        sys.exit(1)
    
    install_requirements()
    start_server()