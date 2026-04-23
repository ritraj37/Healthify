// Main JavaScript for Healthify Website
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

    // Contact Form Validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                } else {
                    field.style.borderColor = '#28a745';
                }
            });
            
            if (isValid) {
                // Check if user is logged in before allowing appointment booking
                const isLoggedIn = localStorage.getItem('healthifyUser');
                
                if (!isLoggedIn && this.querySelector('#subject').value === 'appointment') {
                    alert('Please login or register first to book an appointment.');
                    window.location.href = 'auth-check.html';
                    return;
                }
                
                const submitBtn = this.querySelector('.btn-submit');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#28a745';
                
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    submitBtn.style.background = '';
                }, 2000);
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
            
            // Show typing indicator
            const typingMsg = document.createElement('div');
            typingMsg.className = 'bot-message typing';
            typingMsg.innerHTML = `<p>AI is thinking...</p>`;
            chatbotMessages.appendChild(typingMsg);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            try {
                // Call real AI backend
                const response = await fetch('http://localhost:45678/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
                console.error('AI Backend Error:', error);
                chatbotMessages.removeChild(typingMsg);
                
                // Fallback to local responses
                const fallbackResponse = getHealthResponse(message);
                const botMsg = document.createElement('div');
                botMsg.className = 'bot-message';
                botMsg.innerHTML = `<p>${fallbackResponse}</p>`;
                chatbotMessages.appendChild(botMsg);
            }
            
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }
    
    function getHealthResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Health-related responses
        if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
            return "For headaches, try resting in a quiet, dark room and staying hydrated. If headaches persist or are severe, please consult our doctors. You can book an appointment or call (555) 123-4567 for urgent concerns.";
        }
        
        if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
            return "For fever, rest and drink plenty of fluids. Monitor your temperature regularly. If fever exceeds 101°F (38.3°C) or persists, please seek medical attention. Our emergency line is (555) 123-4567.";
        }
        
        if (lowerMessage.includes('cough') || lowerMessage.includes('cold')) {
            return "For cough and cold symptoms, stay hydrated, rest, and consider warm liquids. If symptoms worsen or persist beyond a week, please consult our healthcare professionals. Book an appointment through our website.";
        }
        
        if (lowerMessage.includes('stomach') || lowerMessage.includes('nausea') || lowerMessage.includes('vomit')) {
            return "For stomach issues, try clear fluids and bland foods. Avoid dairy and fatty foods. If symptoms are severe or persistent, please contact our medical team at (555) 123-4567.";
        }
        
        if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
            return "You can easily book an appointment through our website or call us at (555) 123-4567. Our doctors are available for consultations Monday-Friday 8AM-8PM, and weekends 9AM-6PM.";
        }
        
        if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
            return "For medical emergencies, please call our emergency line immediately at (555) 123-4567. Our emergency department is open 24/7 with specialized trauma teams ready to help.";
        }
        
        if (lowerMessage.includes('doctor') || lowerMessage.includes('specialist')) {
            return "We have over 50 specialist doctors including cardiologists, neurologists, and orthopedic surgeons. You can view our doctors and book appointments on our website or call (555) 123-4567.";
        }
        
        if (lowerMessage.includes('insurance') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            return "We accept most major insurance plans. For specific coverage questions or pricing information, please contact our billing department at (555) 123-4567 or visit our contact page.";
        }
        
        if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
            return "Our clinic hours are Monday-Friday: 8AM-8PM, Saturday-Sunday: 9AM-6PM. Emergency services are available 24/7. Call (555) 123-4567 for more information.";
        }
        
        // Default health-focused response
        return "Thank you for your question! For personalized medical advice, I recommend consulting with our healthcare professionals. You can book an appointment on our website or call (555) 123-4567. For emergencies, our 24/7 emergency line is always available.";
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