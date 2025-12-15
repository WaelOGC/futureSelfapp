// Smoke test for stub providers (Gemini and Anthropic)

// Load environment variables using centralized loader
const { ensureEnvLoaded } = require('../../core/env/env.loader');
ensureEnvLoaded({ override: true });

// Ensure provider registry is bootstrapped
require('../../ai/providers/index');

const { runAiTask } = require('../../ai/orchestration/ai.router');
const { PROVIDERS, AI_TASKS } = require('../../ai/contracts/ai.interface');
const { toAppError } = require('../../core/errors/error.handler');

async function testStubProviders() {
  console.log('Testing stub providers (Gemini and Anthropic)...\n');
  console.log('These providers should fail with PROVIDER_NOT_IMPLEMENTED\n');

  // Test Gemini
  console.log('Testing GEMINI provider:');
  try {
    await runAiTask({
      provider: PROVIDERS.GEMINI,
      task: AI_TASKS.TEXT_GENERATION,
      payload: {
        prompt: 'Test prompt',
        system: 'Test system'
      }
    });
    console.error('❌ Unexpected: Gemini call succeeded (should have failed)');
    process.exit(1);
  } catch (err) {
    const appError = toAppError(err);
    if (appError.code === 'PROVIDER_NOT_IMPLEMENTED') {
      console.log(`✅ Gemini correctly returned: ${appError.code}`);
      console.log(`   Status: ${appError.statusCode}`);
      console.log(`   Message: ${appError.message}\n`);
    } else {
      console.error(`❌ Unexpected error code: ${appError.code}`);
      console.error(`   Expected: PROVIDER_NOT_IMPLEMENTED`);
      console.error(`   Status: ${appError.statusCode}`);
      console.error(`   Message: ${appError.message}\n`);
      process.exit(1);
    }
  }

  // Test Anthropic
  console.log('Testing ANTHROPIC provider:');
  try {
    await runAiTask({
      provider: PROVIDERS.ANTHROPIC,
      task: AI_TASKS.TEXT_GENERATION,
      payload: {
        prompt: 'Test prompt',
        system: 'Test system'
      }
    });
    console.error('❌ Unexpected: Anthropic call succeeded (should have failed)');
    process.exit(1);
  } catch (err) {
    const appError = toAppError(err);
    if (appError.code === 'PROVIDER_NOT_IMPLEMENTED') {
      console.log(`✅ Anthropic correctly returned: ${appError.code}`);
      console.log(`   Status: ${appError.statusCode}`);
      console.log(`   Message: ${appError.message}\n`);
    } else {
      console.error(`❌ Unexpected error code: ${appError.code}`);
      console.error(`   Expected: PROVIDER_NOT_IMPLEMENTED`);
      console.error(`   Status: ${appError.statusCode}`);
      console.error(`   Message: ${appError.message}\n`);
      process.exit(1);
    }
  }

  console.log('✅ All stub provider tests passed!');
}

// Run test
testStubProviders().catch(err => {
  const appError = toAppError(err);
  console.error('❌ Test failed!');
  console.error(`Error: ${appError.message}`);
  console.error(`Code: ${appError.code}`);
  console.error(`Status: ${appError.statusCode}`);
  process.exit(1);
});
