// Bootstrap script to check Node.js dependencies
// DISABLED: No longer runs npm install automatically (Windows instability risk)
// If dependencies are missing, run-ai-task.js will return a clean JSON error

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const NODE_MODULES = path.join(PROJECT_ROOT, "node_modules");
const DOTENV_PATH = path.join(NODE_MODULES, "dotenv");

function checkDependencies() {
  // Check if node_modules/dotenv exists
  if (!fs.existsSync(DOTENV_PATH)) {
    return {
      missing: true,
      message: "dotenv package not found. Run 'npm install' manually before using the dev dashboard."
    };
  }
  return { missing: false };
}

// Do NOT run bootstrap automatically - let run-ai-task.js handle errors gracefully
module.exports = { checkDependencies };
