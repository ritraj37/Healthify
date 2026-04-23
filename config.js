// OpenAI Configuration
// IMPORTANT: Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
// Get your API key from: https://platform.openai.com/api-keys

const OPENAI_CONFIG = {
    API_KEY: 'YOUR_OPENAI_API_KEY', // Replace with your actual API key
    MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7
};

// Healthcare-specific system prompt
const SYSTEM_PROMPT = `You are a helpful healthcare assistant for Healthify medical center. 
Provide helpful, accurate health information while always recommending users consult with healthcare professionals for serious concerns. 
Keep responses concise and professional. 
For emergencies, direct users to call (555) 123-4567.
Always remind users that this is general information and not a substitute for professional medical advice.`;

// Export configuration (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { OPENAI_CONFIG, SYSTEM_PROMPT };
}