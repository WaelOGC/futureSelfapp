// AI request routing and orchestration

const { getProvider } = require('../providers/provider.registry');
const { AI_TASKS } = require('../contracts/ai.interface');
const { AppError, toAppError } = require('../../core/errors/error.handler');
const { defaultRateLimiter } = require('../../core/middlewares/rate.limiter');
const { startUsageSession, endUsageSession, getUsageSummary } = require('../../core/logging/usage.tracker');

/**
 * Calculate input character count from payload
 * @param {Object} payload - Task payload
 * @returns {number} Total character count
 */
function calculateInputChars(payload) {
  if (!payload || typeof payload !== 'object') {
    return 0;
  }

  let total = 0;
  // Check common text fields
  if (payload.prompt && typeof payload.prompt === 'string') {
    total += payload.prompt.length;
  }
  if (payload.system && typeof payload.system === 'string') {
    total += payload.system.length;
  }
  if (payload.text && typeof payload.text === 'string') {
    total += payload.text.length;
  }
  // If payload itself is a string (unlikely but handle it)
  if (typeof payload === 'string') {
    total += payload.length;
  }

  return total;
}

/**
 * Calculate output character count from result
 * @param {*} result - Task result
 * @returns {number} Character count (0 if not a string)
 */
function calculateOutputChars(result) {
  if (typeof result === 'string') {
    return result.length;
  }
  return 0;
}

/**
 * Run an AI task using the specified provider
 * @param {Object} params - Task parameters
 * @param {string} params.provider - Provider name (must be registered)
 * @param {string} params.task - Task type (must be one of AI_TASKS)
 * @param {Object} params.payload - Task-specific payload
 * @param {string} params.identity - User/identity identifier (default: "local-dev")
 * @returns {Promise<Object>} Normalized response: { provider, task, success: true, data }
 * @throws {AppError} If validation fails or task execution fails
 */
async function runAiTask({ provider, task, payload, identity = 'local-dev' }) {
  // Validate inputs
  if (!provider || typeof provider !== 'string') {
    throw new AppError('Provider must be a non-empty string', 400, 'INVALID_INPUT');
  }

  if (!task || typeof task !== 'string') {
    throw new AppError('Task must be a non-empty string', 400, 'INVALID_INPUT');
  }

  if (!Object.values(AI_TASKS).includes(task)) {
    throw new AppError(
      `Invalid task type '${task}'. Valid tasks: ${Object.values(AI_TASKS).join(', ')}`,
      400,
      'INVALID_TASK'
    );
  }

  if (!payload || typeof payload !== 'object') {
    throw new AppError('Payload must be an object', 400, 'INVALID_INPUT');
  }

  // Apply rate limiting
  try {
    defaultRateLimiter.consume(identity);
  } catch (err) {
    if (err instanceof AppError && err.code === 'RATE_LIMITED') {
      throw err; // Re-throw rate limit errors as-is
    }
    throw toAppError(err);
  }

  // Start usage tracking session
  const sessionId = startUsageSession({ identity, provider, task });
  const startTime = Date.now();
  const inputChars = calculateInputChars(payload);

  // Get provider
  let providerClient;
  try {
    providerClient = getProvider(provider);
  } catch (err) {
    const endTime = Date.now();
    endUsageSession(sessionId, {
      inputChars,
      outputChars: 0,
      tokensIn: null,
      tokensOut: null,
      ms: endTime - startTime,
      success: false
    });
    throw toAppError(err);
  }

  // Route to appropriate handler based on task
  let result;
  try {
    switch (task) {
      case AI_TASKS.TEXT_GENERATION:
        if (typeof providerClient.generateText !== 'function') {
          throw new AppError(
            `Provider '${provider}' does not support TEXT_GENERATION task`,
            501,
            'TASK_NOT_SUPPORTED'
          );
        }
        result = await providerClient.generateText(payload);
        break;

      case AI_TASKS.IMAGE_GENERATION:
        if (typeof providerClient.generateImage !== 'function') {
          throw new AppError(
            `Provider '${provider}' does not support IMAGE_GENERATION task`,
            501,
            'TASK_NOT_SUPPORTED'
          );
        }
        result = await providerClient.generateImage(payload);
        break;

      case AI_TASKS.IMAGE_EDIT:
        if (typeof providerClient.editImage !== 'function') {
          throw new AppError(
            `Provider '${provider}' does not support IMAGE_EDIT task`,
            501,
            'TASK_NOT_SUPPORTED'
          );
        }
        result = await providerClient.editImage(payload);
        break;

      case AI_TASKS.IMAGE_ANALYSIS:
        if (typeof providerClient.analyzeImage !== 'function') {
          throw new AppError(
            `Provider '${provider}' does not support IMAGE_ANALYSIS task`,
            501,
            'TASK_NOT_SUPPORTED'
          );
        }
        result = await providerClient.analyzeImage(payload);
        break;

      case AI_TASKS.AUDIO_TRANSCRIPTION:
        if (typeof providerClient.transcribeAudio !== 'function') {
          throw new AppError(
            `Provider '${provider}' does not support AUDIO_TRANSCRIPTION task`,
            501,
            'TASK_NOT_SUPPORTED'
          );
        }
        result = await providerClient.transcribeAudio(payload);
        break;

      default:
        throw new AppError(`Unhandled task type: ${task}`, 500, 'INTERNAL_ERROR');
    }
  } catch (err) {
    const endTime = Date.now();
    const appError = toAppError(err);
    const outputChars = calculateOutputChars(result || '');
    
    // End usage session with failure
    endUsageSession(sessionId, {
      inputChars,
      outputChars,
      tokensIn: null,
      tokensOut: null,
      ms: endTime - startTime,
      success: false
    });

    // Preserve specific error codes that are more informative
    const preserveCodes = ['PROVIDER_NOT_IMPLEMENTED', 'PROVIDER_NOT_CONFIGURED', 'RATE_LIMITED', 'TASK_NOT_SUPPORTED'];
    if (appError instanceof AppError && preserveCodes.includes(appError.code)) {
      throw appError;
    }

    // If already an AppError with AI_TASK_FAILED, preserve it
    if (appError instanceof AppError && appError.code === 'AI_TASK_FAILED') {
      throw appError;
    }

    // Otherwise wrap in AI_TASK_FAILED
    throw new AppError(
      `AI task failed: ${appError.message}`,
      appError.statusCode || 500,
      'AI_TASK_FAILED',
      { provider, task, originalError: appError.code }
    );
  }

  // End usage session with success
  const endTime = Date.now();
  const outputChars = calculateOutputChars(result);
  endUsageSession(sessionId, {
    inputChars,
    outputChars,
    tokensIn: null,
    tokensOut: null,
    ms: endTime - startTime,
    success: true
  });

  // Normalize response
  return {
    provider,
    task,
    success: true,
    data: result
  };
}

/**
 * Get AI usage summary for an identity
 * @param {Object} params - Query parameters
 * @param {string} params.identity - Identity identifier (default: "local-dev")
 * @returns {Object} Usage summary
 */
function getAiUsageSummary({ identity = 'local-dev' } = {}) {
  return getUsageSummary({ identity });
}

module.exports = {
  runAiTask,
  getAiUsageSummary
};
