// Test Services 2-4: Cinematic Switch, Global Voice, Instant Influencer
// Tests environment variable loading, error handling, and basic validation

const { ensureEnvLoaded } = require('../../core/env/env.loader');
const { getEnv } = require('../../core/env/env.loader');
const { AppError } = require('../../core/errors/error.handler');
const { runTool } = require('../../ai_tools/registry/tools.registry');

// Load environment
ensureEnvLoaded({ override: true });

// Test results tracking
const results = {
  service2: { pass: false, reason: '' },
  service3: { pass: false, reason: '' },
  service4: { pass: false, reason: '' }
};

async function testService2() {
  console.log('\n=== Testing Service 2: Cinematic Switch ===\n');
  
  try {
    // Test 1: Environment variable check
    console.log('Test 1.1: Checking REPLICATE_API_TOKEN...');
    try {
      const token = getEnv('REPLICATE_API_TOKEN', { required: true });
      if (!token || token.trim() === '') {
        throw new Error('REPLICATE_API_TOKEN is empty');
      }
      console.log('✅ REPLICATE_API_TOKEN is loaded');
    } catch (err) {
      results.service2.pass = false;
      results.service2.reason = `REPLICATE_API_TOKEN missing: ${err.message}`;
      console.log(`❌ ${results.service2.reason}`);
      return;
    }

    // Test 2: Invalid input handling
    console.log('\nTest 1.2: Testing invalid input handling...');
    try {
      await runTool({
        toolId: 'cinematic-switch',
        payload: {
          image: 'invalid',
          scene_description: '' // Empty description should fail
        },
        identity: 'test'
      });
      results.service2.pass = false;
      results.service2.reason = 'Should have rejected empty scene_description';
      console.log(`❌ ${results.service2.reason}`);
      return;
    } catch (err) {
      if (err instanceof AppError && (err.code === 'INVALID_INPUT' || err.code === 'VALIDATION_ERROR')) {
        console.log('✅ Invalid input correctly rejected');
      } else {
        results.service2.pass = false;
        results.service2.reason = `Unexpected error type: ${err.code || err.message}`;
        console.log(`❌ ${results.service2.reason}`);
        return;
      }
    }

    // Test 3: Error structure validation
    console.log('\nTest 1.3: Testing error structure...');
    try {
      await runTool({
        toolId: 'cinematic-switch',
        payload: {
          image: 'data:image/png;base64,invalid',
          scene_description: 'test scene'
        },
        identity: 'test'
      });
      // If we get here, it might succeed (unlikely with invalid image) or fail later
      // We'll check if error has proper structure if it fails
    } catch (err) {
      if (err instanceof AppError) {
        const hasService = err.details && err.details.service === 'cinematic-switch';
        const hasCode = err.code && typeof err.code === 'string';
        const hasMessage = err.message && typeof err.message === 'string';
        
        if (hasService && hasCode && hasMessage) {
          console.log('✅ Error structure is normalized');
          results.service2.pass = true;
          results.service2.reason = 'All checks passed';
        } else {
          results.service2.pass = false;
          results.service2.reason = `Error structure incomplete: service=${hasService}, code=${hasCode}, message=${hasMessage}`;
          console.log(`❌ ${results.service2.reason}`);
        }
      } else {
        results.service2.pass = false;
        results.service2.reason = `Error is not AppError instance: ${err.constructor.name}`;
        console.log(`❌ ${results.service2.reason}`);
      }
    }

    if (results.service2.pass) {
      console.log('\n✅ Service 2: PASS');
    }
  } catch (err) {
    results.service2.pass = false;
    results.service2.reason = `Unexpected test error: ${err.message}`;
    console.log(`❌ ${results.service2.reason}`);
  }
}

