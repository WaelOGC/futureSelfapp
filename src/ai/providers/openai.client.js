// OpenAI provider client implementation

const { getEnv } = require('../../core/env/env.loader');
const { AppError } = require('../../core/errors/error.handler');

let openaiClient = null;

/**
 * Create OpenAI client instance
 * Uses OpenAI SDK if available, otherwise falls back to fetch API
 * @returns {Object} OpenAI client with handler methods
 */
function createOpenAIClient() {
  // Load API key from environment
  let apiKey = getEnv('OPENAI_API_KEY', { required: true });
  // Trim any whitespace that might have been introduced
  apiKey = apiKey.trim();

  // Try to use OpenAI SDK if installed
  try {
    const { OpenAI } = require('openai');
    
    // Initialize client with only API key
    openaiClient = new OpenAI({ apiKey });
    
    return {
      generateText: async ({ prompt, system, model = 'gpt-4o-mini' }) => {
        try {
          const messages = [];
          if (system) {
            messages.push({ role: 'system', content: system });
          }
          messages.push({ role: 'user', content: prompt });

          const completion = await openaiClient.chat.completions.create({
            model,
            messages,
            temperature: 0.8,
            max_tokens: 300
          });

          return completion.choices[0]?.message?.content?.trim() || '';
        } catch (err) {
          // Provide more helpful error messages for common issues
          let errorMessage = err.message;
          if (err.status === 401 || err.message?.includes('401') || err.message?.includes('Incorrect API key')) {
            const keyPrefix = apiKey.substring(0, 7);
            errorMessage = `401 Unauthorized: Invalid or expired API key. Please verify your OPENAI_API_KEY in the .env file is correct and active. Key format: ${keyPrefix}...${apiKey.substring(apiKey.length - 4)}`;
          }
          throw new AppError(
            `OpenAI text generation failed: ${errorMessage}`,
            500,
            'OPENAI_ERROR',
            { originalError: err.message, status: err.status }
          );
        }
      },
      generateImage: async () => {
        throw new AppError('IMAGE_GENERATION not implemented for OpenAI', 501, 'NOT_IMPLEMENTED');
      },
      editImage: async () => {
        throw new AppError('IMAGE_EDIT not implemented for OpenAI', 501, 'NOT_IMPLEMENTED');
      },
      analyzeImage: async () => {
        throw new AppError('IMAGE_ANALYSIS not implemented for OpenAI', 501, 'NOT_IMPLEMENTED');
      },
      transcribeAudio: async () => {
        throw new AppError('AUDIO_TRANSCRIPTION not implemented for OpenAI', 501, 'NOT_IMPLEMENTED');
      }
    };
  } catch (sdkError) {
    // SDK not installed, use fetch API (Node 18+)
    return {
      generateText: async ({ prompt, system, model = 'gpt-4o-mini' }) => {
        try {
          const messages = [];
          if (system) {
            messages.push({ role: 'system', content: system });
          }
          messages.push({ role: 'user', content: prompt });

          // Build headers
          const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          };

          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              model,
              messages,
              temperature: 0.8,
              max_tokens: 300
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            let errorMessage = errorData.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`;
            
            // Provide more helpful error messages for 401 errors
            if (response.status === 401) {
              const keyPrefix = apiKey.substring(0, 7);
              errorMessage = `401 Unauthorized: Invalid or expired API key. Please verify your OPENAI_API_KEY in the .env file is correct and active. Key format: ${keyPrefix}...${apiKey.substring(apiKey.length - 4)}`;
            }
            
            throw new Error(errorMessage);
          }

          const data = await response.json();
          return data.choices[0]?.message?.content?.trim() || '';
        } catch (err) {
          throw new AppError(
            `OpenAI text generation failed: ${err.message}`,
            500,
            'OPENAI_ERROR',
            { originalError: err.message }
          );
        }
      },
      generateImage: async () => {
        throw new AppError('IMAGE_GENERATION not implemented for OpenAI', 501, 'NOT_IMPLEMENTED');
      },
      editImage: async () => {
        throw new AppError('IMAGE_EDIT not implemented for OpenAI', 501, 'NOT_IMPLEMENTED');
      },
      analyzeImage: async () => {
        throw new AppError('IMAGE_ANALYSIS not implemented for OpenAI', 501, 'NOT_IMPLEMENTED');
      },
      transcribeAudio: async () => {
        throw new AppError('AUDIO_TRANSCRIPTION not implemented for OpenAI', 501, 'NOT_IMPLEMENTED');
      }
    };
  }
}

module.exports = {
  createOpenAIClient
};
