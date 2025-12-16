// AI Tools Registry - Central registry for all AI tools

const { AppError } = require('../../core/errors/error.handler');

// Import all tools
const futureLetter = require('../toolkits/future_letter');
const imageAging = require('../toolkits/image_aging');
const imageVariation = require('../toolkits/image_variation');
const imageAnalysis = require('../toolkits/image_analysis');
const audioTranscription = require('../toolkits/audio_transcription');
const timeCapsule = require('../toolkits/time-capsule');
const cinematicSwitch = require('../toolkits/cinematic-switch');
const globalVoice = require('../toolkits/global-voice');
const instantInfluencer = require('../toolkits/instant-influencer');

// Registry of all tools
const TOOLS = {
  future_letter: futureLetter,
  image_aging: imageAging,
  image_variation: imageVariation,
  image_analysis: imageAnalysis,
  audio_transcription: audioTranscription,
  'time-capsule': timeCapsule,
  'cinematic-switch': cinematicSwitch,
  'global-voice': globalVoice,
  'instant-influencer': instantInfluencer
};

/**
 * List all available tools with their metadata
 * @returns {Array<Object>} Array of tool metadata objects
 */
function listTools() {
  return Object.values(TOOLS).map(tool => tool.metadata);
}

/**
 * Get a tool by its ID
 * @param {string} toolId - Tool identifier
 * @returns {Object} Tool object with metadata, validate, and handler
 * @throws {AppError} If tool not found
 */
function getTool(toolId) {
  if (!toolId || typeof toolId !== 'string') {
    throw new AppError('toolId must be a non-empty string', 400, 'INVALID_INPUT');
  }

  const tool = TOOLS[toolId];
  if (!tool) {
    throw new AppError(
      `Tool '${toolId}' not found. Available tools: ${Object.keys(TOOLS).join(', ')}`,
      404,
      'TOOL_NOT_FOUND'
    );
  }

  return tool;
}

/**
 * Run a tool with the provided payload
 * @param {Object} params - Tool execution parameters
 * @param {string} params.toolId - Tool identifier
 * @param {Object} params.payload - Tool payload
 * @param {string} params.provider - Optional provider override
 * @param {string} params.identity - User identity (default: "local-dev")
 * @returns {Promise<Object>} Normalized response: { toolId, success: true, data }
 * @throws {AppError} If tool not found, validation fails, or execution fails
 */
async function runTool({ toolId, payload, provider, identity = 'local-dev' }) {
  // Get tool
  const tool = getTool(toolId);

  // Validate payload
  tool.validate(payload);

  // Execute handler
  const data = await tool.handler({
    payload,
    providerOverride: provider,
    identity
  });

  // Return normalized response
  return {
    toolId,
    success: true,
    data
  };
}

module.exports = {
  listTools,
  getTool,
  runTool
};
