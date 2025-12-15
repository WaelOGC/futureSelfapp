// Smoke test for AI router with usage tracking

// Load environment variables using centralized loader
const { ensureEnvLoaded } = require('../../core/env/env.loader');
ensureEnvLoaded({ override: true });

// Ensure provider registry is bootstrapped
require('../../ai/providers/index');

const { runAiTask, getAiUsageSummary } = require('../../ai/orchestration/ai.router');
const { PROVIDERS, AI_TASKS } = require('../../ai/contracts/ai.interface');
const { toAppError } = require('../../core/errors/error.handler');

async function testRouterUsage() {
  const identity = 'local-dev';
  const results = {
    call1: null,
    call2: null,
    usageSummary: null
  };

  // First call
  try {
    const result1 = await runAiTask({
      provider: PROVIDERS.OPENAI,
      task: AI_TASKS.TEXT_GENERATION,
      payload: {
        prompt: 'Say hello in one sentence.',
        system: 'You are a helpful assistant.'
      },
      identity
    });
    results.call1 = {
      success: true,
      data: result1.data,
      responsePreview: result1.data.substring(0, 100)
    };
  } catch (err) {
    const appError = toAppError(err);
    results.call1 = {
      success: false,
      error: {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode
      }
    };
  }

  // Second call
  try {
    const result2 = await runAiTask({
      provider: PROVIDERS.OPENAI,
      task: AI_TASKS.TEXT_GENERATION,
      payload: {
        prompt: 'Say goodbye in one sentence.',
        system: 'You are a helpful assistant.'
      },
      identity
    });
    results.call2 = {
      success: true,
      data: result2.data,
      responsePreview: result2.data.substring(0, 100)
    };
  } catch (err) {
    const appError = toAppError(err);
    results.call2 = {
      success: false,
      error: {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode
      }
    };
  }

  // Get usage summary
  results.usageSummary = getAiUsageSummary({ identity });

  // Output clean JSON only
  process.stdout.write(JSON.stringify(results, null, 2));
}

// Run test
testRouterUsage().catch(err => {
  const appError = toAppError(err);
  const errorOutput = {
    success: false,
    error: {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode
    }
  };
  process.stdout.write(JSON.stringify(errorOutput, null, 2));
  process.exit(1);
});
