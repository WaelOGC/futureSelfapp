// Dev dashboard controller (development only)

const { runAiTask } = require('../../ai/orchestration/ai.router');
const { PROVIDERS, AI_TASKS } = require('../../ai/contracts/ai.interface');
const { toAppError } = require('../../core/errors/error.handler');
const { listTools, runTool } = require('../../ai_tools/registry/tools.registry');

/**
 * Render dev dashboard HTML
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function renderDevDashboard(req, res) {
  // This will be served by Flask, but keeping structure for Node.js compatibility
  res.status(200).json({ message: 'Dev dashboard should be served as static HTML' });
}

/**
 * Run AI task via dev dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function runDevAiTask(req, res) {
  try {
    const { provider, task, payload } = req.body;

    // Validate required fields
    if (!provider || typeof provider !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Provider is required and must be a string',
          code: 'INVALID_INPUT',
          statusCode: 400
        }
      });
    }

    if (!task || typeof task !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Task is required and must be a string',
          code: 'INVALID_INPUT',
          statusCode: 400
        }
      });
    }

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Payload is required and must be an object',
          code: 'INVALID_INPUT',
          statusCode: 400
        }
      });
    }

    // Run AI task with dev identity
    const result = await runAiTask({
      provider,
      task,
      payload,
      identity: 'dev-dashboard'
    });

    // Return clean JSON response
    return res.status(200).json({
      success: true,
      result
    });

  } catch (err) {
    const appError = toAppError(err);
    
    // Return clean error object
    return res.status(appError.statusCode || 500).json({
      success: false,
      error: {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode || 500,
        details: appError.details || null
      }
    });
  }
}

/**
 * List all available tools (dev dashboard)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function listDevTools(req, res) {
  try {
    const tools = listTools();
    return res.status(200).json({
      success: true,
      tools
    });
  } catch (err) {
    const appError = toAppError(err);
    return res.status(appError.statusCode || 500).json({
      success: false,
      error: {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode || 500
      }
    });
  }
}

/**
 * Run a tool via dev dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function runDevTool(req, res) {
  try {
    const { toolId, payload, provider } = req.body;

    // Validate required fields
    if (!toolId || typeof toolId !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'toolId is required and must be a string',
          code: 'INVALID_INPUT',
          statusCode: 400
        }
      });
    }

    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'payload is required and must be an object',
          code: 'INVALID_INPUT',
          statusCode: 400
        }
      });
    }

    // Run tool with dev identity
    const result = await runTool({
      toolId,
      payload,
      provider,
      identity: 'dev-dashboard'
    });

    // Return clean JSON response
    return res.status(200).json({
      success: true,
      result
    });

  } catch (err) {
    const appError = toAppError(err);
    
    // Return clean error object
    return res.status(appError.statusCode || 500).json({
      success: false,
      error: {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode || 500,
        details: appError.details || null
      }
    });
  }
}

module.exports = {
  renderDevDashboard,
  runDevAiTask,
  listDevTools,
  runDevTool
};
