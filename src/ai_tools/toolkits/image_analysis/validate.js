// Image Analysis tool validation

const { AppError } = require('../../../core/errors/error.handler');

/**
 * Validate image_analysis tool payload
 * @param {Object} payload - Payload to validate
 * @throws {AppError} If validation fails
 */
function validate(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new AppError('Payload must be an object', 400, 'INVALID_INPUT');
  }

  if (!payload.imageUrl || typeof payload.imageUrl !== 'string' || payload.imageUrl.trim().length === 0) {
    throw new AppError('imageUrl is required and must be a non-empty string', 400, 'INVALID_INPUT');
  }

  if (payload.question !== undefined && (typeof payload.question !== 'string' || payload.question.trim().length === 0)) {
    throw new AppError('question must be a non-empty string if provided', 400, 'INVALID_INPUT');
  }
}

module.exports = {
  validate
};
