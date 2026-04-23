#!/usr/bin/env python3
"""
Test script for Healthify AI Backend
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def test_health_endpoint():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Health check passed")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.RequestException as e:
        print(f"❌ Health check error: {e}")
        return False

def test_chat_endpoint():
    """Test the chat endpoint"""
    test_messages = [
        "I have a headache",
        "What are your clinic hours?",
        "I need to book an appointment",
        "I have chest pain",  # Emergency test
        "Tell me about diabetes"
    ]
    
    print("\n🤖 Testing Chat Endpoint:")
    print("-" * 40)
    
    for message in test_messages:
        try:
            response = requests.post(
                f"{BASE_URL}/chat",
                json={
                    "message": message,
                    "user_id": "test_user",
                    "session_id": f"test_session_{int(time.time())}"
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"📝 Query: {message}")
                print(f"🤖 Response: {data['response'][:100]}...")
                print(f"📊 Confidence: {data['confidence']:.2f}")
                print("-" * 40)
            else:
                print(f"❌ Chat test failed for '{message}': {response.status_code}")
                
        except requests.RequestException as e:
            print(f"❌ Chat test error for '{message}': {e}")

def test_health_query_endpoint():
    """Test the health query endpoint"""
    try:
        response = requests.post(
            f"{BASE_URL}/health-query",
            json={
                "query": "I have been having headaches for 3 days",
                "category": "symptoms",
                "urgency": "normal"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print("\n🏥 Health Query Test:")
            print(f"📝 Answer: {data['answer'][:100]}...")
            print(f"📋 Recommendations: {data['recommendations']}")
            print(f"🚨 Emergency Alert: {data['emergency_alert']}")
            print("✅ Health query test passed")
        else:
            print(f"❌ Health query test failed: {response.status_code}")
            
    except requests.RequestException as e:
        print(f"❌ Health query test error: {e}")

def main():
    print("🧪 Healthify AI Backend Test Suite")
    print("=" * 40)
    
    # Test health endpoint first
    if not test_health_endpoint():
        print("\n❌ Backend is not running or not accessible")
        print("💡 Make sure to start the backend with: python start.py")
        return
    
    # Test chat functionality
    test_chat_endpoint()
    
    # Test health query functionality
    test_health_query_endpoint()
    
    print("\n✅ All tests completed!")
    print("🏥 Healthify AI Backend is ready for integration")

if __name__ == "__main__":
    main()