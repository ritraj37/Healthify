// Main JavaScript for Healthify Website with Database Integration
const API_BASE_URL = 'http://localhost:3000/api';

// CSV Dataset
let csvDataset = [];

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') { inQuotes = !inQuotes; }
        else if (line[i] === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
        else { current += line[i]; }
    }
    result.push(current.trim());
    return result;
}

async function loadCSVDataset() {
    // 1. Load healthcare_dataset.csv (Disease, Description)
    const mainPaths = ['./healthcare_dataset.csv/healthcare_dataset.csv', '../healthcare_dataset.csv/healthcare_dataset.csv'];
    for (const path of mainPaths) {
        try {
            const res = await fetch(path);
            if (!res.ok) continue;
            const lines = (await res.text()).trim().split('\n');
            for (let i = 1; i < lines.length; i++) {
                const cols = parseCSVLine(lines[i]);
                if (cols[0] && cols[1]) csvDataset.push({ disease: cols[0].toLowerCase(), description: cols[1] });
            }
            break;
        } catch (e) { continue; }
    }

    // 2. Load Medicine_Details.csv (Medicine Name, Composition, Uses, Side_effects)
    const medPaths = ['./healthcare_dataset.csv/Medicine_Details.csv', '../healthcare_dataset.csv/Medicine_Details.csv'];
    let prevLen = csvDataset.length;
    for (const path of medPaths) {
        try {
            const res = await fetch(path);
            if (!res.ok) continue;
            const lines = (await res.text()).trim().split('\n');
            for (let i = 1; i < lines.length; i++) {
                const cols = parseCSVLine(lines[i]);
                const name = cols[0] ? cols[0].trim().toLowerCase() : '';
                const uses = cols[2] ? cols[2].trim() : '';
                const sideEffects = cols[3] ? cols[3].trim() : '';
                const composition = cols[1] ? cols[1].trim() : '';
                if (name && uses) {
                    const desc = `<strong>Uses:</strong> ${uses}<br><strong>Composition:</strong> ${composition}<br><strong>Side Effects:</strong> ${sideEffects || 'Consult your doctor'}`;
                    csvDataset.push({ disease: name, description: desc });
                    uses.toLowerCase().split(/treatment of |prevention of /i).forEach(k => {
                        const kw = k.trim().replace(/[^a-z\s]/g, '').trim();
                        if (kw.length > 4) csvDataset.push({ disease: kw, description: desc });
                    });
                }
            }
            break;
        } catch (e) { continue; }
    }
}
loadCSVDataset();

