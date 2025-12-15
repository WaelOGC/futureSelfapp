// Image Aging tool handler

const { runAiTask } = require('../../../ai/orchestration/ai.router');
const { AI_TASKS } = require('../../../ai/contracts/ai.interface');
const { AppError } = require('../../../core/errors/error.handler');

/**
 * Handle image_aging tool execution
 * @param {Object} params - Handler parameters
 * @param {Object} params.payload - Validated payload
 * @param {string} params.providerOverride - Optional provider override
 * @param {string} params.identity - User identity
 * @returns {Promise<string>} Transformed image URL or base64 data
 * @throws {AppError} If the underlying provider method is not implemented
 */
async function handle({ payload, providerOverride, identity }) {
  const provider = providerOverride || 'OPENAI';
  
  // Try IMAGE_EDIT first, fall back to IMAGE_GENERATION if needed
  // For now, we'll attempt IMAGE_EDIT and let runAiTask throw if not supported
  let task = AI_TASKS.IMAGE_EDIT;
  
  try {
    const result = await runAiTask({
      provider,
      task,
      payload: {
        imageUrl: payload.imageUrl,
        imageBase64: payload.imageBase64,
        prompt: payload.prompt
      },
      identity
    });
    return result.data;
  } catch (err) {
    // If IMAGE_EDIT is not supported, try IMAGE_GENERATION
    if (err.code === 'TASK_NOT_SUPPORTED' || err.code === 'TOOL_DEPENDENCY_NOT_READY') {
      task = AI_TASKS.IMAGE_GENERATION;
      try {
        const result = await runAiTask({
          provider,
          task,
          payload: {
            imageUrl: payload.imageUrl,
            imageBase64: payload.imageBase64,
            prompt: payload.prompt || 'Age this image'
          },
          identity
        });
        return result.data;
      } catch (err2) {
        // If both fail, throw a clear error
        throw new AppError(
          'Image aging functionality is not yet implemented for the selected provider',
          501,
          'TOOL_DEPENDENCY_NOT_READY',
          { provider, attemptedTasks: [AI_TASKS.IMAGE_EDIT, AI_TASKS.IMAGE_GENERATION] }
        );
      }
    }
    // Re-throw other errors
    throw err;
  }
}

module.exports = {
  handle
};
