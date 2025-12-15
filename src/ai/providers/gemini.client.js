// Gemini provider client implementation (stub)

const { getEnv } = require('../../core/env/env.loader');
const { AppError } = require('../../core/errors/error.handler');

/**
 * Check if Gemini API key is configured
 * @throws {AppError} If key is missing (status 400, code PROVIDER_NOT_CONFIGURED)
 */
function checkApiKey() {
  try {
    getEnv('GEMINI_API_KEY', { required: true });
  } catch (err) {
    throw new AppError(
      'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment.',
      400,
      'PROVIDER_NOT_CONFIGURED'
    );
  }
}

/**
 * Create Gemini client instance (stub)
 * @returns {Object} Gemini client with handler methods
 */
function createGeminiClient() {
  // Note: We don't check the key here since this is a stub
  // The checkApiKey helper is available for when implementation is added

  return {
    generateText: async () => {
      throw new AppError(
        'Gemini provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    },
    generateImage: async () => {
      throw new AppError(
        'Gemini provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    },
    editImage: async () => {
      throw new AppError(
        'Gemini provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    },
    analyzeImage: async () => {
      throw new AppError(
        'Gemini provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    },
    transcribeAudio: async () => {
      throw new AppError(
        'Gemini provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    }
  };
}

module.exports = {
  createGeminiClient,
  checkApiKey
};
