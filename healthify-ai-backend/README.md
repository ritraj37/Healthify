# 🏥 Healthify AI Backend

AI-powered health assistant backend for the Healthify healthcare platform.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python -m app.main
```

### Docker
```bash
# Build image
docker build -t healthify-ai .

# Run container
docker run -p 8000:8000 healthify-ai
```

## 📡 API Endpoints

- **POST** `/api/chat` - Chat with AI assistant
- **POST** `/api/health-query` - Specialized health queries
- **GET** `/api/health` - Health check
- **GET** `/api/docs` - Interactive API documentation

## 🔧 Integration

### JavaScript
```javascript
const response = await fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: 'I have a headache'})
});
const data = await response.json();
console.log(data.response);
```

### Java
```java
// Using OkHttp
RequestBody body = RequestBody.create(
    MediaType.parse("application/json"),
    "{\"message\": \"I have a headache\"}"
);
Request request = new Request.Builder()
    .url("http://localhost:8000/api/chat")
    .post(body)
    .build();
```

## 🛡️ Features

- ✅ Health-focused AI responses
- ✅ Safety filtering for harmful content
- ✅ Emergency detection
- ✅ Rate limiting (30 requests/minute)
- ✅ Medical disclaimers
- ✅ CORS enabled
- ✅ Docker support

## 🔒 Security

- Input validation with Pydantic
- Rate limiting protection
- Harmful content filtering
- Medical disclaimer enforcement
- Emergency situation detection

## 📊 Configuration

Environment variables:
- `HOST` - Server host (default: 0.0.0.0)
- `PORT` - Server port (default: 8000)
- `DEBUG` - Debug mode (default: False)

## 🏃‍♂️ Running

The server runs on `http://localhost:8000` by default.
Visit `/api/docs` for interactive API documentation.