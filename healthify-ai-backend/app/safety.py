import re
from typing import List, Tuple

class SafetyFilter:
    def __init__(self):
        self.harmful_patterns = [
            r'\b(suicide|kill\s+myself|end\s+my\s+life)\b',
            r'\b(overdose|poison|toxic)\b',
            r'\b(self\s*harm|cut\s+myself)\b',
            r'\b(illegal\s+drugs|cocaine|heroin)\b'
        ]
        
        self.medical_disclaimers = [
            "This is for informational purposes only and not medical advice.",
            "Please consult a healthcare professional for proper diagnosis.",
            "In case of emergency, call 911 or visit the nearest hospital."
        ]
    
    def is_safe_query(self, message: str) -> Tuple[bool, str]:
        """Check if the query is safe and appropriate"""
        message_lower = message.lower()
        
        for pattern in self.harmful_patterns:
            if re.search(pattern, message_lower):
                return False, "I'm concerned about your message. Please contact emergency services or a mental health professional immediately."
        
        return True, ""
    
    def add_medical_disclaimer(self, response: str) -> str:
        """Add appropriate medical disclaimer to response"""
        if any(word in response.lower() for word in ['diagnose', 'treatment', 'medication', 'symptoms']):
            return f"{response}\n\n⚠️ {self.medical_disclaimers[0]} {self.medical_disclaimers[1]}"
        return response
    
    def detect_emergency(self, message: str) -> bool:
        """Detect if message indicates medical emergency"""
        emergency_keywords = [
            'chest pain', 'heart attack', 'stroke', 'bleeding', 'unconscious',
            'difficulty breathing', 'severe pain', 'emergency', 'urgent'
        ]
        
        message_lower = message.lower()
        return any(keyword in message_lower for keyword in emergency_keywords)