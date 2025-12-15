// Minimal CLI test runner for OpenAI text generation

// Load environment variables using centralized loader
const { ensureEnvLoaded } = require('../../core/env/env.loader');
ensureEnvLoaded({ override: true });

// Ensure provider registry is bootstrapped
require('../../ai/providers/index');

const { runAiTask } = require('../../ai/orchestration/ai.router');
const { PROVIDERS, AI_TASKS } = require('../../ai/contracts/ai.interface');
const { toAppError } = require('../../core/errors/error.handler');

async function testOpenAITextGeneration() {
  console.log('Testing OpenAI TEXT_GENERATION task...\n');

  try {
    const result = await runAiTask({
      provider: PROVIDERS.OPENAI,
      task: AI_TASKS.TEXT_GENERATION,
      payload: {
        prompt: 'Say hello in one sentence.',
        system: 'You are a helpful assistant.'
      }
    });

    console.log('✅ Test passed!');
    console.log('\nResult:');
    console.log(JSON.stringify(result, null, 2));
    console.log('\nGenerated text:');
    console.log(result.data);
  } catch (err) {
    const appError = toAppError(err);
    console.error('❌ Test failed!');
    console.error(`\nError: ${appError.message}`);
    console.error(`Code: ${appError.code}`);
    console.error(`Status: ${appError.statusCode}`);
    if (appError.details) {
      console.error(`Details:`, appError.details);
    }
    process.exit(1);
  }
}

// Run test
testOpenAITextGeneration();
