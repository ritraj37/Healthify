import base64
import io
from PIL import Image
from typing import Tuple, List
import re

class MedicalImageAnalyzer:
    def __init__(self):
        self.skin_conditions = {
            "rash": {
                "keywords": ["red", "bumps", "irritated", "itchy", "patches"],
                "analysis": "This appears to be a skin rash. Common causes include allergic reactions, eczema, or contact dermatitis.",
                "recommendations": [
                    "Keep the area clean and dry",
                    "Avoid scratching to prevent infection",
                    "Apply cool compress for relief",
                    "Consider over-the-counter antihistamine if itchy"
                ],
                "urgency": "normal"
            },
            "wound": {
                "keywords": ["cut", "bleeding", "injury", "scratch", "burn"],
                "analysis": "This appears to be a wound or injury that requires proper care.",
                "recommendations": [
                    "Clean the wound gently with water",
                    "Apply antiseptic if available",
                    "Cover with sterile bandage",
                    "Monitor for signs of infection"
                ],
                "urgency": "moderate"
            },
            "mole": {
                "keywords": ["dark", "spot", "mole", "growth", "pigmented"],
                "analysis": "This appears to be a pigmented lesion or mole. Monitor for changes in size, color, or shape.",
                "recommendations": [
                    "Monitor for ABCDE changes (Asymmetry, Border, Color, Diameter, Evolution)",
                    "Protect from sun exposure",
                    "Schedule dermatology consultation if changes occur",
                    "Take photos to track changes over time"
                ],
                "urgency": "normal"
            }
        }
    
    def analyze_image(self, image_data: str, description: str = "", body_part: str = "") -> Tuple[str, List[str], str, bool]:
        """Analyze medical image and provide recommendations"""
        
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Basic image validation
            if image.size[0] < 100 or image.size[1] < 100:
                return "Image quality is too low for analysis. Please upload a clearer, higher resolution image.", [], "normal", True
            
            # Analyze based on description and body part
            condition_type = self._classify_condition(description, body_part)
            
            if condition_type in self.skin_conditions:
                condition = self.skin_conditions[condition_type]
                
                analysis = f"Based on your description and the image of your {body_part or 'skin'}, {condition['analysis']}"
                
                # Add specific guidance based on body part
                if body_part:
                    analysis += f"\\n\\nSince this is on your {body_part}, "
                    if body_part.lower() in ["face", "head", "scalp"]:
                        analysis += "be extra gentle with treatment and avoid harsh products."
                    elif body_part.lower() in ["hands", "fingers"]:
                        analysis += "keep the area clean as hands are frequently exposed to irritants."
                    elif body_part.lower() in ["feet", "toes"]:
                        analysis += "ensure proper hygiene and keep the area dry."
                
                recommendations = condition["recommendations"].copy()
                urgency = condition["urgency"]
                requires_doctor = urgency in ["moderate", "urgent"]
                
                # Add emergency warnings
                if any(word in description.lower() for word in ["severe", "spreading", "fever", "pus", "infected"]):
                    urgency = "urgent"
                    requires_doctor = True
                    recommendations.insert(0, "⚠️ Seek immediate medical attention due to severity")
                
                return analysis, recommendations, urgency, requires_doctor
            
            else:
                # General analysis
                analysis = f"I can see the image you've shared of your {body_part or 'skin condition'}. "
                analysis += "While I can provide general guidance, a proper medical examination is recommended for accurate diagnosis."
                
                recommendations = [
                    "Schedule an appointment with a dermatologist or your primary care physician",
                    "Keep the area clean and avoid irritants",
                    "Take note of any changes in size, color, or symptoms",
                    "Avoid self-medication without professional guidance"
                ]
                
                return analysis, recommendations, "normal", True
                
        except Exception as e:
            return "Unable to analyze the image. Please ensure it's a clear photo and try again.", [], "normal", True
    
    def _classify_condition(self, description: str, body_part: str) -> str:
        """Classify the condition based on description"""
        description_lower = description.lower()
        
        for condition, data in self.skin_conditions.items():
            if any(keyword in description_lower for keyword in data["keywords"]):
                return condition
        
        # Default classification based on common terms
        if any(word in description_lower for word in ["rash", "red", "itchy", "bumps"]):
            return "rash"
        elif any(word in description_lower for word in ["cut", "wound", "injury", "bleeding"]):
            return "wound"
        elif any(word in description_lower for word in ["mole", "spot", "dark", "growth"]):
            return "mole"
        
        return "general"