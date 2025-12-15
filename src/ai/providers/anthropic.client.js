// Anthropic provider client implementation (stub)

const { getEnv } = require('../../core/env/env.loader');
const { AppError } = require('../../core/errors/error.handler');

/**
 * Check if Anthropic API key is configured
 * @throws {AppError} If key is missing (status 400, code PROVIDER_NOT_CONFIGURED)
 */
function checkApiKey() {
  try {
    getEnv('ANTHROPIC_API_KEY', { required: true });
  } catch (err) {
    throw new AppError(
      'Anthropic API key is not configured. Please set ANTHROPIC_API_KEY in your environment.',
      400,
      'PROVIDER_NOT_CONFIGURED'
    );
  }
}

/**
 * Create Anthropic client instance (stub)
 * @returns {Object} Anthropic client with handler methods
 */
function createAnthropicClient() {
  // Note: We don't check the key here since this is a stub
  // The checkApiKey helper is available for when implementation is added

  return {
    generateText: async () => {
      throw new AppError(
        'Anthropic provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    },
    generateImage: async () => {
      throw new AppError(
        'Anthropic provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    },
    editImage: async () => {
      throw new AppError(
        'Anthropic provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    },
    analyzeImage: async () => {
      throw new AppError(
        'Anthropic provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    },
    transcribeAudio: async () => {
      throw new AppError(
        'Anthropic provider is stubbed (not implemented yet).',
        501,
        'PROVIDER_NOT_IMPLEMENTED'
      );
    }
  };
}

module.exports = {
  createAnthropicClient,
  checkApiKey
};
