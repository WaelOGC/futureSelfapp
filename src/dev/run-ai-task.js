// Node.js bridge script to run AI tasks from Flask
// This script is called via subprocess from Flask to execute AI tasks
// CRITICAL: stdout = JSON only, stderr = logs

const path = require("path");
const fs = require("fs");

// Helper functions for JSON-only stdout
function writeJson(obj) {
  process.stdout.write(JSON.stringify(obj));
}

function writeError(code, message, details = null, statusCode = 500) {
  writeJson({ success: false, error: { code, message, details, statusCode } });
}

// Import status tracker (available in all scopes)
const { setEnvReady, setOpenaiReady, setLastTest } = require("./status");

// Main async function - all logic wrapped here
async function main() {
  try {
    // Check dependencies first (no auto-install)
    const { checkDependencies } = require("./bootstrap");
    const depCheck = checkDependencies();
    if (depCheck.missing) {
      writeError("DEPENDENCIES_MISSING", depCheck.message, null, 500);
      process.exitCode = 1;
      await new Promise(r => setImmediate(r));
      return;
    }

    // Load environment variables using centralized loader
    const { ensureEnvLoaded } = require("../core/env/env.loader");
    const envResult = ensureEnvLoaded({ override: true });
    if (!envResult.success && envResult.error !== 'ENOENT') {
      // ENOENT is okay (file might not exist, using system env vars)
      // But other errors should fail
      writeError("DOTENV_LOAD_FAILED", "Failed to load .env file", envResult.message || "Unknown error", 500);
      process.exitCode = 1;
      await new Promise(r => setImmediate(r));
      return;
    }

    // Log to stderr only (not stdout)
    process.stderr.write("[ENV] OPENAI_API_KEY loaded in Node: " + !!process.env.OPENAI_API_KEY + "\n");

    // Hard fail if OPENAI_API_KEY is missing
    if (!process.env.OPENAI_API_KEY) {
      setEnvReady(false);
      setOpenaiReady(false);
      writeError("OPENAI_KEY_MISSING", "OPENAI_API_KEY is not loaded. Ensure .env exists at project root and restart.", null, 500);
      process.exitCode = 1;
      await new Promise(r => setImmediate(r));
      return;
    }

    // Update status
    setEnvReady(true);
    setOpenaiReady(true);

    // Bootstrap AI providers first
    require('../ai/providers/index');

    const { runAiTask } = require('../ai/orchestration/ai.router');

    // Read input from stdin (JSON)
    let inputData = '';
    process.stdin.setEncoding('utf8');

    // Collect stdin data using Promise-based approach
    inputData = await new Promise((resolve, reject) => {
      let data = '';
      process.stdin.on('data', (chunk) => {
        data += chunk;
      });
      process.stdin.on('end', () => {
        resolve(data);
      });
      process.stdin.on('error', (err) => {
        reject(err);
      });
    });

    // Parse input JSON
    let input;
    try {
      input = JSON.parse(inputData);
    } catch (parseErr) {
      writeError("INVALID_JSON_INPUT", "Failed to parse input JSON", parseErr.message, 400);
      process.exitCode = 1;
      await new Promise(r => setImmediate(r));
      return;
    }

    const { provider, task, payload } = input;

    // Validate
    if (!provider || !task || !payload) {
      writeError("INVALID_INPUT", "Missing required fields: provider, task, payload", null, 400);
      process.exitCode = 1;
      await new Promise(r => setImmediate(r));
      return;
    }

    // Run AI task
    const result = await runAiTask({
      provider,
      task,
      payload,
      identity: 'dev-dashboard'
    });

    // Update status
    setLastTest("OK");

    // Output success result (JSON only to stdout)
    writeJson({
      success: true,
      result
    });
    process.exitCode = 0;
    await new Promise(r => setImmediate(r));
    return;

  } catch (err) {
    // Update status
    setLastTest("FAILED");
    
    // Log error details to stderr
    process.stderr.write("[ERROR] " + (err.message || 'Unknown error') + "\n");
    if (err.stack) {
      process.stderr.write("[STACK] " + err.stack + "\n");
    }
    
    // Output error JSON to stdout
    writeError(
      err.code || 'UNKNOWN_ERROR',
      err.message || 'Unknown error',
      err.details || null,
      err.statusCode || 500
    );
    process.exitCode = 1;
    await new Promise(r => setImmediate(r));
    return;
  }
}

// Run main and handle any unhandled errors
main().catch((err) => {
  process.stderr.write("[FATAL] Unhandled error: " + err.message + "\n");
  writeError("FATAL_ERROR", "Unhandled error in main", err.message, 500);
  process.exitCode = 1;
  // Let process terminate naturally
});
