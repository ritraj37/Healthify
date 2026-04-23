import random
from typing import Dict, List, Tuple
from .safety import SafetyFilter

class HealthifyAI:
    def __init__(self):
        self.safety_filter = SafetyFilter()
        self.knowledge_base = self._load_knowledge_base()
        
    def _load_knowledge_base(self) -> Dict[str, List[Dict]]:
        return {
            "symptoms": [
                {"keywords": ["headache", "head", "pain", "migraine"], "response": "I understand you're experiencing head pain. Headaches can have various causes:\n\n🔹 **Common causes:** Stress, dehydration, lack of sleep, eye strain, sinus issues\n🔹 **Immediate relief:** Rest in a dark room, apply cold/warm compress, stay hydrated, gentle neck massage\n🔹 **When to see a doctor:** Sudden severe headache, headache with fever/stiff neck, changes in vision, or if headaches become frequent\n\nCan you tell me more about your headache? How long have you had it, and is it accompanied by any other symptoms?"},
                {"keywords": ["fever", "temperature", "hot", "cold", "flu"], "response": "Fever indicates your body is fighting an infection. Here's what you should know:\n\n🌡️ **Normal response:** Body temperature above 100.4°F (38°C)\n🔹 **Home care:** Rest, drink plenty of fluids, light clothing, lukewarm baths\n🔹 **Medications:** Acetaminophen or ibuprofen as directed\n🔹 **Seek immediate care if:** Fever above 103°F, difficulty breathing, severe headache, persistent vomiting\n\nHow high is your fever, and do you have any other symptoms like cough, sore throat, or body aches?"},
                {"keywords": ["cough", "coughing", "throat", "sore"], "response": "Coughs can be dry or productive and have different causes:\n\n🔹 **Types:** Dry cough (irritation), wet cough (mucus production)\n🔹 **Common causes:** Viral infections, allergies, acid reflux, asthma\n🔹 **Home remedies:** Honey, warm salt water gargle, humidifier, throat lozenges\n🔹 **See a doctor if:** Cough lasts >3 weeks, blood in mucus, high fever, difficulty breathing\n\nIs your cough dry or producing mucus? How long have you had it?"},
                {"keywords": ["stomach", "abdominal", "belly", "nausea", "sick", "vomit"], "response": "Stomach issues can range from mild to serious. Let me help you understand:\n\n🔹 **Common causes:** Food poisoning, viral gastroenteritis, stress, overeating\n🔹 **Immediate care:** Clear fluids, BRAT diet (bananas, rice, applesauce, toast), rest\n🔹 **Red flags:** Severe pain, blood in vomit/stool, signs of dehydration, high fever\n🔹 **Emergency signs:** Severe abdominal pain, rigid abdomen, persistent vomiting\n\nWhere exactly is the pain located, and have you experienced any nausea or vomiting?"},
                {"keywords": ["tired", "fatigue", "exhausted", "weak", "energy"], "response": "Fatigue can significantly impact your daily life. Here's a comprehensive overview:\n\n🔹 **Common causes:** Poor sleep, stress, anemia, thyroid issues, depression, chronic conditions\n🔹 **Lifestyle factors:** Diet, exercise, sleep schedule, work stress\n🔹 **Improvement strategies:** Regular sleep schedule, balanced nutrition, moderate exercise, stress management\n🔹 **When to worry:** Persistent fatigue >2 weeks, unexplained weight loss, severe weakness\n\nHow long have you been feeling tired, and have you noticed any changes in your sleep or appetite?"},
                {"keywords": ["back", "spine", "lower", "upper"], "response": "Back pain is very common and can have various causes:\n\n🔹 **Types:** Lower back (lumbar), upper back (thoracic), neck (cervical)\n🔹 **Common causes:** Muscle strain, poor posture, herniated disc, arthritis\n🔹 **Immediate relief:** Rest, ice/heat therapy, gentle stretching, over-the-counter pain relievers\n🔹 **Prevention:** Good posture, regular exercise, proper lifting techniques\n\nWhere exactly is your back pain, and did it start after any specific activity?"},
                {"keywords": ["joint", "arthritis", "stiff", "swollen"], "response": "Joint problems can affect mobility and quality of life:\n\n🔹 **Common conditions:** Osteoarthritis, rheumatoid arthritis, bursitis, tendinitis\n🔹 **Symptoms:** Pain, stiffness, swelling, reduced range of motion\n🔹 **Management:** Anti-inflammatory medications, physical therapy, gentle exercise, weight management\n🔹 **When to see a doctor:** Persistent joint pain, significant swelling, fever with joint pain\n\nWhich joints are affected, and is the pain worse in the morning or evening?"}
            ],
            "conditions": [
                {"keywords": ["diabetes", "sugar", "blood", "insulin"], "response": "Diabetes is a serious condition that requires ongoing management:\n\n🔹 **Types:** Type 1 (autoimmune), Type 2 (insulin resistance), Gestational\n🔹 **Symptoms:** Increased thirst/urination, fatigue, blurred vision, slow healing\n🔹 **Management:** Blood sugar monitoring, medication compliance, diet control, regular exercise\n🔹 **Complications:** Heart disease, kidney damage, nerve damage, eye problems\n\nAre you newly diagnosed, or do you need help managing existing diabetes?"},
                {"keywords": ["heart", "cardiac", "blood pressure", "hypertension"], "response": "Heart health is crucial for overall wellbeing:\n\n🔹 **Risk factors:** High blood pressure, high cholesterol, smoking, diabetes, family history\n🔹 **Prevention:** Regular exercise, healthy diet, stress management, no smoking\n🔹 **Warning signs:** Chest pain, shortness of breath, irregular heartbeat, swelling\n🔹 **Regular monitoring:** Blood pressure, cholesterol levels, weight management\n\nDo you have any specific heart concerns or family history of heart disease?"},
                {"keywords": ["mental", "depression", "anxiety", "stress"], "response": "Mental health is as important as physical health:\n\n🔹 **Common conditions:** Depression, anxiety, stress disorders, PTSD\n🔹 **Symptoms:** Persistent sadness, worry, sleep changes, appetite changes\n🔹 **Treatment options:** Therapy, medication, lifestyle changes, support groups\n🔹 **Self-care:** Regular exercise, adequate sleep, social connections, mindfulness\n\nAre you experiencing specific mental health concerns that you'd like to discuss?"}
            ],
            "prevention": [
                {"keywords": ["prevent", "avoid", "healthy", "wellness"], "response": "Prevention is the best medicine! Here's a comprehensive approach:\n\n🔹 **Regular screenings:** Annual check-ups, blood tests, cancer screenings\n🔹 **Healthy lifestyle:** Balanced diet, regular exercise, adequate sleep, stress management\n🔹 **Vaccinations:** Stay current with recommended vaccines\n🔹 **Risk reduction:** Don't smoke, limit alcohol, maintain healthy weight\n\nWhat specific health areas would you like to focus on for prevention?"},
                {"keywords": ["vaccine", "vaccination", "immunization"], "response": "Vaccines are one of the most effective preventive measures:\n\n🔹 **Routine vaccines:** Flu, COVID-19, Tdap, MMR, HPV\n🔹 **Travel vaccines:** Hepatitis A/B, typhoid, yellow fever (destination-specific)\n🔹 **Age-specific:** Shingles (50+), pneumonia (65+)\n🔹 **Safety:** Vaccines are thoroughly tested and monitored for safety\n\nAre you looking for information about specific vaccines or travel requirements?"}
            ],
            "diet": [
                {"keywords": ["diet", "nutrition", "food", "eat", "meal"], "response": "Proper nutrition is fundamental to good health:\n\n🔹 **Balanced plate:** 1/2 vegetables/fruits, 1/4 lean protein, 1/4 whole grains\n🔹 **Essential nutrients:** Vitamins, minerals, fiber, healthy fats, adequate protein\n🔹 **Hydration:** 8-10 glasses of water daily\n🔹 **Limit:** Processed foods, added sugars, excessive sodium, saturated fats\n\nDo you have specific dietary goals or restrictions I can help you with?"},
                {"keywords": ["weight", "lose", "fat", "slim", "obesity"], "response": "Healthy weight management involves sustainable lifestyle changes:\n\n🔹 **Safe weight loss:** 1-2 pounds per week through caloric deficit\n🔹 **Diet approach:** Portion control, nutrient-dense foods, regular meals\n🔹 **Exercise:** Combination of cardio and strength training\n🔹 **Behavioral changes:** Food journaling, mindful eating, stress management\n\nWhat's your current weight goal, and what challenges are you facing?"}
            ],
            "exercise": [
                {"keywords": ["exercise", "workout", "fitness", "gym"], "response": "Regular exercise provides numerous health benefits:\n\n🔹 **Recommendations:** 150 minutes moderate aerobic activity weekly\n🔹 **Types:** Cardio, strength training, flexibility, balance exercises\n🔹 **Benefits:** Heart health, weight management, mental health, bone strength\n🔹 **Getting started:** Start slowly, set realistic goals, find enjoyable activities\n\nWhat type of exercise interests you, or do you need help starting a fitness routine?"},
                {"keywords": ["running", "cardio", "walking"], "response": "Cardiovascular exercise is excellent for heart health:\n\n🔹 **Benefits:** Improved heart function, endurance, weight management, mood enhancement\n🔹 **Starting tips:** Begin with walking, gradually increase intensity and duration\n🔹 **Safety:** Proper footwear, warm-up/cool-down, stay hydrated\n🔹 **Progression:** Couch to 5K programs, interval training, cross-training\n\nWhat's your current fitness level, and what are your cardio goals?"}
            ],
            "emergency": [
                {"keywords": ["emergency", "urgent", "911", "help"], "response": "🚨 **MEDICAL EMERGENCY SIGNS:**\n\n🔹 **Call 911 immediately for:** Chest pain, difficulty breathing, severe bleeding, loss of consciousness, stroke symptoms\n🔹 **Stroke signs:** Face drooping, arm weakness, speech difficulty, time to call 911\n🔹 **Heart attack:** Chest pain, shortness of breath, nausea, sweating\n🔹 **Our emergency line:** (555) 123-4567\n\nIf this is an emergency, please call 911 now. Otherwise, how can I help you?"},
                {"keywords": ["chest pain", "heart attack", "cardiac"], "response": "🚨 **EMERGENCY: CHEST PAIN**\n\nChest pain could indicate a heart attack. **CALL 911 IMMEDIATELY**\n\n🔹 **Don't:** Drive yourself, wait to see if it gets better\n🔹 **Do:** Call 911, chew aspirin if not allergic, stay calm\n🔹 **Symptoms:** Pressure, squeezing, pain radiating to arm/jaw\n\n**This requires immediate medical attention - please call 911 now!**"}
            ],
            "appointment": [
                {"keywords": ["appointment", "book", "schedule", "visit"], "response": "I'd be happy to help you with appointment scheduling:\n\n🔹 **Online booking:** Available 24/7 through our website\n🔹 **Phone:** Call (555) 123-4567 during business hours\n🔹 **Same-day appointments:** Available for urgent concerns\n🔹 **Specialists:** Cardiology, neurology, orthopedics, and more\n\nWhat type of appointment are you looking to schedule, and do you have any specific concerns?"},
                {"keywords": ["doctor", "specialist", "physician"], "response": "Our medical team includes experienced specialists:\n\n🔹 **Primary care:** General medicine, family practice, internal medicine\n🔹 **Specialists:** Cardiology, neurology, orthopedics, dermatology, endocrinology\n🔹 **All doctors:** Board-certified with years of experience\n🔹 **Ratings:** Average 4.8/5 patient satisfaction\n\nWhat type of specialist are you looking for, or do you need help choosing the right doctor?"}
            ]
        }
    
    def generate_response(self, message: str, user_id: str = None) -> Tuple[str, float, bool]:
        """Generate AI response for health queries"""
        
        # Safety check
        is_safe, safety_message = self.safety_filter.is_safe_query(message)
        if not is_safe:
            return safety_message, 1.0, True
        
        # Emergency detection
        is_emergency = self.safety_filter.detect_emergency(message)
        if is_emergency:
            return "🚨 This sounds like a medical emergency. Please call 911 or visit the nearest emergency room immediately. Our emergency line: (555) 123-4567", 1.0, True
        
        # Find best matching response
        best_response, confidence = self._find_best_response(message)
        
        # Add medical disclaimer
        final_response = self.safety_filter.add_medical_disclaimer(best_response)
        
        return final_response, confidence, is_emergency
    
    def _find_best_response(self, message: str) -> Tuple[str, float]:
        """Find the best matching response from knowledge base"""
        message_lower = message.lower()
        best_match = None
        best_score = 0
        
        for category, responses in self.knowledge_base.items():
            for response_data in responses:
                score = self._calculate_match_score(message_lower, response_data["keywords"])
                if score > best_score:
                    best_score = score
                    best_match = response_data["response"]
        
        if best_match and best_score > 0.1:
            return best_match, best_score
        
        # Enhanced default responses with follow-up questions
        default_responses = [
            "I'd like to help you with your health concern. Could you provide more details about what you're experiencing? For example, are you having any specific symptoms, or do you have questions about a particular health topic?",
            "I'm here to provide health information and guidance. Could you tell me more about your specific concern? Are you experiencing symptoms, looking for preventive care advice, or have questions about a medical condition?",
            "I want to give you the most helpful information possible. Could you describe your health concern in more detail? This will help me provide more specific guidance tailored to your situation."
        ]
        
        return random.choice(default_responses), 0.5
    
    def _calculate_match_score(self, message: str, keywords: List[str]) -> float:
        """Calculate how well the message matches the keywords"""
        if not keywords:
            return 0
        
        # Check for partial matches and word boundaries
        matches = 0
        for keyword in keywords:
            if keyword in message:
                matches += 1
            # Check for partial word matches
            elif any(word in keyword or keyword in word for word in message.split()):
                matches += 0.5
        
        return matches / len(keywords)