// Audio Transcription tool handler

const { runAiTask } = require('../../../ai/orchestration/ai.router');
const { AI_TASKS } = require('../../../ai/contracts/ai.interface');

/**
 * Handle audio_transcription tool execution
 * @param {Object} params - Handler parameters
 * @param {Object} params.payload - Validated payload
 * @param {string} params.providerOverride - Optional provider override
 * @param {string} params.identity - User identity
 * @returns {Promise<string>} Transcribed text
 */
async function handle({ payload, providerOverride, identity }) {
  const provider = providerOverride || 'OPENAI';
  
  const result = await runAiTask({
    provider,
    task: AI_TASKS.AUDIO_TRANSCRIPTION,
    payload: {
      audioUrl: payload.audioUrl,
      language: payload.language
    },
    identity
  });

  return result.data;
}

module.exports = {
  handle
};