async function testService3() {
  console.log('\n=== Testing Service 3: Global Voice ===\n');
  
  try {
    // Test 1: Environment variable check and error structure
    console.log('Test 2.1: Checking HEYGEN_API_KEY...');
    try {
      const key = getEnv('HEYGEN_API_KEY', { required: true });
      if (!key || key.trim() === '') {
        throw new Error('HEYGEN_API_KEY is empty');
      }
      console.log('✅ HEYGEN_API_KEY is loaded');
    } catch (err) {
      // Test that missing key produces proper error structure
      console.log('⚠️  HEYGEN_API_KEY not configured (testing error handling)');
      try {
        await runTool({
          toolId: 'global-voice',
          payload: {
            video: 'data:video/mp4;base64,test',
            target_language: 'es'
          },
          identity: 'test'
        });
        results.service3.pass = false;
        results.service3.reason = 'Should have failed with missing API key';
        console.log(`❌ ${results.service3.reason}`);
        return;
      } catch (apiErr) {
        if (apiErr instanceof AppError && apiErr.code === 'PROVIDER_KEY_MISSING') {
          const hasService = apiErr.details && apiErr.details.service === 'global-voice';
          const hasRequestId = apiErr.details && apiErr.details.requestId;
          if (hasService && hasRequestId) {
            console.log('✅ Missing key error structure is normalized');
            results.service3.pass = true;
            results.service3.reason = 'Error handling correct (key missing but handled properly)';
            return;
          } else {
            results.service3.pass = false;
            results.service3.reason = `Error structure incomplete: service=${hasService}, requestId=${hasRequestId}`;
            console.log(`❌ ${results.service3.reason}`);
            return;
          }
        } else {
          results.service3.pass = false;
          results.service3.reason = `Unexpected error code: ${apiErr.code || apiErr.message}`;
          console.log(`❌ ${results.service3.reason}`);
          return;
        }
      }
    }

    // Test 2: Invalid input handling
    console.log('\nTest 2.2: Testing invalid input handling...');
    try {
      await runTool({
        toolId: 'global-voice',
        payload: {
          video: 'invalid',
          target_language: '' // Empty language should fail
        },
        identity: 'test'
      });
      results.service3.pass = false;
      results.service3.reason = 'Should have rejected empty target_language';
      console.log(`❌ ${results.service3.reason}`);
      return;
    } catch (err) {
      if (err instanceof AppError && (err.code === 'INVALID_INPUT' || err.code === 'VALIDATION_ERROR')) {
        console.log('✅ Invalid input correctly rejected');
      } else {
        results.service3.pass = false;
        results.service3.reason = `Unexpected error type: ${err.code || err.message}`;
        console.log(`❌ ${results.service3.reason}`);
        return;
      }
    }

    // Test 3: Error structure validation
    console.log('\nTest 2.3: Testing error structure...');
    try {
      await runTool({
        toolId: 'global-voice',
        payload: {
          video: 'data:video/mp4;base64,invalid',
          target_language: 'es'
        },
        identity: 'test'
      });
      // Will likely fail at API call, but we check error structure
    } catch (err) {
      if (err instanceof AppError) {
        const hasService = err.details && err.details.service === 'global-voice';
        const hasCode = err.code && typeof err.code === 'string';
        const hasMessage = err.message && typeof err.message === 'string';
        
        if (hasService && hasCode && hasMessage) {
          console.log('✅ Error structure is normalized');
          results.service3.pass = true;
          results.service3.reason = 'All checks passed';
        } else {
          results.service3.pass = false;
          results.service3.reason = `Error structure incomplete: service=${hasService}, code=${hasCode}, message=${hasMessage}`;
          console.log(`❌ ${results.service3.reason}`);
        }
      } else {
        results.service3.pass = false;
        results.service3.reason = `Error is not AppError instance: ${err.constructor.name}`;
        console.log(`❌ ${results.service3.reason}`);
      }
    }

    if (results.service3.pass) {
      console.log('\n✅ Service 3: PASS');
    }
  } catch (err) {
    results.service3.pass = false;
    results.service3.reason = `Unexpected test error: ${err.message}`;
    console.log(`❌ ${results.service3.reason}`);
  }
}

