// Future Letter tool validation

const { AppError } = require('../../../core/errors/error.handler');

/**
 * Validate future_letter tool payload
 * @param {Object} payload - Payload to validate
 * @throws {AppError} If validation fails
 */
function validate(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new AppError('Payload must be an object', 400, 'INVALID_INPUT');
  }

  if (!payload.prompt || typeof payload.prompt !== 'string' || payload.prompt.trim().length === 0) {
    throw new AppError('prompt is required and must be a non-empty string', 400, 'INVALID_INPUT');
  }

  if (payload.system !== undefined && (typeof payload.system !== 'string' || payload.system.trim().length === 0)) {
    throw new AppError('system must be a non-empty string if provided', 400, 'INVALID_INPUT');
  }

  if (payload.model !== undefined && (typeof payload.model !== 'string' || payload.model.trim().length === 0)) {
    throw new AppError('model must be a non-empty string if provided', 400, 'INVALID_INPUT');
  }
}

module.exports = {
  validate
};
