// AI provider registration and management

const { AppError } = require('../../core/errors/error.handler');

const providers = new Map();

/**
 * Register an AI provider
 * @param {string} name - Provider name (must match PROVIDERS constant)
 * @param {Object} providerClient - Provider client object with handler methods
 * @throws {AppError} If provider client is invalid
 */
function registerProvider(name, providerClient) {
  if (!name || typeof name !== 'string') {
    throw new AppError('Provider name must be a non-empty string', 500, 'INVALID_PROVIDER_NAME');
  }

  if (!providerClient || typeof providerClient !== 'object') {
    throw new AppError('Provider client must be an object', 500, 'INVALID_PROVIDER_CLIENT');
  }

  // Validate that provider has at least one handler method
  const handlerMethods = [
    'generateText',
    'generateImage',
    'editImage',
    'analyzeImage',
    'transcribeAudio'
  ];

  const hasHandler = handlerMethods.some(method => typeof providerClient[method] === 'function');

  if (!hasHandler) {
    throw new AppError(
      `Provider client must implement at least one handler method (${handlerMethods.join(', ')})`,
      500,
      'INVALID_PROVIDER_CLIENT'
    );
  }

  providers.set(name, providerClient);
}

/**
 * Get a registered provider
 * @param {string} name - Provider name
 * @returns {Object} Provider client
 * @throws {AppError} If provider not found
 */
function getProvider(name) {
  if (!name || typeof name !== 'string') {
    throw new AppError('Provider name must be a non-empty string', 500, 'INVALID_PROVIDER_NAME');
  }

  const provider = providers.get(name);

  if (!provider) {
    throw new AppError(
      `Provider '${name}' is not registered. Available providers: ${Array.from(providers.keys()).join(', ') || 'none'}`,
      404,
      'PROVIDER_NOT_FOUND'
    );
  }

  return provider;
}

/**
 * List all registered providers
 * @returns {string[]} Array of provider names
 */
function listProviders() {
  return Array.from(providers.keys());
}

module.exports = {
  registerProvider,
  getProvider,
  listProviders
};
