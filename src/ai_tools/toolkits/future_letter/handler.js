// Future Letter tool handler

const { runAiTask } = require('../../../ai/orchestration/ai.router');
const { AI_TASKS } = require('../../../ai/contracts/ai.interface');

/**
 * Handle future_letter tool execution
 * @param {Object} params - Handler parameters
 * @param {Object} params.payload - Validated payload
 * @param {string} params.providerOverride - Optional provider override
 * @param {string} params.identity - User identity
 * @returns {Promise<string>} Generated letter text
 */
async function handle({ payload, providerOverride, identity }) {
  const provider = providerOverride || 'OPENAI';
  
  const result = await runAiTask({
    provider,
    task: AI_TASKS.TEXT_GENERATION,
    payload: {
      prompt: payload.prompt,
      system: payload.system,
      model: payload.model
    },
    identity
  });

  return result.data;
}

module.exports = {
  handle
};
