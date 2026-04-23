from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def api_documentation():
    """Serve API documentation"""
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Healthify AI API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: #0188df; font-weight: bold; }
            code { background: #e8e8e8; padding: 2px 5px; border-radius: 3px; }
        </style>
    </head>
    <body>
        <h1>🏥 Healthify AI API Documentation</h1>
        
        <div class="endpoint">
            <h3><span class="method">POST</span> /api/chat</h3>
            <p>Send a health-related message to the AI assistant</p>
            <p><strong>Request:</strong> <code>{"message": "I have a headache"}</code></p>
            <p><strong>Response:</strong> <code>{"response": "...", "confidence": 0.8}</code></p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method">GET</span> /api/health</h3>
            <p>Check API health status</p>
            <p><strong>Response:</strong> <code>{"status": "healthy"}</code></p>
        </div>
        
        <div class="endpoint">
            <h3><span class="method">GET</span> /api/docs</h3>
            <p>Interactive API documentation (Swagger UI)</p>
        </div>
        
        <h2>Integration Examples</h2>
        
        <h3>JavaScript</h3>
        <pre><code>
fetch('http://localhost:8000/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({message: 'I have a headache'})
})
.then(response => response.json())
.then(data => console.log(data.response));
        </code></pre>
        
        <h3>Java</h3>
        <pre><code>
// Using OkHttp
RequestBody body = RequestBody.create(
    MediaType.parse("application/json"),
    "{\\"message\\": \\"I have a headache\\"}"
);
Request request = new Request.Builder()
    .url("http://localhost:8000/api/chat")
    .post(body)
    .build();
        </code></pre>
    </body>
    </html>
    """