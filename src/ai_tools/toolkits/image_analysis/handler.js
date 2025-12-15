// Image Analysis tool handler

const { runAiTask } = require('../../../ai/orchestration/ai.router');
const { AI_TASKS } = require('../../../ai/contracts/ai.interface');

/**
 * Handle image_analysis tool execution
 * @param {Object} params - Handler parameters
 * @param {Object} params.payload - Validated payload
 * @param {string} params.providerOverride - Optional provider override
 * @param {string} params.identity - User identity
 * @returns {Promise<string>} Analysis result text
 */
async function handle({ payload, providerOverride, identity }) {
  const provider = providerOverride || 'OPENAI';
  
  const result = await runAiTask({
    provider,
    task: AI_TASKS.IMAGE_ANALYSIS,
    payload: {
      imageUrl: payload.imageUrl,
      question: payload.question || 'Describe this image.'
    },
    identity
  });

  return result.data;
}

module.exports = {
  handle
};
