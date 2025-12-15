// Bootstrap AI provider registry

// Load environment variables from .env file before creating clients
const { ensureEnvLoaded } = require('../../core/env/env.loader');
ensureEnvLoaded({ override: true });

const { registerProvider } = require('./provider.registry');
const { PROVIDERS } = require('../contracts/ai.interface');
const { createOpenAIClient } = require('./openai.client');
const { createGeminiClient } = require('./gemini.client');
const { createAnthropicClient } = require('./anthropic.client');

// Register OpenAI provider on startup
try {
  const openaiClient = createOpenAIClient();
  registerProvider(PROVIDERS.OPENAI, openaiClient);
} catch (err) {
  // Don't throw - allow app to start even if OpenAI key is missing
  // Provider registration will fail when actually used
  // Silent failure - errors will be surfaced when provider is actually used
}

// Register Gemini provider (stub)
try {
  const geminiClient = createGeminiClient();
  registerProvider(PROVIDERS.GEMINI, geminiClient);
} catch (err) {
  // Silent failure - errors will be surfaced when provider is actually used
}

// Register Anthropic provider (stub)
try {
  const anthropicClient = createAnthropicClient();
  registerProvider(PROVIDERS.ANTHROPIC, anthropicClient);
} catch (err) {
  // Silent failure - errors will be surfaced when provider is actually used
}

module.exports = {
  // Export for potential use in other modules
};
