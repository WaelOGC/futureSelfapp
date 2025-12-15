// Image Variation tool validation

const { AppError } = require('../../../core/errors/error.handler');

/**
 * Validate image_variation tool payload
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

  if (payload.size !== undefined && (typeof payload.size !== 'string' || payload.size.trim().length === 0)) {
    throw new AppError('size must be a non-empty string if provided', 400, 'INVALID_INPUT');
  }
}

module.exports = {
  validate
};