function searchCSV(query) {
    if (!query || !csvDataset.length) return null;
    const q = query.toLowerCase();
    return csvDataset.find(e => q.includes(e.disease) || e.disease.split(' ').some(w => w.length > 3 && q.includes(w))) || null;
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navbar.classList.toggle('nav-toggle');
            this.classList.toggle('fa-times');
        });
    }

    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navbar.classList.contains('nav-toggle')) {
                    navbar.classList.remove('nav-toggle');
                    mobileMenu.classList.remove('fa-times');
                }
            }
        });
    });

    // Blog Category Filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            blogCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Contact Form Validation with Database Integration
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            const submitBtn = this.querySelector('.btn-submit');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(`${API_BASE_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = '#28a745';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
                submitBtn.style.background = '#dc3545';
                submitBtn.disabled = false;
            }
        });
    }

    // Header Scroll Effect with Hide/Show
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
        
        lastScrollY = currentScrollY;
    });

    // Counter Animation
    const counters = document.querySelectorAll('.stat h3, .stat h4');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent.replace(/[^\d]/g, ''));
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    const suffix = entry.target.textContent.replace(/[\d.]/g, '');
                    entry.target.textContent = Math.floor(current) + suffix;
                }, 40);
                
                observer.unobserve(entry.target);
            }
        });
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });

    // Chatbot functionality
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotPopup = document.getElementById('chatbotPopup');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    if (chatbotButton) {
        chatbotButton.addEventListener('click', () => {
            chatbotPopup.style.display = chatbotPopup.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    if (closeChatbot) {
        closeChatbot.addEventListener('click', () => {
            chatbotPopup.style.display = 'none';
        });
    }

    if (sendMessage) {
        sendMessage.addEventListener('click', sendChatMessage);
    }

    // Image upload functionality
    const imageBtn = document.getElementById('imageBtn');
    const imageUpload = document.getElementById('imageUpload');
    
    if (imageBtn && imageUpload) {
        imageBtn.addEventListener('click', () => {
            imageUpload.click();
        });
        
        imageUpload.addEventListener('change', handleImageUpload);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }

    async function sendChatMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            const userMsg = document.createElement('div');
            userMsg.className = 'user-message';
            userMsg.innerHTML = `<p>${message}</p>`;
            chatbotMessages.appendChild(userMsg);
            
            chatbotInput.value = '';
            
            const typingMsg = document.createElement('div');
            typingMsg.className = 'bot-message typing';
            typingMsg.innerHTML = `<p>AI is thinking...</p>`;
            chatbotMessages.appendChild(typingMsg);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            try {
                const response = await fetch('http://localhost:45678/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: message,
                        user_id: 'web_user',
                        session_id: 'web_session_' + Date.now()
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    chatbotMessages.removeChild(typingMsg);
                    const botMsg = document.createElement('div');
                    botMsg.className = 'bot-message';
                    botMsg.innerHTML = `<p>${data.response}</p>`;
                    chatbotMessages.appendChild(botMsg);
                } else {
                    throw new Error('API request failed');
                }
            } catch (error) {
                chatbotMessages.removeChild(typingMsg);
                if (csvDataset.length === 0) await loadCSVDataset();
                const fallbackResponse = getHealthResponse(message);
                const botMsg = document.createElement('div');
                botMsg.className = 'bot-message';
                botMsg.innerHTML = `<p>${fallbackResponse}</p>`;
                chatbotMessages.appendChild(botMsg);
            }
            
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }
    
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const imageData = e.target.result;
                
                // Show user message with image
                const userMsg = document.createElement('div');
                userMsg.className = 'user-message';
                userMsg.innerHTML = `<p>📷 Image uploaded for analysis</p><img src="${imageData}" style="max-width: 200px; border-radius: 8px; margin-top: 5px;">`;
                chatbotMessages.appendChild(userMsg);
                
                // Show typing indicator
                const typingMsg = document.createElement('div');
                typingMsg.className = 'bot-message typing';
                typingMsg.innerHTML = `<p>Analyzing image...</p>`;
                chatbotMessages.appendChild(typingMsg);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                
                try {
                    const response = await fetch('http://localhost:45678/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: 'Please analyze this medical image',
                            image_data: imageData,
                            user_id: 'web_user',
                            session_id: 'web_session_' + Date.now()
                        })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        chatbotMessages.removeChild(typingMsg);
                        
                        const botMsg = document.createElement('div');
                        botMsg.className = 'bot-message';
                        botMsg.innerHTML = `<p>${data.response}</p>`;
                        chatbotMessages.appendChild(botMsg);
                    } else {
                        throw new Error('Image analysis failed');
                    }
                } catch (error) {
                    console.error('Image Analysis Error:', error);
                    chatbotMessages.removeChild(typingMsg);
                    
                    const botMsg = document.createElement('div');
                    botMsg.className = 'bot-message';
                    botMsg.innerHTML = `<p>I can see your image, but I'm having trouble analyzing it right now. Please describe your concern and I'll provide general guidance, or consider booking an appointment with our specialists for proper evaluation.</p>`;
                    chatbotMessages.appendChild(botMsg);
                }
                
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            };
            reader.readAsDataURL(file);
        }
    }
    
    function getHealthResponse(message) {
        const msg = message.toLowerCase();
        const disclaimer = '<br><br><em>⚕️ Not medical advice. Consult a doctor.</em>';

        // CSV Dataset match first
        const csvMatch = searchCSV(msg);
        if (csvMatch) {
            return `🩺 <strong>${csvMatch.disease.charAt(0).toUpperCase() + csvMatch.disease.slice(1)}</strong><br><br>${csvMatch.description}${disclaimer}`;
        }
        
        // Symptom-based disease diagnosis
        if (msg.includes('fever') && (msg.includes('cough') || msg.includes('cold'))) {
            return '🦺 <strong>Possible Condition:</strong> Common Cold/Flu<br><br><strong>Symptoms Match:</strong> Fever + Cough<br><br><strong>Recommendations:</strong><br>• Rest for 7-10 days<br>• Drink warm fluids (ginger tea, turmeric milk)<br>• Take paracetamol for fever<br>• Steam inhalation 2-3 times daily<br><br><strong>Diet:</strong> Warm soups, citrus fruits (Vitamin C), honey, ginger, garlic<br><br>⚠️ Consult doctor if fever >102°F or persists >3 days<br>📞 Call: (555) 123-4567';
        }
        
        if (msg.includes('chest pain') || msg.includes('heart pain')) {
            return '🚨 <strong>URGENT:</strong> Chest pain can indicate serious conditions<br><br><strong>Possible Causes:</strong><br>• Heart attack (if severe, radiating to arm/jaw)<br>• Angina<br>• Acid reflux<br>• Muscle strain<br><br><strong>Immediate Action:</strong><br>• Call emergency: (555) 123-4567<br>• Chew aspirin if suspected heart attack<br>• Sit down and rest<br><br><strong>Prevention Diet:</strong> Oats, nuts, fish, leafy greens, avoid fried/fatty foods<br><br>⚠️ DO NOT DELAY - Seek immediate medical attention!';
        }
        
        if (msg.includes('diabetes') || msg.includes('sugar') && msg.includes('high')) {
            return '🦺 <strong>Condition:</strong> High Blood Sugar/Diabetes<br><br><strong>Common Symptoms:</strong><br>• Frequent urination<br>• Excessive thirst<br>• Fatigue<br>• Blurred vision<br><br><strong>Management:</strong><br>• Check fasting blood sugar (normal: 70-100 mg/dL)<br>• Regular exercise 30 min/day<br>• Monitor carb intake<br><br><strong>Diet Plan:</strong><br>✅ Eat: Bitter gourd, fenugreek, leafy greens, whole grains, nuts<br>❌ Avoid: White rice, sugar, sweets, processed foods, soft drinks<br><br>📅 Book appointment for HbA1c test';
        }
        
        if (msg.includes('headache') || msg.includes('migraine')) {
            return '🦺 <strong>Condition:</strong> Headache/Migraine<br><br><strong>Types:</strong><br>• Tension headache (stress-related)<br>• Migraine (severe, one-sided)<br>• Cluster headache<br><br><strong>Relief:</strong><br>• Rest in dark, quiet room<br>• Cold compress on forehead<br>• Drink water (dehydration causes headaches)<br>• Take paracetamol/ibuprofen<br><br><strong>Diet:</strong><br>✅ Eat: Almonds, spinach, bananas, ginger tea<br>❌ Avoid: Caffeine, alcohol, processed meats, MSG<br><br>⚠️ See doctor if severe or frequent (>3 times/week)';
        }
        
        if (msg.includes('stomach') && (msg.includes('pain') || msg.includes('ache'))) {
            return '🦺 <strong>Condition:</strong> Stomach Pain/Gastritis<br><br><strong>Possible Causes:</strong><br>• Acidity/Gas<br>• Food poisoning<br>• Ulcer<br>• Indigestion<br><br><strong>Relief:</strong><br>• Drink warm water<br>• Avoid spicy/oily food<br>• Take antacid (if acidity)<br>• Rest and avoid stress<br><br><strong>Diet:</strong><br>✅ Eat: Banana, yogurt, rice, boiled vegetables, buttermilk<br>❌ Avoid: Spicy food, coffee, alcohol, fried items<br><br>⚠️ Consult doctor if pain is severe or persists >24 hours';
        }
        
        if (msg.includes('weight loss') || msg.includes('lose weight')) {
            return '💪 <strong>Weight Loss Plan</strong><br><br><strong>Healthy Approach:</strong><br>• Target: 0.5-1 kg per week<br>• Calorie deficit: 500 cal/day<br>• Exercise: 30-45 min daily<br>• Sleep: 7-8 hours<br><br><strong>Diet Plan:</strong><br>🌅 Breakfast: Oats, eggs, fruits<br>🌞 Lunch: Brown rice, dal, salad, vegetables<br>🌙 Dinner: Soup, grilled chicken/fish, salad<br><br>✅ Eat: Protein, fiber, whole grains<br>❌ Avoid: Sugar, fried food, junk food, soft drinks<br><br>💧 Drink 3-4 liters water daily';
        }
        
        if (msg.includes('blood pressure') || msg.includes('bp high')) {
            return '🦺 <strong>Condition:</strong> High Blood Pressure (Hypertension)<br><br><strong>Normal BP:</strong> 120/80 mmHg<br><strong>High BP:</strong> >140/90 mmHg<br><br><strong>Symptoms:</strong><br>• Headaches<br>• Dizziness<br>• Shortness of breath<br>• Nosebleeds (rare)<br><br><strong>Management:</strong><br>• Reduce salt intake (<5g/day)<br>• Regular exercise<br>• Stress management<br>• Medication (if prescribed)<br><br><strong>Diet:</strong><br>✅ Eat: Bananas, beetroot, garlic, leafy greens, oats<br>❌ Avoid: Salt, pickles, processed foods, alcohol<br><br>📅 Monitor BP regularly';
        }
        
        if (msg.includes('thyroid')) {
            return '🦺 <strong>Condition:</strong> Thyroid Disorder<br><br><strong>Types:</strong><br>• Hypothyroid (low): Weight gain, fatigue, cold sensitivity<br>• Hyperthyroid (high): Weight loss, anxiety, heat sensitivity<br><br><strong>Tests Needed:</strong><br>• TSH, T3, T4 levels<br><br><strong>Diet for Hypothyroid:</strong><br>✅ Eat: Iodized salt, seafood, eggs, nuts, selenium-rich foods<br>❌ Avoid: Soy products, raw cruciferous vegetables<br><br><strong>Diet for Hyperthyroid:</strong><br>✅ Eat: Cruciferous vegetables, low-iodine foods<br>❌ Avoid: Iodine-rich foods, caffeine<br><br>📅 Book thyroid profile test';
        }
        
        if (msg.includes('cold') || msg.includes('cough') || msg.includes('flu')) {
            return '🦺 <strong>Condition:</strong> Common Cold/Cough<br><br><strong>Symptoms:</strong><br>• Runny nose<br>• Sore throat<br>• Cough<br>• Mild fever<br><br><strong>Home Remedies:</strong><br>• Ginger + honey tea<br>• Turmeric milk (haldi doodh)<br>• Steam inhalation<br>• Gargle with salt water<br>• Rest 7-8 hours<br><br><strong>Diet:</strong><br>✅ Eat: Warm soups, citrus fruits, ginger, garlic, honey<br>❌ Avoid: Cold drinks, ice cream, fried food<br><br>💊 Take vitamin C supplements<br>⚠️ See doctor if symptoms worsen';
        }
        
        if (msg.includes('skin') || msg.includes('acne') || msg.includes('pimple')) {
            return '🦺 <strong>Condition:</strong> Skin Issues/Acne<br><br><strong>Common Causes:</strong><br>• Hormonal changes<br>• Poor diet<br>• Stress<br>• Lack of sleep<br><br><strong>Treatment:</strong><br>• Wash face 2x daily<br>• Use non-comedogenic products<br>• Don\'t touch/pop pimples<br>• Stay hydrated<br><br><strong>Diet:</strong><br>✅ Eat: Water-rich fruits, green vegetables, nuts, fish (omega-3)<br>❌ Avoid: Dairy, sugar, fried food, processed foods<br><br>🧴 Use salicylic acid or benzoyl peroxide creams<br>📅 Consult dermatologist for severe acne';
        }
        
        if (msg.includes('sleep') || msg.includes('insomnia')) {
            return '😴 <strong>Condition:</strong> Sleep Problems/Insomnia<br><br><strong>Causes:</strong><br>• Stress/anxiety<br>• Screen time before bed<br>• Irregular schedule<br>• Caffeine intake<br><br><strong>Sleep Hygiene:</strong><br>• Fixed sleep schedule (10 PM - 6 AM)<br>• Dark, cool room<br>• No screens 1 hour before bed<br>• Relaxation techniques<br><br><strong>Diet:</strong><br>✅ Eat: Almonds, warm milk, bananas, chamomile tea<br>❌ Avoid: Caffeine after 4 PM, heavy meals at night<br><br>🧘 Try meditation or deep breathing<br>⚠️ Consult doctor if insomnia persists >2 weeks';
        }
        
        if (msg.includes('diet') || msg.includes('nutrition') || msg.includes('healthy eating')) {
            return '🥗 <strong>Healthy Diet Plan</strong><br><br><strong>Balanced Plate:</strong><br>• 50% Vegetables & Fruits<br>• 25% Whole Grains<br>• 25% Protein<br><br><strong>Daily Meals:</strong><br>🌅 Breakfast: Oats/eggs + fruits<br>🌞 Lunch: Rice/roti + dal + vegetables + salad<br>🍎 Snack: Nuts/fruits<br>🌙 Dinner: Light meal + soup<br><br><strong>Key Nutrients:</strong><br>• Protein: Eggs, chicken, fish, dal, paneer<br>• Fiber: Vegetables, fruits, whole grains<br>• Healthy fats: Nuts, olive oil, avocado<br><br>💧 Drink 8-10 glasses water<br>⚠️ Avoid processed foods, excess sugar, trans fats';
        }
        
        if (msg.includes('covid') || msg.includes('corona')) {
            return '🦠 <strong>COVID-19 Information</strong><br><br><strong>Symptoms:</strong><br>• Fever, dry cough<br>• Fatigue, body ache<br>• Loss of taste/smell<br>• Difficulty breathing<br><br><strong>Action:</strong><br>• Get tested (RT-PCR/Rapid)<br>• Isolate immediately<br>• Monitor oxygen levels (SpO2 >95%)<br>• Rest and hydrate<br><br><strong>Diet:</strong><br>✅ Eat: Protein-rich foods, vitamin C, zinc, warm fluids<br>❌ Avoid: Cold items, junk food<br><br>💊 Take paracetamol for fever<br>🚨 Emergency if: SpO2 <94%, severe breathlessness<br>📞 Call: (555) 123-4567';
        }
        
        if (msg.includes('appointment') || msg.includes('book') || msg.includes('schedule')) {
            return "You can easily book an appointment through our website or call us at (555) 123-4567. Our doctors are available for consultations Monday-Friday 8AM-8PM, and weekends 9AM-6PM.";
        }
        
        if (msg.includes('emergency') || msg.includes('urgent')) {
            return "For medical emergencies, please call our emergency line immediately at (555) 123-4567. Our emergency department is open 24/7 with specialized trauma teams ready to help.";
        }
        
        // Default response
        return '👋 Hello! I\'m your AI health assistant.<br><br>I can help you with:<br>✅ Symptom analysis<br>✅ Disease information<br>✅ Diet suggestions<br>✅ Health tips<br><br>💬 Tell me your symptoms like:<br>• "I have fever and cough"<br>• "Stomach pain for 2 days"<br>• "How to lose weight?"<br>• "Diet for diabetes"<br><br>⚠️ For emergencies, call: (555) 123-4567<br>📅 Or book appointment with our doctors';
    }
    
    // Check authentication status and update navigation
    function updateNavigation() {
        const isLoggedIn = localStorage.getItem('healthifyUser');
        const dashboardLink = document.getElementById('dashboardLink');
        const loginLink = document.getElementById('loginLink');
        const logoutLink = document.getElementById('logoutLink');
        
        if (isLoggedIn) {
            if (dashboardLink) dashboardLink.style.display = 'block';
            if (loginLink) loginLink.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'block';
        } else {
            if (dashboardLink) dashboardLink.style.display = 'none';
            if (loginLink) loginLink.style.display = 'block';
            if (logoutLink) logoutLink.style.display = 'none';
        }
    }
    
    // Logout function
    window.logout = function() {
        localStorage.removeItem('healthifyUser');
        updateNavigation();
        window.location.href = 'index.html';
    }
    
    // Update navigation on page load
    updateNavigation();
    
    // Check authentication on page load for appointment page
    if (window.location.pathname.includes('appointment.html')) {
        const isLoggedIn = localStorage.getItem('healthifyUser');
        const authRequired = document.getElementById('authRequired');
        const appointmentSection = document.getElementById('appointmentSection');
        
        if (isLoggedIn) {
            authRequired.style.display = 'none';
            appointmentSection.style.display = 'block';
        } else {
            authRequired.style.display = 'block';
            appointmentSection.style.display = 'none';
        }
    }
    
    // Article Modal Functions
    window.openArticle = function(articleId) {
        const modal = document.getElementById('articleModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        
        const articles = {
            'heart-health': {
                title: '10 Essential Heart Health Tips for a Stronger Tomorrow',
                content: '<h3>Introduction</h3><p>Heart disease remains the leading cause of death worldwide, but the good news is that many heart conditions are preventable through lifestyle changes and proper medical care. Here are 10 essential tips to keep your heart healthy and strong.</p><h3>1. Maintain a Heart-Healthy Diet</h3><p>Focus on eating plenty of fruits, vegetables, whole grains, and lean proteins. Limit saturated fats, trans fats, sodium, and added sugars. The Mediterranean diet has been shown to significantly reduce heart disease risk.</p><h3>2. Exercise Regularly</h3><p>Aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity per week. Include strength training exercises at least twice a week.</p><h3>3. Maintain a Healthy Weight</h3><p>Being overweight increases your risk of heart disease. Calculate your BMI and work with healthcare professionals to achieve and maintain a healthy weight.</p><h3>4. Don\'t Smoke and Avoid Secondhand Smoke</h3><p>Smoking damages blood vessels and reduces oxygen in your blood. Quitting smoking is one of the best things you can do for your heart health.</p><h3>5. Manage Stress</h3><p>Chronic stress can contribute to heart disease. Practice stress-reduction techniques like meditation, deep breathing, yoga, or regular physical activity.</p><h3>6. Get Quality Sleep</h3><p>Aim for 7-9 hours of quality sleep per night. Poor sleep is linked to high blood pressure, obesity, and diabetes - all risk factors for heart disease.</p><h3>7. Monitor Your Blood Pressure</h3><p>High blood pressure often has no symptoms but significantly increases heart disease risk. Check your blood pressure regularly and follow your doctor\'s recommendations.</p><h3>8. Control Cholesterol Levels</h3><p>High cholesterol can lead to plaque buildup in arteries. Get regular cholesterol screenings and follow dietary and medication recommendations from your healthcare provider.</p><h3>9. Manage Diabetes</h3><p>Diabetes significantly increases heart disease risk. If you have diabetes, work closely with your healthcare team to manage blood sugar levels effectively.</p><h3>10. Regular Medical Check-ups</h3><p>Schedule regular check-ups with your healthcare provider to monitor heart health, discuss risk factors, and catch potential problems early.</p><h3>Conclusion</h3><p>Taking care of your heart is a lifelong commitment that pays dividends in improved quality of life and longevity. Start implementing these tips today, and consult with our cardiology specialists at Healthify for personalized heart health guidance.</p>'
            },
            'covid-vaccination': {
                title: 'COVID-19 Vaccination: Your Shield Against the Pandemic',
                content: '<h3>Introduction</h3><p>COVID-19 vaccination remains one of the most effective tools in our fight against the pandemic. Our comprehensive vaccination program ensures safe, effective immunization for you and your family.</p><h3>Why Vaccination Matters</h3><p>Vaccines significantly reduce the risk of severe illness, hospitalization, and death from COVID-19. They also help protect your community through collective immunity.</p><h3>Available Vaccines</h3><p>We offer all FDA-approved COVID-19 vaccines including mRNA vaccines (Pfizer-BioNTech, Moderna) and viral vector vaccines (Johnson & Johnson). Our medical team will help determine the best option for you.</p><h3>Booster Recommendations</h3><p>Stay up-to-date with booster shots as recommended by the CDC. Boosters help maintain strong immunity against new variants and waning antibody levels.</p><h3>Safety Measures</h3><p>All vaccines are administered by certified healthcare professionals in a sterile environment. We monitor patients for 15-30 minutes post-vaccination to ensure safety.</p><h3>Side Effects</h3><p>Common side effects include mild pain at injection site, fatigue, and low-grade fever. These are normal signs that your immune system is responding to the vaccine.</p><h3>Schedule Your Vaccination</h3><p>Contact Healthify at (555) 123-4567 to schedule your COVID-19 vaccination or booster shot. Walk-ins are also welcome during clinic hours.</p>'
            },
            'diabetes-management': {
                title: 'Mastering Diabetes: A Complete Management Guide',
                content: '<h3>Understanding Diabetes</h3><p>Diabetes is a chronic condition that affects how your body processes blood sugar (glucose). With proper management, people with diabetes can live healthy, fulfilling lives.</p><h3>Types of Diabetes</h3><p><strong>Type 1:</strong> Autoimmune condition where the body doesn\'t produce insulin.<br><strong>Type 2:</strong> Most common form where the body doesn\'t use insulin effectively.<br><strong>Gestational:</strong> Develops during pregnancy and usually resolves after delivery.</p><h3>Blood Sugar Monitoring</h3><p>Regular monitoring is crucial. Check blood glucose levels as recommended by your healthcare provider. Modern continuous glucose monitors provide real-time data and trends.</p><h3>Medication Management</h3><p>Take medications exactly as prescribed. Options include insulin, metformin, and newer medications like GLP-1 agonists. Never adjust doses without consulting your doctor.</p><h3>Dietary Guidelines</h3><p>Focus on balanced meals with controlled carbohydrate intake. Include plenty of vegetables, lean proteins, and whole grains. Work with a registered dietitian for personalized meal planning.</p><h3>Exercise Benefits</h3><p>Regular physical activity helps lower blood sugar levels and improves insulin sensitivity. Aim for at least 150 minutes of moderate exercise weekly.</p><h3>Complications Prevention</h3><p>Proper management prevents serious complications including heart disease, kidney damage, nerve damage, and vision problems. Regular check-ups are essential.</p><h3>Emergency Preparedness</h3><p>Know the signs of high and low blood sugar. Always carry glucose tablets or snacks. Wear medical identification and inform family members about your condition.</p>'
            },
            'balanced-nutrition': {
                title: 'Complete Guide to Balanced Nutrition for Optimal Health',
                content: '<h3>Fundamentals of Nutrition</h3><p>Proper nutrition provides your body with essential nutrients needed for optimal function, disease prevention, and overall well-being. Understanding nutritional basics empowers you to make healthier choices.</p><h3>Macronutrients</h3><p><strong>Carbohydrates:</strong> Primary energy source. Choose complex carbs like whole grains, fruits, and vegetables.<br><strong>Proteins:</strong> Essential for tissue repair and immune function. Include lean meats, fish, legumes, and dairy.<br><strong>Fats:</strong> Important for hormone production and nutrient absorption. Focus on healthy fats from nuts, olive oil, and avocados.</p><h3>Micronutrients</h3><p>Vitamins and minerals support various body functions. Eat a colorful variety of fruits and vegetables to ensure adequate intake of essential micronutrients.</p><h3>Hydration</h3><p>Drink at least 8 glasses of water daily. Proper hydration supports digestion, circulation, and temperature regulation. Limit sugary drinks and excessive caffeine.</p><h3>Meal Planning</h3><p>Plan balanced meals that include all food groups. Use the plate method: fill half your plate with vegetables, one quarter with lean protein, and one quarter with whole grains.</p><h3>Portion Control</h3><p>Use smaller plates and bowls to control portions. Listen to your body\'s hunger and fullness cues. Eat slowly and mindfully to improve digestion and satisfaction.</p><h3>Special Dietary Needs</h3><p>Consider individual needs based on age, activity level, health conditions, and personal preferences. Consult with our registered dietitians for personalized nutrition counseling.</p><h3>Healthy Cooking Tips</h3><p>Use cooking methods like grilling, baking, steaming, and sautéing instead of frying. Season with herbs and spices instead of excess salt. Prepare meals at home when possible.</p>'
            },
            'heart-disease-prevention': {
                title: 'Understanding Heart Disease: Prevention and Early Detection',
                content: '<h3>Common Types of Heart Disease</h3><p>Heart disease encompasses various conditions affecting the heart and blood vessels, including coronary artery disease, heart failure, arrhythmias, and valvular heart disease.</p><h3>Risk Factors</h3><p><strong>Modifiable:</strong> High blood pressure, high cholesterol, smoking, diabetes, obesity, physical inactivity, poor diet, excessive alcohol consumption.<br><strong>Non-modifiable:</strong> Age, gender, family history, race/ethnicity.</p><h3>Warning Signs</h3><p>Chest pain or discomfort, shortness of breath, fatigue, irregular heartbeat, swelling in legs or feet, dizziness, and nausea. Seek immediate medical attention for severe symptoms.</p><h3>Prevention Strategies</h3><p>Maintain a heart-healthy diet rich in fruits, vegetables, and whole grains. Exercise regularly, maintain healthy weight, don\'t smoke, limit alcohol, and manage stress effectively.</p><h3>Screening Tests</h3><p>Regular blood pressure checks, cholesterol panels, blood glucose tests, and electrocardiograms (ECG) help detect problems early when treatment is most effective.</p><h3>Treatment Options</h3><p>Depending on the condition, treatments may include lifestyle modifications, medications, medical procedures, or surgery. Early intervention significantly improves outcomes.</p><h3>Living with Heart Disease</h3><p>With proper management, many people with heart disease live active, fulfilling lives. Follow your treatment plan, attend regular check-ups, and maintain healthy lifestyle habits.</p><h3>Emergency Action Plan</h3><p>Know the signs of a heart attack and stroke. Call 911 immediately if you experience severe chest pain, difficulty breathing, or sudden weakness. Time is critical in cardiac emergencies.</p>'
            },
            'baby-care-guide': {
                title: 'Complete Baby Care Guide: From Newborn to 12 Months',
                content: '<h3>Newborn Care (0-3 months)</h3><p>Focus on feeding, sleeping, and bonding. Newborns need frequent feeding every 2-3 hours, sleep 14-17 hours daily, and require gentle handling and lots of skin-to-skin contact.</p><h3>Feeding Guidelines</h3><p><strong>Breastfeeding:</strong> Exclusive breastfeeding for first 6 months is recommended. Feed on demand, typically 8-12 times daily.<br><strong>Formula Feeding:</strong> If breastfeeding isn\'t possible, use iron-fortified formula. Follow preparation instructions carefully.</p><h3>Sleep Safety</h3><p>Always place babies on their back to sleep. Use a firm mattress with fitted sheet. Keep cribs free of blankets, pillows, and toys to reduce SIDS risk.</p><h3>Hygiene and Bathing</h3><p>Bathe newborns 2-3 times weekly with lukewarm water. Clean diaper area thoroughly with each change. Keep umbilical cord dry until it heals.</p><h3>Developmental Milestones</h3><p><strong>0-3 months:</strong> Lifts head, follows objects, smiles socially.<br><strong>4-6 months:</strong> Rolls over, sits with support, babbles.<br><strong>7-9 months:</strong> Crawls, pulls to stand, says first words.<br><strong>10-12 months:</strong> Walks independently, follows simple commands.</p><h3>Vaccination Schedule</h3><p>Follow the recommended immunization schedule starting at 2 months. Vaccines protect against serious diseases and are crucial for your baby\'s health.</p><h3>When to Call the Doctor</h3><p>Contact your pediatrician for fever over 100.4°F, persistent crying, feeding difficulties, unusual lethargy, or any concerns about your baby\'s health or development.</p><h3>Parenting Support</h3><p>Don\'t hesitate to ask for help. Join parent groups, consult with our pediatric specialists, and remember that every baby develops at their own pace.</p>'
            }
        };
        
        if (articles[articleId]) {
            title.textContent = articles[articleId].title;
            body.innerHTML = articles[articleId].content;
            modal.style.display = 'block';
        }
    };
    
    window.closeArticle = function() {
        document.getElementById('articleModal').style.display = 'none';
    };
    
    window.onclick = function(event) {
        const modal = document.getElementById('articleModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
});