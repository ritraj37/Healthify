// CSV Dataset Loader
let csvDataset = [];

function parseCSVLine(line) {
    const result = [];
    let current = '', inQuotes = false;
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
            console.log(`healthcare_dataset.csv: ${csvDataset.length} entries`);
            break;
        } catch (e) { continue; }
    }

    // 2. Load Medicine_Details.csv (Medicine Name, Composition, Uses, Side_effects)
    const medPaths = ['./healthcare_dataset.csv/Medicine_Details.csv', '../healthcare_dataset.csv/Medicine_Details.csv'];
    const prevLen = csvDataset.length;
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
            console.log(`Medicine_Details.csv: ${csvDataset.length - prevLen} entries`);
            break;
        } catch (e) { continue; }
    }
}

function searchCSVDataset(query) {
    const q = query.toLowerCase();
    return csvDataset.find(entry =>
        q.includes(entry.disease) || entry.disease.split(' ').some(word => word.length > 3 && q.includes(word))
    );
}

// AI Assistant JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCSVDataset();
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const imageBtn = document.getElementById('image-btn');
    const imageUpload = document.getElementById('image-upload');
    const clearBtn = document.getElementById('clear-chat');
    const exportBtn = document.getElementById('export-chat');
    const typingIndicator = document.getElementById('typing-indicator');
    const charCount = document.querySelector('.char-count');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');

    // Character counter
    userInput.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count}/500`;
        
        if (count > 450) {
            charCount.style.color = '#dc3545';
        } else {
            charCount.style.color = '#666';
        }
    });

    // Quick suggestions
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            userInput.value = question;
            sendMessage();
        });
    });

    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        userInput.value = '';
        charCount.textContent = '0/500';

        // Show typing indicator
        showTypingIndicator();

        // Wait for CSV to load if not yet loaded, then respond
        const delay = 1500 + Math.random() * 1000;
        setTimeout(async () => {
            if (csvDataset.length === 0) await loadCSVDataset();
            hideTypingIndicator();
            const response = generateAIResponse(message);
            addMessage(response, 'ai');
        }, delay);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="ai-avatar-small">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${time}</span>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content user-message">
                    <p>${text}</p>
                    <span class="message-time">${time}</span>
                </div>
                <div class="user-avatar-small">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Show/hide typing indicator
    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }

    // Healthify AI Health Assistant - Safe & Responsible
    function generateAIResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        const disclaimer = '<br><br><em>⚕️ This is not medical advice. Please consult a doctor for proper diagnosis.</em>';

        // --- CSV DATASET MATCH ---
        const csvMatch = searchCSVDataset(msg);
        if (csvMatch) {
            return `🩺 <strong>${csvMatch.disease.charAt(0).toUpperCase() + csvMatch.disease.slice(1)}</strong><br><br>${csvMatch.description}${disclaimer}`;
        }

        // --- EMERGENCY CONDITIONS (respond urgently) ---
        if (msg.includes('chest pain') || msg.includes('heart attack') || msg.includes('cant breathe') || msg.includes("can't breathe") || msg.includes('difficulty breathing') || msg.includes('severe bleeding') || msg.includes('unconscious') || msg.includes('stroke')) {
            return '🚨 <strong>This sounds like a medical emergency!</strong><br><br>Please take these steps <strong>immediately</strong>:<br>• Call emergency services or go to the nearest ER right away<br>• Do not drive yourself — ask someone to help<br>• Stay calm and sit or lie down in a comfortable position<br><br>📞 <strong>Emergency: (555) 123-4567</strong><br><br>Do not wait or try to manage this at home. Your safety comes first.' + disclaimer;
        }

        // --- MENTAL HEALTH ---
        if (msg.includes('anxiety') || msg.includes('depression') || msg.includes('stress') || msg.includes('mental health') || msg.includes('sad') || msg.includes('lonely') || msg.includes('panic')) {
            return '💙 I hear you, and I want you to know — <strong>what you\'re feeling is valid</strong>.<br><br><strong>Some things that may help:</strong><br>• Take slow, deep breaths (inhale 4 sec, hold 4 sec, exhale 4 sec)<br>• Talk to someone you trust about how you feel<br>• Limit news/social media if it adds to your stress<br>• Try a short walk or light stretching<br>• Journaling your thoughts can bring clarity<br><br><strong>Lifestyle tips:</strong><br>• Maintain a regular sleep schedule<br>• Eat balanced meals and stay hydrated<br>• Avoid alcohol and excessive caffeine<br><br>You are not alone. Speaking with a mental health professional can make a big difference. 💚' + disclaimer;
        }

        // --- FEVER & COLD/FLU ---
        if (msg.includes('fever') || (msg.includes('cold') && msg.includes('cough')) || msg.includes('flu')) {
            return '🤒 I understand you\'re not feeling well. Fever and cold symptoms are very common and are usually caused by viral infections.<br><br><strong>General precautions:</strong><br>• Rest as much as possible<br>• Drink plenty of warm fluids (water, herbal tea, soups)<br>• Use a cool damp cloth on your forehead for comfort<br>• Keep yourself warm and avoid cold air<br><br><strong>Diet suggestions:</strong><br>✅ Warm soups, citrus fruits, ginger tea, honey, garlic<br>❌ Avoid cold drinks, fried or heavy foods<br><br>⚠️ Please see a doctor if your fever is very high, lasts more than 3 days, or is accompanied by difficulty breathing.' + disclaimer;
        }

        // --- HEADACHE / MIGRAINE ---
        if (msg.includes('headache') || msg.includes('migraine')) {
            return '😣 I\'m sorry to hear you have a headache. Headaches can have many causes — stress, dehydration, lack of sleep, or eye strain are among the most common.<br><br><strong>General tips that may help:</strong><br>• Drink a glass of water — dehydration is a frequent cause<br>• Rest in a quiet, dimly lit room<br>• Apply a cold or warm compress to your forehead<br>• Avoid staring at screens for long periods<br>• Try gentle neck stretches<br><br><strong>Diet suggestions:</strong><br>✅ Water, almonds, bananas, ginger tea, spinach<br>❌ Limit caffeine, alcohol, and processed foods<br><br>⚠️ If headaches are severe, frequent, or come with vision changes or vomiting, please consult a doctor.' + disclaimer;
        }

        // --- STOMACH PAIN ---
        if (msg.includes('stomach') || msg.includes('stomach pain') || msg.includes('stomach ache') || msg.includes('abdomen') || msg.includes('nausea') || msg.includes('vomiting') || msg.includes('indigestion')) {
            return '🤢 I understand stomach discomfort can be quite unpleasant. It can be caused by indigestion, gas, acidity, or a mild infection.<br><br><strong>General precautions:</strong><br>• Sip warm water or ginger tea slowly<br>• Avoid spicy, oily, or heavy meals for now<br>• Rest and avoid strenuous activity<br>• Try eating small, light meals<br><br><strong>Diet suggestions:</strong><br>✅ Bananas, plain rice, yogurt, boiled vegetables, buttermilk<br>❌ Avoid spicy food, coffee, alcohol, raw vegetables<br><br>⚠️ If the pain is severe, persistent (more than 24 hours), or comes with high fever or blood in stool, please see a doctor promptly.' + disclaimer;
        }

        // --- DIABETES ---
        if (msg.includes('diabetes') || msg.includes('blood sugar') || msg.includes('sugar level')) {
            return '🩺 Thank you for sharing that. Diabetes is a manageable condition with the right lifestyle habits.<br><br><strong>General lifestyle tips:</strong><br>• Stay physically active — even a 30-minute daily walk helps<br>• Monitor your meals and avoid skipping them<br>• Stay well hydrated<br>• Manage stress, as it can affect blood sugar levels<br>• Get regular check-ups and blood tests<br><br><strong>Diet suggestions:</strong><br>✅ Bitter gourd, fenugreek, leafy greens, whole grains, legumes, nuts<br>❌ Avoid white rice, sugary drinks, sweets, processed snacks<br><br>📅 It\'s important to work closely with your doctor for a personalised management plan.' + disclaimer;
        }

        // --- BLOOD PRESSURE ---
        if (msg.includes('blood pressure') || msg.includes('hypertension') || msg.includes('bp')) {
            return '💓 High blood pressure is a common condition that can be managed well with lifestyle changes.<br><br><strong>General tips:</strong><br>• Reduce salt in your meals<br>• Exercise regularly — even brisk walking helps<br>• Manage stress through relaxation techniques<br>• Avoid smoking and limit alcohol<br>• Monitor your BP regularly at home if possible<br><br><strong>Diet suggestions:</strong><br>✅ Bananas, beetroot, garlic, leafy greens, oats, low-fat dairy<br>❌ Avoid excess salt, pickles, processed foods, caffeine<br><br>📅 Please consult your doctor before making any changes to your medication.' + disclaimer;
        }

        // --- SLEEP / INSOMNIA ---
        if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes('cant sleep') || msg.includes("can't sleep")) {
            return '😴 Sleep is essential for good health, and I\'m glad you\'re paying attention to it.<br><br><strong>Sleep hygiene tips:</strong><br>• Try to sleep and wake at the same time every day<br>• Avoid screens (phone, TV) at least 1 hour before bed<br>• Keep your bedroom cool, dark, and quiet<br>• Avoid heavy meals or caffeine close to bedtime<br>• Try deep breathing or light stretching before sleep<br><br><strong>Diet suggestions:</strong><br>✅ Warm milk, almonds, bananas, chamomile tea<br>❌ Avoid caffeine after 4 PM and heavy dinners<br><br>🧘 Meditation or a short gratitude journal before bed can also help calm the mind.<br><br>⚠️ If sleep problems persist for more than 2 weeks, please speak with a doctor.' + disclaimer;
        }

        // --- DIET / NUTRITION ---
        if (msg.includes('diet') || msg.includes('nutrition') || msg.includes('healthy eating') || msg.includes('what to eat') || msg.includes('food')) {
            return '🥗 Great question! A balanced diet is one of the best things you can do for your health.<br><br><strong>A simple balanced plate:</strong><br>• 50% — Vegetables & fruits<br>• 25% — Whole grains (brown rice, oats, roti)<br>• 25% — Protein (eggs, dal, fish, paneer, chicken)<br><br><strong>Daily meal ideas:</strong><br>🌅 Breakfast: Oats or eggs with fruits<br>🌞 Lunch: Rice/roti + dal + vegetables + salad<br>🍎 Snack: Handful of nuts or a fruit<br>🌙 Dinner: Light soup or grilled food with salad<br><br>💧 Drink 8–10 glasses of water daily<br>❌ Limit sugar, fried food, and ultra-processed snacks' + disclaimer;
        }

        // --- FITNESS / EXERCISE ---
        if (msg.includes('exercise') || msg.includes('fitness') || msg.includes('workout') || msg.includes('physical activity')) {
            return '💪 Staying active is one of the best investments for your long-term health!<br><br><strong>Safe exercise tips for beginners:</strong><br>• Start with 20–30 minutes of brisk walking daily<br>• Gradually add light strength training 2–3 times a week<br>• Always warm up before and cool down after exercise<br>• Stay hydrated during workouts<br>• Listen to your body — rest if you feel pain<br><br><strong>Low-impact options:</strong><br>• Yoga, swimming, cycling, stretching<br><br>⚠️ If you have any existing health conditions (heart, joints, etc.), please consult your doctor before starting a new exercise routine.' + disclaimer;
        }

        // --- WEIGHT MANAGEMENT ---
        if (msg.includes('weight') || msg.includes('lose weight') || msg.includes('obesity') || msg.includes('overweight')) {
            return '⚖️ Managing weight is a journey, and small consistent steps make a big difference.<br><br><strong>Healthy approach:</strong><br>• Aim for gradual loss — 0.5 to 1 kg per week is healthy<br>• Focus on whole, unprocessed foods<br>• Eat slowly and mindfully — avoid eating in front of screens<br>• Stay active with daily movement you enjoy<br>• Get 7–8 hours of sleep (poor sleep affects weight)<br><br><strong>Diet tips:</strong><br>✅ Vegetables, fruits, lean protein, whole grains, water<br>❌ Avoid sugary drinks, fried food, late-night snacking<br><br>📅 A nutritionist or doctor can help you create a safe, personalised plan.' + disclaimer;
        }

        // --- SKIN / ACNE ---
        if (msg.includes('skin') || msg.includes('acne') || msg.includes('pimple') || msg.includes('rash')) {
            return '🧴 Skin concerns are very common and often linked to lifestyle, hormones, or environment.<br><br><strong>General skin care tips:</strong><br>• Wash your face gently twice a day<br>• Avoid touching your face frequently<br>• Stay hydrated — skin loves water<br>• Change pillowcases regularly<br>• Manage stress, which can trigger breakouts<br><br><strong>Diet suggestions:</strong><br>✅ Water-rich fruits, leafy greens, nuts, fish (omega-3)<br>❌ Limit dairy, sugar, and fried foods<br><br>⚠️ For persistent rashes, severe acne, or unusual skin changes, please consult a dermatologist.' + disclaimer;
        }

        // --- THYROID ---
        if (msg.includes('thyroid')) {
            return '🦋 Thyroid issues are quite common and very manageable with proper care.<br><br><strong>Common symptoms to discuss with your doctor:</strong><br>• Unexplained weight changes<br>• Fatigue or feeling unusually cold/hot<br>• Hair thinning or mood changes<br><br><strong>General lifestyle tips:</strong><br>• Eat regular, balanced meals<br>• Manage stress through relaxation or yoga<br>• Get adequate sleep<br>• Avoid self-medicating<br><br><strong>Diet suggestions (general):</strong><br>✅ Iodized salt, eggs, seafood, nuts, selenium-rich foods<br>❌ Avoid excessive raw cruciferous vegetables and soy if hypothyroid<br><br>📅 A TSH blood test is the standard way to check thyroid function. Please consult your doctor for testing and guidance.' + disclaimer;
        }

        // --- COVID / RESPIRATORY ---
        if (msg.includes('covid') || msg.includes('corona') || msg.includes('breathing') || msg.includes('shortness of breath')) {
            return '🫁 Respiratory symptoms should always be taken seriously.<br><br><strong>General precautions:</strong><br>• Rest and stay well hydrated<br>• Monitor your symptoms closely<br>• Keep your living space well ventilated<br>• Wear a mask if around others<br><br><strong>Diet suggestions:</strong><br>✅ Warm fluids, vitamin C-rich fruits, protein-rich foods, zinc sources<br>❌ Avoid cold drinks and heavy meals<br><br>🚨 <strong>Seek immediate medical help if you experience:</strong><br>• Difficulty breathing or shortness of breath<br>• Persistent chest pain<br>• Confusion or inability to stay awake<br><br>📞 Emergency: (555) 123-4567' + disclaimer;
        }

        // --- GREETINGS ---
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.match(/^(good morning|good afternoon|good evening)$/)) {
            return '👋 Hello! Welcome to <strong>Healthify AI Health Assistant</strong>.<br><br>I\'m here to provide you with safe, general health guidance. I can help with:<br>• 🤒 Symptom guidance<br>• 🥗 Diet & nutrition tips<br>• 💪 Fitness advice<br>• 💙 Mental health support<br>• 🚨 Emergency guidance<br><br>How are you feeling today? Please describe your concern and I\'ll do my best to help.' + disclaimer;
        }

        // --- DEFAULT ---
        return '👋 Thank you for reaching out to <strong>Healthify AI Assistant</strong>.<br><br>I\'m here to provide general health guidance. Could you tell me a bit more about what you\'re experiencing? For example:<br>• What symptoms are you feeling?<br>• How long have you had them?<br>• Is there anything specific you\'d like advice on (diet, fitness, sleep, etc.)?<br><br>The more you share, the better I can guide you. 😊' + disclaimer;
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Clear chat
    clearBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            const welcomeMessage = chatBox.querySelector('.welcome-message');
            chatBox.innerHTML = '';
            chatBox.appendChild(welcomeMessage);
        }
    });

    // Export chat (basic implementation)
    exportBtn.addEventListener('click', function() {
        const messages = chatBox.querySelectorAll('.message');
        let chatText = 'Healthify AI Assistant Chat Export\n\n';
        
        messages.forEach(msg => {
            const content = msg.querySelector('.message-content p').textContent;
            const time = msg.querySelector('.message-time').textContent;
            const sender = msg.classList.contains('user') ? 'You' : 'AI Assistant';
            chatText += `[${time}] ${sender}: ${content}\n\n`;
        });
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'healthify-chat-export.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Image upload functionality
    imageBtn.addEventListener('click', function() {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function(event) {
                const imageData = event.target.result;
                
                // Add user message with image
                addImageMessage(imageData, 'user');
                
                // Show typing indicator
                showTypingIndicator();
                
                try {
                    // Call AI backend for image analysis
                    const response = await fetch('http://localhost:45678/api/chat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: 'Please analyze this medical image',
                            image_data: imageData,
                            user_id: 'ai_assistant_user',
                            session_id: 'ai_session_' + Date.now()
                        })
                    });
                    
                    hideTypingIndicator();
                    
                    if (response.ok) {
                        const data = await response.json();
                        addMessage(data.response, 'ai');
                    } else {
                        throw new Error('Image analysis failed');
                    }
                } catch (error) {
                    console.error('Image Analysis Error:', error);
                    hideTypingIndicator();
                    
                    const fallbackResponse = "I can see your image, but I'm having trouble analyzing it right now. Please describe your concern and I'll provide general guidance, or consider booking an appointment with our specialists for proper evaluation.";
                    addMessage(fallbackResponse, 'ai');
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Add image message to chat
    function addImageMessage(imageData, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-content user-message">
                <p>📷 Medical image uploaded for analysis</p>
                <img src="${imageData}" style="max-width: 250px; border-radius: 8px; margin-top: 8px;" alt="Uploaded medical image">
                <span class="message-time">${time}</span>
            </div>
            <div class="user-avatar-small">
                <i class="fas fa-user"></i>
            </div>
        `;
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    // Voice input (basic implementation)
    voiceBtn.addEventListener('click', function() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = function() {
                voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
                voiceBtn.style.background = '#dc3545';
            };

            recognition.onresult = function(event) {
                const transcript = event.results[0][0].transcript;
                userInput.value = transcript;
            };

            recognition.onend = function() {
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.style.background = '#f8f9fa';
            };

            recognition.start();
        } else {
            alert('Voice recognition is not supported in your browser.');
        }
    });
});