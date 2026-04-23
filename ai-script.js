const API_KEY = "YOUR_OPENAI_API_KEY"; // visible in frontend

document.getElementById("send-btn").addEventListener("click", sendMessage);

async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const text = input.value.trim();
    if (!text) return;

    // Show user message
    chatBox.innerHTML += `<div class="message user">${text}</div>`;
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Typing bubble
    const typing = document.createElement("div");
    typing.className = "message ai";
    typing.id = "typing";
    typing.innerText = "AI is typing...";
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    const systemPrompt = `
You are a safe healthcare assistant.
Provide general guidance only.
Do NOT diagnose or prescribe medication.
If user describes severe or emergency symptoms, advise immediate medical help.
`;

    const result = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ]
        })
    });

    const data = await result.json();

    // Remove typing bubble
    document.getElementById("typing").remove();

    const reply = data.choices[0].message.content;

    // Show AI message
    chatBox.innerHTML += `<div class="message ai">${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}