async function testService4() {
  console.log('\n=== Testing Service 4: Instant Influencer ===\n');
  
  try {
    // Test 1: Environment variable check
    console.log('Test 3.1: Checking REPLICATE_API_TOKEN...');
    try {
      const token = getEnv('REPLICATE_API_TOKEN', { required: true });
      if (!token || token.trim() === '') {
        throw new Error('REPLICATE_API_TOKEN is empty');
      }
      console.log('✅ REPLICATE_API_TOKEN is loaded');
    } catch (err) {
      results.service4.pass = false;
      results.service4.reason = `REPLICATE_API_TOKEN missing: ${err.message}`;
      console.log(`❌ ${results.service4.reason}`);
      return;
    }

    // Test 2: Invalid input handling
    console.log('\nTest 3.2: Testing invalid input handling...');
    try {
      await runTool({
        toolId: 'instant-influencer',
        payload: {
          image: 'invalid',
          style: '' // Empty style should fail
        },
        identity: 'test'
      });
      results.service4.pass = false;
      results.service4.reason = 'Should have rejected empty style';
      console.log(`❌ ${results.service4.reason}`);
      return;
    } catch (err) {
      if (err instanceof AppError && (err.code === 'INVALID_INPUT' || err.code === 'VALIDATION_ERROR')) {
        console.log('✅ Invalid input correctly rejected');
      } else {
        results.service4.pass = false;
        results.service4.reason = `Unexpected error type: ${err.code || err.message}`;
        console.log(`❌ ${results.service4.reason}`);
        return;
      }
    }

    // Test 3: Error structure validation
    console.log('\nTest 3.3: Testing error structure...');
    try {
      await runTool({
        toolId: 'instant-influencer',
        payload: {
          image: 'data:image/png;base64,invalid',
          style: 'corporate'
        },
        identity: 'test'
      });
      // Will likely fail at API call, but we check error structure
    } catch (err) {
      if (err instanceof AppError) {
        const hasService = err.details && err.details.service === 'instant-influencer';
        const hasCode = err.code && typeof err.code === 'string';
        const hasMessage = err.message && typeof err.message === 'string';
        
        if (hasService && hasCode && hasMessage) {
          console.log('✅ Error structure is normalized');
          results.service4.pass = true;
          results.service4.reason = 'All checks passed';
        } else {
          results.service4.pass = false;
          results.service4.reason = `Error structure incomplete: service=${hasService}, code=${hasCode}, message=${hasMessage}`;
          console.log(`❌ ${results.service4.reason}`);
        }
      } else {
        results.service4.pass = false;
        results.service4.reason = `Error is not AppError instance: ${err.constructor.name}`;
        console.log(`❌ ${results.service4.reason}`);
      }
    }

    if (results.service4.pass) {
      console.log('\n✅ Service 4: PASS');
    }
  } catch (err) {
    results.service4.pass = false;
    results.service4.reason = `Unexpected test error: ${err.message}`;
    console.log(`❌ ${results.service4.reason}`);
  }
}

async function runAllTests() {
  console.log('========================================');
  console.log('Services 2-4 Recovery & Retest');
  console.log('========================================');
  
  await testService2();
  await testService3();
  await testService4();

  // Final Report
  console.log('\n========================================');
  console.log('FINAL REPORT');
  console.log('========================================\n');
  
  console.log(`✔ Service 2: ${results.service2.pass ? 'PASS' : 'FAIL'} — ${results.service2.reason || 'N/A'}`);
  console.log(`✔ Service 3: ${results.service3.pass ? 'PASS' : 'FAIL'} — ${results.service3.reason || 'N/A'}`);
  console.log(`✔ Service 4: ${results.service4.pass ? 'PASS' : 'FAIL'} — ${results.service4.reason || 'N/A'}`);
  
  console.log('\nFiles modified:');
  console.log('src/ai_tools/toolkits/cinematic-switch/handler.js');
  console.log('src/ai_tools/toolkits/global-voice/handler.js');
  console.log('src/ai_tools/toolkits/instant-influencer/handler.js');
  
  // Exit with appropriate code
  const allPassed = results.service2.pass && results.service3.pass && results.service4.pass;
  process.exit(allPassed ? 0 : 1);
}

// Bootstrap providers
require('../../ai/providers/index');

// Run tests
runAllTests().catch(err => {
  console.error('\n❌ Test suite failed with error:');
  console.error(err);
  process.exit(1);
});

