# 🔗 Integration Examples

## JavaScript Integration

### Basic Chat Integration
```javascript
// Function to send message to AI backend
async function sendToHealthifyAI(message) {
    try {
        const response = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                user_id: 'web_user',
                session_id: 'session_' + Date.now()
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.response;
        } else {
            throw new Error('API request failed');
        }
    } catch (error) {
        console.error('AI Backend Error:', error);
        return 'Sorry, I am currently unavailable. Please try again later.';
    }
}

// Usage example
sendToHealthifyAI('I have a headache').then(response => {
    console.log('AI Response:', response);
});
```

### Health Query Integration
```javascript
async function sendHealthQuery(query, category = 'general') {
    try {
        const response = await fetch('http://localhost:8000/api/health-query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: query,
                category: category,
                urgency: 'normal'
            })
        });
        
        const data = await response.json();
        return {
            answer: data.answer,
            recommendations: data.recommendations,
            emergency: data.emergency_alert
        };
    } catch (error) {
        console.error('Health Query Error:', error);
        return null;
    }
}
```

## Java Integration

### Using OkHttp
```java
import okhttp3.*;
import com.google.gson.Gson;
import java.io.IOException;

public class HealthifyAIClient {
    private static final String BASE_URL = "http://localhost:8000/api";
    private final OkHttpClient client;
    private final Gson gson;
    
    public HealthifyAIClient() {
        this.client = new OkHttpClient();
        this.gson = new Gson();
    }
    
    public String sendChatMessage(String message) throws IOException {
        ChatRequest request = new ChatRequest(message, "java_user", "session_" + System.currentTimeMillis());
        
        RequestBody body = RequestBody.create(
            MediaType.parse("application/json"),
            gson.toJson(request)
        );
        
        Request httpRequest = new Request.Builder()
            .url(BASE_URL + "/chat")
            .post(body)
            .build();
        
        try (Response response = client.newCall(httpRequest).execute()) {
            if (response.isSuccessful()) {
                ChatResponse chatResponse = gson.fromJson(response.body().string(), ChatResponse.class);
                return chatResponse.response;
            } else {
                throw new IOException("API request failed: " + response.code());
            }
        }
    }
    
    // Request/Response classes
    static class ChatRequest {
        String message;
        String user_id;
        String session_id;
        
        ChatRequest(String message, String userId, String sessionId) {
            this.message = message;
            this.user_id = userId;
            this.session_id = sessionId;
        }
    }
    
    static class ChatResponse {
        String response;
        double confidence;
        String timestamp;
    }
}
```

### Using Spring RestTemplate
```java
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class HealthifyAIService {
    private static final String BASE_URL = "http://localhost:8000/api";
    private final RestTemplate restTemplate;
    
    public HealthifyAIService() {
        this.restTemplate = new RestTemplate();
    }
    
    public String getChatResponse(String message) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("message", message);
        requestBody.put("user_id", "spring_user");
        requestBody.put("session_id", "session_" + System.currentTimeMillis());
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                BASE_URL + "/chat", 
                entity, 
                Map.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK) {
                return (String) response.getBody().get("response");
            }
        } catch (Exception e) {
            System.err.println("Error calling AI API: " + e.getMessage());
        }
        
        return "Sorry, I am currently unavailable.";
    }
}
```

## Python Integration

### Using requests library
```python
import requests
import json

class HealthifyAIClient:
    def __init__(self, base_url="http://localhost:8000/api"):
        self.base_url = base_url
    
    def send_chat_message(self, message, user_id="python_user"):
        try:
            response = requests.post(
                f"{self.base_url}/chat",
                json={
                    "message": message,
                    "user_id": user_id,
                    "session_id": f"session_{int(time.time())}"
                },
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json()["response"]
            else:
                return "Sorry, I am currently unavailable."
                
        except requests.RequestException as e:
            print(f"Error: {e}")
            return "Sorry, I am currently unavailable."

# Usage
client = HealthifyAIClient()
response = client.send_chat_message("I have a fever")
print(response)
```

## Error Handling Best Practices

### JavaScript
```javascript
async function robustAICall(message) {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
                timeout: 10000
            });
            
            if (response.ok) {
                return await response.json();
            }
            
            throw new Error(`HTTP ${response.status}`);
            
        } catch (error) {
            attempt++;
            if (attempt >= maxRetries) {
                return { 
                    response: "I'm currently experiencing technical difficulties. Please try again later or contact support at (555) 123-4567.",
                    confidence: 0.0 
                };
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}
```

### Java
```java
public String sendMessageWithRetry(String message, int maxRetries) {
    for (int attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return sendChatMessage(message);
        } catch (IOException e) {
            if (attempt == maxRetries) {
                return "I'm currently experiencing technical difficulties. Please contact support.";
            }
            
            try {
                Thread.sleep(1000 * attempt); // Exponential backoff
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
    return "Service temporarily unavailable.";
}
```