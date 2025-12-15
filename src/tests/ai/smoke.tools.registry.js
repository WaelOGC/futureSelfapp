// Smoke test for AI tools registry

// Load environment variables using centralized loader
const { ensureEnvLoaded } = require('../../core/env/env.loader');
ensureEnvLoaded({ override: true });

// Ensure provider registry is bootstrapped
require('../../ai/providers/index');

const { listTools, runTool } = require('../../ai_tools/registry/tools.registry');
const { PROVIDERS } = require('../../ai/contracts/ai.interface');
const { toAppError } = require('../../core/errors/error.handler');

async function testToolsRegistry() {
  console.log('Testing AI Tools Registry...\n');

  // Test 1: List all tools
  console.log('Test 1: Listing all tools');
  console.log('========================');
  try {
    const tools = listTools();
    console.log(`✅ Found ${tools.length} tools:\n`);
    tools.forEach(tool => {
      console.log(`  - ${tool.id}: ${tool.name}`);
      console.log(`    Description: ${tool.description}`);
      console.log(`    Default Provider: ${tool.defaultProvider}`);
      console.log(`    Supported Tasks: ${tool.supportedTasks.join(', ')}`);
      console.log('');
    });
  } catch (err) {
    const appError = toAppError(err);
    console.error('❌ Failed to list tools!');
    console.error(`Error: ${appError.message}`);
    console.error(`Code: ${appError.code}`);
    console.error(`Status: ${appError.statusCode}\n`);
    return;
  }

  // Test 2: Run future_letter tool
  console.log('Test 2: Running future_letter tool');
  console.log('==================================');
  try {
    const result = await runTool({
      toolId: 'future_letter',
      payload: {
        prompt: 'Write a short letter to my future self about staying motivated.',
        system: 'You are a thoughtful assistant that helps people write meaningful letters.'
      },
      provider: PROVIDERS.OPENAI,
      identity: 'smoke-test'
    });
    console.log('✅ future_letter tool succeeded');
    console.log(`Tool ID: ${result.toolId}`);
    console.log(`Success: ${result.success}`);
    console.log(`Response preview: ${String(result.data).substring(0, 150)}...\n`);
  } catch (err) {
    const appError = toAppError(err);
    console.error('❌ future_letter tool failed!');
    console.error(`Error: ${appError.message}`);
    console.error(`Code: ${appError.code}`);
    console.error(`Status: ${appError.statusCode}\n`);
  }

  // Test 3: Attempt image_analysis with dummy URL (expected to fail if not implemented)
  console.log('Test 3: Attempting image_analysis with dummy URL');
  console.log('================================================');
  try {
    const result = await runTool({
      toolId: 'image_analysis',
      payload: {
        imageUrl: 'https://example.com/dummy-image.jpg',
        question: 'What is in this image?'
      },
      provider: PROVIDERS.OPENAI,
      identity: 'smoke-test'
    });
    console.log('✅ image_analysis tool succeeded (unexpected)');
    console.log(`Response: ${result.data}\n`);
  } catch (err) {
    const appError = toAppError(err);
    console.log('ℹ️  image_analysis tool failed (expected if not implemented)');
    console.log(`Error: ${appError.message}`);
    console.log(`Code: ${appError.code}`);
    console.log(`Status: ${appError.statusCode}`);
    
    if (appError.code === 'TOOL_DEPENDENCY_NOT_READY' || 
        appError.code === 'TASK_NOT_SUPPORTED' ||
        appError.code === 'NOT_IMPLEMENTED') {
      console.log('✅ Clean error handling: Tool dependency not ready\n');
    } else {
      console.log('⚠️  Unexpected error code\n');
    }
  }

  console.log('Smoke test completed!');
}

// Run test
testToolsRegistry().catch(err => {
  const appError = toAppError(err);
  console.error('❌ Smoke test failed!');
  console.error(`Error: ${appError.message}`);
  console.error(`Code: ${appError.code}`);
  console.error(`Status: ${appError.statusCode}`);
  process.exit(1);
});
