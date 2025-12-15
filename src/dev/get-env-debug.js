// Node.js script to get safe environment debug info (no secrets)
// Called by Flask /dev/env endpoint to get Node.js-side debug info

// Load environment variables using centralized loader
const { ensureEnvLoaded, getEnvDebugInfo, getProjectRoot } = require('../core/env/env.loader');
const path = require("path");
const fs = require("fs");

// Load .env and capture result
const envResult = ensureEnvLoaded({ override: true });
const envPathUsed = envResult.path || path.join(getProjectRoot(), '.env');
const dotenvLoaded = envResult.loaded || false;

// Import debug function and get debug info
const debugInfo = getEnvDebugInfo();
debugInfo.envPathUsed = envResult.path || (fs.existsSync(envPathUsed) ? envPathUsed : "NOT_FOUND");
debugInfo.dotenvLoaded = dotenvLoaded;

// Output debug info as JSON
process.stdout.write(JSON.stringify(debugInfo));
